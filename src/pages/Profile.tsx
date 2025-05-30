
import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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
      <div className="max-w-4xl mx-auto space-y-8">
        <PageHeader 
          title="My Profile" 
          description="View and manage your account information"
        />
        
        {/* Profile Card with enhanced visual hierarchy */}
        <Card className="card-glass border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white/20 shadow-lg">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                  {user ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-blue-100 mb-1">Welcome back</p>
                <CardTitle className="text-3xl font-bold text-white mb-2">{user?.name}</CardTitle>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                  <span className="capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
                {canEdit && (
                  <Button 
                    type="button"
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "btn-glass" : "btn-gradient"}
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
              
              <div className="grid gap-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={cn(
                        "input-glass h-12",
                        !isEditing && "bg-gray-50/80 text-gray-600"
                      )}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={cn(
                        "input-glass h-12",
                        !isEditing && "bg-gray-50/80 text-gray-600"
                      )}
                    />
                  </div>
                </div>
                
                {user?.role === "student" && (
                  <div className="space-y-3">
                    <Label htmlFor="studentId" className="text-sm font-medium text-gray-700">Student ID</Label>
                    <Input
                      id="studentId"
                      value={user.studentId || ""}
                      disabled
                      className="input-glass h-12 bg-gray-50/80 text-gray-600"
                    />
                  </div>
                )}
                
                {isEditing && canEdit && (
                  <>
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-semibold mb-6 text-gray-900">Change Password</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current"
                            className="input-glass h-12"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="input-glass h-12"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-6">
                      <Button type="submit" className="btn-gradient">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </>
                )}
                
                {!canEdit && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Only administrators can edit profile information. Please contact an administrator if you need to update your information.
                    </p>
                  </div>
                )}
                
                {!isEditing && canEdit && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 flex items-start">
                    <UserCheck className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
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
    </DashboardLayout>
  );
};

export default Profile;
