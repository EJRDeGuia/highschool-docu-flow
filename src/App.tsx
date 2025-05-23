
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyRequests from "./pages/MyRequests";
import NewRequest from "./pages/NewRequest";
import ManageRequests from "./pages/ManageRequests";
import ReceiptUploadPage from "./pages/ReceiptUploadPage";
import Search from "./pages/Search";
import Users from "./pages/Users";
import Backup from "./pages/Backup";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// Route protection component for admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/my-requests" element={<MyRequests />} />
      <Route path="/dashboard/new-request" element={<NewRequest />} />
      <Route path="/dashboard/manage-requests" element={<ManageRequests />} />
      <Route path="/dashboard/upload-receipt" element={<ReceiptUploadPage />} />
      <Route path="/dashboard/search" element={<Search />} />
      <Route path="/dashboard/users" element={
        <AdminRoute>
          <Users />
        </AdminRoute>
      } />
      <Route path="/dashboard/backup" element={
        <AdminRoute>
          <Backup />
        </AdminRoute>
      } />
      <Route path="/dashboard/settings" element={
        <AdminRoute>
          <Settings />
        </AdminRoute>
      } />
      <Route path="/dashboard/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </NotificationsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
