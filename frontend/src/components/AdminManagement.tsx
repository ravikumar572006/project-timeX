import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  School
} from "lucide-react";
import { useState } from "react";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  subjects: string[];
  joinDate: string;
  status: "active" | "inactive";
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  status: "active" | "inactive";
}

interface Class {
  id: string;
  name: string;
  level: string;
  sections: string[];
  subjects: string[];
  maxStudents: number;
  status: "active" | "inactive";
}

interface Section {
  id: string;
  name: string;
  classId: string;
  maxStudents: number;
  currentStudents: number;
  status: "active" | "inactive";
}

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  head: string;
  staffCount: number;
  status: "active" | "inactive";
}

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState("staff");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: "1",
      name: "Dr. John Smith",
      email: "john.smith@school.edu",
      phone: "+91 98765 43210",
      department: "Computer Science",
      designation: "Professor",
      subjects: ["Data Structures", "Algorithms"],
      joinDate: "2020-01-15",
      status: "active"
    },
    {
      id: "2",
      name: "Prof. Jane Doe",
      email: "jane.doe@school.edu",
      phone: "+91 98765 43211",
      department: "Mathematics",
      designation: "Associate Professor",
      subjects: ["Calculus", "Linear Algebra"],
      joinDate: "2019-08-20",
      status: "active"
    }
  ]);

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@student.edu",
      phone: "+91 98765 43212",
      class: "Class 10",
      section: "A",
      rollNumber: "2024001",
      admissionDate: "2024-04-01",
      status: "active"
    },
    {
      id: "2",
      name: "Bob Wilson",
      email: "bob.wilson@student.edu",
      phone: "+91 98765 43213",
      class: "Class 10",
      section: "B",
      rollNumber: "2024002",
      admissionDate: "2024-04-01",
      status: "active"
    }
  ]);

  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      name: "Class 10",
      level: "Secondary",
      sections: ["A", "B", "C"],
      subjects: ["Mathematics", "Science", "English", "Social Studies"],
      maxStudents: 40,
      status: "active"
    },
    {
      id: "2",
      name: "Class 12",
      level: "Higher Secondary",
      sections: ["A", "B"],
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
      maxStudents: 35,
      status: "active"
    }
  ]);

  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      name: "Section A",
      classId: "1",
      maxStudents: 40,
      currentStudents: 38,
      status: "active"
    },
    {
      id: "2",
      name: "Section B",
      classId: "1",
      maxStudents: 40,
      currentStudents: 35,
      status: "active"
    }
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Computer Science",
      code: "CS",
      description: "Computer Science and Engineering Department",
      head: "Dr. John Smith",
      staffCount: 15,
      status: "active"
    },
    {
      id: "2",
      name: "Mathematics",
      code: "MATH",
      description: "Mathematics Department",
      head: "Prof. Jane Doe",
      staffCount: 12,
      status: "active"
    }
  ]);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.includes(searchTerm)
  );

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSections = sections.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Institution Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Classes
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Departments
          </TabsTrigger>
        </TabsList>

        {/* Staff Management */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Management
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Staff Member</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="staffName">Full Name</Label>
                        <Input id="staffName" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffEmail">Email</Label>
                        <Input id="staffEmail" type="email" placeholder="Enter email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffPhone">Phone</Label>
                        <Input id="staffPhone" placeholder="Enter phone number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffDepartment">Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cs">Computer Science</SelectItem>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffDesignation">Designation</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professor">Professor</SelectItem>
                            <SelectItem value="associate">Associate Professor</SelectItem>
                            <SelectItem value="assistant">Assistant Professor</SelectItem>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffSubjects">Subjects</Label>
                        <Input id="staffSubjects" placeholder="Enter subjects (comma separated)" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Staff</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStaff.map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.designation}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {member.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>
                          {member.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          <strong>Department:</strong> {member.department}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          <strong>Subjects:</strong> {member.subjects.join(", ")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          <strong>Joined:</strong> {member.joinDate}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Management */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Student Management
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Full Name</Label>
                        <Input id="studentName" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentEmail">Email</Label>
                        <Input id="studentEmail" type="email" placeholder="Enter email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentPhone">Phone</Label>
                        <Input id="studentPhone" placeholder="Enter phone number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentClass">Class</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Class 1</SelectItem>
                            <SelectItem value="2">Class 2</SelectItem>
                            <SelectItem value="3">Class 3</SelectItem>
                            <SelectItem value="4">Class 4</SelectItem>
                            <SelectItem value="5">Class 5</SelectItem>
                            <SelectItem value="6">Class 6</SelectItem>
                            <SelectItem value="7">Class 7</SelectItem>
                            <SelectItem value="8">Class 8</SelectItem>
                            <SelectItem value="9">Class 9</SelectItem>
                            <SelectItem value="10">Class 10</SelectItem>
                            <SelectItem value="11">Class 11</SelectItem>
                            <SelectItem value="12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentSection">Section</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a">Section A</SelectItem>
                            <SelectItem value="b">Section B</SelectItem>
                            <SelectItem value="c">Section C</SelectItem>
                            <SelectItem value="d">Section D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentRoll">Roll Number</Label>
                        <Input id="studentRoll" placeholder="Enter roll number" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Student</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {student.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          <strong>Class:</strong> {student.class}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          <strong>Section:</strong> {student.section}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          <strong>Admitted:</strong> {student.admissionDate}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Class Management */}
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Class Management
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Class</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="className">Class Name</Label>
                        <Input id="className" placeholder="e.g., Class 10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classLevel">Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="higher">Higher Secondary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classSections">Sections</Label>
                        <Input id="classSections" placeholder="A, B, C" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classSubjects">Subjects</Label>
                        <Input id="classSubjects" placeholder="Mathematics, Science, English" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classMaxStudents">Max Students</Label>
                        <Input id="classMaxStudents" type="number" placeholder="40" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Class</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClasses.map((classItem) => (
                  <Card key={classItem.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{classItem.name}</h3>
                          <p className="text-sm text-muted-foreground">{classItem.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={classItem.status === "active" ? "default" : "secondary"}>
                          {classItem.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            <strong>Sections:</strong> {classItem.sections.join(", ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            <strong>Max Students:</strong> {classItem.maxStudents}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm text-muted-foreground">
                            <strong>Subjects:</strong> {classItem.subjects.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Management */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Section Management
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Section</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sectionName">Section Name</Label>
                        <Input id="sectionName" placeholder="e.g., Section A" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sectionClass">Class</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Class 1</SelectItem>
                            <SelectItem value="2">Class 2</SelectItem>
                            <SelectItem value="3">Class 3</SelectItem>
                            <SelectItem value="4">Class 4</SelectItem>
                            <SelectItem value="5">Class 5</SelectItem>
                            <SelectItem value="6">Class 6</SelectItem>
                            <SelectItem value="7">Class 7</SelectItem>
                            <SelectItem value="8">Class 8</SelectItem>
                            <SelectItem value="9">Class 9</SelectItem>
                            <SelectItem value="10">Class 10</SelectItem>
                            <SelectItem value="11">Class 11</SelectItem>
                            <SelectItem value="12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sectionMaxStudents">Max Students</Label>
                        <Input id="sectionMaxStudents" type="number" placeholder="40" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Section</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSections.map((section) => (
                  <Card key={section.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <School className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{section.name}</h3>
                          <p className="text-sm text-muted-foreground">Class {section.classId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={section.status === "active" ? "default" : "secondary"}>
                          {section.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          <strong>Current Students:</strong> {section.currentStudents}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          <strong>Max Students:</strong> {section.maxStudents}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          <strong>Available:</strong> {section.maxStudents - section.currentStudents}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Management */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Department Management
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Department</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deptName">Department Name</Label>
                        <Input id="deptName" placeholder="e.g., Computer Science" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deptCode">Department Code</Label>
                        <Input id="deptCode" placeholder="e.g., CS" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="deptDescription">Description</Label>
                        <Textarea id="deptDescription" placeholder="Enter department description" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deptHead">Department Head</Label>
                        <Input id="deptHead" placeholder="Enter department head name" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Department</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDepartments.map((dept) => (
                  <Card key={dept.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">Code: {dept.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={dept.status === "active" ? "default" : "secondary"}>
                          {dept.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <strong>Description:</strong> {dept.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            <strong>Head:</strong> {dept.head}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            <strong>Staff Count:</strong> {dept.staffCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement;
