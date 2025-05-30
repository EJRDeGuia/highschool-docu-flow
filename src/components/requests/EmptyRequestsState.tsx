
import { FilePlus } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyRequestsStateProps {
  searchQuery: string;
  statusFilter: string;
  onNewRequest: () => void;
}

const EmptyRequestsState = ({ searchQuery, statusFilter, onNewRequest }: EmptyRequestsStateProps) => {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FilePlus className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No requests found</h3>
      <p className="text-gray-500 mb-6">
        {searchQuery || statusFilter !== "all"
          ? "Try adjusting your search or filters"
          : "You haven't made any document requests yet"}
      </p>
      <Button onClick={onNewRequest}>
        <FilePlus className="mr-2 h-4 w-4" />
        Create New Request
      </Button>
    </div>
  );
};

export default EmptyRequestsState;
