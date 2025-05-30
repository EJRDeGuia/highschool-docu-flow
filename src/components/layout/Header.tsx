
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Menu, ChevronDown } from "lucide-react";
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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between gap-8 px-8 py-6">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl h-12 w-12 border border-gray-200/70 shadow-sm transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-base text-gray-600 font-medium">
              Here's what's happening with your documents today
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <NotificationPopover />
          
          <div className="h-10 w-px bg-gray-200/70"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-4 px-4 py-3 h-auto hover:bg-gray-100 rounded-xl border border-gray-200/70 shadow-sm transition-all duration-200 bg-white/90"
              >
                <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-gray-100/60">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="font-semibold text-base text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-500 capitalize font-medium">{user?.role}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-xl rounded-xl p-3">
              <DropdownMenuLabel className="px-4 py-3">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-base">{user?.name}</p>
                  <p className="text-sm text-gray-600 font-medium">{user?.email}</p>
                  <p className="text-sm text-gray-500 capitalize px-3 py-1.5 bg-gray-100 rounded-lg inline-block">{user?.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-100 my-3" />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-blue-50 rounded-lg font-medium px-4 py-3 transition-colors text-base" 
                onClick={() => navigate("/dashboard/profile")}
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-blue-50 rounded-lg font-medium px-4 py-3 transition-colors text-base" 
                onClick={() => navigate("/dashboard/settings")}
              >
                System Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 my-3" />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium px-4 py-3 transition-colors text-base" 
                onClick={handleLogout}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
