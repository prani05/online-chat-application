import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Eye, X } from "lucide-react";
import { useState } from "react";

interface SafetyBannerProps {
    onDismiss?: () => void;
    className?: string;
}

export const SafetyBanner = ({ onDismiss, className = "" }: SafetyBannerProps) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    if (!isVisible) return null;

    return (
        <Card className={`p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-primary ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Stay Safe While Chatting</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center space-x-2">
                                <Eye className="w-3 h-3" />
                                <span>All conversations are monitored for safety</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Report inappropriate behavior immediately</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Shield className="w-3 h-3" />
                                <span>Never share personal information</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-3 h-3" />
                </Button>
            </div>
        </Card>
    );
};

export default SafetyBanner;
