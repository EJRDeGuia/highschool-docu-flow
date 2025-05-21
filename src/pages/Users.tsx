
import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  Trash,
  Edit,
  User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { UserRole } from "@/contexts/AuthContext";

// Sample users for demonstration
const sampleUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'student@school.edu',
    role: 'student' as UserRole,
    studentId: '2023-1234',
    avatar: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'registrar@school.edu',
    role: 'registrar' as UserRole,
    avatar: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@school.edu',
    role: 'admin' as UserRole,
    avatar: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'student2@school.edu',
    role: 'student' as UserRole,
    studentId: '2023-5678',
    avatar: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'Mike Wilson',
    email: 'registrar2@school.edu',
    role: 'registrar' as UserRole,
    avatar: '/placeholder.svg',
  },
];

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(sampleUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof sampleUsers[0] | null>(null);
  
  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("student");
  const [newUserStudentId, setNewUserStudentId] = useState("");
  
  // Edit user form state
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState<UserRole>("student");
  const [editUserStudentId, setEditUserStudentId] = useState("");

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    // Apply role filter
    if (roleFilter !== "all" && user.role !== roleFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.studentId && user.studentId.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleAddUser = () => {
    // Validate form
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newUserRole === "student" && !newUserStudentId.trim()) {
      toast({
        title: "Error",
        description: "Student ID is required for student users",
        variant: "destructive",
      });
      return;
    }
    
    // Create new user
    const newUser = {
      id: Math.random().toString(36).substring(2, 15),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      studentId: newUserRole === "student" ? newUserStudentId : undefined,
      avatar: '/placeholder.svg',
    };
    
    // Add to users list
    setUsers([...users, newUser]);
    
    // Reset form
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("student");
    setNewUserStudentId("");
    
    // Close dialog
    setIsAddUserDialogOpen(false);
    
    // Show success toast
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    // Validate form
    if (!editUserName.trim() || !editUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (editUserRole === "student" && !editUserStudentId.trim()) {
      toast({
        title: "Error",
        description: "Student ID is required for student users",
        variant: "destructive",
      });
      return;
    }
    
    // Update user
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: editUserName,
          email: editUserEmail,
          role: editUserRole,
          studentId: editUserRole === "student" ? editUserStudentId : undefined,
        };
      }
      return user;
    });
    
    // Update users list
    setUsers(updatedUsers);
    
    // Close dialog
    setIsEditUserDialogOpen(false);
    
    // Show success toast
    toast({
      title: "User Updated",
      description: `${editUserName} has been updated successfully.`,
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // Delete user
    setUsers(users.filter(user => user.id !== selectedUser.id));
    
    // Close dialog
    setIsDeleteDialogOpen(false);
    
    // Show success toast
    toast({
      title: "User Deleted",
      description: `${selectedUser.name} has been deleted successfully.`,
    });
  };

  const openEditDialog = (user: typeof sampleUsers[0]) => {
    setSelectedUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setEditUserStudentId(user.studentId || "");
    setIsEditUserDialogOpen(true);
  };

  const openDeleteDialog = (user: typeof sampleUsers[0]) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">
            Manage user accounts in the system
          </p>
        </div>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="registrar">Registrars</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.studentId && (
                        <p className="text-sm text-gray-500">
                          Student ID: {user.studentId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className={`
                        ${user.role === "student" ? "bg-blue-100 text-blue-700" : ""}
                        ${user.role === "registrar" ? "bg-purple-100 text-purple-700" : ""}
                        ${user.role === "admin" ? "bg-amber-100 text-amber-700" : ""}
                      `}
                    >
                      {user.role === "student" ? "Student" : ""}
                      {user.role === "registrar" ? "Registrar" : ""}
                      {user.role === "admin" ? "Admin" : ""}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteDialog(user)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-gray-500">
            {searchQuery || roleFilter !== "all"
              ? "Try adjusting your search or filters"
              : "There are no users in the system yet"}
          </p>
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="User's full name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@school.edu"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUserRole}
                onValueChange={(value) => setNewUserRole(value as UserRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="registrar">Registrar</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newUserRole === "student" && (
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="e.g., 2023-1234"
                  value={newUserStudentId}
                  onChange={(e) => setNewUserStudentId(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="User's full name"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="user@school.edu"
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={editUserRole}
                onValueChange={(value) => setEditUserRole(value as UserRole)}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="registrar">Registrar</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editUserRole === "student" && (
              <div className="space-y-2">
                <Label htmlFor="edit-studentId">Student ID</Label>
                <Input
                  id="edit-studentId"
                  placeholder="e.g., 2023-1234"
                  value={editUserStudentId}
                  onChange={(e) => setEditUserStudentId(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedUser && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  {selectedUser.studentId && (
                    <p className="text-sm text-gray-500">
                      Student ID: {selectedUser.studentId}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Users;
