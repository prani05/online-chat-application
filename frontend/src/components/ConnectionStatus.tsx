import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Clock } from "lucide-react";

interface ConnectionStatusProps {
    isConnected: boolean;
    connectionTime?: number;
    className?: string;
}

export const ConnectionStatus = ({ isConnected, connectionTime = 0, className = "" }: ConnectionStatusProps) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {isConnected ? (
                <>
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <Wifi className="w-4 h-4 text-green-500" />
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                            Connected
                        </Badge>
                    </div>
                    {connectionTime > 0 && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{formatTime(connectionTime)}</span>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/20">
                        Disconnected
                    </Badge>
                </div>
            )}
        </div>
    );
};

export default ConnectionStatus;
