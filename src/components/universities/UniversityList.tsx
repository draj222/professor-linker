import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface University {
  id: string;
  name: string;
  country: string;
  ranking?: number;
  academic_focus?: string[];
  research_funding_level?: string;
  matchScore?: number;
}

interface UniversityListProps {
  universities: University[];
  onFavorite: (id: string) => void;
  favorites: string[];
  matchedUniversities: University[];
}

export const UniversityList = ({ 
  universities, 
  onFavorite, 
  favorites,
  matchedUniversities 
}: UniversityListProps) => {
  const getMatchScore = (universityId: string) => {
    const matched = matchedUniversities.find(u => u.id === universityId);
    return matched?.matchScore || 0;
  };

  if (!universities.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No universities found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {universities.map((university) => (
        <Card key={university.id} className="p-4 bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{university.name}</h3>
              <p className="text-sm text-muted-foreground">{university.country}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFavorite(university.id)}
              className={favorites.includes(university.id) ? "text-yellow-500" : "text-muted-foreground"}
            >
              <Star className="h-5 w-5" fill={favorites.includes(university.id) ? "currentColor" : "none"} />
            </Button>
          </div>
          
          <div className="space-y-2">
            {university.ranking && (
              <p className="text-sm">
                <span className="text-muted-foreground">Ranking:</span> #{university.ranking}
              </p>
            )}
            {university.academic_focus && (
              <p className="text-sm">
                <span className="text-muted-foreground">Focus:</span>{" "}
                {university.academic_focus.join(", ")}
              </p>
            )}
            {university.research_funding_level && (
              <p className="text-sm">
                <span className="text-muted-foreground">Research Funding:</span>{" "}
                {university.research_funding_level.charAt(0).toUpperCase() + 
                 university.research_funding_level.slice(1)}
              </p>
            )}
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Match Score:</span>
                <span className="text-sm font-medium">
                  {getMatchScore(university.id)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${getMatchScore(university.id)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};