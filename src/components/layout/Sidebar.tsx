
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
        "bg-white/90 backdrop-blur-2xl border-r border-gray-200/70 shadow-xl",
        isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72 md:w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/70">
        <div className={cn("flex items-center space-x-4", !isOpen && "md:justify-center")}>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          {(isOpen || window.innerWidth < 768) && (
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                PINHS
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Document Management</p>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm font-medium transition-all duration-200 h-12 rounded-xl group relative",
                  isActive 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-l-blue-500 shadow-sm font-semibold" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
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
                  "h-5 w-5 transition-colors", 
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700",
                  isOpen ? "mr-4" : "md:mr-0"
                )} />
                {(isOpen || window.innerWidth < 768) && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    )}
                  </div>
                )}
                {(isOpen || window.innerWidth < 768) && isActive && (
                  <ChevronRight className="h-4 w-4 text-blue-500" />
                )}
              </Button>
            );
          })}
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-200/70 mt-auto">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100/80 p-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-gray-50/80 to-blue-50/30 border border-gray-200/50"
          onClick={handleProfileClick}
        >
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
          {(isOpen || window.innerWidth < 768) && (
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="font-semibold text-sm truncate text-gray-800 mb-0.5">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize font-medium bg-gray-200/60 px-2 py-1 rounded-md inline-block">
                {user?.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
