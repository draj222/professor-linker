import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const generateProfessors = async () => {
      try {
        const fieldOfInterest = localStorage.getItem("fieldOfInterest");
        const selectedEmailCount = localStorage.getItem("selectedEmailCount");
        const numberOfProfessors = selectedEmailCount ? parseInt(selectedEmailCount) : 10;
        
        console.log("Starting professor generation with field:", fieldOfInterest, "count:", numberOfProfessors);
        
        if (!fieldOfInterest) {
          console.error("No field of interest found in localStorage");
          toast.error("Please specify your field of interest first");
          navigate("/");
          return;
        }

        console.log("Calling edge function to generate professors...");
        const { data, error } = await supabase.functions.invoke('getprofessors', {
          body: { 
            fieldOfInterest,
            numberOfProfessors
          }
        });

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }

        if (!data) {
          console.error("No data received from edge function");
          throw new Error("No professors were generated");
        }

        console.log("Successfully generated professors:", data);
        localStorage.setItem("generatedProfessors", JSON.stringify(data));
        
        navigate("/generating");

      } catch (error) {
        console.error("Error in professor generation:", error);
        toast.error("Failed to generate professors. Please try again.");
        navigate("/");
      }
    };

    const timer = setTimeout(() => {
      generateProfessors();
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl -z-10" />
        <div className="text-center space-y-8">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-4 border-primary rounded-full animate-spin" />
            <div className="absolute inset-4 rounded-full">
              <Sparkles className="w-16 h-16 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Loading Your Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Preparing your academic adventure...
            </p>
            <div className="text-muted-foreground/80 animate-pulse">
              Generating personalized recommendations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;