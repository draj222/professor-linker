import { useEffect, useState } from "react";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const Results = () => {
  const [results, setResults] = useState([]);
  const [numberOfEmails, setNumberOfEmails] = useState(10);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const storedResults = localStorage.getItem("generatedProfessors");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const handleGenerateEmails = () => {
    const allResults = [...results];
    const selectedResults = allResults.slice(0, numberOfEmails);
    setResults(selectedResults);
    setShowResults(true);
    toast.success(`Generated ${numberOfEmails} personalized emails`);
  };

  if (!showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-24 px-4">
          <Card className="max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-lg">
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
                  value={[numberOfEmails]}
                  onValueChange={(value) => setNumberOfEmails(value[0])}
                  max={50}
                  min={1}
                  step={1}
                  className="my-4"
                />
                <div className="text-center text-xl text-blue-400 font-semibold">
                  {numberOfEmails} email{numberOfEmails !== 1 ? 's' : ''}
                </div>
              </div>
              <Button 
                onClick={handleGenerateEmails}
                className="w-full"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Generated Emails
        </h1>
        <ResultsDisplay results={results} />
      </div>
    </div>
  );
};

export default Results;