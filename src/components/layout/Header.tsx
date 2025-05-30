
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Menu, ChevronDown, Sparkles } from "lucide-react";
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
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-2xl border-b border-gray-200/50 shadow-lg shadow-gray-200/20">
      <div className="flex items-center justify-between gap-8 px-8 py-5">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-2xl h-12 w-12 border border-gray-200/70 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
            </div>
            <p className="text-base text-gray-600 font-medium pl-9">
              Here's what's happening with your documents today
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <NotificationPopover />
          
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-4 px-4 py-3 h-auto hover:bg-gray-100/80 rounded-2xl border border-gray-200/70 shadow-sm transition-all duration-300 hover:shadow-md bg-white/90 backdrop-blur-xl"
              >
                <Avatar className="h-10 w-10 border-3 border-white shadow-xl ring-2 ring-gray-200/60">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-base">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="font-bold text-base text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-500 capitalize font-semibold">{user?.role}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white/95 backdrop-blur-2xl border border-gray-200/70 shadow-2xl rounded-2xl p-3 mt-2">
              <DropdownMenuLabel className="px-4 py-3">
                <div className="space-y-2">
                  <p className="font-bold text-lg text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600 font-medium">{user?.email}</p>
                  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-sm font-semibold capitalize border border-blue-200/50">
                    {user?.role}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200/60 my-3" />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-blue-50/80 rounded-xl font-semibold px-4 py-3 transition-all duration-200 text-base" 
                onClick={() => navigate("/dashboard/profile")}
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-blue-50/80 rounded-xl font-semibold px-4 py-3 transition-all duration-200 text-base" 
                onClick={() => navigate("/dashboard/settings")}
              >
                System Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200/60 my-3" />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 hover:bg-red-50/80 hover:text-red-700 rounded-xl font-semibold px-4 py-3 transition-all duration-200 text-base" 
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
