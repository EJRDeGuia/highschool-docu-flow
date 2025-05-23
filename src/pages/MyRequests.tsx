
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { FilePlus, Loader, Search, SlidersHorizontal, Upload } from "lucide-react";
import { Input } from "../components/ui/input";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { DocumentRequest, getUserRequests } from "../services/requestService";
import { useNavigate } from "react-router-dom";
import RequestTimeline from "../components/requests/RequestTimeline";
import StatusBadge from "../components/shared/StatusBadge";
import { useToast } from "@/hooks/use-toast";

const MyRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DocumentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const userRequests = await getUserRequests(user.id);
          setRequests(userRequests);
          setFilteredRequests(userRequests);
        } catch (error) {
          console.error("Error fetching requests:", error);
          toast({
            title: "Error",
            description: "Failed to load your requests. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRequests();
  }, [user?.id, toast]);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...requests];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.id.toLowerCase().includes(query) ||
        request.documentTypeName.toLowerCase().includes(query) ||
        request.purpose.toLowerCase().includes(query) ||
        request.status.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter, sortOrder]);

  const handleRequestSelect = (request: DocumentRequest) => {
    setSelectedRequest(request);
  };

  const closeRequestDetails = () => {
    setSelectedRequest(null);
  };

  const handleNewRequest = () => {
    navigate("/dashboard/new-request");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-gray-600">View and track all your document requests</p>
        </div>
        <Button onClick={handleNewRequest}>
          <FilePlus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search requests..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {sortOrder === "asc" ? "Oldest First" : "Newest First"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card 
              key={request.id} 
              className="cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => handleRequestSelect(request)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{request.documentTypeName}</p>
                    <p className="text-sm text-gray-500">
                      Request ID: {request.id}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(request.createdAt).toLocaleDateString()} - {request.purpose}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={request.status} />
                    
                    {!request.hasPaid && (
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={(e) => {
                        e.stopPropagation();
                        navigate("/dashboard/receipt-upload");
                      }}>
                        <Upload className="mr-1 h-3 w-3" />
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FilePlus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No requests found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "You haven't made any document requests yet"}
          </p>
          <Button onClick={handleNewRequest}>
            <FilePlus className="mr-2 h-4 w-4" />
            Create New Request
          </Button>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedRequest.documentTypeName}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeRequestDetails}
                >
                  &times;
                </Button>
              </div>
              
              <div className="grid gap-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Request ID</p>
                    <p className="font-medium">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <StatusBadge status={selectedRequest.status} className="mt-1" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Request Date</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p className="font-medium">{selectedRequest.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Copies</p>
                    <p className="font-medium">{selectedRequest.copies}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fee</p>
                    <p className="font-medium">₱{selectedRequest.fee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className="font-medium">
                      {selectedRequest.hasPaid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                </div>
                
                {selectedRequest.additionalDetails && (
                  <div>
                    <p className="text-sm text-gray-500">Additional Details</p>
                    <p className="p-3 bg-gray-50 rounded-md mt-1">
                      {selectedRequest.additionalDetails}
                    </p>
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Request Timeline</p>
                  <RequestTimeline 
                    requestId={selectedRequest.id}
                    documentType={selectedRequest.documentTypeName}
                    statuses={selectedRequest.timeline}
                    currentStatus={selectedRequest.status}
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  {!selectedRequest.hasPaid && (
                    <Button 
                      onClick={() => {
                        closeRequestDetails();
                        navigate("/dashboard/receipt-upload");
                      }}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Pay Now
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={closeRequestDetails}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyRequests;
