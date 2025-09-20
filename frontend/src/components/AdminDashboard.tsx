import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  BookOpen, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Download,
  Settings,
  UserCheck,
  UserX,
  Megaphone,
  Send,
  X,
  BarChart3,
  Building
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdminManagement from "./AdminManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAttendance, setShowAttendance] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementTitle, setAnnouncementTitle] = useState("");

  // Mock attendance data
  const attendanceData = [
    { name: "Dr. Sarah Johnson", department: "Computer Science", status: "present", time: "9:15 AM" },
    { name: "Prof. Michael Chen", department: "Mathematics", status: "present", time: "9:20 AM" },
    { name: "Dr. Lisa Rodriguez", department: "Physics", status: "absent", time: null },
    { name: "Prof. David Kim", department: "Chemistry", status: "present", time: "9:10 AM" },
    { name: "Dr. Emily Watson", department: "Biology", status: "late", time: "9:45 AM" },
    { name: "Prof. James Wilson", department: "English", status: "present", time: "9:05 AM" },
  ];

  const presentCount = attendanceData.filter(f => f.status === "present" || f.status === "late").length;
  const absentCount = attendanceData.filter(f => f.status === "absent").length;

  const handleSendAnnouncement = () => {
    if (announcementTitle && announcementText) {
      console.log("Sending announcement:", { title: announcementTitle, text: announcementText });
      setAnnouncementTitle("");
      setAnnouncementText("");
      setShowAnnouncements(false);
    }
  };

  const stats = [
    { title: "Total Faculty", value: "48", icon: Users, change: "+3", trend: "up" },
    { title: "Active Courses", value: "156", icon: BookOpen, change: "+12", trend: "up" },
    { title: "Classrooms", value: "24", icon: MapPin, change: "0", trend: "neutral" },
    { title: "Generated Timetables", value: "8", icon: Calendar, change: "+2", trend: "up" }
  ];

  const recentActivity = [
    { action: "Timetable generated for CS Department", time: "2 hours ago", status: "success" },
    { action: "Faculty availability updated", time: "4 hours ago", status: "info" },
    { action: "Room R-205 marked unavailable", time: "1 day ago", status: "warning" },
    { action: "New faculty member added", time: "2 days ago", status: "success" },
  ];

  const pendingTasks = [
    { task: "Review CS Department timetable", priority: "high" },
    { task: "Approve faculty leave requests", priority: "medium" },
    { task: "Update room capacities", priority: "low" },
    { task: "Generate reports for academic council", priority: "high" },
  ];
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (taskLabel: string) => {
    setCompletedTasks(prev => prev.includes(taskLabel)
      ? prev.filter(t => t !== taskLabel)
      : [...prev, taskLabel]);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground font-sans">Manage your institution's timetable system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="glass hover-lift transition-bounce">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="hover-glow transition-bounce">
            <Plus className="h-4 w-4 mr-2" />
            Generate Timetable
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="glass-card border-0 shadow-md hover-lift animate-fade-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground font-sans">{stat.title}</p>
                    <p className="text-2xl lg:text-3xl font-bold font-display">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant={stat.trend === 'up' ? 'default' : 'secondary'}
                        className="text-xs glass"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg hover-glow">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 glass-card border-0 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start glass hover-lift transition-bounce"
              onClick={() => setShowAttendance(true)}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Attendance Status
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start glass hover-lift transition-bounce"
              onClick={() => setShowAnnouncements(true)}
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Post Announcements
            </Button>
            <Button variant="outline" className="w-full justify-start glass hover-lift transition-bounce">
              <Users className="h-4 w-4 mr-2" />
              Manage Faculty
            </Button>
            <Button variant="outline" className="w-full justify-start glass hover-lift transition-bounce">
              <BookOpen className="h-4 w-4 mr-2" />
              Course Management
            </Button>
            <Button variant="outline" className="w-full justify-start glass hover-lift transition-bounce">
              <MapPin className="h-4 w-4 mr-2" />
              Classroom Setup
            </Button>
            <Button variant="outline" className="w-full justify-start glass hover-lift transition-bounce">
              <Calendar className="h-4 w-4 mr-2" />
              View All Timetables
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 glass-card border-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg glass hover-lift transition-smooth animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success/10' :
                    activity.status === 'warning' ? 'bg-warning/10' : 'bg-primary/10'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : activity.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : (
                      <Clock className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium font-sans">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card className="glass-card border-0 animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="font-display">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {pendingTasks.map((task, index) => {
              const isDone = completedTasks.includes(task.task);
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg glass hover-lift transition-smooth animate-fade-in ${isDone ? 'opacity-60' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={isDone}
                      onChange={() => toggleTask(task.task)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <span className={`text-sm font-medium font-sans ${isDone ? 'line-through' : ''}`}>{task.task}</span>
                  </div>
                  <Badge 
                    variant={
                      task.priority === 'high' ? 'destructive' : 
                      task.priority === 'medium' ? 'default' : 'secondary'
                    }
                    className="text-xs glass"
                  >
                    {task.priority}
                  </Badge>
                </div>
              );
            })}
          </div>
          {completedTasks.length > 0 && (
            <div className="mt-6">
              <CardTitle className="text-base mb-3">Completed Tasks</CardTitle>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {completedTasks.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Status Modal */}
      {showAttendance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Faculty Attendance - {new Date().toLocaleDateString()}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowAttendance(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Present: {presentCount}</span>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserX className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">Absent: {absentCount}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {attendanceData.map((faculty, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        faculty.status === 'present' ? 'bg-green-500' :
                        faculty.status === 'late' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{faculty.name}</p>
                        <p className="text-sm text-muted-foreground">{faculty.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {faculty.time ? (
                        <p className="text-sm text-muted-foreground">{faculty.time}</p>
                      ) : (
                        <p className="text-sm text-red-500">Not marked</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Announcements Modal */}
      {showAnnouncements && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Post Announcement
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowAnnouncements(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter announcement title"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Enter your message for faculty and students"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSendAnnouncement} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
                <Button variant="outline" onClick={() => setShowAnnouncements(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <AdminManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Reports Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced reporting and analytics features will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;