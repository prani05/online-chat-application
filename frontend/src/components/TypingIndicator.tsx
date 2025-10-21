import { useState, useEffect } from "react";

interface TypingIndicatorProps {
    isVisible: boolean;
    className?: string;
}

export const TypingIndicator = ({ isVisible, className = "" }: TypingIndicatorProps) => {
    const [dots, setDots] = useState(".");

    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === "...") return ".";
                return prev + ".";
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className={`flex items-center space-x-2 text-muted-foreground ${className}`}>
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm">Stranger is typing{dots}</span>
        </div>
    );
};

export default TypingIndicator;
