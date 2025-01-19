import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BookOpen, Star } from "lucide-react";

interface Update {
  id: string;
  type: 'publication' | 'project' | 'opportunity';
  title: string;
  professor: string;
  date: string;
}

interface ResearchUpdatesSectionProps {
  updates: Update[];
}

export const ResearchUpdatesSection = ({ updates }: ResearchUpdatesSectionProps) => {
  const getUpdateIcon = (type: Update['type']) => {
    switch (type) {
      case 'publication':
        return <BookOpen className="h-4 w-4 text-blue-400" />;
      case 'project':
        return <Star className="h-4 w-4 text-yellow-400" />;
      case 'opportunity':
        return <Bell className="h-4 w-4 text-green-400" />;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-gray-700">
      <CardHeader>
        <CardTitle>Recent Research Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.map((update) => (
            <div
              key={update.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="mt-1">{getUpdateIcon(update.type)}</div>
              <div>
                <h4 className="font-medium text-white">{update.title}</h4>
                <p className="text-sm text-gray-400">{update.professor}</p>
                <p className="text-xs text-gray-500 mt-1">{update.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};