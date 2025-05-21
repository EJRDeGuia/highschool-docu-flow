
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ClipboardList,
  FileCheck,
  FileClock,
  FileX,
  Loader,
} from "lucide-react";
import { getRequestStatistics, getUserRequests } from "../services/requestService";

const Dashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
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

  // Display appropriate cards based on user role
  const renderDashboardCards = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-school-primary" />
        </div>
      );
    }

    if (user?.role === "student") {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="My Requests"
            description="Total document requests you've submitted"
            value={userRequestCount.toString()}
            icon={<ClipboardList className="h-12 w-12" />}
            color="bg-blue-50 text-blue-600"
          />
          
          <DashboardCard
            title="Pending Approval"
            description="Requests awaiting approval"
            value={(stats?.pending || 0).toString()}
            icon={<FileClock className="h-12 w-12" />}
            color="bg-amber-50 text-amber-600"
          />
          
          <DashboardCard
            title="Completed"
            description="Successfully completed requests"
            value={(stats?.completed || 0).toString()}
            icon={<FileCheck className="h-12 w-12" />}
            color="bg-green-50 text-green-600"
          />
        </div>
      );
    }

    // For registrars and admins
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Requests"
          description="All document requests in the system"
          value={(stats?.total || 0).toString()}
          icon={<ClipboardList className="h-12 w-12" />}
          color="bg-blue-50 text-blue-600"
        />
        
        <DashboardCard
          title="Pending"
          description="Requests waiting for review"
          value={(stats?.pending || 0).toString()}
          icon={<FileClock className="h-12 w-12" />}
          color="bg-amber-50 text-amber-600"
        />
        
        <DashboardCard
          title="Approved"
          description="Requests approved and ready"
          value={(stats?.approved || 0).toString()}
          icon={<FileCheck className="h-12 w-12" />}
          color="bg-emerald-50 text-emerald-600"
        />
        
        <DashboardCard
          title="Processing"
          description="Requests currently in progress"
          value={(stats?.processing || 0).toString()}
          icon={<FileClock className="h-12 w-12" />}
          color="bg-purple-50 text-purple-600"
        />
        
        <DashboardCard
          title="Completed"
          description="Successfully completed requests"
          value={(stats?.completed || 0).toString()}
          icon={<FileCheck className="h-12 w-12" />}
          color="bg-green-50 text-green-600"
        />
        
        <DashboardCard
          title="Rejected"
          description="Denied or cancelled requests"
          value={(stats?.rejected || 0).toString()}
          icon={<FileX className="h-12 w-12" />}
          color="bg-red-50 text-red-600"
        />
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">
          {user?.role === "student" 
            ? "Track your document requests and submit new ones." 
            : user?.role === "registrar"
            ? "Manage and process student document requests."
            : "Oversee the document request system and user management."}
        </p>
      </div>

      {renderDashboardCards()}
      
      {user?.role === "student" && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Things you might want to do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <ActionCard
                  title="Request Document"
                  description="Submit a new document request"
                  link="/dashboard/new-request"
                />
                <ActionCard
                  title="My Requests"
                  description="View and track your requests"
                  link="/dashboard/my-requests"
                />
                <ActionCard
                  title="Upload Receipt"
                  description="Upload a payment receipt"
                  link="/dashboard/receipt-upload"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {(user?.role === "registrar" || user?.role === "admin") && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest request updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  title="New Transcript Request"
                  description="John Doe submitted a request for Transcript of Records"
                  time="10 minutes ago"
                  status="Pending"
                />
                <ActivityItem
                  title="Payment Received"
                  description="Payment confirmed for Certificate of Enrollment request"
                  time="25 minutes ago"
                  status="Processing"
                />
                <ActivityItem
                  title="Request Completed"
                  description="Certificate of Good Moral Character ready for pickup"
                  time="1 hour ago"
                  status="Completed"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard = ({ title, description, value, icon, color }: DashboardCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  link: string;
}

const ActionCard = ({ title, description, link }: ActionCardProps) => {
  return (
    <a 
      href={link}
      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </a>
  );
};

// Activity Item Component
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  status: string;
}

const ActivityItem = ({ title, description, time, status }: ActivityItemProps) => {
  return (
    <div className="flex items-start justify-between border-b border-gray-100 pb-4">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      <Badge
        variant="outline"
        className={`
          ${status === "Pending" ? "status-pending" : ""}
          ${status === "Processing" ? "status-pending" : ""}
          ${status === "Approved" ? "status-approved" : ""}
          ${status === "Rejected" ? "status-rejected" : ""}
          ${status === "Completed" ? "status-approved" : ""}
        `}
      >
        {status}
      </Badge>
    </div>
  );
};

export default Dashboard;
