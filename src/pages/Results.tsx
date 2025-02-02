import { useEffect, useState } from "react";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Wand2, Mail, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const [results, setResults] = useState([]);
  const [numberOfEmails, setNumberOfEmails] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = localStorage.getItem("generatedProfessors");
    if (storedResults) {
      console.log("Found stored results, displaying them");
      setResults(JSON.parse(storedResults));
      setShowResults(true);
    }
  }, []);

  const handleGenerateEmails = async () => {
    localStorage.setItem("selectedEmailCount", numberOfEmails.toString());
    navigate("/generating");
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Generated Emails
            </h1>
            <p className="text-muted-foreground text-lg">
              Personalized emails ready to help you connect with professors
            </p>
          </div>
          <ResultsDisplay results={results} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Email Generation
          </h1>
          <p className="text-muted-foreground text-lg">
            Our AI will craft personalized emails for your selected professors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <Card className="p-6 bg-card hover:bg-accent/5 transition-colors border border-border/50">
            <Sparkles className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Smart Templates</h3>
            <p className="text-muted-foreground">Professionally crafted templates for various academic purposes</p>
          </Card>

          <Card className="p-6 bg-card hover:bg-accent/5 transition-colors border border-border/50">
            <Wand2 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">AI Personalization</h3>
            <p className="text-muted-foreground">Each email is uniquely tailored to the professor's research</p>
          </Card>

          <Card className="p-6 bg-card hover:bg-accent/5 transition-colors border border-border/50">
            <Mail className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Bulk Generation</h3>
            <p className="text-muted-foreground">Generate multiple emails in seconds with consistent quality</p>
          </Card>
        </div>

        <Card className="max-w-xl mx-auto p-8 bg-card border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            How many emails would you like to generate?
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 email</span>
                <span>50 emails</span>
              </div>
              <Slider
                defaultValue={[numberOfEmails]}
                value={[numberOfEmails]}
                onValueChange={(value) => setNumberOfEmails(value[0])}
                max={50}
                min={1}
                step={1}
                className="my-4"
              />
              <div className="text-center text-xl font-semibold text-foreground">
                {numberOfEmails} email{numberOfEmails !== 1 ? 's' : ''}
              </div>
            </div>
            <Button 
              onClick={handleGenerateEmails}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Generate Emails
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Results;