import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const GeneratingResults = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const fieldOfInterest = localStorage.getItem("fieldOfInterest");
        if (!fieldOfInterest) {
          throw new Error("No field of interest specified");
        }
        
        console.log("Fetching professors for field:", fieldOfInterest);

        const { data, error } = await supabase.functions.invoke("getprofessors", {
          body: { fieldOfInterest },
        });

        if (error) {
          console.error("Supabase function error:", error);
          throw error;
        }

        if (!data || !Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          throw new Error("Invalid response format from server");
        }

        console.log("Generated professors:", data);
        localStorage.setItem("generatedProfessors", JSON.stringify(data));
        navigate("/results");
      } catch (error) {
        console.error("Error generating professors:", error);
        toast.error(error.message || "Failed to generate professors. Please try again.");
        navigate("/pricing");
      }
    };

    fetchProfessors();
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
              Finding Your Professors
            </h2>
            <p className="text-xl text-muted-foreground">
              Searching top universities...
            </p>
            <div className="text-muted-foreground/80 animate-pulse">
              Please wait while we generate personalized recommendations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingResults;