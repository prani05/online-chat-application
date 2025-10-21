import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Users, Clock } from "lucide-react";

const QueuePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { chatMode, gender } = location.state || {};

    const [queueTime, setQueueTime] = useState(0);

    useEffect(() => {
        // Simulate waiting in the queue
        const timer = setInterval(() => {
            setQueueTime(prev => prev + 1);
        }, 1000);

        // Simulate finding a match after 5 seconds for demonstration
        const matchTimeout = setTimeout(() => {
            // In a real app, the backend would provide the roomId
            const mockRoomId = `room_${Math.random().toString(36).substr(2, 9)}`;
            navigate(`/chat/${mockRoomId}`, { state: { chatMode, gender } });
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(matchTimeout);
        };
    }, [navigate, chatMode, gender]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-muted">
            <Card className="w-full max-w-md p-8 text-center shadow-lg animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Finding a Match...</h2>
                <div className="text-6xl font-mono font-bold text-primary mb-6">
                    {formatTime(queueTime)}
                </div>
                <div className="flex justify-center items-center space-x-2 mb-8">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Waiting for a connection</span>
                </div>
                <Button variant="destructive" size="lg" onClick={() => navigate('/')}>
                    Leave Queue
                </Button>
            </Card>
        </div>
    );
};

export default QueuePage;

