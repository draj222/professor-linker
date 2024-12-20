import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfessorList } from "./ProfessorList";
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
  const [processedResults, setProcessedResults] = useState<Professor[]>(results);
  const { toast } = useToast();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('Fetching profile for user:', user.id);
          
          // Fetch the user's profile from the profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            throw error;
          }
          
          // Only update if we have a valid name
          if (profile?.full_name) {
            console.log('Retrieved user full name:', profile.full_name);
            setUserName(profile.full_name);
            
            // Process the results with the actual user name
            const processed = results.map(result => ({
              ...result,
              generatedEmail: result.generatedEmail.replace(
                '[Your name]', 
                profile.full_name || 'Your name'  // Fallback if somehow full_name is empty
              )
            }));
            setProcessedResults(processed);
          } else {
            console.log('No full name found in profile, using default');
            // If no name is found, use a default placeholder
            const processed = results.map(result => ({
              ...result,
              generatedEmail: result.generatedEmail.replace('[Your name]', 'Your name')
            }));
            setProcessedResults(processed);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Use a default value if there's an error
        const processed = results.map(result => ({
          ...result,
          generatedEmail: result.generatedEmail.replace('[Your name]', 'Your name')
        }));
        setProcessedResults(processed);
        
        toast({
          title: "Error",
          description: "Failed to load user profile information",
          variant: "destructive",
        });
      }
    };

    getUserProfile();
  }, [results, toast]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfessorList
          professors={processedResults}
          selectedProfessor={selectedProfessor}
          flippedCard={flippedCard}
          onProfessorSelect={handleProfessorSelect}
        />

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