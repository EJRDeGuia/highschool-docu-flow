
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export interface RequestStatus {
  id: string;
  step: string;
  status: "completed" | "current" | "pending";
  date?: string;
  note?: string;
}

interface RequestTimelineProps {
  requestId: string;
  documentType: string;
  statuses: RequestStatus[];
  currentStatus: string;
}

const RequestTimeline = ({ 
  requestId, 
  documentType, 
  statuses, 
  currentStatus 
}: RequestTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Request #{requestId}</CardTitle>
            <CardDescription>{documentType}</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`
              ${currentStatus === "Pending" ? "status-pending" : ""}
              ${currentStatus === "Processing" ? "status-pending" : ""}
              ${currentStatus === "Approved" ? "status-approved" : ""}
              ${currentStatus === "Rejected" ? "status-rejected" : ""}
              ${currentStatus === "Completed" ? "status-approved" : ""}
            `}
          >
            {currentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-gray-200 ml-3 space-y-6">
          {statuses.map((status, index) => (
            <li key={status.id} className="ml-6">
              <span 
                className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white
                  ${status.status === "completed" ? "bg-school-success" : ""}
                  ${status.status === "current" ? "bg-school-warning" : ""}
                  ${status.status === "pending" ? "bg-gray-300" : ""}
                `}
              >
                {status.status === "completed" && (
                  <svg 
                    className="w-2.5 h-2.5 text-white" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 16 12"
                  >
                    <path 
                      stroke="currentColor" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M1 5.917 5.724 10.5 15 1.5" 
                    />
                  </svg>
                )}
                {status.status === "current" && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </span>
              <h3 className={`font-medium ${status.status === "completed" ? "text-gray-900" : status.status === "current" ? "text-school-warning" : "text-gray-400"}`}>
                {status.step}
              </h3>
              {status.date && (
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                  {status.date}
                </time>
              )}
              {status.note && (
                <p className="text-sm font-normal text-gray-500">
                  {status.note}
                </p>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default RequestTimeline;
