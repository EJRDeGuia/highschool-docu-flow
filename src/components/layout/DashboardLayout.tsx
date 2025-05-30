
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Loader } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center bg-white/95 backdrop-blur-3xl p-20 max-w-lg mx-auto rounded-3xl shadow-2xl border border-white/60 ring-1 ring-gray-200/50">
          <div className="relative">
            <Loader className="h-16 w-16 animate-spin text-blue-600 mb-8" />
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-blue-100 animate-ping opacity-20"></div>
          </div>
          <h2 className="text-gray-800 font-bold text-2xl mb-3 tracking-tight">Loading Dashboard</h2>
          <p className="text-gray-600 text-center text-base leading-relaxed mb-6">Preparing your workspace...</p>
          <div className="w-48 h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/40 to-indigo-50/60">
      {/* Sidebar */}
      <div className={`fixed md:static z-40 h-full transition-all duration-500 ease-in-out ${
        isSidebarOpen ? 'w-80' : 'w-0 md:w-20'
      }`}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-all duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-white/30">
          <div className="max-w-7xl mx-auto px-8 py-10 lg:px-12">
            <div className="space-y-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
