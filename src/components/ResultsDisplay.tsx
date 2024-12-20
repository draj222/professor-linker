import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    if (flippedCard === index) {
      setFlippedCard(null);
    } else {
      setFlippedCard(index);
    }
    setSelectedProfessor(professor);
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
                <div
                  key={index}
                  className={`relative w-full h-48 cursor-pointer perspective-1000`}
                  onClick={() => handleCardClick(professor, index)}
                >
                  <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    flippedCard === index ? 'rotate-y-180' : ''
                  }`}>
                    {/* Front of card */}
                    <Card
                      className={`absolute w-full h-full p-4 backface-hidden ${
                        selectedProfessor === professor ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <h4 className="font-medium">{professor.name}</h4>
                      <p className="text-sm text-muted-foreground">{professor.position}</p>
                      <p className="text-sm text-muted-foreground">{professor.institution}</p>
                    </Card>
                    
                    {/* Back of card */}
                    <Card
                      className="absolute w-full h-full p-4 backface-hidden rotate-y-180 bg-primary/5"
                    >
                      <h4 className="font-medium mb-2">Recent Work</h4>
                      <p className="text-sm text-muted-foreground">{professor.recentWork}</p>
                      <div className="mt-2">
                        <h4 className="font-medium mb-1">Contact</h4>
                        <p className="text-sm text-muted-foreground">{professor.email}</p>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="glass-panel p-6 h-[600px]">
          <h3 className="text-xl font-semibold mb-4">Generated Email</h3>
          {selectedProfessor ? (
            <div className="space-y-4">
              <div className="prose prose-sm">
                <ScrollArea className="h-[420px] pr-4">
                  <div className="space-y-2">
                    <p><strong>To:</strong> {selectedProfessor.email}</p>
                    <p><strong>Subject:</strong> Research Opportunity Inquiry</p>
                    <div className="mt-4">
                      {selectedProfessor.generatedEmail.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-2">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(selectedProfessor.generatedEmail)}
                  variant="outline"
                  className="flex-1"
                >
                  Copy Email
                </Button>
                <Button
                  onClick={sendEmail}
                  className="flex-1"
                  disabled={isSending}
                >
                  {isSending ? 'Sending...' : 'Send Email'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a professor to view the generated email
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
