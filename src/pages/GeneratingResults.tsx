import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GeneratingResults = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const fieldOfInterest = localStorage.getItem("fieldOfInterest");
        console.log("Fetching professors for field:", fieldOfInterest);

        const { data, error } = await supabase.functions.invoke("getprofessors", {
          body: { fieldOfInterest },
        });

        if (error) throw error;

        console.log("Generated professors:", data);
        localStorage.setItem("generatedProfessors", JSON.stringify(data));
        navigate("/results");
      } catch (error) {
        console.error("Error generating professors:", error);
        toast.error("Failed to generate professors. Please try again.");
        navigate("/pricing");
      }
    };

    fetchProfessors();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Finding Your Professors</h2>
          <p className="text-xl text-blue-300">Searching top universities...</p>
          <div className="text-gray-400 animate-pulse">Please wait while we generate personalized recommendations</div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingResults;