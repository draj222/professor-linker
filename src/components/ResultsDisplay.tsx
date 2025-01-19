import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfessorList } from "./ProfessorList";
import { EmailDisplay } from "./EmailDisplay";
import { useUserProfile } from "@/hooks/useUserProfile";
import { processEmails } from "@/utils/emailUtils";
import { Mail, Send, Star } from "lucide-react";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  generatedEmail: string;
  recentWork: string;
}

export const ResultsDisplay = ({ results }: { results: Professor[] }) => {
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const { userName } = useUserProfile();
  const [processedResults, setProcessedResults] = useState<Professor[]>(results);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Processing emails with userName:', userName);
    const processed = processEmails(results, userName || 'Your name');
    setProcessedResults(processed);
  }, [results, userName]);

  const handleProfessorSelect = (professor: Professor, index: number) => {
    const selectedProf = processedResults.find(p => p.email === professor.email);
    if (selectedProf) {
      setSelectedProfessor(selectedProf);
      setFlippedCard(flippedCard === index ? null : index);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Email copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy email",
        variant: "destructive",
      });
    }
  };

  const sendEmail = async () => {
    if (!selectedProfessor) return;

    setIsSending(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email;

      if (!userEmail) {
        toast({
          title: "Error",
          description: "You must be logged in to send emails",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('sendemail', {
        body: {
          from: userEmail,
          to: [selectedProfessor.email],
          subject: "Research Opportunity Inquiry",
          html: selectedProfessor.generatedEmail,
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Email sent successfully",
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-card hover:bg-accent/5 transition-colors border border-border/50">
          <Mail className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">{processedResults.length} Emails</h3>
          <p className="text-muted-foreground">Ready to be personalized and sent</p>
        </Card>

        <Card className="p-6 bg-card hover:bg-accent/5 transition-colors border border-border/50">
          <Send className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">One Click Send</h3>
          <p className="text-muted-foreground">Instantly deliver your emails</p>
        </Card>

        <Card className="p-6 bg-card hover:bg-accent/5 transition-colors border border-border/50">
          <Star className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Smart Match</h3>
          <p className="text-muted-foreground">AI-powered personalization</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Selected Professors
          </h2>
          <ProfessorList
            professors={processedResults}
            selectedProfessor={selectedProfessor}
            flippedCard={flippedCard}
            onProfessorSelect={handleProfessorSelect}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Email Preview
          </h2>
          <Card className="p-6 bg-card border border-border/50">
            <EmailDisplay
              professor={selectedProfessor}
              onCopy={copyToClipboard}
              onSend={sendEmail}
              isSending={isSending}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};