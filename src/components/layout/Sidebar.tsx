
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
  ChevronRight,
  Sparkles
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
        "fixed top-0 left-0 z-40 h-full transition-all duration-500 md:relative md:translate-x-0",
        "bg-white/95 backdrop-blur-3xl border-r border-gray-200/50 shadow-2xl shadow-gray-200/30",
        isOpen ? "translate-x-0 w-80" : "-translate-x-full w-80 md:w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-8 border-b border-gray-200/50">
        <div className={cn("flex items-center space-x-5", !isOpen && "md:justify-center")}>
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl shadow-xl ring-2 ring-blue-200/50">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-lg">
              <Sparkles className="h-2 w-2 text-white m-1" />
            </div>
          </div>
          {(isOpen || window.innerWidth < 768) && (
            <div>
              <h1 className="font-black text-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PINHS
              </h1>
              <p className="text-sm text-gray-500 font-semibold mt-1 tracking-wide">Document Management</p>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl h-10 w-10 transition-all duration-200"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-6 py-8">
        <div className="space-y-3">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-base font-semibold transition-all duration-300 h-14 rounded-2xl group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 text-blue-700 border-l-4 border-l-blue-500 shadow-lg shadow-blue-100/50 font-bold" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-md",
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
                  "h-6 w-6 transition-all duration-300", 
                  isActive ? "text-blue-600 scale-110" : "text-gray-500 group-hover:text-gray-700 group-hover:scale-105",
                  isOpen ? "mr-5" : "md:mr-0"
                )} />
                {(isOpen || window.innerWidth < 768) && (
                  <div className="flex-1 text-left">
                    <div className="font-bold">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500 mt-1 font-medium">{item.description}</div>
                    )}
                  </div>
                )}
                {(isOpen || window.innerWidth < 768) && isActive && (
                  <ChevronRight className="h-5 w-5 text-blue-500" />
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
                )}
              </Button>
            );
          })}
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="p-6 border-t border-gray-200/50 mt-auto">
        <div 
          className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100/80 p-5 rounded-2xl transition-all duration-300 bg-gradient-to-r from-gray-50/80 to-blue-50/40 border border-gray-200/60 shadow-lg hover:shadow-xl group"
          onClick={handleProfileClick}
        >
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-xl ring-2 ring-white group-hover:scale-105 transition-transform duration-300">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
          {(isOpen || window.innerWidth < 768) && (
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="font-bold text-base truncate text-gray-800 mb-1">{user?.name}</p>
              <div className="inline-flex items-center text-sm text-gray-500 truncate capitalize font-semibold bg-gray-200/70 px-3 py-1 rounded-xl">
                {user?.role}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
