
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface RequestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: () => void;
}

const RequestFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onSortOrderChange
}: RequestFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search requests..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={onSortOrderChange}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </Button>
      </div>
    </div>
  );
};

export default RequestFilters;
