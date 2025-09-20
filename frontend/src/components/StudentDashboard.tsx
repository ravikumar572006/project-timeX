import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Download,
  Bell,
  Users,
  MapPin
} from "lucide-react";
import { useState, useEffect } from "react";

const StudentDashboard = () => {
  const [schedule, setSchedule] = useState([
    { time: "9:00-10:00", subject: "Data Structures", faculty: "Dr. Smith", room: "R-101", type: "theory" },
    { time: "10:00-11:00", subject: "DBMS", faculty: "Prof. Johnson", room: "R-102", type: "theory" },
    { time: "11:30-12:30", subject: "OS Lab", faculty: "Dr. Wilson", room: "Lab-1", type: "lab" },
    { time: "2:30-3:30", subject: "Computer Networks", faculty: "Dr. Brown", room: "R-103", type: "theory" },
  ]);

  // Simulate real-time updates (in real app, this would come from API)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate schedule updates
      setSchedule(prev => [...prev]);
+      console.log("Schedule updated at:", new Date().toLocaleTimeString());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);


  const weeklySubjects = [
    { name: "Data Structures & Algorithms", code: "CS501", credits: 4, faculty: "Dr. Smith" },
    { name: "Database Management Systems", code: "CS502", credits: 4, faculty: "Prof. Johnson" },
    { name: "Operating Systems", code: "CS503", credits: 3, faculty: "Dr. Wilson" },
    { name: "Computer Networks", code: "CS504", credits: 3, faculty: "Dr. Brown" },
    { name: "Software Engineering", code: "CS505", credits: 3, faculty: "Prof. Davis" },
  ];

  const announcements = [
    { title: "Mid-term exam schedule released", time: "2 hours ago", type: "exam" },
    { title: "Project submission deadline extended", time: "1 day ago", type: "assignment" },
    { title: "Guest lecture on AI tomorrow", time: "2 days ago", type: "event" },
  ];

  const getSubjectColor = (type: string) => {
    switch (type) {
      case 'theory': return 'bg-primary/10 border-primary/20 text-primary';
      case 'lab': return 'bg-success/10 border-success/20 text-success';
      case 'project': return 'bg-accent/10 border-accent/20 text-accent-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">CS - Semester 5 • Student ID: CS21001</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Schedule
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Full Timetable
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="bg-gradient-card border-0 shadow-university">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">John Smith</h3>
              <p className="text-muted-foreground">Computer Science & Engineering</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="default">Semester 5</Badge>
                <Badge variant="secondary">Regular Student</Badge>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-bold">17</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule - Monday
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto scroll-thin-blue">
              {schedule.map((cls, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${getSubjectColor(cls.type)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{cls.subject}</h4>
                    <Badge variant="outline" className="text-xs">
                      {cls.time}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-80">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {cls.faculty}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {cls.room}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {cls.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.map((announcement, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 border">
                  <h5 className="font-medium text-sm mb-1">{announcement.title}</h5>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{announcement.time}</p>
                    <Badge 
                      variant={
                        announcement.type === 'exam' ? 'destructive' : 
                        announcement.type === 'assignment' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {announcement.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Full Timetable</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Download className="h-5 w-5" />
              <span className="text-sm">Download PDF</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Bell className="h-5 w-5" />
              <span className="text-sm">Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;