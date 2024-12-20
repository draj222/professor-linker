import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ProfessorCard } from "./ProfessorCard";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  generatedEmail: string;
  recentWork: string;
}

interface ProfessorListProps {
  professors: Professor[];
  selectedProfessor: Professor | null;
  flippedCard: number | null;
  onProfessorSelect: (professor: Professor, index: number) => void;
}

export const ProfessorList = ({
  professors,
  selectedProfessor,
  flippedCard,
  onProfessorSelect,
}: ProfessorListProps) => {
  return (
    <Card className="glass-panel p-6 h-[600px]">
      <h3 className="text-xl font-semibold mb-4">Found Professors</h3>
      <ScrollArea className="h-[520px] pr-4">
        <div className="space-y-4">
          {professors.map((professor, index) => (
            <ProfessorCard
              key={index}
              professor={professor}
              isSelected={selectedProfessor === professor}
              isFlipped={flippedCard === index}
              onClick={() => onProfessorSelect(professor, index)}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};