import { useState, useEffect } from "react";
import { UniversitySearch } from "./UniversitySearch";
import { UniversityList } from "./UniversityList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UniversitySelectorProps {
  onComplete?: () => void;
}

export const UniversitySelector = ({ onComplete }: UniversitySelectorProps) => {
  const [universities, setUniversities] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const generateUniversities = async () => {
      const fieldOfInterest = localStorage.getItem("fieldOfInterest");
      const educationLevel = localStorage.getItem("educationLevel");
      const numberOfUniversities = parseInt(localStorage.getItem("numberOfUniversities") || "6");
      
      if (!fieldOfInterest) {
        toast({
          title: "Missing Information",
          description: "Please complete your profile first",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        console.log("Generating universities with field:", fieldOfInterest, "count:", numberOfUniversities);
        const { data, error } = await supabase.functions.invoke('getuniversities', {
          body: { 
            fieldOfInterest,
            educationLevel,
            numberOfUniversities
          }
        });

        if (error) throw error;

        console.log("Generated universities:", data);
        setUniversities(data);
        
        toast({
          title: "Universities Found!",
          description: `Found ${data.length} universities matching your interests`,
        });
      } catch (error) {
        console.error("Error generating universities:", error);
        toast({
          title: "Error",
          description: "Failed to generate university suggestions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateUniversities();
  }, [toast, navigate]);

  const handleComplete = async () => {
    if (favorites.length === 0) {
      toast({
        title: "No Universities Selected",
        description: "Please favorite at least one university before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save favorites to user's account if they're logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        for (const universityId of favorites) {
          await supabase
            .from('user_favorite_universities')
            .upsert({ 
              user_id: user.id,
              university_id: universityId
            });
        }
      }

      navigate('/generating');
    } catch (error) {
      console.error('Error saving favorites:', error);
      toast({
        title: "Error",
        description: "Failed to save your selections. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
        <p className="text-lg text-muted-foreground">Generating university suggestions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl -z-10" />
        <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-foreground">
            <Sparkles className="h-6 w-6 text-[#9b87f5]" />
            Suggested Universities
          </h2>
          <p className="text-muted-foreground">
            Based on your academic interests and goals, we've found these universities that might be a great fit.
          </p>
        </Card>
      </div>

      <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          {universities.length > 0 ? "Recommended Universities" : "No Universities Found"}
        </h3>
        
        <UniversityList
          universities={universities}
          onFavorite={(universityId) => {
            setFavorites(prev => 
              prev.includes(universityId)
                ? prev.filter(id => id !== universityId)
                : [...prev, universityId]
            );
          }}
          favorites={favorites}
          matchedUniversities={universities}
        />
      </Card>
      
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleComplete}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-8 py-2 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={favorites.length === 0}
        >
          Continue to Professor Search
        </Button>
      </div>
    </div>
  );
};