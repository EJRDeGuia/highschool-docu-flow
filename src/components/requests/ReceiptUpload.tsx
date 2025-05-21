
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader, Upload, FileCheck } from "lucide-react";

const ReceiptUpload = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a receipt image to upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      
      // Simulate processing
      setTimeout(() => {
        navigate("/dashboard/my-requests");
      }, 2000);
      
    } catch (error) {
      console.error("Error uploading receipt:", error);
      
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Payment Receipt</CardTitle>
        <CardDescription>
          Please upload a screenshot or photo of your payment receipt to confirm your transaction.
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
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
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
