import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MultiStepForm = () => {
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
          numberOfProfessors: 26  // Pass the number of professors you want to generate
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
    <form onSubmit={handleSubmit}>
      {/* Form fields for fieldOfInterest and userName */}
      <input
        type="text"
        value={fieldOfInterest}
        onChange={(e) => setFieldOfInterest(e.target.value)}
        placeholder="Field of Interest"
        required
      />
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Your Name"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Emails"}
      </button>
    </form>
  );
};

export default MultiStepForm;
