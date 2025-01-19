import { useEffect, useState } from "react";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Wand2, Mail, Sparkles } from "lucide-react";

const Results = () => {
  const [results, setResults] = useState([]);
  const [numberOfEmails, setNumberOfEmails] = useState(10);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const storedResults = localStorage.getItem("generatedProfessors");
    if (storedResults) {
      const allResults = JSON.parse(storedResults);
      const userPlanEmails = localStorage.getItem("selectedEmailCount");
      if (userPlanEmails) {
        const count = parseInt(userPlanEmails);
        console.log(`Using user selected email count: ${count}`);
        setNumberOfEmails(count);
        setResults(allResults.slice(0, count));
        setShowResults(true);
      } else {
        console.log('No email count found in localStorage');
        setResults(allResults);
      }
    }
  }, []);

  const handleGenerateEmails = () => {
    const allResults = JSON.parse(localStorage.getItem("generatedProfessors") || "[]");
    console.log(`Generating ${numberOfEmails} emails from ${allResults.length} available professors`);
    
    localStorage.setItem("selectedEmailCount", numberOfEmails.toString());
    
    const selectedResults = allResults.slice(0, numberOfEmails);
    console.log(`Selected ${selectedResults.length} professors for email generation`);
    
    setResults(selectedResults);
    setShowResults(true);
    toast.success(`Generated ${selectedResults.length} personalized emails`);
  };

  if (!showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-24 px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">
              Email Generation
            </h1>
            <p className="text-gray-300 text-lg">
              Our AI will craft personalized emails for your selected professors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-transparent backdrop-blur-lg border-purple-700/30 animate-fade-in hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Smart Templates</h3>
              <p className="text-gray-300">Professionally crafted templates for various academic purposes</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-transparent backdrop-blur-lg border-purple-700/30 animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
              <Wand2 className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">AI Personalization</h3>
              <p className="text-gray-300">Each email is uniquely tailored to the professor's research</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-transparent backdrop-blur-lg border-purple-700/30 animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
              <Mail className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Bulk Generation</h3>
              <p className="text-gray-300">Generate multiple emails in seconds with consistent quality</p>
            </Card>
          </div>

          <Card className="max-w-xl mx-auto p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-purple-700/30 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              How many emails would you like to generate?
            </h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-300">
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
                <div className="text-center text-xl font-semibold text-white">
                  {numberOfEmails} email{numberOfEmails !== 1 ? 's' : ''}
                </div>
              </div>
              <Button 
                onClick={handleGenerateEmails}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 animate-shine"
                size="lg"
              >
                Generate Emails
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Generated Emails
          </h1>
          <p className="text-gray-300 text-lg">
            Personalized emails ready to help you connect with professors
          </p>
        </div>
        <ResultsDisplay results={results} />
      </div>
    </div>
  );
};

export default Results;