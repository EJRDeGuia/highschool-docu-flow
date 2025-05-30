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
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl ${stat.highlight ? 'ring-2 ring-orange-200 bg-orange-50/50' : 'bg-white'}`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-base font-semibold text-gray-600">{stat.title}</p>
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
                {stat.highlight && (
                  <div className="mt-4 flex items-center text-sm text-orange-700 bg-orange-100 px-3 py-2 rounded-lg">
                    <Bell className="h-4 w-4 mr-2" />
                    Needs attention
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg rounded-xl bg-white">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-gray-900">Recent Requests</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Latest document request submissions
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(user?.role === 'student' ? '/dashboard/my-requests' : '/dashboard/manage-requests')}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 px-6 py-3 h-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-6">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900 text-base">{request.type}</p>
                            {request.studentName && (
                              <p className="text-sm text-gray-600">by {request.studentName}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              {new Date(request.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                      <p className="text-lg">No recent requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg rounded-xl bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {user?.role === 'student' ? (
                  <>
                    <Button 
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
                      onClick={() => navigate("/dashboard/new-request")}
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Submit New Request
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 text-base"
                      onClick={() => navigate("/dashboard/my-requests")}
                    >
                      <FileText className="h-5 w-5 mr-3" />
                      View My Requests
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
                      onClick={() => navigate("/dashboard/manage-requests")}
                    >
                      <CheckCircle className="h-5 w-5 mr-3" />
                      Review Requests
                    </Button>
                    {user?.role === 'admin' && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-12 text-base"
                        onClick={() => navigate("/dashboard/users")}
                      >
                        <Users className="h-5 w-5 mr-3" />
                        Manage Users
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <TrendingUp className="h-12 w-12 text-blue-600 mx-auto" />
                  <h3 className="font-bold text-gray-900 text-lg">System Status</h3>
                  <p className="text-base text-gray-600">All services operational</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm">
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
