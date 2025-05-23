
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ReceiptUpload from "../components/requests/ReceiptUpload";
import { getRequestById } from "../services/requestService";
import { DocumentRequest } from "../services/requestService";
import { AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReceiptUploadPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const requestId = searchParams.get("requestId");

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
        if (requestData) {
          console.log("Request data fetched:", requestData);
          setRequest(requestData);
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
  }, [requestId, toast, navigate]);

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
