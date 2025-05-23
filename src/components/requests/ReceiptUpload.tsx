
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader, Upload, FileCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { markReceiptUploaded } from "../../services/requestService";

interface ReceiptUploadProps {
  requestId: string | null;
}

const ReceiptUpload = ({ requestId }: ReceiptUploadProps) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate all required data is present
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a receipt image to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload a receipt",
        variant: "destructive"
      });
      return;
    }
    
    if (!requestId) {
      setError("No request ID provided. Please go back and try again.");
      toast({
        title: "Error",
        description: "No request ID provided. Please try again from My Requests page.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log("Starting upload for requestId:", requestId);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${requestId}.${fileExt}`;
      
      console.log("Uploading to receipts bucket with filename:", fileName);
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`Storage upload failed: ${error.message}`);
      }
      
      console.log("Upload successful:", data);
      
      // Mark receipt as uploaded in the database
      const updatedRequest = await markReceiptUploaded(requestId);
      
      if (!updatedRequest) {
        throw new Error("Failed to update request status. The file was uploaded but request status was not updated.");
      }
      
      // Add notification
      addNotification({
        title: "Receipt Uploaded",
        message: "Your payment receipt has been uploaded successfully.",
        type: "success",
      });
      
      // Show success message
      toast({
        title: "Upload Successful",
        description: "Your receipt has been uploaded successfully",
      });
      
      setUploadComplete(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard/my-requests");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      
      setError(error.message || "Upload failed");
      
      toast({
        title: "Upload Failed",
        description: `There was an error uploading your receipt: ${error.message || "Unknown error"}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error Uploading Receipt</CardTitle>
          <CardDescription>
            We encountered a problem with your receipt upload.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-100 rounded-md p-4 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div>
              <h4 className="font-medium text-red-800">Upload Failed</h4>
              <p className="text-red-700 text-sm">
                {error}
              </p>
              <p className="text-red-700 text-sm mt-2">
                Please go back to your requests and try again.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/dashboard/my-requests")}
          >
            Return to My Requests
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Payment Receipt</CardTitle>
        <CardDescription>
          Please upload a screenshot or photo of your payment receipt to confirm your transaction.
          {requestId && <span className="block text-xs mt-1 text-gray-500">Request ID: {requestId}</span>}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="receipt">Receipt Image</Label>
            <div className="flex items-center gap-3">
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading || uploadComplete}
                className="cursor-pointer"
              />
            </div>
          </div>
          
          {preview && (
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="w-full h-auto max-h-[300px] object-contain bg-gray-50"
                />
              </div>
            </div>
          )}
          
          {uploadComplete && (
            <div className="bg-green-50 border border-green-100 rounded-md p-4 flex items-center gap-3">
              <FileCheck className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-medium text-green-800">Upload Complete</h4>
                <p className="text-green-700 text-sm">
                  Your receipt has been uploaded successfully. Redirecting to your requests...
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate("/dashboard/my-requests")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={!file || isUploading || uploadComplete}
          >
            {isUploading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : uploadComplete ? (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Uploaded Successfully
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Receipt
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReceiptUpload;
