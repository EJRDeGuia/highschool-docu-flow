import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/shared/PageHeader";
import StatusBadge from "../components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ClipboardList, FileCheck, FileClock, FileX, Loader, ArrowRight, Clock } from "lucide-react";
import { getRequestStatistics, getUserRequests } from "../services/requestService";
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    addNotification
  } = useNotifications();
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    processing: number;
    approved: number;
    completed: number;
    rejected: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRequestCount, setUserRequestCount] = useState(0);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics based on user role
        const statistics = await getRequestStatistics();
        setStats(statistics);

        // For students, get their request count
        if (user?.role === "student" && user?.id) {
          const userRequests = await getUserRequests(user.id);
          setUserRequestCount(userRequests.length);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  // Display loading state
  if (isLoading) {
    return <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 animate-spin text-school-primary" />
            <p className="mt-6 text-gray-600 font-medium">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>;
  }

  // Display appropriate welcome message based on user role
  const getWelcomeMessage = () => {
    if (user?.role === "student") {
      return "Track your document requests and submit new ones.";
    } else if (user?.role === "registrar") {
      return "Manage and process student document requests.";
    } else {
      return "Oversee the document request system and user management.";
    }
  };
  return <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <PageHeader title={`Welcome, ${user?.name}!`} description={getWelcomeMessage()} />

        {/* Dashboard Cards */}
        {user?.role === "student" ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <DashboardCard title="My Requests" description="Total document requests you've submitted" value={userRequestCount.toString()} icon={<ClipboardList className="h-12 w-12" />} color="bg-blue-50 text-blue-600" gradient="from-blue-500 to-blue-600" />
            
            <DashboardCard title="Pending Approval" description="Requests awaiting approval" value={(stats?.pending || 0).toString()} icon={<FileClock className="h-12 w-12" />} color="bg-amber-50 text-amber-600" gradient="from-amber-500 to-amber-600" />
            
            <DashboardCard title="Completed" description="Successfully completed requests" value={(stats?.completed || 0).toString()} icon={<FileCheck className="h-12 w-12" />} color="bg-green-50 text-green-600" gradient="from-green-500 to-green-600" />
          </div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <DashboardCard title="Total Requests" description="All document requests in the system" value={(stats?.total || 0).toString()} icon={<ClipboardList className="h-12 w-12" />} color="bg-blue-50 text-blue-600" gradient="from-blue-400 to-blue-600" />
            
            <DashboardCard title="Pending" description="Requests waiting for review" value={(stats?.pending || 0).toString()} icon={<FileClock className="h-12 w-12" />} color="bg-amber-50 text-amber-600" gradient="from-amber-400 to-amber-600" />
            
            <DashboardCard title="Approved" description="Requests approved and ready" value={(stats?.approved || 0).toString()} icon={<FileCheck className="h-12 w-12" />} color="bg-emerald-50 text-emerald-600" gradient="from-emerald-400 to-emerald-600" />
            
            <DashboardCard title="Processing" description="Requests currently in progress" value={(stats?.processing || 0).toString()} icon={<FileClock className="h-12 w-12" />} color="bg-purple-50 text-purple-600" gradient="from-purple-400 to-purple-600" />
            
            <DashboardCard title="Completed" description="Successfully completed requests" value={(stats?.completed || 0).toString()} icon={<FileCheck className="h-12 w-12" />} color="bg-green-50 text-green-600" gradient="from-green-400 to-green-600" />
            
            <DashboardCard title="Rejected" description="Denied or cancelled requests" value={(stats?.rejected || 0).toString()} icon={<FileX className="h-12 w-12" />} color="bg-red-50 text-red-600" gradient="from-red-400 to-red-600" />
          </div>}
        
        {/* Quick Actions Section for Students */}
        {user?.role === "student" && <div className="mt-10">
            <Card className="dashboard-card overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-school-primary to-school-secondary text-white p-6">
                <CardTitle className="font-semibold text-slate-50 text-2xl">Quick Actions</CardTitle>
                
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <ActionCard title="Request Document" description="Submit a new document request" link="/dashboard/new-request" icon={<ClipboardList className="h-5 w-5" />} />
                  <ActionCard title="My Requests" description="View and track your requests" link="/dashboard/my-requests" icon={<FileCheck className="h-5 w-5" />} />
                  <ActionCard title="Upload Receipt" description="Upload a payment receipt" link="/dashboard/receipt-upload" icon={<FileCheck className="h-5 w-5" />} />
                </div>
              </CardContent>
            </Card>
          </div>}
        
        {/* Recent Activity Section for Staff */}
        {(user?.role === "registrar" || user?.role === "admin") && <div className="mt-10">
            <Card className="dashboard-card overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-school-primary to-school-secondary text-white p-6">
                <CardTitle className="text-xl font-semibold text-slate-50">Recent Activity</CardTitle>
                <CardDescription className="text-white/90 mt-1">Latest request updates</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <ActivityItem title="New Transcript Request" description="John Doe submitted a request for Transcript of Records" time="10 minutes ago" status="Pending" />
                  <ActivityItem title="Payment Received" description="Payment confirmed for Certificate of Enrollment request" time="25 minutes ago" status="Processing" />
                  <ActivityItem title="Request Completed" description="Certificate of Good Moral Character ready for pickup" time="1 hour ago" status="Completed" />
                </div>
              </CardContent>
            </Card>
          </div>}
      </div>
    </DashboardLayout>;
};

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
}
const DashboardCard = ({
  title,
  description,
  value,
  icon,
  color,
  gradient
}: DashboardCardProps) => {
  return <Card className="dashboard-card overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className={`p-6 ${gradient ? `bg-gradient-to-br ${gradient} text-white` : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${gradient ? 'text-white/90' : 'text-gray-500'} mb-1`}>{title}</p>
                <p className={`text-3xl font-bold ${gradient ? 'text-white' : ''}`}>{value}</p>
              </div>
              <div className={`p-3 rounded-full ${gradient ? 'bg-white/20' : color} shadow-inner`}>{icon}</div>
            </div>
            <p className={`text-sm mt-3 ${gradient ? 'text-white/80' : 'text-gray-500'}`}>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>;
};

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}
const ActionCard = ({
  title,
  description,
  link,
  icon
}: ActionCardProps) => {
  return <a href={link} className="group block p-5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="bg-school-primary/10 text-school-primary p-3 rounded-lg group-hover:bg-school-primary/15 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 group-hover:text-school-primary transition-colors">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-5 w-5 text-school-primary" />
        </div>
      </div>
    </a>;
};

// Activity Item Component
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  status: "Pending" | "Processing" | "Approved" | "Rejected" | "Completed";
}
const ActivityItem = ({
  title,
  description,
  time,
  status
}: ActivityItemProps) => {
  return <div className="flex items-start justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
      <div>
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Clock className="h-3 w-3" /> {time}
        </p>
      </div>
      <StatusBadge status={status} />
    </div>;
};
export default Dashboard;