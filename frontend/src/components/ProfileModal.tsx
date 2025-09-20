import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Building,
  Edit,
  Save,
  X,
  Camera
} from "lucide-react";
import { useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "faculty" | "student";
  avatar?: string;
  department?: string;
  designation?: string;
  class?: string;
  section?: string;
  rollNumber?: string;
  joinDate: string;
  address?: string;
  bio?: string;
  subjects?: string[];
}

interface ProfileModalProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

const ProfileModal = ({ user, onUpdate }: ProfileModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(user);

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'faculty': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={editedUser.avatar} />
              <AvatarFallback className="text-lg">
                {getInitials(editedUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{editedUser.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(editedUser.role)}`}>
                  {editedUser.role.charAt(0).toUpperCase() + editedUser.role.slice(1)}
                </span>
              </div>
              <p className="text-muted-foreground">{editedUser.email}</p>
              {editedUser.department && (
                <p className="text-sm text-muted-foreground">{editedUser.department}</p>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={editedUser.address || ""}
                    onChange={(e) => setEditedUser({...editedUser, address: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editedUser.bio || ""}
                    onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={editedUser.role}
                    onValueChange={(value: "admin" | "faculty" | "student") => 
                      setEditedUser({...editedUser, role: value})
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editedUser.role === "faculty" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={editedUser.department || ""}
                        onChange={(e) => setEditedUser({...editedUser, department: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={editedUser.designation || ""}
                        onChange={(e) => setEditedUser({...editedUser, designation: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subjects">Subjects</Label>
                      <Input
                        id="subjects"
                        value={editedUser.subjects?.join(", ") || ""}
                        onChange={(e) => setEditedUser({
                          ...editedUser, 
                          subjects: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                        })}
                        disabled={!isEditing}
                        placeholder="Enter subjects separated by commas"
                      />
                    </div>
                  </>
                )}

                {editedUser.role === "student" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Input
                        id="class"
                        value={editedUser.class || ""}
                        onChange={(e) => setEditedUser({...editedUser, class: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        value={editedUser.section || ""}
                        onChange={(e) => setEditedUser({...editedUser, section: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        value={editedUser.rollNumber || ""}
                        onChange={(e) => setEditedUser({...editedUser, rollNumber: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={editedUser.joinDate}
                    onChange={(e) => setEditedUser({...editedUser, joinDate: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Avatar Upload */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={editedUser.avatar} />
                    <AvatarFallback className="text-xl">
                      {getInitials(editedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="Enter image URL"
                      value={editedUser.avatar || ""}
                      onChange={(e) => setEditedUser({...editedUser, avatar: e.target.value})}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter a URL to your profile picture
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
