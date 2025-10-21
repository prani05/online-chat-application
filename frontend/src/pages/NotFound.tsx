import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
                Oops! The page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
                Return to Home
            </Button>
        </div>
    );
};

export default NotFound;
