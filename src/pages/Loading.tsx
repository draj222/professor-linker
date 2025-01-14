import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const generateProfessors = async () => {
      try {
        const fieldOfInterest = localStorage.getItem("fieldOfInterest");
        if (!fieldOfInterest) {
          throw new Error("No field of interest specified");
        }

        console.log("Starting professor generation for field:", fieldOfInterest);
        
        // First check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Authentication error:', authError);
          throw new Error("You must be logged in to generate professors");
        }

        console.log("User authenticated, proceeding with generation");
        
        const { data, error } = await supabase.functions.invoke('getprofessors', {
          body: { 
            fieldOfInterest,
            numberOfProfessors: 5
          }
        });

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }

        if (!data) {
          console.error("No data received from edge function");
          throw new Error("Failed to generate professors - no data received");
        }

        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          throw new Error("Invalid response format from server");
        }

        console.log("Successfully generated professors:", data);
        localStorage.setItem("generatedProfessors", JSON.stringify(data));
        navigate("/generating");

      } catch (error) {
        console.error("Error generating professors:", error);
        toast.error(error.message || "Failed to generate professors. Please try again.");
        navigate("/pricing");
      }
    };

    // Start generation after a short delay to ensure loading animation is visible
    const timer = setTimeout(() => {
      generateProfessors();
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Loading Your Journey</h2>
          <p className="text-xl text-blue-300">Preparing your academic adventure...</p>
          <div className="text-gray-400 animate-pulse">Generating personalized recommendations</div>
        </div>
      </div>
    </div>
  );
};

export default Loading;