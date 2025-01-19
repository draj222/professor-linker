import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface University {
  id: string;
  name: string;
  country: string;
  region: string;
  ranking?: number;
  academic_focus?: string[];
  research_funding_level?: string;
  faculty_size?: number;
}

export const UniversityList = ({
  universities,
  onFavorite,
  favorites,
}: {
  universities: University[];
  onFavorite: (id: string) => void;
  favorites: string[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {universities.map((university) => (
        <Card key={university.id} className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg text-foreground">{university.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {university.country} • {university.region}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFavorite(university.id)}
                className={favorites.includes(university.id) ? "text-red-500" : "text-muted-foreground"}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {university.ranking && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Rank #{university.ranking}</Badge>
              </div>
            )}
            {university.academic_focus && (
              <div className="flex flex-wrap gap-1">
                {university.academic_focus.map((focus) => (
                  <Badge key={focus} variant="outline">
                    {focus}
                  </Badge>
                ))}
              </div>
            )}
            {university.faculty_size && (
              <p className="text-sm text-muted-foreground">
                Faculty Size: {university.faculty_size}
              </p>
            )}
            {university.research_funding_level && (
              <p className="text-sm text-muted-foreground">
                Research Funding: {university.research_funding_level}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};