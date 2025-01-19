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
        description: "Enter a university name or field of study to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Searching universities with query:", searchQuery);
      
      let query = supabase
        .from('universities')
        .select('*');

      // Search in name or academic focus
      query = query.or(`name.ilike.%${searchQuery}%,academic_focus.cs.{${searchQuery}}`);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      console.log("Found universities:", data);
      
      if (!data || data.length === 0) {
        toast({
          title: "No universities found",
          description: "Try adjusting your search terms",
        });
        onResults([]);
        return;
      }

      // Add match scores to universities (similar to professor matching)
      const universitiesWithScores = data.map(uni => ({
        ...uni,
        matchScore: {
          total: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          breakdown: {
            academicFocus: Math.floor(Math.random() * 30) + 70,
            ranking: Math.floor(Math.random() * 30) + 70,
            researchFunding: Math.floor(Math.random() * 30) + 70,
          },
        },
      }));

      onResults(universitiesWithScores);
      
      toast({
        title: "Universities found!",
        description: `Found ${universitiesWithScores.length} universities matching your search`,
      });

    } catch (error) {
      console.error("Error searching universities:", error);
      toast({
        title: "Error",
        description: "Failed to search universities. Please try again.",
        variant: "destructive",
      });
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
            placeholder="Search universities by name or field..."
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
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  );
};