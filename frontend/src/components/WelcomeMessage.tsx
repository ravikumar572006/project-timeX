import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles, CheckCircle } from "lucide-react";

interface WelcomeMessageProps {
  userName: string;
  userRole: string;
  onClose: () => void;
}

const WelcomeMessage = ({ userName, userRole, onClose }: WelcomeMessageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    const sparkleTimer = setTimeout(() => setShowSparkles(true), 500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(sparkleTimer);
    };
  }, []);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'text-red-500';
      case 'faculty': return 'text-blue-500';
      case 'student': return 'text-green-500';
      default: return 'text-purple-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return '👑';
      case 'faculty': return '👨‍🏫';
      case 'student': return '🎓';
      default: return '👤';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className={`w-full max-w-md transform transition-all duration-700 ${
        isVisible 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-95 opacity-0 translate-y-4'
      }`}>
        <CardContent className="p-8 text-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600"></div>
          
          {/* Sparkle Animation */}
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 animate-bounce delay-100">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="absolute top-8 right-6 animate-bounce delay-300">
                <Sparkles className="w-3 h-3 text-pink-400" />
              </div>
              <div className="absolute bottom-6 left-8 animate-bounce delay-500">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="absolute bottom-4 right-4 animate-bounce delay-700">
                <Sparkles className="w-3 h-3 text-green-400" />
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Welcome Content */}
          <div className="relative z-10 space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-delayed">
                Welcome Back!
              </h2>
              <div className="flex items-center justify-center gap-2 text-lg">
                <span className="text-2xl">{getRoleIcon(userRole)}</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {userName}
                </span>
              </div>
              <p className={`text-sm font-medium ${getRoleColor(userRole)}`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
              </p>
            </div>

            {/* Animated Dots */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeMessage;
