import { useState } from 'react';
import { MultiStepForm } from '@/components/MultiStepForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { useToast } from "@/components/ui/use-toast";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  generatedEmail: string;
}

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Professor[] | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to search for professors and generate emails
      // This is a mock response
      const mockResults: Professor[] = [
        {
          name: "Dr. Jane Smith",
          email: "jane.smith@university.edu",
          position: "Associate Professor",
          institution: "University of Technology",
          generatedEmail: `Dear Dr. Smith,

I hope this email finds you well. My name is ${formData.name}, and I am reaching out because I am deeply interested in pursuing research in ${formData.fieldOfInterest}.

Your work on [specific research area] caught my attention, and I would greatly appreciate the opportunity to discuss potential research opportunities in your lab.

Thank you for your time and consideration.

Best regards,
${formData.name}`
        },
        // Add more mock results as needed
      ];

      setTimeout(() => {
        setResults(mockResults);
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Academic Outreach Assistant
          </h1>
          <p className="mt-3 text-xl text-blue-200 sm:mt-5">
            Connect with professors and researchers in your field of interest
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
          </div>
        ) : results ? (
          <ResultsDisplay results={results} />
        ) : (
          <MultiStepForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default Index;