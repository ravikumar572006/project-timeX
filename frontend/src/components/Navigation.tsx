import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  Settings, 
  Home, 
  FileSpreadsheet, 
  LogIn,
  Menu,
  X,
  User
} from "lucide-react";
import TimexLogo from "./TimexLogo";
import LoginModal from "./LoginModal";
import ProfileModal from "./ProfileModal";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isLoggedIn?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "faculty" | "student";
    avatar?: string;
    department?: string;
    designation?: string;
    class?: string;
    section?: string;
    rollNumber?: string;
    joinDate: string;
    address?: string;
    bio?: string;
    subjects?: string[];
  };
  onUserUpdate?: (user: any) => void;
}

const Navigation = ({ currentView, onViewChange, isLoggedIn = false, user, onUserUpdate }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'admin', label: 'Admin', icon: Settings },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'timetable', label: 'Timetables', icon: Calendar },
    { id: 'generator', label: 'Generator', icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav className="sticky top-0 z-50 glass border-b border-border/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <TimexLogo size="sm" showSettings={true} />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center space-x-2 transition-bounce hover-lift ${
                      currentView === item.id ? 'bg-primary/90 hover-glow' : 'glass hover:glass-card'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline font-medium">{item.label}</span>
                  </Button>
                );
              })}
              
              {isLoggedIn && user ? (
                <ProfileModal user={user} onUpdate={onUserUpdate || (() => {})} />
              ) : (
                <LoginModal>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="glass hover-glow transition-bounce ml-4"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Login</span>
                  </Button>
                </LoginModal>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {isLoggedIn && user ? (
                <ProfileModal user={user} onUpdate={onUserUpdate || (() => {})} />
              ) : (
                <LoginModal>
                  <Button variant="ghost" size="sm" className="glass">
                    <LogIn className="h-4 w-4" />
                  </Button>
                </LoginModal>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="glass"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="glass-card mx-4 mb-4 rounded-xl animate-slide-in-left">
            <div className="grid grid-cols-2 gap-3 p-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-start space-x-2 w-full transition-bounce hover-lift ${
                      currentView === item.id ? 'bg-primary/90 hover-glow' : 'glass hover:glass-card'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;