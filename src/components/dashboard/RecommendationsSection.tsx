import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Star, Mail } from "lucide-react";

interface Professor {
  id: string;
  name: string;
  institution: string;
  matchScore: number;
}

interface RecommendationsSectionProps {
  recommendations: Professor[];
}

export const RecommendationsSection = ({ recommendations }: RecommendationsSectionProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
      <CardHeader>
        <CardTitle>Recommended Professors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((professor) => (
            <div
              key={professor.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div>
                <h4 className="font-medium text-white">{professor.name}</h4>
                <p className="text-sm text-gray-400">{professor.institution}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-400">{professor.matchScore}% Match</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  onClick={() => navigate(`/professor/${professor.id}`)}
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate(`/email/${professor.id}`)}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};