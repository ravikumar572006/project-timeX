import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Mail, GraduationCap, Users, Settings, Building2 } from "lucide-react";
import TimexLogo from "./TimexLogo";
import WelcomeMessage from "./WelcomeMessage";

interface LoginModalProps {
  children: React.ReactNode;
}

const LoginModal = ({ children }: LoginModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({ name: "", role: "" });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    // Mock login logic - in real app, this would authenticate
    console.log("Login attempt:", formData);
    setLoggedInUser({ name: formData.email.split('@')[0], role: formData.role });
    setIsOpen(false);
    setShowWelcome(true);
  };

  const handleRegister = () => {
    // Mock registration logic
    console.log("Registration attempt:", formData);
    setLoggedInUser({ name: formData.name, role: formData.role });
    setIsOpen(false);
    setShowWelcome(true);
  };

  const roleIcons = {
    student: GraduationCap,
    faculty: Users,
    admin: Settings
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md p-0 border-0 bg-transparent">
        <div className="relative">
          
          <Card className="border border-slate-700 bg-slate-900 text-white animate-scale-in relative z-10">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <TimexLogo size="md" />
              </div>
              <CardTitle className="font-display text-2xl text-slate-800 dark:text-white">
                Welcome Back
              </CardTitle>
              <p className="text-slate-200 text-sm">
                Access your scheduling dashboard
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 text-white bg-slate-800 border border-slate-700 rounded-md">
                  <TabsTrigger value="login" className="transition-smooth text-white">Login</TabsTrigger>
                  <TabsTrigger value="register" className="transition-smooth text-white">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 animate-fade-in">
                  {/* Social Login */}
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full text-white border-white/30 hover:border-white/50 bg-slate-800 hover:bg-slate-700"
                    onClick={() => console.log('Login with Google')}
                  >
                    Continue with Google
                  </Button>
                  <div className="relative text-center">
                    <span className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/20"></span></span>
                    <span className="relative px-2 text-xs text-slate-200 bg-transparent">or</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-200" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 border border-white/20 bg-white/10 placeholder:text-slate-300 text-white rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-200" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 border border-white/20 bg-white/10 placeholder:text-slate-300 text-white rounded-md"
                      />
                    </div>
                    <div className="text-right">
                      <button type="button" className="text-xs text-blue-300 hover:underline">Forgot password?</button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleLogin}
                    className="w-full hover-glow transition-bounce text-slate-900 bg-white hover:bg-slate-100"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4 animate-fade-in max-h-[60vh] overflow-y-auto pr-1 scroll-thin-blue">
                  {/* Social Sign Up */}
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full text-white border-white/30 hover:border-white/50 bg-slate-800 hover:bg-slate-700"
                    onClick={() => console.log('Sign up with Google')}
                  >
                    Sign up with Google
                  </Button>
                  <div className="relative text-center">
                    <span className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/20"></span></span>
                    <span className="relative px-2 text-xs text-slate-200">or sign up with email</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-200" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10 border border-white/20 bg-white/10 placeholder:text-slate-300 text-white rounded-md"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-sm font-medium text-white">Institution Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-200" />
                      <Input
                        id="institution"
                        type="text"
                        placeholder="Enter your institution name"
                        onChange={(e) => handleInputChange("institution", e.target.value)}
                        className="pl-10 border border-white/20 bg-white/10 placeholder:text-slate-300 text-white rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-sm font-medium text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-200" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 border border-white/20 bg-white/10 placeholder:text-slate-300 text-white rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">Role</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {Object.entries(roleIcons).map(([role, Icon]) => (
                        <Button
                          key={role}
                          type="button"
                          variant={formData.role === role ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleInputChange("role", role)}
                          className="transition-bounce hover-lift text-white border-white/30 bg-slate-800 hover:bg-slate-700"
                        >
                          <Icon className="h-4 w-4 mr-1" />
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-sm font-medium text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-200" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 border border-white/20 bg-white/10 placeholder:text-slate-300 text-white rounded-md"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleRegister}
                    className="w-full hover-glow transition-bounce text-slate-900 bg-white hover:bg-slate-100"
                    size="lg"
                  >
                    Create Account
                  </Button>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our Terms of Service
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
      
      {/* Welcome Message */}
      {showWelcome && (
        <WelcomeMessage
          userName={loggedInUser.name}
          userRole={loggedInUser.role}
          onClose={() => setShowWelcome(false)}
        />
      )}
    </Dialog>
  );
};

export default LoginModal;