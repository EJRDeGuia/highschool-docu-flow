
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ReceiptUpload from "../components/requests/ReceiptUpload";
import { getRequestById } from "../services/requestService";
import { DocumentRequest } from "../services/requestService";
import { Loader } from "lucide-react";

const ReceiptUploadPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const requestId = searchParams.get("requestId");

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "No request ID provided. Please try again.",
          variant: "destructive",
        });
        
        // Redirect back to my requests after a short delay
        setTimeout(() => {
          navigate("/dashboard/my-requests");
        }, 3000);
        
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
          toast({
            title: "Error",
            description: "Request not found",
            variant: "destructive",
          });
          
          // Redirect back to my requests after a short delay
          setTimeout(() => {
            navigate("/dashboard/my-requests");
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching request:", error);
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
