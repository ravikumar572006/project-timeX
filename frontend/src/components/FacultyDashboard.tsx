import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  AlertCircle,
  CheckCircle,
  Edit,
  Eye
} from "lucide-react";
import { useState } from "react";

const FacultyDashboard = () => {
  const [showWeekly, setShowWeekly] = useState(false);
  const [periodAttendance, setPeriodAttendance] = useState([
    { period: 1, status: 'present' as 'present' | 'absent' },
    { period: 2, status: 'present' as 'present' | 'absent' },
    { period: 3, status: 'absent' as 'present' | 'absent' },
    { period: 4, status: 'present' as 'present' | 'absent' },
    { period: 5, status: 'present' as 'present' | 'absent' },
    { period: 6, status: 'present' as 'present' | 'absent' },
    { period: 7, status: 'absent' as 'present' | 'absent' },
    { period: 8, status: 'present' as 'present' | 'absent' },
  ]);

  const togglePeriodStatus = (p: number) => {
    setPeriodAttendance(prev => prev.map(x => x.period === p ? { ...x, status: x.status === 'present' ? 'absent' : 'present' } : x));
  };
  const weeklySchedule = [
    { day: "Monday", slots: 4, subjects: ["Data Structures", "DBMS Lab"] },
    { day: "Tuesday", slots: 3, subjects: ["Algorithms", "Project Guide"] },
    { day: "Wednesday", slots: 4, subjects: ["Data Structures", "Compiler Design"] },
    { day: "Thursday", slots: 2, subjects: ["DBMS", "Seminar"] },
    { day: "Friday", slots: 3, subjects: ["Algorithms", "Ethics in CS"] }
  ];

  const upcomingClasses = [
    { time: "9:00 AM", subject: "Data Structures", room: "R-101", batch: "CS-5A" },
    { time: "11:30 AM", subject: "DBMS Lab", room: "Lab-3", batch: "CS-5B" },
    { time: "2:30 PM", subject: "Compiler Design", room: "R-102", batch: "CS-7A" }
  ];

  const workloadStats = {
    weeklyHours: 18,
    maxAllowed: 24,
    subjects: 4,
    batches: 6
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Prof. Smith</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowWeekly(true)} title="Weekly Overview">
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Full Schedule
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Hours</p>
                <p className="text-3xl font-bold">{workloadStats.weeklyHours}</p>
                <p className="text-xs text-muted-foreground">of {workloadStats.maxAllowed} max</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subjects</p>
                <p className="text-3xl font-bold">{workloadStats.subjects}</p>
                <Badge variant="secondary" className="text-xs mt-1">Active</Badge>
              </div>
              <div className="bg-success/10 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student Batches</p>
                <p className="text-3xl font-bold">{workloadStats.batches}</p>
                <p className="text-xs text-success">All Active</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-lg font-bold text-success">Available</p>
                <p className="text-xs text-muted-foreground">No conflicts</p>
              </div>
              <div className="bg-success/10 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{cls.subject}</h4>
                      <Badge variant="outline" className="text-xs">{cls.time}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cls.room} • {cls.batch}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Period Attendance Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Period Attendance (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {periodAttendance.map((slot) => (
                <div key={slot.period} className="p-4 rounded-lg border bg-card text-center">
                  <div className="text-sm text-muted-foreground mb-1">Period {slot.period}</div>
                  <div className={`text-sm font-semibold mb-3 ${slot.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                    {slot.status === 'present' ? 'Present' : 'Absent'}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant={slot.status === 'present' ? 'default' : 'outline'}
                      onClick={() => slot.status !== 'present' && togglePeriodStatus(slot.period)}
                    >
                      Present
                    </Button>
                    <Button 
                      size="sm" 
                      variant={slot.status === 'absent' ? 'destructive' : 'outline'}
                      onClick={() => slot.status !== 'absent' && togglePeriodStatus(slot.period)}
                    >
                      Absent
                    </Button>
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
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Edit className="h-5 w-5" />
              <span className="text-sm">Update Availability</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">Report Issue</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Request Leave</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview Modal */}
      {showWeekly && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Weekly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklySchedule.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div>
                      <p className="font-medium">{day.day}</p>
                      <p className="text-sm text-muted-foreground">{day.subjects.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={day.slots > 3 ? 'default' : 'secondary'} className="text-xs">{day.slots} slots</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Button variant="outline" onClick={() => setShowWeekly(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;