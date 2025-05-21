import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  FilePen,
  Loader,
  Search,
  SlidersHorizontal,
  X,
  Check,
  Clock,
  AlertCircle
} from "lucide-react";
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
import { Textarea } from "../components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DocumentRequest, getAllRequests, getRequestById, updateRequestStatus } from "../services/requestService";
import RequestTimeline from "../components/requests/RequestTimeline";

const ManageRequests = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DocumentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "complete" | null>(null);
  const [actionNote, setActionNote] = useState("");
  
  // Check if user can approve/reject requests (only registrars)
  const canManageRequests = user?.role === 'registrar';

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const allRequests = await getAllRequests();
        setRequests(allRequests);
        setFilteredRequests(allRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

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

  const handleActionClick = (type: "approve" | "reject" | "complete") => {
    // Only registrars can perform these actions
    if (!canManageRequests) {
      toast({
        title: "Access Denied",
        description: "Only registrars can approve or reject requests.",
        variant: "destructive",
      });
      return;
    }
    
    setActionType(type);
    setActionNote("");
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedRequest || !actionType || !canManageRequests) return;
    
    setIsUpdating(true);
    
    try {
      let newStatus: "Approved" | "Rejected" | "Completed" | "Processing" = "Processing";
      
      switch (actionType) {
        case "approve":
          newStatus = "Approved";
          break;
        case "reject":
          newStatus = "Rejected";
          break;
        case "complete":
          newStatus = "Completed";
          break;
      }
      
      const updatedRequest = await updateRequestStatus(
        selectedRequest.id,
        newStatus,
        actionNote || undefined
      );
      
      if (updatedRequest) {
        // Update local state
        setRequests(prev => 
          prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
        );
        
        // Update selected request
        setSelectedRequest(updatedRequest);
        
        // Add notification
        addNotification({
          title: `Request ${newStatus}`,
          message: `Request ${selectedRequest.id} has been ${newStatus.toLowerCase()}.`,
          type: actionType === "reject" ? "error" : "success",
        });
        
        // Show toast
        toast({
          title: "Success",
          description: `Request has been ${newStatus.toLowerCase()}.`,
        });
      }
    } catch (error) {
      console.error("Error updating request:", error);
      
      toast({
        title: "Error",
        description: "Failed to update the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setActionDialogOpen(false);
    }
  };

  const refreshRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      const updatedRequest = await getRequestById(selectedRequest.id);
      
      if (updatedRequest) {
        setSelectedRequest(updatedRequest);
        
        // Update the request in the main list too
        setRequests(prev => 
          prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
        );
      }
    } catch (error) {
      console.error("Error refreshing request:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Requests</h1>
        <p className="text-gray-600">
          {canManageRequests 
            ? "Review, approve, or reject student document requests" 
            : "View and track student document requests"}
        </p>
        
        {!canManageRequests && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mt-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>
              Note: Only registrars can approve or reject document requests. You are currently in view-only mode.
            </span>
          </div>
        )}
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
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">{request.documentTypeName}</p>
                      <Badge
                        variant="outline"
                        className={`
                          ${request.status === "Pending" ? "status-pending" : ""}
                          ${request.status === "Processing" ? "status-pending" : ""}
                          ${request.status === "Approved" ? "status-approved" : ""}
                          ${request.status === "Rejected" ? "status-rejected" : ""}
                          ${request.status === "Completed" ? "status-approved" : ""}
                        `}
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Request ID: {request.id}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(request.createdAt).toLocaleDateString()} - {request.purpose}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Student ID: {request.userId}</p>
                    <p className="text-xs text-gray-500">
                      {request.hasPaid ? "Payment Verified" : "Payment Pending"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.copies} {request.copies > 1 ? "copies" : "copy"} - ₱{request.fee.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FilePen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No requests found</h3>
          <p className="text-gray-500">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "There are no document requests in the system yet"}
          </p>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
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
                    <Badge
                      variant="outline"
                      className={`
                        mt-1
                        ${selectedRequest.status === "Pending" ? "status-pending" : ""}
                        ${selectedRequest.status === "Processing" ? "status-pending" : ""}
                        ${selectedRequest.status === "Approved" ? "status-approved" : ""}
                        ${selectedRequest.status === "Rejected" ? "status-rejected" : ""}
                        ${selectedRequest.status === "Completed" ? "status-approved" : ""}
                      `}
                    >
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium">{selectedRequest.userId}</p>
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
                  <div>
                    <p className="text-sm text-gray-500">Receipt Uploaded</p>
                    <p className="font-medium">
                      {selectedRequest.hasUploadedReceipt ? "Yes" : "No"}
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
                
                <div className="flex flex-wrap justify-end gap-3 mt-4">
                  {/* Action buttons based on current status - only shown to registrars */}
                  {canManageRequests && selectedRequest.status === "Pending" && selectedRequest.hasPaid && (
                    <>
                      <Button 
                        variant="outline" 
                        className="border-amber-500 text-amber-600 hover:bg-amber-50"
                        onClick={() => handleActionClick("approve")}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Process Request
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => handleActionClick("reject")}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject Request
                      </Button>
                    </>
                  )}
                  
                  {canManageRequests && selectedRequest.status === "Processing" && (
                    <Button 
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                      onClick={() => handleActionClick("approve")}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve Request
                    </Button>
                  )}
                  
                  {canManageRequests && selectedRequest.status === "Approved" && (
                    <Button 
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                      onClick={() => handleActionClick("complete")}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                  )}
                  
                  {!canManageRequests && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mt-4 w-full flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>
                        Only registrars can approve or reject document requests.
                      </span>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={refreshRequest}
                    disabled={isUpdating}
                  >
                    Refresh
                  </Button>
                  
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

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Request"}
              {actionType === "reject" && "Reject Request"}
              {actionType === "complete" && "Complete Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && selectedRequest?.status === "Pending" && 
                "This will change the request status to 'Processing'."
              }
              {actionType === "approve" && selectedRequest?.status === "Processing" && 
                "This will change the request status to 'Approved'."
              }
              {actionType === "reject" && "This will reject the request."}
              {actionType === "complete" && "This will mark the request as completed."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Add a note (optional):</p>
              <Textarea 
                placeholder="Enter a note about this action..." 
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleActionConfirm}
              disabled={isUpdating}
              variant={actionType === "reject" ? "destructive" : "default"}
            >
              {isUpdating && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageRequests;
