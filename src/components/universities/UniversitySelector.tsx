import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UniversitySearch } from "./UniversitySearch";
import { UniversityList } from "./UniversityList";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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
    fetchUniversities();
    fetchFavorites();
    matchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .order("ranking", { ascending: true });

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error("Error fetching universities:", error);
      toast({
        title: "Error",
        description: "Failed to load universities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const matchUniversities = async () => {
    try {
      const fieldOfInterest = localStorage.getItem("fieldOfInterest")?.toLowerCase() || "";
      console.log("Matching universities for field:", fieldOfInterest);

      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .order("ranking", { ascending: true });

      if (error) throw error;

      // Calculate match score for each university
      const matchedResults = (data || []).map(university => {
        let matchScore = 0;
        
        // Match based on academic focus
        if (university.academic_focus?.some(focus => 
          focus.toLowerCase().includes(fieldOfInterest) || 
          fieldOfInterest.includes(focus.toLowerCase())
        )) {
          matchScore += 50;
        }

        // Bonus points for research funding level
        if (university.research_funding_level === "high") {
          matchScore += 20;
        } else if (university.research_funding_level === "medium") {
          matchScore += 10;
        }

        // Bonus points for ranking
        if (university.ranking && university.ranking <= 50) {
          matchScore += 30;
        } else if (university.ranking && university.ranking <= 100) {
          matchScore += 20;
        }

        return {
          ...university,
          matchScore
        };
      });

      // Sort by match score
      const sortedMatches = matchedResults.sort((a, b) => b.matchScore - a.matchScore);
      setMatchedUniversities(sortedMatches);
      setUniversities(sortedMatches);

      // Automatically favorite top matches if no favorites exist
      if (favorites.length === 0) {
        const topMatches = sortedMatches.slice(0, 3).map(uni => uni.id);
        await handleBatchFavorite(topMatches);
      }

    } catch (error) {
      console.error("Error matching universities:", error);
      toast({
        title: "Error",
        description: "Failed to match universities. Please try again.",
        variant: "destructive",
      });
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

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .ilike("name", `%${query}%`)
        .order("ranking", { ascending: true });

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error("Error searching universities:", error);
      toast({
        title: "Error",
        description: "Failed to search universities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async ({ type, value }: { type: string; value: string }) => {
    setLoading(true);
    try {
      let query = supabase.from("universities").select("*");

      switch (type) {
        case "region":
          query = query.eq("region", value);
          break;
        case "focus":
          query = query.contains("academic_focus", [value]);
          break;
        case "funding":
          query = query.eq("research_funding_level", value);
          break;
      }

      const { data, error } = await query.order("ranking", { ascending: true });

      if (error) throw error;
      setUniversities(data || []);
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
        <div className="text-lg text-muted-foreground">Matching universities to your interests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Matched Universities
        </h2>
        <p className="text-sm text-muted-foreground">
          Based on your interests in {localStorage.getItem("fieldOfInterest")}, 
          we've automatically selected the best matching universities. 
          You can adjust these selections using the filters below.
        </p>
      </div>

      <UniversitySearch onSearch={handleSearch} onFilterChange={handleFilterChange} />
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