
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/shared/PageHeader";
import StatusBadge from "../components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../components/ui/badge";
import { 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Bell,
  Plus,
  RefreshCw,
  Eye
} from "lucide-react";

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

interface RecentRequest {
  id: string;
  type: string;
  status: string;
  submittedAt: string;
  studentName?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalRequests: 156,
          pendingRequests: 23,
          approvedRequests: 98,
          rejectedRequests: 12,
        });

        setRecentRequests([
          {
            id: "1",
            type: "Transcript",
            status: "pending",
            submittedAt: "2024-01-15T10:30:00Z",
            studentName: user?.role !== 'student' ? "John Doe" : undefined,
          },
          {
            id: "2",
            type: "Certificate",
            status: "approved",
            submittedAt: "2024-01-14T14:20:00Z",
            studentName: user?.role !== 'student' ? "Jane Smith" : undefined,
          },
          {
            id: "3",
            type: "Diploma",
            status: "processing",
            submittedAt: "2024-01-13T09:15:00Z",
            studentName: user?.role !== 'student' ? "Mike Johnson" : undefined,
          },
        ]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast, user?.role]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    {
      title: "Total Requests",
      value: stats.totalRequests,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Approval",
      value: stats.pendingRequests,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      highlight: stats.pendingRequests > 0,
    },
    {
      title: "Approved",
      value: stats.approvedRequests,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rejected",
      value: stats.rejectedRequests,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title={`${getGreeting()}, ${user?.name?.split(' ')[0]}!`}
          description="Here's an overview of your document requests and system activity"
          action={
            user?.role === 'student' ? {
              label: "New Request",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => navigate("/dashboard/new-request"),
            } : undefined
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${stat.highlight ? 'ring-2 ring-yellow-200 bg-yellow-50/50' : 'bg-white'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                {stat.highlight && (
                  <div className="mt-3 flex items-center text-sm text-yellow-700">
                    <Bell className="h-4 w-4 mr-1" />
                    Needs attention
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Recent Requests</CardTitle>
                    <CardDescription className="text-gray-600">
                      Latest document request submissions
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(user?.role === 'student' ? '/dashboard/my-requests' : '/dashboard/manage-requests')}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{request.type}</p>
                            {request.studentName && (
                              <p className="text-sm text-gray-600">by {request.studentName}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(request.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No recent requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {user?.role === 'student' ? (
                  <>
                    <Button 
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate("/dashboard/new-request")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit New Request
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate("/dashboard/my-requests")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View My Requests
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate("/dashboard/manage-requests")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Review Requests
                    </Button>
                    {user?.role === 'admin' && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate("/dashboard/users")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Manage Users
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">System Status</h3>
                  <p className="text-sm text-gray-600 mb-4">All services operational</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
