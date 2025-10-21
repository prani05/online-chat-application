import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Camera, Mic, User, CheckCircle, AlertCircle } from 'lucide-react';

import { useSessionStore } from '@/store/sessionStore';
import { createSession, SessionResponse } from '@/api/apiService';

type VerificationStep =
    | 'gender-selection'
    | 'face-verification'
    | 'voice-verification'
    | 'processing'
    | 'success'
    | 'failed';

let modelsLoaded = false;
async function ensureFaceModels() {
    if (modelsLoaded) return;
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.ageGenderNet.loadFromUri('/models');
    modelsLoaded = true;
}

function estimateF0(samples: Float32Array, sr: number): number | null {
    const size = Math.min(samples.length, sr);
    const buf = samples.subarray(0, size);
    let bestLag = -1,
        best = 0;
    const minLag = Math.floor(sr / 400);
    const maxLag = Math.floor(sr / 70);
    for (let lag = minLag; lag <= maxLag; lag++) {
        let sum = 0;
        for (let i = 0; i < size - lag; i++) sum += buf[i] * buf[i + lag];
        if (sum > best) {
            best = sum;
            bestLag = lag;
        }
    }
    return bestLag > 0 ? sr / bestLag : null;
}

// ✅ Improved video readiness check
const waitForVideo = async (video: HTMLVideoElement | null) => {
    if (!video) return false;
    return new Promise<boolean>((resolve) => {
        let checks = 0;
        const checkReady = () => {
            if (
                video.readyState >= 2 &&
                video.videoWidth > 0 &&
                video.videoHeight > 0
            ) {
                resolve(true);
            } else if (++checks > 60) {
                // ~1s max wait
                resolve(false);
            } else {
                requestAnimationFrame(checkReady);
            }
        };
        checkReady();
    });
};

