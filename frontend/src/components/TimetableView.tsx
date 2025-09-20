import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, Users, BookOpen, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const TimetableView = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("cs");
  const [selectedSemester, setSelectedSemester] = useState("sem5");
  const [selectedClass, setSelectedClass] = useState("cs5a");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showTodaysTimetable, setShowTodaysTimetable] = useState(true);

  const timeSlots = [
    "9:00-10:00",
    "10:00-11:00", 
    "11:30-12:30",
    "12:30-1:30",
    "2:30-3:30",
    "3:30-4:30"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Check if today's timetable should be shown (disappears at end of day)
  useEffect(() => {
    const checkTodaysTimetable = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      if (now > endOfDay) {
        setShowTodaysTimetable(false);
      }
    };

    checkTodaysTimetable();
    const interval = setInterval(checkTodaysTimetable, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Today's modified timetable (due to faculty unavailability)
  const todaysTimetable = {
    "Monday": {
      "9:00-10:00": { subject: "Data Structures", faculty: "Dr. Smith", room: "R-101", type: "theory", modified: false },
      "10:00-11:00": { subject: "DBMS", faculty: "Prof. Johnson", room: "R-102", type: "theory", modified: false },
      "11:30-12:30": { subject: "OS Lab", faculty: "Dr. Wilson", room: "Lab-1", type: "lab", modified: false },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break", modified: false },
      "2:30-3:30": { subject: "Computer Networks", faculty: "Dr. Brown", room: "R-103", type: "theory", modified: true, reason: "Faculty unavailable" },
      "3:30-4:30": { subject: "Software Engineering", faculty: "Prof. Davis", room: "R-101", type: "theory", modified: false }
    },
    "Tuesday": {
      "9:00-10:00": { subject: "Algorithms", faculty: "Dr. Smith", room: "R-101", type: "theory", modified: false },
      "10:00-11:00": { subject: "Web Development", faculty: "Prof. Miller", room: "Lab-2", type: "lab", modified: true, reason: "Room change" },
      "11:30-12:30": { subject: "DBMS Lab", faculty: "Prof. Johnson", room: "Lab-3", type: "lab", modified: false },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break", modified: false },
      "2:30-3:30": { subject: "Machine Learning", faculty: "Dr. Taylor", room: "R-104", type: "theory", modified: false },
      "3:30-4:30": { subject: "Project Work", faculty: "Various", room: "R-105", type: "project", modified: false }
    },
    "Wednesday": {
      "9:00-10:00": { subject: "Data Structures", faculty: "Dr. Smith", room: "R-101", type: "theory", modified: false },
      "10:00-11:00": { subject: "Computer Graphics", faculty: "Prof. Anderson", room: "Lab-4", type: "lab", modified: false },
      "11:30-12:30": { subject: "Networks Lab", faculty: "Dr. Brown", room: "Lab-1", type: "lab", modified: false },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break", modified: false },
      "2:30-3:30": { subject: "Compiler Design", faculty: "Dr. Wilson", room: "R-102", type: "theory", modified: true, reason: "Faculty on leave" },
      "3:30-4:30": { subject: "Seminar", faculty: "Guest Faculty", room: "Auditorium", type: "seminar", modified: false }
    },
    "Thursday": {
      "9:00-10:00": { subject: "DBMS", faculty: "Prof. Johnson", room: "R-102", type: "theory", modified: false },
      "10:00-11:00": { subject: "AI Fundamentals", faculty: "Dr. Taylor", room: "R-103", type: "theory", modified: false },
      "11:30-12:30": { subject: "Project Lab", faculty: "Various", room: "Lab-2", type: "lab", modified: false },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break", modified: false },
      "2:30-3:30": { subject: "Software Testing", faculty: "Prof. Davis", room: "R-104", type: "theory", modified: false },
      "3:30-4:30": { subject: "Industry Talk", faculty: "Industry Expert", room: "Auditorium", type: "seminar", modified: false }
    },
    "Friday": {
      "9:00-10:00": { subject: "Algorithms", faculty: "Dr. Smith", room: "R-101", type: "theory", modified: false },
      "10:00-11:00": { subject: "Mobile App Dev", faculty: "Prof. Miller", room: "Lab-3", type: "lab", modified: false },
      "11:30-12:30": { subject: "Capstone Project", faculty: "All Faculty", room: "Various", type: "project", modified: false },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break", modified: false },
      "2:30-3:30": { subject: "Ethics in CS", faculty: "Dr. Wilson", room: "R-105", type: "theory", modified: false },
      "3:30-4:30": { subject: "Free Period", faculty: "", room: "", type: "free", modified: false }
    }
  };

  const sampleTimetable = {
    "Monday": {
      "9:00-10:00": { subject: "Data Structures", faculty: "Dr. Smith", room: "R-101", type: "theory" },
      "10:00-11:00": { subject: "DBMS", faculty: "Prof. Johnson", room: "R-102", type: "theory" },
      "11:30-12:30": { subject: "OS Lab", faculty: "Dr. Wilson", room: "Lab-1", type: "lab" },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      "2:30-3:30": { subject: "Computer Networks", faculty: "Dr. Brown", room: "R-103", type: "theory" },
      "3:30-4:30": { subject: "Software Engineering", faculty: "Prof. Davis", room: "R-101", type: "theory" }
    },
    "Tuesday": {
      "9:00-10:00": { subject: "Algorithms", faculty: "Dr. Smith", room: "R-101", type: "theory" },
      "10:00-11:00": { subject: "Web Development", faculty: "Prof. Miller", room: "Lab-2", type: "lab" },
      "11:30-12:30": { subject: "DBMS Lab", faculty: "Prof. Johnson", room: "Lab-3", type: "lab" },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      "2:30-3:30": { subject: "Machine Learning", faculty: "Dr. Taylor", room: "R-104", type: "theory" },
      "3:30-4:30": { subject: "Project Work", faculty: "Various", room: "R-105", type: "project" }
    },
    "Wednesday": {
      "9:00-10:00": { subject: "Data Structures", faculty: "Dr. Smith", room: "R-101", type: "theory" },
      "10:00-11:00": { subject: "Computer Graphics", faculty: "Prof. Anderson", room: "Lab-4", type: "lab" },
      "11:30-12:30": { subject: "Networks Lab", faculty: "Dr. Brown", room: "Lab-1", type: "lab" },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      "2:30-3:30": { subject: "Compiler Design", faculty: "Dr. Wilson", room: "R-102", type: "theory" },
      "3:30-4:30": { subject: "Seminar", faculty: "Guest Faculty", room: "Auditorium", type: "seminar" }
    },
    "Thursday": {
      "9:00-10:00": { subject: "DBMS", faculty: "Prof. Johnson", room: "R-102", type: "theory" },
      "10:00-11:00": { subject: "AI Fundamentals", faculty: "Dr. Taylor", room: "R-103", type: "theory" },
      "11:30-12:30": { subject: "Project Lab", faculty: "Various", room: "Lab-2", type: "lab" },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      "2:30-3:30": { subject: "Software Testing", faculty: "Prof. Davis", room: "R-104", type: "theory" },
      "3:30-4:30": { subject: "Industry Talk", faculty: "Industry Expert", room: "Auditorium", type: "seminar" }
    },
    "Friday": {
      "9:00-10:00": { subject: "Algorithms", faculty: "Dr. Smith", room: "R-101", type: "theory" },
      "10:00-11:00": { subject: "Mobile App Dev", faculty: "Prof. Miller", room: "Lab-3", type: "lab" },
      "11:30-12:30": { subject: "Capstone Project", faculty: "All Faculty", room: "Various", type: "project" },
      "12:30-1:30": { subject: "Lunch Break", faculty: "", room: "", type: "break" },
      "2:30-3:30": { subject: "Ethics in CS", faculty: "Dr. Wilson", room: "R-105", type: "theory" },
      "3:30-4:30": { subject: "Free Period", faculty: "", room: "", type: "free" }
    }
  };

  const getSubjectColor = (type: string, modified: boolean = false) => {
    const baseColors = {
      'theory': 'bg-primary/10 border-primary/20 text-primary',
      'lab': 'bg-success/10 border-success/20 text-success',
      'project': 'bg-accent/10 border-accent/20 text-accent-foreground',
      'seminar': 'bg-warning/10 border-warning/20 text-warning-foreground',
      'break': 'bg-muted border-muted-foreground/20 text-muted-foreground',
      'free': 'bg-secondary border-secondary-foreground/20 text-secondary-foreground'
    };
    
    const color = baseColors[type] || 'bg-muted';
    return modified ? `${color} border-orange-300 bg-orange-50/50` : color;
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Timetable View</h1>
          <p className="text-muted-foreground">View and manage academic schedules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Print View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="ece">Electronics & Communication</SelectItem>
                  <SelectItem value="mech">Mechanical Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem1">Sem 1</SelectItem>
                  <SelectItem value="sem2">Sem 2</SelectItem>
                  <SelectItem value="sem3">Sem 3</SelectItem>
                  <SelectItem value="sem4">Sem 4</SelectItem>
                  <SelectItem value="sem5">Sem 5</SelectItem>
                  <SelectItem value="sem6">Sem 6</SelectItem>
                  <SelectItem value="sem7">Sem 7</SelectItem>
                  <SelectItem value="sem8">Sem 8</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs5a">CS-5A</SelectItem>
                  <SelectItem value="cs5b">CS-5B</SelectItem>
                  <SelectItem value="cs5c">CS-5C</SelectItem>
                  <SelectItem value="cs7a">CS-7A</SelectItem>
                  <SelectItem value="cs7b">CS-7B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="ds">Data Structures</SelectItem>
                  <SelectItem value="dbms">DBMS</SelectItem>
                  <SelectItem value="os">Operating Systems</SelectItem>
                  <SelectItem value="cn">Computer Networks</SelectItem>
                  <SelectItem value="se">Software Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-primary/10 border-primary/20 text-primary">Theory</Badge>
            <Badge className="bg-success/10 border-success/20 text-success">Lab</Badge>
            <Badge className="bg-accent/10 border-accent/20 text-accent-foreground">Project</Badge>
            <Badge className="bg-warning/10 border-warning/20 text-warning-foreground">Seminar</Badge>
            <Badge className="bg-muted border-muted-foreground/20 text-muted-foreground">Break</Badge>
            <Badge className="bg-secondary border-secondary-foreground/20 text-secondary-foreground">Free</Badge>
            <Badge className="bg-orange-50 border-orange-300 text-orange-700">Modified</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Tabs */}
      <Tabs defaultValue="permanent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="permanent" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Permanent Timetable
          </TabsTrigger>
          <TabsTrigger value="today" className="flex items-center gap-2" disabled={!showTodaysTimetable}>
            <Clock className="h-4 w-4" />
            Today's Timetable
            {!showTodaysTimetable && <AlertCircle className="h-3 w-3 text-muted-foreground" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="permanent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Permanent Timetable - {selectedClass.toUpperCase()} - Semester 5
              </CardTitle>
              <p className="text-sm text-muted-foreground">Official timetable designed by admin</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full font-times">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold">Time</th>
                      {days.map((day) => (
                        <th key={day} className="text-center p-3 font-bold min-w-48">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, slotIndex) => (
                      <tr key={slot} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium bg-muted/50">{slot}</td>
                        {days.map((day) => {
                          const classInfo = sampleTimetable[day]?.[slot];
                          return (
                            <td key={`${day}-${slot}`} className="p-2">
                              {classInfo ? (
                                <div className={`p-3 rounded-lg border-2 ${getSubjectColor(classInfo.type)} transition-all hover:shadow-md`}>
                                  <div className="font-semibold text-sm mb-1">
                                    {classInfo.subject}
                                  </div>
                                  {classInfo.faculty && (
                                    <div className="text-xs opacity-80 flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {classInfo.faculty}
                                    </div>
                                  )}
                                  {classInfo.room && (
                                    <div className="text-xs opacity-80 flex items-center gap-1">
                                      <BookOpen className="h-3 w-3" />
                                      {classInfo.room}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-3 rounded-lg border border-dashed border-muted-foreground/20 text-center text-xs text-muted-foreground">
                                  Free
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Timetable - {selectedClass.toUpperCase()} - {new Date().toLocaleDateString()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Updated due to faculty unavailability - expires at end of day</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full font-times">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold">Time</th>
                      {days.map((day) => (
                        <th key={day} className="text-center p-3 font-bold min-w-48">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, slotIndex) => (
                      <tr key={slot} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium bg-muted/50">{slot}</td>
                        {days.map((day) => {
                          const classInfo = todaysTimetable[day]?.[slot];
                          return (
                            <td key={`${day}-${slot}`} className="p-2">
                              {classInfo ? (
                                <div className={`p-3 rounded-lg border-2 ${getSubjectColor(classInfo.type, classInfo.modified)} transition-all hover:shadow-md`}>
                                  <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                                    {classInfo.subject}
                                    {classInfo.modified && <AlertCircle className="h-3 w-3 text-orange-600" />}
                                  </div>
                                  {classInfo.faculty && (
                                    <div className="text-xs opacity-80 flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {classInfo.faculty}
                                    </div>
                                  )}
                                  {classInfo.room && (
                                    <div className="text-xs opacity-80 flex items-center gap-1">
                                      <BookOpen className="h-3 w-3" />
                                      {classInfo.room}
                                    </div>
                                  )}
                                  {classInfo.modified && classInfo.reason && (
                                    <div className="text-xs text-orange-600 mt-1 italic">
                                      {classInfo.reason}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-3 rounded-lg border border-dashed border-muted-foreground/20 text-center text-xs text-muted-foreground">
                                  Free
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimetableView;