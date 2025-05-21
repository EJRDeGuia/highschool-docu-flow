
import React from 'react';
import { Badge } from "../ui/badge";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "Pending" | "Processing" | "Approved" | "Rejected" | "Completed";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "Pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "Processing":
        return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
      case "Approved":
      case "Completed":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "Rejected":
        return <AlertCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 py-1.5 px-2.5 font-medium text-xs rounded-full",
        status === "Pending" ? "status-pending" : "",
        status === "Processing" ? "status-processing" : "",
        status === "Approved" ? "status-approved" : "",
        status === "Rejected" ? "status-rejected" : "",
        status === "Completed" ? "status-completed" : "",
        className
      )}
    >
      {getStatusIcon()} {status}
    </Badge>
  );
};

export default StatusBadge;