export default function GenderVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const { chatMode } = (location.state as any) || { chatMode: 'text' };

    const setSession = useSessionStore((s) => s.setSession);

    const [currentStep, setCurrentStep] =
        useState<VerificationStep>('gender-selection');
    const [selectedGender, setSelectedGender] =
        useState<'male' | 'female' | null>(null);
    const [verificationError, setVerificationError] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [camReady, setCamReady] = useState(false);

    const webcamRef = useRef<Webcam>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Load models once
    useEffect(() => {
        ensureFaceModels().catch(() => {});
    }, []);

    // Automatically start camera when entering face verification
    useEffect(() => {
        if (currentStep === 'face-verification') {
            startCamera();
        }
    }, [currentStep]);

    const startCamera = async () => {
        try {
            setVerificationError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });
            streamRef.current = stream;

            const videoEl = webcamRef.current?.video as HTMLVideoElement | undefined;
            if (videoEl) {
                videoEl.srcObject = stream as any;
                await videoEl.play();
                setCamReady(true);
            }
        } catch (e: unknown) {
            const err = e as Error;
            setVerificationError(err?.message || 'Unable to access camera.');
        }
    };

    // Turn off camera after finishing or failing
    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setCamReady(false);
    };

    const handleGenderSelection = (gender: 'male' | 'female') => {
        setSelectedGender(gender);
        setVerificationError(null);
        setCurrentStep('face-verification');
    };

    const handleFaceVerification = async () => {
        try {
            setCurrentStep('processing');
            setVerificationError(null);
            await ensureFaceModels();

            // Wait for webcam video element to exist
            const video = await new Promise<HTMLVideoElement | null>((resolve) => {
                const tryGetVideo = (attempts = 0) => {
                    const v = webcamRef.current?.video as HTMLVideoElement | null;
                    if (v && v.readyState >= 2 && v.videoWidth > 0) {
                        resolve(v);
                    } else if (attempts < 50) {
                        setTimeout(() => tryGetVideo(attempts + 1), 100);
                    } else {
                        resolve(null);
                    }
                };
                tryGetVideo();
            });

            if (!video) {
                setVerificationError('Camera not ready. Please allow access or refresh.');
                setCurrentStep('failed');
                stopCamera();
                return;
            }

            const opts = new faceapi.TinyFaceDetectorOptions({
                inputSize: 512,
                scoreThreshold: 0.25,
            });
            const det = await faceapi
                .detectSingleFace(video, opts)
                .withFaceLandmarks()
                .withAgeAndGender();

            if (!det) {
                setVerificationError(
                    'No face detected. Improve lighting and center your face.'
                );
                setCurrentStep('failed');
                stopCamera();
                return;
            }

            const detected = det.gender === 'male' ? 'male' : 'female';
            const confidence = det.genderProbability * 100;

            stopCamera();

            if (detected === selectedGender && confidence >= 75) {
                setCurrentStep('voice-verification');
            } else {
                setVerificationError(
                    `Detected ${detected} at ${confidence.toFixed(
                        1
                    )}%. Expected ${selectedGender}.`
                );
                setCurrentStep('failed');
            }
        } catch (e: any) {
            stopCamera();
            setVerificationError(e.message || 'Face verification failed.');
            setCurrentStep('failed');
        }
    };


    const record5s = async (): Promise<Blob> => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
            video: false,
        });
        const rec = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        rec.ondataavailable = (e) => chunks.push(e.data);
        const done = new Promise<Blob>((resolve) => {
            rec.onstop = () => {
                stream.getTracks().forEach((t) => t.stop());
                resolve(new Blob(chunks, { type: 'audio/webm' }));
            };
        });
        rec.start();
        await new Promise((r) => setTimeout(r, 5000));
        rec.stop();
        return done;
    };

    const handleFinalVerification = async () => {
        if (!selectedGender) return;
        try {
            setCurrentStep('processing');
            setVerificationError(null);

            const blob = await record5s();
            const arrayBuf = await blob.arrayBuffer();
            const ctx = new AudioContext();
            const audio = await ctx.decodeAudioData(arrayBuf);
            const data = audio.getChannelData(0);
            const f0 = estimateF0(data, audio.sampleRate);

            let detected: 'male' | 'female' = 'male';
            let confidence = 55;
            if (f0) {
                if (f0 > 165) {
                    detected = 'female';
                    confidence = Math.min(95, 60 + (f0 - 165) / 2);
                } else {
                    detected = 'male';
                    confidence = Math.min(95, 60 + (165 - f0) / 2);
                }
            }

            if (!(detected === selectedGender && confidence >= 70)) {
                throw new Error(
                    `Voice detected ${detected} at ${confidence.toFixed(
                        1
                    )}%. Expected ${selectedGender}.`
                );
            }

            const payload = {
                gender: selectedGender.toUpperCase() as 'MALE' | 'FEMALE',
                deviceId: crypto.randomUUID(),
            };
            const session: SessionResponse = await createSession(payload);

            const id = (session.id ?? session.sessionId)!;
            const userGender = session.userGender ?? payload.gender;
            setSession(id, userGender);

            setCurrentStep('success');
            setTimeout(() => navigate('/queue', { state: { chatMode } }), 800);
        } catch (e: any) {
            setVerificationError(e.message || 'Voice verification failed.');
            setCurrentStep('failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-muted">
            <Card className="w-full max-w-lg p-8 shadow-2xl">
                {currentStep === 'gender-selection' && (
                    <div className="text-center">
                        <User className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-3xl font-bold mb-4">Select Your Gender</h2>
                        <p className="text-muted-foreground mb-8">
                            This helps verification rules and matching.
                        </p>
                        <RadioGroup
                            onValueChange={(g: 'male' | 'female') => handleGenderSelection(g)}
                            className="flex justify-center gap-8"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male" className="text-lg">
                                    Male
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female" className="text-lg">
                                    Female
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                )}

                {currentStep === 'face-verification' && (
                    <div className="text-center">
                        <Camera className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-2xl font-bold mb-2">
                            Face Verification (Step 1/2)
                        </h2>
                        <Progress value={50} className="mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Ensure good lighting and center your face.
                        </p>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            className="rounded-md mx-auto mb-4"
                            videoConstraints={{ facingMode: 'user' }}
                            onUserMedia={() => setCamReady(true)}
                            onUserMediaError={(err) =>
                                setVerificationError(
                                    typeof err === 'string'
                                        ? err
                                        : (err as any)?.message || 'Camera access error'
                                )
                            }
                        />
                        <Button
                            onClick={handleFaceVerification}
                            disabled={!camReady || loading}
                        >
                            {camReady ? 'Verify Face' : 'Initializing Camera...'}
                        </Button>
                    </div>
                )}

                {currentStep === 'voice-verification' && (
                    <div className="text-center">
                        <Mic className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-2xl font-bold mb-2">
                            Voice Verification (Step 2/2)
                        </h2>
                        <Progress value={100} className="mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Read the sentence below clearly.
                        </p>
                        <Card className="p-4 mb-4 bg-muted">
                            <p>"The quick brown fox jumps over the lazy dog."</p>
                        </Card>
                        <Button onClick={handleFinalVerification} disabled={loading}>
                            Finish Verification
                        </Button>
                    </div>
                )}

                {(currentStep === 'processing' ||
                    currentStep === 'success' ||
                    currentStep === 'failed') && (
                    <div className="text-center">
                        {currentStep === 'processing' && <p>Processing...</p>}
                        {currentStep === 'success' && (
                            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                        )}
                        {currentStep === 'success' && (
                            <h2 className="text-2xl font-bold text-green-500">
                                Verification Successful!
                            </h2>
                        )}
                        {currentStep === 'failed' && (
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        )}
                        {currentStep === 'failed' && (
                            <h2 className="text-2xl font-bold text-red-500">
                                Verification Failed
                            </h2>
                        )}
                        {currentStep === 'failed' && verificationError && (
                            <p className="text-muted-foreground my-4">
                                {verificationError}
                            </p>
                        )}
                        {currentStep === 'failed' && (
                            <Button
                                onClick={() => {
                                    setVerificationError(null);
                                    setCurrentStep('gender-selection');
                                }}
                            >
                                Try Again
                            </Button>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}
