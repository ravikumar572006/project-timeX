import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, GraduationCap, Settings, ChevronRight, CheckCircle, Star, ArrowRight, Shield, Zap, Clock, Award, TrendingUp, Globe, Smartphone, BarChart3, Sparkles, BookOpen, FileText, Database, Lock, RefreshCw, Download, Upload, Eye, Edit, Trash2, Plus, Search, Filter, MoreHorizontal, Linkedin } from "lucide-react";
import LoginModal from "./LoginModal";

interface HomePageProps {
  onViewChange: (view: string) => void;
}

const HomePage = ({ onViewChange }: HomePageProps) => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered timetable generation with automatic conflict detection and optimization",
      color: "bg-blue-50 text-blue-600",
      iconColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "Faculty Management",
      description: "Comprehensive faculty profiles with availability tracking and workload distribution",
      color: "bg-green-50 text-green-600",
      iconColor: "text-green-600"
    },
    {
      icon: GraduationCap,
      title: "Student Portal",
      description: "Personalized dashboards with real-time timetable access and notifications",
      color: "bg-purple-50 text-purple-600",
      iconColor: "text-purple-600"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Real-time insights, performance metrics, and comprehensive reporting tools",
      color: "bg-orange-50 text-orange-600",
      iconColor: "text-orange-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Institutions", icon: Globe },
    { number: "50K+", label: "Students", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "24/7", label: "Support", icon: Clock }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Academic Director",
      institution: "University of Technology",
      content: "Timex has revolutionized our scheduling process. What used to take weeks now takes minutes!",
      rating: 5
    },
    {
      name: "Prof. Michael Chen",
      role: "Head of Computer Science",
      institution: "Metropolitan University",
      content: "The AI-powered optimization has eliminated 95% of scheduling conflicts. Incredible system!",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Student Affairs Manager",
      institution: "State University",
      content: "Students love the mobile-friendly interface. It's made timetable management so much easier.",
      rating: 5
    }
  ];

  const benefits = [
    "NEP 2020 Compliant Scheduling",
    "Multi-Department Support", 
    "Real-time Conflict Resolution",
    "Mobile-Responsive Design",
    "Export to PDF & Excel",
    "Role-based Access Control"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-700 border-blue-200">
                  <Award className="w-3 h-3 mr-1" />
                  Trusted by Jharkhand Government
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Smart Academic
                  <span className="text-blue-600 dark:text-blue-400"> Scheduling</span>
                </h1>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Streamline your institution's timetable management with AI-powered scheduling, 
                  real-time conflict resolution, and comprehensive analytics.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <LoginModal>
                  <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </LoginModal>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onViewChange('timetable')}
                  className="text-lg px-8 py-6 border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure & Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>Mobile Ready</span>
                </div>
              </div>
            </div>
            
            {/* Right Content removed as per requirement */}
          </div>
        </div>
      </section>

      {/* Quick Access moved up - Get Started Today */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Get Started Today</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Choose your role and access the appropriate portal to begin managing schedules.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { 
                view: 'admin', 
                icon: Settings, 
                label: 'Admin Dashboard', 
                description: 'Complete system management and analytics',
                color: 'bg-red-50 text-red-600',
                iconColor: 'text-red-600'
              },
              { 
                view: 'faculty', 
                icon: Users, 
                label: 'Faculty Portal', 
                description: 'Manage schedules and availability',
                color: 'bg-blue-50 text-blue-600',
                iconColor: 'text-blue-600'
              },
              { 
                view: 'student', 
                icon: GraduationCap, 
                label: 'Student Access', 
                description: 'View timetables and course schedules',
                color: 'bg-green-50 text-green-600',
                iconColor: 'text-green-600'
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.view}
                  className="group p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-200 dark:border-slate-700"
                  onClick={() => onViewChange(item.view)}
                >
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-10 w-10 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {item.label}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {item.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 group-hover:border-blue-500 transition-all duration-300"
                  >
                    Access Portal
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
              <Award className="w-3 h-3 mr-1" />
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything You Need for Perfect Scheduling
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our comprehensive suite of tools ensures seamless timetable management with 
              intelligent automation and real-time collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group p-8 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Section (Jharkhand CM and Education Minister) */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-white dark:bg-slate-700">
              <Star className="w-3 h-3 mr-1" />
              Leadership Endorsements
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Jharkhand Government Leadership
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Insights from the Hon'ble Chief Minister and the Education Minister of Jharkhand.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <img src="https://theleaderspage.com/wp-content/uploads/2020/07/Soren_new_571_855.jpg" alt="Chief Minister of Jharkhand" className="w-full h-64 object-cover rounded-lg mb-6 bg-slate-100 dark:bg-slate-700" />
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Hon'ble Chief Minister of Jharkhand</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Driving digital transformation for education across the state, prioritizing efficiency,
                transparency, and student success with modern scheduling systems.
              </p>
            </Card>
            <Card className="p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <img src="/placeholder.svg" alt="Education Minister, Government of Jharkhand" className="w-full h-64 object-cover rounded-lg mb-6 bg-slate-100 dark:bg-slate-700" />
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Hon'ble Education Minister, Govt. of Jharkhand</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Championing technology-first initiatives in education to improve outcomes and streamline
                administrative processes for institutions statewide.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Why Choose Timex?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Experience the difference with our comprehensive scheduling solution designed for modern education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300" 
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Creators Section (replacing bottom CTA) */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
              <Award className="w-3 h-3 mr-1" />
              Built by
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Creators</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Meet the minds behind this project. Connect with us on LinkedIn.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Creator One', description: 'Leads product and platform engineering.', link: '#' },
              { name: 'Creator Two', description: 'Designs delightful, accessible experiences.', link: '#' },
              { name: 'Creator Three', description: 'Research and partnerships outreach.', link: '#' },
              { name: 'Creator Four', description: 'Frontend specialist and UI systems.', link: '#' },
              { name: 'Creator Five', description: 'Backend, APIs, and data pipelines.', link: '#' },
              { name: 'Creator Six', description: 'QA, reliability, and docs.', link: '#' }
            ].map((creator) => (
              <Card key={creator.name} className="p-8 border border-slate-200 dark:border-slate-700 text-center hover:shadow-lg transition-all duration-300">
                <img src="/placeholder.svg" alt={creator.name} className="w-24 h-24 mx-auto rounded-full mb-6 bg-slate-100 dark:bg-slate-700 object-cover" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{creator.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{creator.description}</p>
                <a href={creator.link} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section moved to end */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-white">{stat.number}</div>
                  <div className="text-sm text-slate-300">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;