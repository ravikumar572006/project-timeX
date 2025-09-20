import { useEffect, useState } from "react";
import { Calendar, Clock, Users, BookOpen, Sparkles, CheckCircle } from "lucide-react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Calendar, text: "Initializing Schedule System", color: "text-blue-500" },
    { icon: Users, text: "Loading User Management", color: "text-green-500" },
    { icon: BookOpen, text: "Preparing Course Data", color: "text-purple-500" },
    { icon: Clock, text: "Setting Up Timetables", color: "text-orange-500" },
    { icon: Sparkles, text: "Finalizing Experience", color: "text-pink-500" },
  ];

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const increment = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadingComplete();
          }, 500); // Small delay to show completion
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete, steps.length]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/20 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 bg-indigo-200/20 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-200/20 rounded-full animate-bounce delay-3000"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-32 right-20 text-blue-300/30 animate-float">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="absolute top-60 left-16 text-purple-300/30 animate-float-delayed">
            <Clock className="w-6 h-6" />
          </div>
          <div className="absolute bottom-40 right-40 text-indigo-300/30 animate-float-slow">
            <Users className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo Section */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-slow">
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in tracking-tight">
                Neat Schedule
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg animate-fade-in-delayed font-medium">
                Your Academic Timetable Solution
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-6">
            {/* Current Step */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div key={index} className="flex items-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                        ${isCompleted 
                          ? 'bg-green-500 text-white scale-110' 
                          : isActive 
                            ? `${step.color.replace('text-', 'bg-')} text-white scale-110 shadow-lg` 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`
                          w-8 h-1 mx-2 transition-all duration-500
                          ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
                        `} />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-2">
                <p className={`text-lg font-semibold transition-all duration-500 ${
                  currentStep < steps.length ? steps[currentStep].color : 'text-green-500'
                }`}>
                  {currentStep < steps.length ? steps[currentStep].text : 'Ready to Go!'}
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoadingScreen;
