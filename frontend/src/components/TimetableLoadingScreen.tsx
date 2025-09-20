import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, RefreshCw, Sparkles, Calendar, Users, MapPin, Clock, Settings, Brain, Zap, Timer } from "lucide-react";

interface TimetableLoadingScreenProps {
  currentStep: number;
  onComplete: () => void;
}

const TimetableLoadingScreen = ({ currentStep, onComplete }: TimetableLoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    { 
      step: 1, 
      label: "Analyzing Constraints", 
      icon: Settings,
      description: "Processing faculty availability and room requirements",
      color: "blue",
      duration: 2000
    },
    { 
      step: 2, 
      label: "Optimizing Faculty Allocation", 
      icon: Users,
      description: "Matching teachers to subjects and time slots",
      color: "green",
      duration: 2500
    },
    { 
      step: 3, 
      label: "Resolving Room Conflicts", 
      icon: MapPin,
      description: "Ensuring optimal room utilization and scheduling",
      color: "purple",
      duration: 2000
    },
    { 
      step: 4, 
      label: "AI Workload Balancing", 
      icon: Brain,
      description: "Applying machine learning for optimal distribution",
      color: "orange",
      duration: 3000
    },
    { 
      step: 5, 
      label: "Finalizing Timetable", 
      icon: Calendar,
      description: "Generating the final optimized schedule",
      color: "pink",
      duration: 1500
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentStep >= 5) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  const getColorClasses = (color: string, isActive: boolean, isCompleted: boolean) => {
    if (isCompleted) {
      return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300";
    }
    if (isActive) {
      switch (color) {
        case 'blue': return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300";
        case 'green': return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300";
        case 'purple': return "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300";
        case 'orange': return "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300";
        case 'pink': return "bg-pink-50 border-pink-200 text-pink-800 dark:bg-pink-900/20 dark:border-pink-800 dark:text-pink-300";
        default: return "bg-primary/10 border-primary/20 text-primary";
      }
    }
    return "bg-muted/30 border-muted text-muted-foreground";
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="max-w-2xl w-full mx-4">
        <Card className={`transform transition-all duration-700 shadow-2xl border-0 ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}>
          <CardContent className="p-8">
            {/* Hourglass Animation */}
            <div className="text-center mb-8">
              <div className="relative mb-8">
                {/* Hourglass Container */}
                <div className="w-32 h-40 mx-auto relative">
                  {/* Hourglass Frame */}
                  <div className="absolute inset-0 border-4 border-primary/30 rounded-lg"></div>
                  
                  {/* Top Chamber */}
                  <div className="absolute top-2 left-2 right-2 h-16 bg-gradient-to-b from-primary/20 to-primary/10 rounded-t-lg overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 transition-all duration-2000 ease-in-out"
                      style={{ 
                        height: `${Math.max(0, 100 - (currentStep / steps.length) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  
                  {/* Middle Narrow Part */}
                  <div className="absolute top-18 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-primary/30"></div>
                  
                  {/* Bottom Chamber */}
                  <div className="absolute bottom-2 left-2 right-2 h-16 bg-gradient-to-b from-primary/10 to-primary/20 rounded-b-lg overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary/60 to-primary transition-all duration-2000 ease-in-out"
                      style={{ 
                        height: `${(currentStep / steps.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                  
                  {/* Sand Particles Animation */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-ping"></div>
                  <div className="absolute top-22 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-primary/80 rounded-full animate-ping delay-300"></div>
                  <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-primary/60 rounded-full animate-ping delay-700"></div>
                </div>
                
                {/* Timer Icon */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <Timer className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Generating Your Timetable
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Our AI is working hard to create the perfect schedule for you
              </p>
              <p className="text-sm text-muted-foreground italic">
                Thanks for your patience
              </p>
            </div>

            {/* Current Step Display */}
            <div className="text-center mb-6">
              {currentStep > 0 && currentStep <= steps.length && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                      <RefreshCw className="h-4 w-4 text-white animate-spin" />
                    </div>
                    <h3 className="font-semibold text-primary">
                      {steps[currentStep - 1]?.label}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {steps[currentStep - 1]?.description}
                  </p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
              </div>
              
              {/* Status Text */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {currentStep === 0 && "Preparing your timetable..."}
                  {currentStep > 0 && currentStep < steps.length && `Step ${currentStep} of ${steps.length}`}
                  {currentStep >= steps.length && "Finalizing your schedule..."}
                </p>
              </div>
            </div>

            {/* Animated Elements */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimetableLoadingScreen;
