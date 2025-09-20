import { useState } from "react";
import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import AdminDashboard from "@/components/AdminDashboard";
import TimetableView from "@/components/TimetableView";
import FacultyDashboard from "@/components/FacultyDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import TimetableGenerator from "@/components/TimetableGenerator";

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john.doe@school.edu",
    phone: "+91 98765 43210",
    role: "admin" as "admin" | "faculty" | "student",
    avatar: "",
    department: "Computer Science",
    designation: "Administrator",
    joinDate: "2020-01-15",
    address: "123 Main Street, City, State",
    bio: "Experienced administrator with a passion for education technology."
  });

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onViewChange={setCurrentView} />;
      case 'admin':
        return <AdminDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'timetable':
        return <TimetableView />;
      case 'generator':
        return <TimetableGenerator />;
      default:
        return <HomePage onViewChange={setCurrentView} />;
    }
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isLoggedIn={isLoggedIn}
        user={user}
        onUserUpdate={handleUserUpdate}
      />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
