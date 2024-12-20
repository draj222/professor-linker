import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfessorCard } from "./ProfessorCard";
import { EmailDisplay } from "./EmailDisplay";

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
  const [userName, setUserName] = useState('');
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
        const updatedResults = results.map(prof => ({
          ...prof,
          generatedEmail: prof.generatedEmail.replace('[Your name]', user.user_metadata.full_name)
        }));
        if (selectedProfessor) {
          const updatedSelectedProfessor = {
            ...selectedProfessor,
            generatedEmail: selectedProfessor.generatedEmail.replace('[Your name]', user.user_metadata.full_name)
          };
          setSelectedProfessor(updatedSelectedProfessor);
        }
      }
    };
    getUserName();
  }, [results, selectedProfessor]);

  const handleCardClick = (professor: Professor, index: number) => {
    // If clicking the same card, just toggle the flip
    if (flippedCard === index) {
      setFlippedCard(null);
    } else {
      // If clicking a different card, update both the flip and selection
      setFlippedCard(index);
      setSelectedProfessor(professor);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel p-6 h-[600px]">
          <h3 className="text-xl font-semibold mb-4">Found Professors</h3>
          <ScrollArea className="h-[520px] pr-4">
            <div className="space-y-4">
              {results.map((professor, index) => (
                <ProfessorCard
                  key={index}
                  professor={professor}
                  isSelected={selectedProfessor === professor}
                  isFlipped={flippedCard === index}
                  onClick={() => handleCardClick(professor, index)}
                />
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="glass-panel p-6 h-[600px]">
          <h3 className="text-xl font-semibold mb-4">Generated Email</h3>
          <EmailDisplay
            professor={selectedProfessor}
            onCopy={copyToClipboard}
            onSend={sendEmail}
            isSending={isSending}
          />
        </Card>
      </div>
    </div>
  );
};