import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Request/response aligned to Spring Boot
export interface CreateSessionRequest {
    gender: 'MALE' | 'FEMALE';
    deviceId: string;
}

export interface SessionResponse {
    id?: string;             // if backend DTO uses 'id'
    sessionId?: string;      // if backend DTO uses 'sessionId'
    userGender?: 'MALE' | 'FEMALE';
    verifiedGender?: 'MALE' | 'FEMALE';
    deviceId?: string;
    ipAddress?: string;
    status?: string;
}

export interface QueueRequest {
    sessionId: string;
    chatMode: 'text' | 'video';
}

export const createSession = async (payload: CreateSessionRequest): Promise<SessionResponse> => {
    const { data } = await axios.post(`${API_BASE_URL}/sessions`, payload, { withCredentials: true });
    return data as SessionResponse;
};

// Adjust these to your actual controller paths if different
export const joinQueue = async (payload: QueueRequest): Promise<void> => {
    await axios.post(`${API_BASE_URL}/queue/join`, payload, { withCredentials: true });
};

export const leaveQueue = async (payload: QueueRequest): Promise<void> => {
    await axios.post(`${API_BASE_URL}/queue/leave`, payload, { withCredentials: true });
};
// WebSocket chat client (SockJS + STOMP)
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient: any = null;

export const connectWebSocket = (onConnected?: () => void, onError?: (err:any) => void) => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => { onConnected && onConnected(); }, (e:any) => { onError && onError(e); });
};

export const subscribeToRoom = (roomId: string, onMessageReceived: (message: any) => void) => {
    if (stompClient && stompClient.connected) {
        return stompClient.subscribe(`/topic/chat/${roomId}`, (message: any) => {
            onMessageReceived(JSON.parse(message.body));
        });
    }
    return null;
};

export interface ChatMessageDTO {
    roomId: string;
    senderSessionId: string;
    content: string;
}

export const sendMessage = (message: ChatMessageDTO) => {
    if (stompClient && stompClient.connected) {
        stompClient.send(`/app/chat/${message.roomId}/sendMessage`, {}, JSON.stringify(message));
    }
};

export const disconnectWebSocket = () => {
    if (stompClient) stompClient.disconnect(() => {});
    stompClient = null;
};
