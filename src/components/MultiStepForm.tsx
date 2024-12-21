import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const MultiStepForm = () => {
  const [fieldOfInterest, setFieldOfInterest] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldOfInterest) {
      toast.error("Please enter your field of interest");
      return;
    }

    try {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email;

      if (!userEmail) {
        toast.error("You must be logged in to generate emails");
        return;
      }

      const { data: professors, error } = await supabase.functions.invoke('getprofessors', {
        body: { 
          fieldOfInterest,
          userName,
          numberOfProfessors: 26
        },
      });

      if (error) throw error;

      localStorage.setItem('generatedProfessors', JSON.stringify(professors));
      navigate('/results');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to generate professors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto bg-white/10 backdrop-blur-lg border-gray-700">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={fieldOfInterest}
              onChange={(e) => setFieldOfInterest(e.target.value)}
              placeholder="Field of Interest (e.g., Machine Learning)"
              className="bg-white text-gray-900 border-gray-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              className="bg-white text-gray-900 border-gray-200"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Emails"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};