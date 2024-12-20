import { Card } from "@/components/ui/card";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  generatedEmail: string;
  recentWork: string;
}

interface ProfessorCardProps {
  professor: Professor;
  isSelected: boolean;
  isFlipped: boolean;
  onClick: () => void;
}

export const ProfessorCard = ({ professor, isSelected, isFlipped, onClick }: ProfessorCardProps) => {
  return (
    <div
      className="relative w-full h-48 cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Front of card */}
        <Card
          className={`absolute w-full h-full p-4 backface-hidden bg-sky-500 text-white ${
            isSelected ? 'ring-2 ring-white' : ''
          }`}
        >
          <h4 className="font-medium">{professor.name}</h4>
          <p className="text-sm text-sky-100">{professor.position}</p>
          <p className="text-sm text-sky-100">{professor.institution}</p>
        </Card>
        
        {/* Back of card */}
        <Card
          className="absolute w-full h-full p-4 backface-hidden rotate-y-180 bg-sky-600 text-white"
        >
          <h4 className="font-medium mb-2">Recent Work</h4>
          <p className="text-sm text-sky-100">{professor.recentWork}</p>
          <div className="mt-2">
            <h4 className="font-medium mb-1">Contact</h4>
            <p className="text-sm text-sky-100">{professor.email}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};