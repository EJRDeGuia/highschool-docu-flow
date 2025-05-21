
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/my-requests" element={<MyRequests />} />
              <Route path="/dashboard/new-request" element={<NewRequest />} />
              <Route path="/dashboard/manage-requests" element={<ManageRequests />} />
              <Route path="/dashboard/receipt-upload" element={<ReceiptUploadPage />} />
              <Route path="/dashboard/search" element={<Search />} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/backup" element={<Backup />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
