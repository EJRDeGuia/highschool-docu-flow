
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { FilePlus, Loader } from "lucide-react";
import { DocumentRequest, getUserRequests, cancelRequest } from "../services/requestService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import RequestFilters from "../components/requests/RequestFilters";
import RequestCard from "../components/requests/RequestCard";
import RequestDetailsModal from "../components/requests/RequestDetailsModal";
import EmptyRequestsState from "../components/requests/EmptyRequestsState";

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
  const [cancellingRequestId, setCancellingRequestId] = useState<string | null>(null);

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

  const handleNewRequest = () => {
    navigate("/dashboard/new-request");
  };

  const handlePayNow = (requestId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    console.log("Navigating to receipt upload with requestId:", requestId);
    navigate(`/dashboard/upload-receipt?requestId=${requestId}`);
  };

  const handleCancelRequest = async (requestId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setCancellingRequestId(requestId);
    
    try {
      await cancelRequest(requestId);
      
      // Refresh the requests list
      if (user?.id) {
        const userRequests = await getUserRequests(user.id);
        setRequests(userRequests);
        setFilteredRequests(userRequests);
      }
      
      toast({
        title: "Success",
        description: "Request cancelled successfully.",
      });
      
      // Close modal if the cancelled request was selected
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel request.",
        variant: "destructive",
      });
    } finally {
      setCancellingRequestId(null);
    }
  };

  const canCancelRequest = (request: DocumentRequest) => {
    return request.status === 'Pending' && !request.hasPaid;
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

      <RequestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onSelect={setSelectedRequest}
              onPayNow={handlePayNow}
              onCancel={handleCancelRequest}
              canCancel={canCancelRequest}
              cancellingRequestId={cancellingRequestId}
            />
          ))}
        </div>
      ) : (
        <EmptyRequestsState
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onNewRequest={handleNewRequest}
        />
      )}

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onPayNow={handlePayNow}
          onCancel={handleCancelRequest}
          canCancel={canCancelRequest}
          cancellingRequestId={cancellingRequestId}
        />
      )}
    </DashboardLayout>
  );
};

export default MyRequests;
