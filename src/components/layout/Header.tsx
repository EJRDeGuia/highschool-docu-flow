
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { NotificationPopover } from "../notifications/NotificationPopover";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="dashboard-glass sticky top-0 z-30 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-700 hover:bg-white/50 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:block">
          <h2 className="font-semibold text-gray-800">Welcome back, {user?.name?.split(' ')[0]}!</h2>
          <p className="text-sm text-gray-600">Here's what's happening with your documents today.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationPopover />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-3 p-1 px-3 hover:bg-white/50 rounded-lg">
              <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">
                  {user ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <span className="font-semibold text-sm text-gray-800">{user?.name}</span>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border border-white/20">
            <DropdownMenuLabel>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-white/50" onClick={() => navigate("/dashboard/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/50" onClick={() => navigate("/dashboard/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
