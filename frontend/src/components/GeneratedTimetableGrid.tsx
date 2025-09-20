import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, Users, MapPin, Clock } from "lucide-react";

interface GeneratedTimetableGridProps {
  section: string;
  onDownload: () => void;
  onViewDetails: () => void;
}

const GeneratedTimetableGrid = ({ section, onDownload, onViewDetails }: GeneratedTimetableGridProps) => {
  const timeSlots = [
    "9:00-10:00",
    "10:00-11:00", 
    "11:30-12:30",
    "12:30-1:30",
    "2:30-3:30",
    "3:30-4:30"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Sample generated timetable data
  const generatedTimetable = {
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

  const getSubjectColor = (type: string) => {
    switch (type) {
      case 'theory': return 'bg-primary/10 border-primary/20 text-primary';
      case 'lab': return 'bg-success/10 border-success/20 text-success';
      case 'project': return 'bg-accent/10 border-accent/20 text-accent-foreground';
      case 'seminar': return 'bg-warning/10 border-warning/20 text-warning-foreground';
      case 'break': return 'bg-muted border-muted-foreground/20 text-muted-foreground';
      case 'free': return 'bg-secondary border-secondary-foreground/20 text-secondary-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Generated Timetable - Section {section.toUpperCase()}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Optimized schedule generated successfully
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <Button onClick={onDownload} size="sm" className="w-full lg:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download Timetable
            </Button>
            <Button variant="outline" onClick={onViewDetails} size="sm" className="w-full lg:w-auto">
              <BookOpen className="h-4 w-4 mr-2" />
              Preview & Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-primary/10 border-primary/20 text-primary">Theory</Badge>
          <Badge className="bg-success/10 border-success/20 text-success">Lab</Badge>
          <Badge className="bg-accent/10 border-accent/20 text-accent-foreground">Project</Badge>
          <Badge className="bg-warning/10 border-warning/20 text-warning-foreground">Seminar</Badge>
          <Badge className="bg-muted border-muted-foreground/20 text-muted-foreground">Break</Badge>
          <Badge className="bg-secondary border-secondary-foreground/20 text-secondary-foreground">Free</Badge>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
          <table className="w-full font-times">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-bold bg-muted/50">Time</th>
                {days.map((day) => (
                  <th key={day} className="text-center p-3 font-bold min-w-48 bg-muted/30">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, slotIndex) => (
                <tr key={slot} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium bg-muted/50">{slot}</td>
                  {days.map((day) => {
                    const classInfo = generatedTimetable[day]?.[slot];
                    return (
                      <td key={`${day}-${slot}`} className="p-2">
                        {classInfo ? (
                          <div className={`p-3 rounded-lg border-2 ${getSubjectColor(classInfo.type)} transition-all hover:shadow-md`}>
                            <div className="font-semibold text-sm mb-1">
                              {classInfo.subject}
                            </div>
                            {classInfo.faculty && (
                              <div className="text-xs opacity-80 flex items-center gap-1 mb-1">
                                <Users className="h-3 w-3" />
                                {classInfo.faculty}
                              </div>
                            )}
                            {classInfo.room && (
                              <div className="text-xs opacity-80 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
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

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-sm text-muted-foreground">Total Classes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">8</div>
            <div className="text-sm text-muted-foreground">Lab Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-sm text-muted-foreground">Seminars</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">95%</div>
            <div className="text-sm text-muted-foreground">Efficiency</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneratedTimetableGrid;
