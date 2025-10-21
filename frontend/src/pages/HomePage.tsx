import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, MessageCircle, Users, Moon, Sun, Shield, FileText, HelpCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
    const [onlineUsers] = useState({ male: 1247, female: 892 });
    const navigate = useNavigate();

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark");
    };

    const handleChatMode = (mode: 'text' | 'video') => {
        navigate('/gender-verification', { state: { chatMode: mode } });
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">StrangerChat</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 border">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{onlineUsers.male + onlineUsers.female} online</span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="rounded-full bg-card/80 backdrop-blur-sm border"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Hero Section */}
                    <div className="mb-12 animate-fade-in">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-green-500 bg-clip-text text-transparent">
                            Connect with Strangers
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Safe, anonymous, and verified conversations. Choose your preferred chat mode and start connecting with people worldwide.
                        </p>
                    </div>

                    {/* Chat Mode Selection */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12 animate-slide-up">
                        <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group bg-card/80 backdrop-blur-sm border-2 hover:border-primary/50"
                              onClick={() => handleChatMode('text')}>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center group-hover:animate-pulse-glow">
                                    <MessageCircle className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Text Chat</h3>
                                <p className="text-muted-foreground mb-6">
                                    Connect through messages with real-time typing indicators and instant connections.
                                </p>
                                <div className="flex justify-center space-x-2 mb-4">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Anonymous</Badge>
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">Verified</Badge>
                                </div>
                                <Button className="w-full gradient-primary hover:opacity-90 transition-opacity">
                                    Start Text Chat
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group bg-card/80 backdrop-blur-sm border-2 hover:border-secondary/50"
                              onClick={() => handleChatMode('video')}>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-verification flex items-center justify-center group-hover:animate-pulse-glow">
                                    <Video className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Video Chat</h3>
                                <p className="text-muted-foreground mb-6">
                                    Face-to-face conversations with camera verification and text chat alongside video.
                                </p>
                                <div className="flex justify-center space-x-2 mb-4">
                                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">Face-to-Face</Badge>
                                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">HD Quality</Badge>
                                </div>
                                <Button className="w-full gradient-verification hover:opacity-90 transition-opacity">
                                    Start Video Chat
                                </Button>
                            </div>
                        </Card>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-wrap justify-center space-x-6 mb-6">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <FileText className="w-4 h-4 mr-2" />
                            Rules
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Shield className="w-4 h-4 mr-2" />
                            Terms of Service
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <FileText className="w-4 h-4 mr-2" />
                            Privacy Policy
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Blog
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <HelpCircle className="w-4 h-4 mr-2" />
                            FAQ
                        </Button>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        <p>&copy; 2024 StrangerChat. Safe, anonymous conversations worldwide.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
