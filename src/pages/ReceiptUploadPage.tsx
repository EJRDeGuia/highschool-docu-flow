
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ReceiptUpload from "../components/requests/ReceiptUpload";
import { getRequestById, markRequestAsPaid, updateRequestStatus } from "../services/requestService";
import { DocumentRequest } from "../services/requestService";
import { AlertCircle, Loader, ReceiptText, Receipt, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const ReceiptUploadPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<string | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const { toast } = useToast();
  const requestId = searchParams.get("requestId");
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);
  const [confirmVerifyOpen, setConfirmVerifyOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if user is registrar or admin to determine view mode
  const isRegistrar = hasPermission(['registrar', 'admin']);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) {
        setIsLoading(false);
        setError("No request ID provided");
        toast({
          title: "Error",
          description: "No request ID provided. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetching request with ID:", requestId);
      
      try {
        const requestData = await getRequestById(requestId);
        console.log("Request data returned:", requestData);
        
        if (requestData) {
          setRequest(requestData);
          
          // If user is registrar/admin or if this is their request and it has receipt
          if ((isRegistrar || requestData.userId === user?.id) && requestData.hasUploadedReceipt) {
            setIsViewMode(true);
            await fetchReceiptImage(requestId);
          }
        } else {
          console.error("Request not found for ID:", requestId);
          setError(`Request with ID ${requestId} not found. Please check the request ID and try again.`);
          toast({
            title: "Error",
            description: "Request not found. Please check the request ID and try again.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching request:", error);
        setError(`Error loading request: ${error.message || "Unknown error"}`);
        toast({
          title: "Error",
          description: "Failed to load request information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, toast, user, isRegistrar]);

  const fetchReceiptImage = async (reqId: string) => {
    try {
      const { data, error } = await supabase
        .from('receipt_uploads')
        .select('file_data')
        .eq('request_id', reqId)
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching receipt:", error);
        toast({
          title: "Error",
          description: "Failed to fetch receipt image",
          variant: "destructive",
        });
        return;
      }

      if (data && data.file_data) {
        setReceiptData(data.file_data);
      }
    } catch (error: any) {
      console.error("Error in receipt fetch:", error);
    }
  };

  const handleVerifyPayment = async () => {
    if (!request || !requestId) return;
    
    setIsProcessing(true);
    try {
      const updatedRequest = await markRequestAsPaid(requestId);
      if (updatedRequest) {
        toast({
          title: "Success",
          description: "Payment has been verified successfully.",
        });
        // Redirect to request management
        setTimeout(() => {
          navigate("/dashboard/manage-requests");
        }, 1500);
      } else {
        throw new Error("Failed to verify payment");
      }
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      toast({
        title: "Error",
        description: `Failed to verify payment: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setConfirmVerifyOpen(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!request || !requestId) return;
    
    setIsProcessing(true);
    try {
      const updatedRequest = await updateRequestStatus(requestId, "Rejected", rejectNote || "Receipt not provided or insufficient");
      if (updatedRequest) {
        toast({
          title: "Request Rejected",
          description: "The request has been rejected successfully.",
        });
        // Redirect to request management
        setTimeout(() => {
          navigate("/dashboard/manage-requests");
        }, 1500);
      } else {
        throw new Error("Failed to reject request");
      }
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error",
        description: `Failed to reject request: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setConfirmRejectOpen(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Payment Receipt</h1>
          <p className="text-gray-600">
            An error occurred while loading the request information
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Request not found</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate("/dashboard/my-requests")} 
          className="mt-4"
        >
          Return to My Requests
        </Button>
      </DashboardLayout>
    );
  }

  // Display receipt view for registrars or users viewing their own uploaded receipt
  if (isViewMode && receiptData) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment Receipt</h1>
          <p className="text-gray-600">
            {isRegistrar ? "Review the payment receipt uploaded by the student" : "Your uploaded receipt"}
          </p>
          {request && (
            <div className="mt-2 text-sm text-gray-500">
              Request: {request.documentTypeName} - ₱{request.fee.toFixed(2)}
            </div>
          )}
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ReceiptText className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium">Payment Receipt</h3>
            </div>
            
            <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50">
              <img 
                src={receiptData} 
                alt="Payment Receipt" 
                className="w-full max-h-[600px] object-contain"
              />
            </div>
          </CardContent>
        </Card>
        
        {isRegistrar && !request?.hasPaid && (
          <div className="flex flex-wrap gap-4 mt-6">
            <Button 
              onClick={() => setConfirmVerifyOpen(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={isProcessing}
            >
              <Check className="mr-2 h-4 w-4" />
              Verify Payment
            </Button>
            <Button 
              onClick={() => setConfirmRejectOpen(true)}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
              disabled={isProcessing}
            >
              <X className="mr-2 h-4 w-4" />
              Reject Request
            </Button>
            <Button 
              onClick={() => navigate("/dashboard/manage-requests")} 
              variant="outline"
              disabled={isProcessing}
            >
              Back to Request Management
            </Button>
          </div>
        )}
        
        {isRegistrar && request?.hasPaid && (
          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-center gap-2 mb-4">
              <Check className="h-5 w-5 text-green-500" />
              <p className="text-green-700">Payment has already been verified for this request</p>
            </div>
            <Button 
              onClick={() => navigate("/dashboard/manage-requests")} 
              variant="outline"
            >
              Back to Request Management
            </Button>
          </div>
        )}
        
        {!isRegistrar && (
          <Button 
            onClick={() => navigate("/dashboard/my-requests")} 
            variant="outline"
          >
            Return to My Requests
          </Button>
        )}

        {/* Verify Payment Dialog */}
        <Dialog open={confirmVerifyOpen} onOpenChange={setConfirmVerifyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Payment</DialogTitle>
              <DialogDescription>
                Are you sure you want to verify this payment? This will mark the request as paid.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfirmVerifyOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleVerifyPayment}
                className="bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Verify Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Request Dialog */}
        <Dialog open={confirmRejectOpen} onOpenChange={setConfirmRejectOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this request? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Reason for rejection (optional)"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfirmRejectOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRejectRequest}
                variant="destructive"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Reject Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    );
  }

  // For registrars when there's no receipt uploaded yet
  if (isRegistrar && request && !request.hasUploadedReceipt) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment Receipt</h1>
          <p className="text-gray-600">
            This request does not have an uploaded receipt yet
          </p>
          {request && (
            <div className="mt-2 text-sm text-gray-500">
              Request: {request.documentTypeName} - ₱{request.fee.toFixed(2)}
            </div>
          )}
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="h-5 w-5 text-amber-600" />
              <h3 className="font-medium">No Receipt Uploaded</h3>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <p className="text-amber-800">
                The student has not uploaded a payment receipt for this request yet. 
                You can either wait for the receipt to be uploaded or reject the request.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <Button 
            onClick={() => setConfirmRejectOpen(true)}
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
            disabled={isProcessing}
          >
            <X className="mr-2 h-4 w-4" />
            Reject Request
          </Button>
          <Button 
            onClick={() => navigate("/dashboard/manage-requests")} 
            variant="outline"
          >
            Back to Request Management
          </Button>
        </div>

        {/* Reject Request Dialog */}
        <Dialog open={confirmRejectOpen} onOpenChange={setConfirmRejectOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this request? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Reason for rejection (optional)"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfirmRejectOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRejectRequest}
                variant="destructive"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Reject Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Payment Receipt</h1>
        <p className="text-gray-600">
          Upload a screenshot of your payment receipt to verify your payment
        </p>
        {request && (
          <div className="mt-2 text-sm text-gray-500">
            Request: {request.documentTypeName} - ₱{request.fee.toFixed(2)}
          </div>
        )}
      </div>
      
      <ReceiptUpload requestId={requestId} />
    </DashboardLayout>
  );
};

export default ReceiptUploadPage;
