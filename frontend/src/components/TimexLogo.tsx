import { Clock, Settings } from "lucide-react";
import SettingsModal from "./SettingsModal";

interface TimexLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean; // New prop to control animations
  showSettings?: boolean; // New prop to show settings button
}

const TimexLogo = ({ size = "md", className = "", animated = false, showSettings = false }: TimexLogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl", 
    lg: "text-4xl"
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative group">
        {/* Subtle Background Glow - only on hover if animated */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        )}
        
        {/* Logo Container */}
        <div className={`relative bg-gradient-primary p-3 rounded-xl shadow-university transition-all duration-300 ${
          animated ? 'group-hover:scale-105 group-hover:shadow-lg' : ''
        }`}>
          <Clock className={`${iconSizes[size]} text-primary-foreground ${
            animated ? 'group-hover:rotate-12 transition-transform duration-300' : ''
          }`} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <h1 className={`${sizeClasses[size]} text-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent ${
          animated ? 'group-hover:from-accent group-hover:via-primary group-hover:to-accent transition-all duration-500' : ''
        }`}>
          Timex
        </h1>
        {size !== "sm" && (
          <p className="text-caption text-muted-foreground">
            Smart Scheduling System
          </p>
        )}
      </div>

      {showSettings && (
        <SettingsModal>
          <button className="ml-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
            <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </SettingsModal>
      )}
    </div>
  );
};

export default TimexLogo;