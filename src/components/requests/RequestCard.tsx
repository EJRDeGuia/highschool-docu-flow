
import { DocumentRequest } from "../../services/requestService";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Upload, X, Loader } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";

interface RequestCardProps {
  request: DocumentRequest;
  onSelect: (request: DocumentRequest) => void;
  onPayNow: (requestId: string, event?: React.MouseEvent) => void;
  onCancel: (requestId: string, event?: React.MouseEvent) => void;
  canCancel: (request: DocumentRequest) => boolean;
  cancellingRequestId: string | null;
}

const RequestCard = ({ 
  request, 
  onSelect, 
  onPayNow, 
  onCancel, 
  canCancel, 
  cancellingRequestId 
}: RequestCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:border-blue-500 transition-colors"
      onClick={() => onSelect(request)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg">{request.documentTypeName}</p>
            <p className="text-sm text-gray-500">
              Request ID: {request.id}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(request.createdAt).toLocaleDateString()} - {request.purpose}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={request.status} />
            
            <div className="flex gap-2">
              {!request.hasUploadedReceipt && !request.hasPaid && 
               request.status !== 'Cancelled' && request.status !== 'Rejected' && (
                <Button size="sm" variant="outline" className="text-xs h-7" onClick={(e) => onPayNow(request.id, e)}>
                  <Upload className="mr-1 h-3 w-3" />
                  Pay Now
                </Button>
              )}
              
              {canCancel(request) && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50" 
                  onClick={(e) => onCancel(request.id, e)}
                  disabled={cancellingRequestId === request.id}
                >
                  {cancellingRequestId === request.id ? (
                    <Loader className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <X className="mr-1 h-3 w-3" />
                  )}
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
