import { useState } from "react";
import { UniversitySearch } from "./UniversitySearch";
import { UniversityList } from "./UniversityList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface UniversitySelectorProps {
  onComplete?: () => void;
}

export const UniversitySelector = ({ onComplete }: UniversitySelectorProps) => {
  const [universities, setUniversities] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Search Universities
        </h2>
        <p className="text-sm text-muted-foreground">
          Search for universities by name or field of study. Select your favorites to proceed.
        </p>
      </div>

      <UniversitySearch onResults={setUniversities} />

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">
          {universities.length > 0 ? "Found Universities" : "Search Results"}
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