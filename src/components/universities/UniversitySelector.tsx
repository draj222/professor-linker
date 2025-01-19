import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UniversitySearch } from "./UniversitySearch";
import { UniversityList } from "./UniversityList";
import { useToast } from "@/components/ui/use-toast";

export const UniversitySelector = () => {
  const [universities, setUniversities] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUniversities();
    fetchFavorites();
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

  if (loading) {
    return <div className="text-center mt-8">Loading universities...</div>;
  }

  return (
    <div className="space-y-6">
      <UniversitySearch onSearch={handleSearch} onFilterChange={handleFilterChange} />
      <UniversityList
        universities={universities}
        onFavorite={handleFavorite}
        favorites={favorites}
      />
    </div>
  );
};