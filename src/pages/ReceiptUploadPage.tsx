
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ReceiptUpload from "../components/requests/ReceiptUpload";
import { getRequestById } from "../services/requestService";
import { DocumentRequest } from "../services/requestService";

const ReceiptUploadPage = () => {
  const [searchParams] = useSearchParams();
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
          description: "No request ID provided",
          variant: "destructive",
        });
        return;
      }

      try {
        const requestData = await getRequestById(requestId);
        if (requestData) {
          setRequest(requestData);
        } else {
          toast({
            title: "Error",
            description: "Request not found",
            variant: "destructive",
          });
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
  }, [requestId, toast]);

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
