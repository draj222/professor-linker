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
        console.log("Generating universities with field:", fieldOfInterest);
        const { data, error } = await supabase.functions.invoke('getuniversities', {
          body: { 
            fieldOfInterest,
            educationLevel,
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

  const handleComplete = () => {
    if (favorites.length === 0) {
      toast({
        title: "No Universities Selected",
        description: "Please favorite at least one university before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    // Save favorites to user's account if they're logged in
    const saveUserFavorites = async () => {
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
    };

    saveUserFavorites();
    onComplete?.();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Generating university suggestions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Suggested Universities
        </h2>
        <p className="text-sm text-muted-foreground">
          Based on your academic interests and goals, we've found these universities that might be a great fit.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 text-lg"
          disabled={favorites.length === 0}
        >
          Continue to Professor Search
        </Button>
      </div>
    </div>
  );
};