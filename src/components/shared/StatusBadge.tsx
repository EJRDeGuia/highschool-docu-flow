
import React from 'react';
import { Badge } from "../ui/badge";
import { Clock, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "Pending" | "Processing" | "Approved" | "Rejected" | "Completed" | "Cancelled";

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
      case "Cancelled":
        return <X className="h-3.5 w-3.5" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5" />;
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 py-1.5 px-2.5 font-medium text-xs rounded-full",
        status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "",
        status === "Processing" ? "bg-blue-50 text-blue-700 border-blue-200" : "",
        status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "",
        status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : "",
        status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : "",
        status === "Cancelled" ? "bg-gray-50 text-gray-700 border-gray-200" : "",
        className
      )}
    >
      {getStatusIcon()} {status}
    </Badge>
  );
};

export default StatusBadge;
