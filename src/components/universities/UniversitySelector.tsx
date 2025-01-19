import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UniversityList } from "./UniversityList";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UniversitySelectorProps {
  onComplete?: () => void;
}

export const UniversitySelector = ({ onComplete }: UniversitySelectorProps) => {
  const [universities, setUniversities] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedUniversities, setMatchedUniversities] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    matchUniversities();
    fetchFavorites();
  }, []);

  const matchUniversities = async () => {
    try {
      const fieldOfInterest = localStorage.getItem("fieldOfInterest") || "";
      const userName = localStorage.getItem("userName") || "";
      const educationLevel = localStorage.getItem("educationLevel") || "";
      const researchExperience = localStorage.getItem("researchExperience") || "";
      const academicGoals = localStorage.getItem("academicGoals") || "";

      console.log("Matching universities with profile:", {
        fieldOfInterest,
        educationLevel,
        researchExperience,
        academicGoals
      });

      // Get AI-generated university matches using the Edge Function
      const { data: aiMatches, error: aiError } = await supabase.functions.invoke('match-universities', {
        body: {
          fieldOfInterest,
          educationLevel,
          researchExperience,
          academicGoals
        }
      });

      if (aiError) throw aiError;

      console.log("AI-generated matches:", aiMatches);

      if (!aiMatches || aiMatches.length === 0) {
        toast({
          title: "No Matches Found",
          description: "We couldn't find universities matching your profile. Please try adjusting your interests.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Sort matches by score
      const sortedMatches = aiMatches.sort((a, b) => b.matchScore - a.matchScore);
      
      setMatchedUniversities(sortedMatches);
      setUniversities(sortedMatches);

      // Automatically favorite top matches if no favorites exist
      if (favorites.length === 0) {
        const topMatches = sortedMatches.slice(0, 3).map(uni => uni.id);
        await handleBatchFavorite(topMatches);
      }

      toast({
        title: "Universities Matched!",
        description: `Found ${sortedMatches.length} universities matching your academic profile`,
      });

    } catch (error) {
      console.error("Error matching universities:", error);
      toast({
        title: "Error",
        description: "Failed to match universities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchFavorite = async (universityIds: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save favorites.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("user_favorite_universities")
        .insert(universityIds.map(id => ({
          user_id: user.id,
          university_id: id
        })));

      if (error) throw error;
      setFavorites(universityIds);
      
      toast({
        title: "Universities Matched",
        description: "We've selected the best matches for your interests!",
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_favorite_universities")
        .select("university_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.university_id) || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleFilterChange = async ({ value }: { value: string }) => {
    setLoading(true);
    try {
      // Filter the existing matched universities instead of fetching new ones
      const filtered = matchedUniversities.filter(uni => {
        if (value === "high_match") return uni.matchScore >= 80;
        if (value === "medium_match") return uni.matchScore >= 50 && uni.matchScore < 80;
        if (value === "low_match") return uni.matchScore < 50;
        return true;
      });

      setUniversities(filtered);
    } catch (error) {
      console.error("Error filtering universities:", error);
      toast({
        title: "Error",
        description: "Failed to filter universities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (universityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save favorites.",
          variant: "destructive",
        });
        return;
      }

      if (favorites.includes(universityId)) {
        // Remove from favorites
        const { error } = await supabase
          .from("user_favorite_universities")
          .delete()
          .eq("user_id", user.id)
          .eq("university_id", universityId);

        if (error) throw error;
        setFavorites(favorites.filter(id => id !== universityId));
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("user_favorite_universities")
          .insert([{ user_id: user.id, university_id: universityId }]);

        if (error) throw error;
        setFavorites([...favorites, universityId]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    if (favorites.length === 0) {
      toast({
        title: "No Universities Selected",
        description: "Please favorite at least one university before continuing.",
        variant: "destructive",
      });
      return;
    }
    onComplete?.();
  };

  if (loading) {
    return (
      <div className="text-center mt-8 space-y-4">
        <Sparkles className="animate-spin h-8 w-8 text-primary mx-auto" />
        <div className="text-lg text-muted-foreground">Analyzing your profile and finding the best university matches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Matched Universities
        </h2>
        <p className="text-sm text-muted-foreground">
          Based on your academic profile and interests in {localStorage.getItem("fieldOfInterest")}, 
          we've used AI to find the best matching universities. Use the filter below to refine the matches.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Select onValueChange={(value) => handleFilterChange({ value })}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
            <SelectValue placeholder="Filter by match" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Matches</SelectItem>
            <SelectItem value="high_match">High Match (80%+)</SelectItem>
            <SelectItem value="medium_match">Medium Match (50-79%)</SelectItem>
            <SelectItem value="low_match">Low Match (Below 50%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <UniversityList
        universities={universities}
        onFavorite={handleFavorite}
        favorites={favorites}
        matchedUniversities={matchedUniversities}
      />
      
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleComplete}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 text-lg"
          disabled={favorites.length === 0}
        >
          Continue to Professor Search
        </Button>
      </div>
    </div>
  );
};
