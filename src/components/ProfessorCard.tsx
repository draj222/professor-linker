import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Book, Award, Mail } from "lucide-react";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  generatedEmail: string;
  recentWork: string;
  matchScore?: {
    total: number;
    breakdown: {
      researchInterests: number;
      citations: number;
      activity: number;
    };
  };
}

interface ProfessorCardProps {
  professor: Professor;
  isSelected: boolean;
  isFlipped: boolean;
  onClick: () => void;
}

export const ProfessorCard = ({ professor, isSelected, isFlipped, onClick }: ProfessorCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div
      className="relative w-full h-64 cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Front of card */}
        <Card
          className={`absolute w-full h-full p-4 backface-hidden bg-blue-900 text-white ${
            isSelected ? 'ring-2 ring-white' : ''
          }`}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-lg">{professor.name}</h4>
              <p className="text-sm text-blue-100">{professor.position}</p>
              <p className="text-sm text-blue-100">{professor.institution}</p>
            </div>

            {professor.matchScore && (
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Match Score</span>
                        <span className="font-medium">{professor.matchScore.total}%</span>
                      </div>
                      <Progress 
                        value={professor.matchScore.total} 
                        className="h-2"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 p-2">
                        <p className="text-xs">Score Breakdown:</p>
                        <div className="flex items-center gap-2">
                          <Book className="h-3 w-3" />
                          <span className="text-xs">Research Match: {professor.matchScore.breakdown.researchInterests}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-3 w-3" />
                          <span className="text-xs">Citations: {professor.matchScore.breakdown.citations}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs">Activity: {professor.matchScore.breakdown.activity}%</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </Card>
        
        {/* Back of card */}
        <Card
          className="absolute w-full h-full p-4 backface-hidden rotate-y-180 bg-blue-800 text-white"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Recent Work</h4>
              <p className="text-sm text-blue-100 line-clamp-4">{professor.recentWork}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Contact</h4>
              <p className="text-sm text-blue-100">{professor.email}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};