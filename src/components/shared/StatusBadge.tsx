
import { Badge } from "../ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'approved':
        return 'status-approved';
      case 'completed':
        return 'status-completed';
      case 'rejected':
        return 'status-rejected';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border border-gray-300 font-medium px-3 py-1 rounded-full text-sm';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300 font-medium px-3 py-1 rounded-full text-sm';
    }
  };

  return (
    <span className={`${getStatusStyles(status)} inline-flex items-center ${className || ''}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-60 mr-2"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
