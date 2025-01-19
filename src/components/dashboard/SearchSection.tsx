import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Star, StarOff, School } from "lucide-react";
import { useState } from "react";

interface Professor {
  id: string;
  name: string;
  institution: string;
  department: string;
  isFavorite: boolean;
}

interface SearchSectionProps {
  professors: Professor[];
  onToggleFavorite: (id: string) => void;
  onViewProfile: (id: string) => void;
}

export const SearchSection = ({ professors, onToggleFavorite, onViewProfile }: SearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfessors = professors.filter(
    (prof) =>
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6 text-blue-400" />
          Quick Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search professors, universities, or departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-gray-700"
          />
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {filteredProfessors.map((professor) => (
                <div
                  key={professor.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <School className="h-4 w-4 text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-200">
                        {professor.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {professor.institution} • {professor.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-white/10"
                      onClick={() => onToggleFavorite(professor.id)}
                    >
                      {professor.isFavorite ? (
                        <Star className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-white/10"
                      onClick={() => onViewProfile(professor.id)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};