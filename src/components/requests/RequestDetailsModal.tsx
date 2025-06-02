
import { DocumentRequest } from "../../services/requestService";
import { Button } from "../ui/button";
import { Upload, X, Loader } from "lucide-react";
import RequestTimeline from "./RequestTimeline";
import StatusBadge from "../shared/StatusBadge";

interface RequestDetailsModalProps {
  request: DocumentRequest;
  onClose: () => void;
  onPayNow: (requestId: string) => void;
  onCancel: (requestId: string) => void;
  canCancel: (request: DocumentRequest) => boolean;
  cancellingRequestId: string | null;
}

const RequestDetailsModal = ({
  request,
  onClose,
  onPayNow,
  onCancel,
  canCancel,
  cancellingRequestId
}: RequestDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{request.documentTypeName}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              &times;
            </Button>
          </div>
          
          <div className="grid gap-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Request ID</p>
                <p className="font-medium">{request.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={request.status} className="mt-1" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="font-medium">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {new Date(request.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purpose</p>
                <p className="font-medium">{request.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Copies</p>
                <p className="font-medium">{request.copies}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fee</p>
                <p className="font-medium">₱{request.fee.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-medium">
                  {request.hasPaid ? "Paid" : "Unpaid"}
                </p>
              </div>
            </div>
            
            {request.additionalDetails && (
              <div>
                <p className="text-sm text-gray-500">Additional Details</p>
                <p className="p-3 bg-gray-50 rounded-md mt-1">
                  {request.additionalDetails}
                </p>
              </div>
            )}
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Request Timeline</p>
              <RequestTimeline 
                requestId={request.id}
                documentType={request.documentTypeName}
                statuses={request.timeline}
                currentStatus={request.status}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              {!request.hasUploadedReceipt && !request.hasPaid && 
               request.status !== 'Cancelled' && request.status !== 'Rejected' && (
                <Button onClick={() => onPayNow(request.id)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              )}
              
              {canCancel(request) && (
                <Button 
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onCancel(request.id)}
                  disabled={cancellingRequestId === request.id}
                >
                  {cancellingRequestId === request.id ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  Cancel Request
                </Button>
              )}
              
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
