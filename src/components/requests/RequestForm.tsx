import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createRequest } from "../../services/requestService";
const formSchema = z.object({
  documentType: z.string({
    required_error: "Please select a document type."
  }),
  purpose: z.string().min(5, {
    message: "Purpose must be at least 5 characters."
  }),
  additionalDetails: z.string().optional(),
  copies: z.coerce.number().min(1, {
    message: "Number of copies must be at least 1."
  })
});
const RequestForm = () => {
  const {
    user
  } = useAuth();
  const {
    addNotification
  } = useNotifications();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [documentTypes, setDocumentTypes] = useState<{
    id: string;
    name: string;
    fee: number;
  }[]>([]);

  // Fetch document types from database
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      const {
        data,
        error
      } = await supabase.from('document_types').select('id, name, base_fee');
      if (error) {
        console.error('Error fetching document types:', error);
        toast({
          title: "Error",
          description: "Failed to load document types. Please try again.",
          variant: "destructive"
        });
        return;
      }
      if (data) {
        setDocumentTypes(data.map(doc => ({
          id: doc.id,
          name: doc.name,
          fee: doc.base_fee
        })));
      }
    };
    fetchDocumentTypes();
  }, [toast]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      purpose: "",
      additionalDetails: "",
      copies: 1
    }
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a request.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Find the selected document to get its fee and name
      const docType = documentTypes.find(doc => doc.id === values.documentType);
      if (!docType) {
        throw new Error("Invalid document type selected");
      }
      setSelectedDocument(docType);

      // Create the request in the database
      const newRequest = await createRequest(user.id, values.documentType, docType.name, values.purpose, values.copies, values.additionalDetails, docType.fee * values.copies);

      // Add notification
      addNotification({
        title: "Request Submitted",
        message: `Your ${docType.name} request has been submitted successfully.`,
        type: "success"
      });
      toast({
        title: "Request Submitted",
        description: "Your document request has been submitted successfully"
      });

      // Show payment modal
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const calculateTotalFee = () => {
    const docType = documentTypes.find(doc => doc.id === form.watch("documentType"));
    const copies = form.watch("copies") || 1;
    if (docType) {
      return docType.fee * copies;
    }
    return 0;
  };
  return <>
      <Card>
        <CardHeader>
          <CardTitle>Document Request Form</CardTitle>
          <CardDescription>
            Fill out the form below to request a document from the registrar's office.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="documentType" render={({
              field
            }) => <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={value => {
                field.onChange(value);
                // Automatically set the document type when selected
                const docType = documentTypes.find(doc => doc.id === value);
                if (docType) {
                  setSelectedDocument(docType);
                }
              }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypes.map(doc => <SelectItem key={doc.id} value={doc.id}>
                            {doc.name} - ₱{doc.fee.toFixed(2)}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="copies" render={({
              field
            }) => <FormItem>
                    <FormLabel>Number of Copies</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="purpose" render={({
              field
            }) => <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., College application, employment, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="additionalDetails" render={({
              field
            }) => <FormItem>
                    <FormLabel>Additional Details (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any specific requirements or details about your request." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              {form.watch("documentType") && <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-800">Fee Summary</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Document Fee:</span>
                      <span>
                        ₱{selectedDocument?.fee.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of Copies:</span>
                      <span>
                        {form.watch("copies") || "1"}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between font-medium">
                      <span>Total Fee:</span>
                      <span>₱{calculateTotalFee().toFixed(2)}</span>
                    </div>
                  </div>
                </div>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Request
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {showPaymentModal && selectedDocument && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Payment Required</CardTitle>
              <CardDescription>
                Please pay the fee to proceed with your request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800">Payment Details</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Document:</span>
                    <span>{selectedDocument.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Copies:</span>
                    <span>{form.getValues("copies")}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>₱{calculateTotalFee().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-center mb-4">Scan the QR code below to pay via InstaPay</p>
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  {/* Real InstaPay QR code */}
                  <img src="/lovable-uploads/3b093e83-c96b-4906-b53b-a048b47c09df.png" alt="InstaPay QR code" className="w-48 h-48 object-contain" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Reference No: REQ-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              
              <Button variant="outline" className="w-full" onClick={() => setShowPaymentModal(false)}>Close</Button>
            </CardFooter>
          </Card>
        </div>}
    </>;
};
export default RequestForm;