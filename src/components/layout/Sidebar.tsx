
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
  GraduationCap,
  ChevronRight
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
  description?: string;
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
      description: "Overview & Analytics"
    },
    {
      name: "My Requests",
      href: "/dashboard/my-requests",
      icon: FileText,
      roles: ["student"],
      description: "View your submissions"
    },
    {
      name: "New Request",
      href: "/dashboard/new-request",
      icon: ClipboardList,
      roles: ["student"],
      description: "Submit new document"
    },
    {
      name: "Manage Requests",
      href: "/dashboard/manage-requests",
      icon: Check,
      roles: ["registrar", "admin"],
      description: "Process submissions"
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
      roles: ["admin"],
      description: "User management"
    },
    {
      name: "Backup",
      href: "/dashboard/backup",
      icon: Database,
      roles: ["admin"],
      description: "System backup"
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin"],
      description: "System configuration"
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
        "fixed top-0 left-0 z-40 h-full transition-all duration-300 md:relative md:translate-x-0",
        "bg-white border-r border-gray-200 shadow-lg",
        isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72 md:w-16"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={cn("flex items-center space-x-3", !isOpen && "md:justify-center")}>
          <div className="p-2 bg-blue-600 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {(isOpen || window.innerWidth < 768) && (
            <div>
              <h1 className="font-bold text-lg text-gray-900">PINHS</h1>
              <p className="text-xs text-gray-500">Document System</p>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm font-medium transition-all duration-200 h-11 rounded-lg group relative",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-500 shadow-sm font-semibold" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  !isOpen && "md:justify-center md:px-0"
                )}
                onClick={() => {
                  navigate(item.href);
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors flex-shrink-0", 
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700",
                  isOpen ? "mr-3" : "md:mr-0"
                )} />
                {(isOpen || window.innerWidth < 768) && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    )}
                  </div>
                )}
                {(isOpen || window.innerWidth < 768) && isActive && (
                  <ChevronRight className="h-4 w-4 text-blue-500 flex-shrink-0" />
                )}
              </Button>
            );
          })}
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="p-3 border-t border-gray-200 mt-auto">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-3 rounded-lg transition-all duration-200 bg-gray-50"
          onClick={handleProfileClick}
        >
          <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
          {(isOpen || window.innerWidth < 768) && (
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="font-medium text-sm truncate text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
