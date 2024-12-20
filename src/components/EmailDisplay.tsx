import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  generatedEmail: string;
  recentWork: string;
}

interface EmailDisplayProps {
  professor: Professor | null;
  onCopy: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export const EmailDisplay = ({ professor, onCopy, onSend, isSending }: EmailDisplayProps) => {
  if (!professor) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a professor to view the generated email
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="prose prose-sm">
        <ScrollArea className="h-[420px] pr-4">
          <div className="space-y-2">
            <p><strong>To:</strong> {professor.email}</p>
            <p><strong>Subject:</strong> Research Opportunity Inquiry</p>
            <div className="mt-4">
              {professor.generatedEmail.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => onCopy(professor.generatedEmail)}
          variant="outline"
          className="flex-1"
        >
          Copy Email
        </Button>
        <Button
          onClick={onSend}
          className="flex-1"
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send Email'}
        </Button>
      </div>
    </div>
  );
};