
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
        <div className="flex flex-col items-center bg-white/90 backdrop-blur-2xl p-16 max-w-md mx-auto rounded-3xl shadow-2xl border border-white/60">
          <Loader className="h-14 w-14 animate-spin text-blue-600 mb-8" />
          <h2 className="text-gray-800 font-semibold text-xl mb-2">Loading Dashboard</h2>
          <p className="text-gray-600 text-center text-sm leading-relaxed">Preparing your workspace...</p>
          <div className="mt-6 w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50/80 via-blue-50/50 to-indigo-50/30">
      {/* Sidebar */}
      <div className={`fixed md:static z-40 h-full transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-80' : 'w-0 md:w-20'
      }`}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white/30 to-blue-50/20">
          <div className="max-w-8xl mx-auto px-8 py-12 lg:px-12">
            <div className="space-y-12">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
