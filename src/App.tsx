
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, UserRole } from "@/contexts/AuthContext";
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

// Route protection component that requires specific roles
const RoleBasedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) => {
  const { user, hasPermission } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasPermission(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Protected route component for regular user authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes for all authenticated users */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* Student-specific routes */}
      <Route path="/dashboard/my-requests" element={
        <RoleBasedRoute allowedRoles={['student']}><MyRequests /></RoleBasedRoute>
      } />
      <Route path="/dashboard/new-request" element={
        <RoleBasedRoute allowedRoles={['student']}><NewRequest /></RoleBasedRoute>
      } />
      <Route path="/dashboard/upload-receipt" element={<ProtectedRoute><ReceiptUploadPage /></ProtectedRoute>} />
      
      {/* Registrar and admin routes */}
      <Route path="/dashboard/manage-requests" element={
        <RoleBasedRoute allowedRoles={['registrar', 'admin']}><ManageRequests /></RoleBasedRoute>
      } />
      
      {/* Admin-only routes */}
      <Route path="/dashboard/search" element={
        <RoleBasedRoute allowedRoles={['admin']}><Search /></RoleBasedRoute>
      } />
      <Route path="/dashboard/users" element={
        <RoleBasedRoute allowedRoles={['admin']}><Users /></RoleBasedRoute>
      } />
      <Route path="/dashboard/backup" element={
        <RoleBasedRoute allowedRoles={['admin']}><Backup /></RoleBasedRoute>
      } />
      <Route path="/dashboard/settings" element={
        <RoleBasedRoute allowedRoles={['admin']}><Settings /></RoleBasedRoute>
      } />
      
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
