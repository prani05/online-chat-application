import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { Send, LogOut } from "lucide-react";
import ConnectionStatus from "@/components/ConnectionStatus";
import SafetyBanner from "@/components/SafetyBanner";
import TypingIndicator from "@/components/TypingIndicator";
import { useSessionStore } from "@/store/sessionStore";
import { connectWebSocket, disconnectWebSocket, sendMessage, subscribeToRoom } from "@/api/apiService";

// This interface matches the ChatMessageDTO from your backend
interface Message {
    roomId: string;
    senderSessionId: string;
    content: string;
}

const ChatPage = () => {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const { sessionId } = useSessionStore();

    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Redirect if essential info is missing
        if (!sessionId || !roomId) {
            console.error("Session or Room ID is missing. Redirecting.");
            navigate('/');
            return;
        }

        // Connect to the WebSocket server
        connectWebSocket(() => {
            setIsConnected(true);

            // Once connected, subscribe to this specific room
            subscribeToRoom(roomId, (newMessage: Message) => {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });

            // Add an initial system message to the chat for the current user
            const welcomeMessage = {
                roomId: roomId,
                content: 'You are now connected. Say hi!',
                senderSessionId: sessionId, // Mark as sent by the user
            };
            setMessages([welcomeMessage]);
        });

        // Disconnect from the WebSocket when the user leaves the page
        return () => {
            disconnectWebSocket();
            setIsConnected(false);
        };
    }, [roomId, sessionId, navigate]);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!currentMessage.trim() || !sessionId || !roomId) return;

        const messageDto: Message = {
            roomId: roomId,
            senderSessionId: sessionId,
            content: currentMessage,
        };

        // Send the message over the WebSocket connection
        sendMessage(messageDto);
        setCurrentMessage('');
    };

    return (
        <div className="flex flex-col h-screen bg-muted/20">
            <header className="p-4 border-b bg-background flex justify-between items-center shadow-sm">
                <ConnectionStatus isConnected={isConnected} />
                <Button variant="destructive" size="sm" onClick={() => navigate('/')}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Chat
                </Button>
            </header>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <SafetyBanner />
                    <div className="space-y-4 mt-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.senderSessionId === sessionId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-[80%] shadow-md ${msg.senderSessionId === sessionId ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {/* A real implementation would use WebSocket events for typing indicators */}
                        {/* <TypingIndicator isVisible={strangerIsTyping} /> */}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <footer className="p-4 border-t bg-background">
                <div className="flex items-center space-x-2 max-w-3xl mx-auto">
                    <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={!isConnected}
                    />
                    <Button onClick={handleSendMessage} disabled={!isConnected || !currentMessage.trim()}>
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;

