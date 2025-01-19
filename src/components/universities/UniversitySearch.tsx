import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UniversitySearchProps {
  onResults: (universities: any[]) => void;
}

export const UniversitySearch = ({ onResults }: UniversitySearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Enter a field of study or research area to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Generating universities with query:", searchQuery);
      
      const { data, error } = await supabase.functions.invoke('getuniversities', {
        body: { fieldOfInterest: searchQuery }
      });

      if (error) {
        throw error;
      }

      console.log("Generated universities:", data);
      
      if (!data || data.length === 0) {
        toast({
          title: "No universities found",
          description: "Try adjusting your search terms",
        });
        onResults([]);
        return;
      }

      onResults(data);
      
      toast({
        title: "Universities found!",
        description: `Found ${data.length} universities matching your search`,
      });

    } catch (error) {
      console.error("Error generating universities:", error);
      toast({
        title: "Error",
        description: "Failed to generate university suggestions. Please try again.",
        variant: "destructive",
      });
      onResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter a field of study (e.g., Computer Science, Biology)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
};