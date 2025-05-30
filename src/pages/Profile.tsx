
import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "../components/shared/PageHeader";
import { UserCog, Save, UserCheck, AlertCircle } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    password: "",
    confirmPassword: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Check if user is admin - only admins can edit profiles
  const canEdit = user?.role === 'admin';
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically call an API to update the user profile
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    
    setIsEditing(false);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <PageHeader 
          title="My Profile" 
          description="View and manage your account information"
        />
        
        <div className="mt-8 grid gap-8">
          {/* Profile Card */}
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-school-primary to-school-secondary text-white">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-white/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-white text-school-primary text-xl">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-white/80">Welcome back</p>
                  <CardTitle className="text-2xl mt-1">{user?.name}</CardTitle>
                  <p className="text-sm mt-1 text-white/80 capitalize">{user?.role}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Account Information</h3>
                  {canEdit && (
                    <Button 
                      type="button"
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>Cancel</>
                      ) : (
                        <>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                  
                  {user?.role === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={user.studentId || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  )}
                  
                  {isEditing && canEdit && (
                    <>
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-4">Change Password</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Leave blank to keep current"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {!canEdit && (
                    <div className="bg-amber-50 text-amber-700 rounded-lg p-4 flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        Only administrators can edit profile information. Please contact an administrator if you need to update your information.
                      </p>
                    </div>
                  )}
                  
                  {!isEditing && canEdit && (
                    <div className="bg-blue-50 text-blue-700 rounded-lg p-4 flex items-start">
                      <UserCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        You can update profile information by clicking the "Edit Profile" button above.
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
