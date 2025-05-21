
import React from 'react';
import { Badge } from "../ui/badge";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

type StatusType = "Pending" | "Processing" | "Approved" | "Rejected" | "Completed";

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Processing":
        return <Clock className="h-4 w-4" />;
      case "Approved":
      case "Completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Badge
      variant="outline"
      className={`
        flex items-center gap-1.5
        ${status === "Pending" ? "status-pending" : ""}
        ${status === "Processing" ? "status-processing" : ""}
        ${status === "Approved" ? "status-approved" : ""}
        ${status === "Rejected" ? "status-rejected" : ""}
        ${status === "Completed" ? "status-completed" : ""}
      `}
    >
      {getStatusIcon()} {status}
    </Badge>
  );
};

export default StatusBadge;
