import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Mail, Clock, CheckCircle, XCircle } from "lucide-react";

interface FollowUp {
  id: string;
  professorName: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  type: 'follow_up' | 'initial_contact';
}

interface OutreachSectionProps {
  followUps: FollowUp[];
  onScheduleFollowUp: (professorId: string) => void;
}

export const OutreachSection = ({ followUps, onScheduleFollowUp }: OutreachSectionProps) => {
  const getStatusIcon = (status: FollowUp['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-gray-700 hover:bg-white/15 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-400" />
          Follow-up Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {followUps.map((followUp) => (
              <div
                key={followUp.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(followUp.status)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">
                      {followUp.professorName}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Due: {followUp.dueDate}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  onClick={() => onScheduleFollowUp(followUp.id)}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  {followUp.type === 'follow_up' ? 'Send Follow-up' : 'Send Email'}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};