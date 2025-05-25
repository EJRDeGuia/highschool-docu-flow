import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { createUserSpecificNotification, NotificationTemplates } from "@/services/notificationService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Upload, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ReceiptUploadPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("requestId");
  
  const [request, setRequest] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const fetchRequestAndReceipt = async () => {
    if (!requestId) return;

    try {
      // Fetch request details
      const { data: requestData, error: requestError } = await supabase
        .from('document_requests')
        .select(`
          *,
          document_types (name, base_fee),
          users (name, email, student_id)
        `)
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;
      setRequest(requestData);

      // Fetch receipt if exists
      const { data: receiptData, error: receiptError } = await supabase
        .from('receipt_uploads')
        .select('*')
        .eq('request_id', requestId)
        .maybeSingle();

      if (receiptError && receiptError.code !== 'PGRST116') {
        throw receiptError;
      }
      
      setReceipt(receiptData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRequestAndReceipt();
  }, [requestId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !requestId) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target?.result as string;
        
        const { error } = await supabase
          .from('receipt_uploads')
          .insert({
            request_id: requestId,
            user_id: user.id,
            filename: file.name,
            file_data: fileData,
          });

        if (error) throw error;

        // Update request status
        await supabase
          .from('document_requests')
          .update({ has_uploaded_receipt: true })
          .eq('id', requestId);

        // Send notification to registrars
        if (request) {
          addNotification({
            ...NotificationTemplates.receiptUploaded(user.name, request.document_types.name),
          });
        }

        toast({
          title: "Success",
          description: "Receipt uploaded successfully",
        });
        
        fetchRequestAndReceipt();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload receipt",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!requestId || !user) return;

    setProcessing(true);
    try {
      await supabase
        .from('document_requests')
        .update({ 
          has_paid: true,
          status: 'Processing'
        })
        .eq('id', requestId);

      // Send notification to student
      if (request) {
        createUserSpecificNotification(
          addNotification,
          'Payment Verified',
          `Payment for ${request.document_types.name} has been verified. Your document is being processed.`,
          request.user_id,
          'success'
        );
      }

      toast({
        title: "Success",
        description: "Payment verified successfully",
      });
      
      fetchRequestAndReceipt();
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify payment",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!requestId || !user || !rejectionReason.trim()) return;

    setProcessing(true);
    try {
      await supabase
        .from('document_requests')
        .update({ 
          status: 'Rejected'
        })
        .eq('id', requestId);

      // Send notification to student
      if (request) {
        createUserSpecificNotification(
          addNotification,
          'Request Rejected',
          `Your request for ${request.document_types.name} has been rejected: ${rejectionReason}`,
          request.user_id,
          'error'
        );
      }

      toast({
        title: "Request Rejected",
        description: "The request has been rejected and the student has been notified",
      });
      
      navigate('/dashboard/manage-requests');
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setShowRejectionForm(false);
    }
  };

  if (!request) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading request details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isRegistrarOrAdmin = user?.role === 'registrar' || user?.role === 'admin';
  const isRequestOwner = user?.id === request.user_id;
  const canView = isRegistrarOrAdmin || isRequestOwner;

  if (!canView) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to view this request.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={isRegistrarOrAdmin ? "Payment Verification" : "Receipt Upload"}
          description={isRegistrarOrAdmin ? "Review and verify student payment" : "Upload your payment receipt"}
        />

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Document Type</Label>
                <p className="text-base">{request.document_types?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Fee</Label>
                <p className="text-base">₱{request.fee}</p>
              </div>
              {isRegistrarOrAdmin && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Student</Label>
                    <p className="text-base">{request.users?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Student ID</Label>
                    <p className="text-base">{request.users?.student_id}</p>
                  </div>
                </>
              )}
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'}>
                  {request.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Payment Status</Label>
                <Badge variant={request.has_paid ? 'default' : 'secondary'}>
                  {request.has_paid ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment QR Code - Show for students */}
        {!isRegistrarOrAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Scan the QR code below to make your payment via InstaPay
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                <img 
                  src="/lovable-uploads/022b0cff-37f6-4f3f-811e-bb565c45c0b1.png" 
                  alt="InstaPay QR Code" 
                  className="w-64 h-64 mx-auto"
                />
                <p className="mt-2 text-sm text-gray-600">InstaPay QR Code</p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                After making the payment, please upload your receipt below
              </p>
            </CardContent>
          </Card>
        )}

        {/* Receipt Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              {receipt ? 'Uploaded Receipt' : 'Payment Receipt'}
            </CardTitle>
            <CardDescription>
              {receipt 
                ? (isRegistrarOrAdmin ? 'Review the uploaded receipt' : 'Your uploaded receipt')
                : 'Upload your payment receipt for verification'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {receipt ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Receipt uploaded</span>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">File: {receipt.filename}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Uploaded: {new Date(receipt.uploaded_at).toLocaleString()}
                  </p>
                  
                  {receipt.file_data && (
                    <div className="max-w-md mx-auto">
                      <img 
                        src={receipt.file_data} 
                        alt="Payment Receipt" 
                        className="w-full h-auto border rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Action buttons for registrars */}
                {isRegistrarOrAdmin && !request.has_paid && (
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleVerifyPayment}
                      disabled={processing}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {processing ? "Verifying..." : "Verify Payment"}
                    </Button>
                    
                    {!showRejectionForm ? (
                      <Button
                        variant="destructive"
                        onClick={() => setShowRejectionForm(true)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject Request
                      </Button>
                    ) : (
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label htmlFor="rejection-reason">Rejection Reason</Label>
                          <Textarea
                            id="rejection-reason"
                            placeholder="Please provide a reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleRejectRequest}
                            disabled={!rejectionReason.trim() || processing}
                          >
                            Confirm Rejection
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowRejectionForm(false);
                              setRejectionReason("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {request.has_paid && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Payment has been verified. Your document is being processed.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {!isRegistrarOrAdmin ? (
                  // Upload form for students
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="receipt-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-violet-600 hover:text-violet-500">
                          Click to upload your receipt
                        </span>
                        <Input
                          id="receipt-upload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-xs text-gray-500">
                        Support: JPG, PNG, PDF (max 10MB)
                      </p>
                    </div>
                    {uploading && (
                      <div className="mt-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // No receipt message for registrars
                  <div className="text-center py-8">
                    <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Receipt Uploaded</h3>
                    <p className="text-gray-500 mb-6">
                      The student has not uploaded a payment receipt yet.
                    </p>
                    
                    {!showRejectionForm ? (
                      <Button
                        variant="destructive"
                        onClick={() => setShowRejectionForm(true)}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject Request
                      </Button>
                    ) : (
                      <div className="max-w-md mx-auto space-y-3">
                        <div>
                          <Label htmlFor="rejection-reason">Rejection Reason</Label>
                          <Textarea
                            id="rejection-reason"
                            placeholder="Please provide a reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleRejectRequest}
                            disabled={!rejectionReason.trim() || processing}
                          >
                            Confirm Rejection
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowRejectionForm(false);
                              setRejectionReason("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReceiptUploadPage;
