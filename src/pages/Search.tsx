
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  FilePen,
  Loader,
  Search as SearchIcon
} from "lucide-react";
import { DocumentRequest, searchRequests } from "../services/requestService";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DocumentRequest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Extract query from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const searchResults = await searchRequests(query);
      setResults(searchResults);
    } catch (error) {
      console.error("Error searching requests:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    
    // Update URL for shareable searches
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
      navigate(`/dashboard/search?${params.toString()}`);
    } else {
      navigate("/dashboard/search");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Requests</h1>
        <p className="text-gray-600">
          Search for document requests by ID, type, purpose, or status
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SearchIcon className="mr-2 h-4 w-4" />
            )}
            Search
          </Button>
        </div>
      </form>

      {isSearching ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-school-primary" />
        </div>
      ) : results.length > 0 ? (
        <div>
          <h2 className="text-lg font-medium mb-4">
            Found {results.length} result{results.length !== 1 && 's'} for "{searchQuery}"
          </h2>
          
          <div className="space-y-4">
            {results.map((request) => (
              <Card 
                key={request.id} 
                className="cursor-pointer hover:border-school-primary transition-colors"
                onClick={() => {
                  // Could navigate to a detail view or open a modal
                  navigate(`/dashboard/manage-requests?id=${request.id}`);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">{request.documentTypeName}</p>
                        <Badge
                          variant="outline"
                          className={`
                            ${request.status === "Pending" ? "status-pending" : ""}
                            ${request.status === "Processing" ? "status-pending" : ""}
                            ${request.status === "Approved" ? "status-approved" : ""}
                            ${request.status === "Rejected" ? "status-rejected" : ""}
                            ${request.status === "Completed" ? "status-approved" : ""}
                          `}
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Request ID: {request.id}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(request.createdAt).toLocaleDateString()} - {request.purpose}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Student ID: {request.userId}</p>
                      <p className="text-xs text-gray-500">
                        {request.hasPaid ? "Payment Verified" : "Payment Pending"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-gray-500">
            No document requests match your search for "{searchQuery}"
          </p>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default Search;
