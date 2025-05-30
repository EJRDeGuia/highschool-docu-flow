
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  ClipboardList, 
  FileText, 
  Home,
  Menu,
  Search, 
  Settings, 
  User, 
  Users,
  Database,
  Receipt,
  X,
  Check,
  GraduationCap
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["student", "registrar", "admin"],
    },
    {
      name: "My Requests",
      href: "/dashboard/my-requests",
      icon: FileText,
      roles: ["student"],
    },
    {
      name: "New Request",
      href: "/dashboard/new-request",
      icon: ClipboardList,
      roles: ["student"],
    },
    {
      name: "Manage Requests",
      href: "/dashboard/manage-requests",
      icon: Check,
      roles: ["registrar", "admin"],
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Backup",
      href: "/dashboard/backup",
      icon: Database,
      roles: ["admin"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ];
  
  const filteredNavItems = user?.role 
    ? navItems.filter(item => item.roles.includes(user.role as UserRole))
    : [];
    
  const handleProfileClick = () => {
    navigate("/dashboard/profile");
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  
  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 z-40 h-full transition-all duration-300 md:relative md:translate-x-0 sidebar-glass",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <div className={cn("flex items-center space-x-3", !isOpen && "md:justify-center")}>
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {(isOpen || window.innerWidth < 768) && (
            <div>
              <h1 className="font-bold text-lg text-gradient">PINHS</h1>
              <p className="text-xs text-gray-600">Document System</p>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(false)}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="px-4 py-6 space-y-2">
        {filteredNavItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "w-full justify-start text-sm font-medium transition-all duration-200 h-12",
              pathname === item.href 
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl" 
                : "text-gray-700 hover:bg-white/50",
              !isOpen && "md:justify-center md:px-0"
            )}
            onClick={() => {
              navigate(item.href);
              if (window.innerWidth < 768) {
                setIsOpen(false);
              }
            }}
          >
            <item.icon className={cn("h-5 w-5", isOpen ? "mr-3" : "md:mr-0")} />
            {(isOpen || window.innerWidth < 768) && (
              <span className="truncate">{item.name}</span>
            )}
          </Button>
        ))}
      </nav>
      
      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:bg-white/30 p-3 rounded-lg transition-all duration-200"
          onClick={handleProfileClick}
        >
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
          {(isOpen || window.innerWidth < 768) && (
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-600 truncate capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
