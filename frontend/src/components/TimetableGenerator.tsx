import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Users,
  MapPin,
  BookOpen,
  Play,
  Download,
  RefreshCw,
  Calendar,
  Sparkles,
  Plus,
  X
} from "lucide-react";
import { useState } from "react";
import TimetableLoadingScreen from "./TimetableLoadingScreen";
import GeneratedTimetableGrid from "./GeneratedTimetableGrid";

const TimetableGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [showTimetable, setShowTimetable] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [selectedSection, setSelectedSection] = useState("a");
  const [institutionType, setInstitutionType] = useState<"school" | "college">("college");
  const [selectedStandard, setSelectedStandard] = useState("1");
  const [periodTimings, setPeriodTimings] = useState([
    { period: 1, startTime: "09:00", endTime: "10:00" },
    { period: 2, startTime: "10:00", endTime: "11:00" },
    { period: 3, startTime: "11:30", endTime: "12:30" },
    { period: 4, startTime: "12:30", endTime: "13:30" },
    { period: 5, startTime: "14:30", endTime: "15:30" },
    { period: 6, startTime: "15:30", endTime: "16:30" }
  ]);

  const generationSteps = [
    { step: 1, label: "Analyzing constraints", icon: Settings },
    { step: 2, label: "Optimizing faculty allocation", icon: Users },
    { step: 3, label: "Resolving room conflicts", icon: MapPin },
    { step: 4, label: "Balancing workload", icon: Clock },
    { step: 5, label: "Finalizing timetable", icon: CheckCircle },
  ];

  const constraints = [
    { name: "Faculty Availability", status: "configured", count: 48 },
    { name: "Room Capacity", status: "configured", count: 24 },
    { name: "Subject Requirements", status: "configured", count: 156 },
    { name: "Student Batches", status: "configured", count: 12 },
    { name: "Time Slots", status: "configured", count: 6 },
  ];

  const optimizationSettings = {
    maxClassesPerDay: 6,
    maxConsecutiveClasses: 3,
    lunchBreak: "12:30-1:30",
    workloadDistribution: "balanced"
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(0);
    setShowTimetable(false);
    
    // Simulate backend processing with realistic delays
    const stepDelays = [3000, 2500, 2000, 1500, 1000]; // Decreasing delays for backend processing
    
    let currentStepIndex = 0;
    const processStep = () => {
      if (currentStepIndex < stepDelays.length) {
        setGenerationStep(currentStepIndex + 1);
        currentStepIndex++;
        setTimeout(processStep, stepDelays[currentStepIndex - 1]);
      } else {
        setIsGenerating(false);
        setShowTimetable(true);
      }
    };
    
    setTimeout(processStep, stepDelays[0]);
  };

  const handleLoadingComplete = () => {
    setShowTimetable(true);
  };

  const handleReset = () => {
    setShowResetAlert(true);
  };

  const confirmReset = () => {
    setGenerationStep(0);
    setShowTimetable(false);
    setShowResetAlert(false);
  };

  return (
    <>
      {/* Loading Screen */}
      {isGenerating && (
        <TimetableLoadingScreen 
          currentStep={generationStep} 
          onComplete={handleLoadingComplete}
        />
      )}

      <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Timetable Generator</h1>
          <p className="text-muted-foreground">AI-powered automated scheduling with optimization</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isGenerating} 
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Parameters
          </Button>
          <Button 
            size="sm" 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-primary w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generate Timetable
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="institutionType" className="text-sm font-medium">Institution Type</Label>
                <Select value={institutionType} onValueChange={(value: "school" | "college") => setInstitutionType(value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Institution Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {institutionType === "college" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                    <Select>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="ece">Electronics & Communication</SelectItem>
                        <SelectItem value="mech">Mechanical Engineering</SelectItem>
                        <SelectItem value="civil">Civil Engineering</SelectItem>
                        <SelectItem value="electrical">Electrical Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-sm font-medium">Semester</Label>
                    <Select>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem1">Semester 1</SelectItem>
                        <SelectItem value="sem2">Semester 2</SelectItem>
                        <SelectItem value="sem3">Semester 3</SelectItem>
                        <SelectItem value="sem4">Semester 4</SelectItem>
                        <SelectItem value="sem5">Semester 5</SelectItem>
                        <SelectItem value="sem6">Semester 6</SelectItem>
                        <SelectItem value="sem7">Semester 7</SelectItem>
                        <SelectItem value="sem8">Semester 8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="standard" className="text-sm font-medium">Standard/Class</Label>
                  <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select Standard" />
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
              )}

              <div className="space-y-2">
                <Label htmlFor="section" className="text-sm font-medium">Section</Label>
                <div className="max-h-32 overflow-y-auto scroll-thin-blue border rounded-md">
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="border-0 h-9">
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Section A</SelectItem>
                      <SelectItem value="b">Section B</SelectItem>
                      <SelectItem value="c">Section C</SelectItem>
                      <SelectItem value="d">Section D</SelectItem>
                      <SelectItem value="e">Section E</SelectItem>
                      <SelectItem value="f">Section F</SelectItem>
                      <SelectItem value="g">Section G</SelectItem>
                      <SelectItem value="h">Section H</SelectItem>
                      <SelectItem value="i">Section I</SelectItem>
                      <SelectItem value="j">Section J</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="maxClasses" className="text-sm font-medium">Max Classes/Day</Label>
                  <Input 
                    type="number" 
                    value={optimizationSettings.maxClassesPerDay}
                    min={1}
                    max={8}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consecutive" className="text-sm font-medium">Max Consecutive</Label>
                  <Input 
                    type="number" 
                    value={optimizationSettings.maxConsecutiveClasses}
                    min={1}
                    max={4}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="optimization" className="text-sm font-medium">Optimization Strategy</Label>
                <Select>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced Workload</SelectItem>
                    <SelectItem value="faculty">Faculty Preference</SelectItem>
                    <SelectItem value="room">Room Utilization</SelectItem>
                    <SelectItem value="student">Student Convenience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Period Timings Configuration */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Period Timings Configuration
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Set the start and end times for each period
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {periodTimings.map((timing, index) => (
                <div key={timing.period} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{timing.period}</span>
                    </div>
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor={`start-${timing.period}`} className="text-xs font-medium">Start Time</Label>
                    <Input
                      id={`start-${timing.period}`}
                      type="time"
                      value={timing.startTime}
                      onChange={(e) => {
                        const newTimings = [...periodTimings];
                        newTimings[index].startTime = e.target.value;
                        setPeriodTimings(newTimings);
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor={`end-${timing.period}`} className="text-xs font-medium">End Time</Label>
                    <Input
                      id={`end-${timing.period}`}
                      type="time"
                      value={timing.endTime}
                      onChange={(e) => {
                        const newTimings = [...periodTimings];
                        newTimings[index].endTime = e.target.value;
                        setPeriodTimings(newTimings);
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Duration</div>
                      <div className="text-sm font-medium text-primary">
                        {timing.startTime} - {timing.endTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newPeriod = periodTimings.length + 1;
                    setPeriodTimings([...periodTimings, { 
                      period: newPeriod, 
                      startTime: "09:00", 
                      endTime: "10:00" 
                    }]);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Period
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (periodTimings.length > 1) {
                      setPeriodTimings(periodTimings.slice(0, -1));
                    }
                  }}
                  disabled={periodTimings.length <= 1}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Period
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status and Progress */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Generation Status
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Real-time progress monitoring
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* System Overview */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Status
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {constraints.map((constraint, index) => (
                  <div key={index} className="p-2 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border border-muted/50 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium truncate">{constraint.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {constraint.count} items
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generation Progress */}
            {isGenerating && (
              <div>
                <h4 className="font-semibold mb-3 text-sm">Generation Progress</h4>
                <div className="space-y-2">
                  {generationSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = generationStep > index;
                    const isCurrent = generationStep === index;
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 p-2 rounded-md transition-all ${
                          isCompleted ? 'bg-success/10 border-success/20' :
                          isCurrent ? 'bg-primary/10 border-primary/20' :
                          'bg-muted/30'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-success/20' :
                          isCurrent ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-3 w-3 text-success" />
                          ) : isCurrent ? (
                            <RefreshCw className="h-3 w-3 text-primary animate-spin" />
                          ) : (
                            <Icon className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <span className={`text-xs font-medium ${
                          isCompleted ? 'text-success' :
                          isCurrent ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results Preview */}
            {generationStep === 5 && (
              <div>
                <h4 className="font-semibold mb-3 text-success">Generation Complete!</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-success/20 bg-success/5">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="font-semibold">100% Success</p>
                      <p className="text-xs text-muted-foreground">No conflicts detected</p>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 text-center">
                      <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="font-semibold">Optimized</p>
                      <p className="text-xs text-muted-foreground">95% efficiency score</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Timetable
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Preview & Edit
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generated Timetable Display */}
      {showTimetable && (
        <div className="mt-6">
          <GeneratedTimetableGrid 
            section={selectedSection}
            onDownload={() => console.log("Download timetable")}
            onViewDetails={() => console.log("View timetable details")}
          />
        </div>
      )}

      {/* Reset Confirmation Alert */}
      {showResetAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Reset Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to reset all parameters? This will clear your current settings and any generated timetables.
              </p>
              <div className="flex gap-2">
                <Button onClick={confirmReset} className="flex-1">
                  Yes, Reset
                </Button>
                <Button variant="outline" onClick={() => setShowResetAlert(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </>
  );
};

export default TimetableGenerator;