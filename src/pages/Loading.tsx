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
        console.log("Starting professor generation with field:", fieldOfInterest);
        
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
            numberOfProfessors: 5
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
        
        // Get current user's plan
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: userPlan } = await supabase
            .from('user_plans')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (userPlan) {
            console.log("User has a plan, navigating to index page");
            navigate("/");
          } else {
            console.log("No user plan found, navigating to pricing");
            navigate("/pricing");
          }
        } else {
          console.log("No session found, navigating to pricing");
          navigate("/pricing");
        }

      } catch (error) {
        console.error("Error in professor generation:", error);
        toast.error("Failed to generate professors. Please try again.");
        // Navigate back to the form page on error
        navigate("/");
      }
    };

    // Start generation after a short delay to ensure loading animation is visible
    const timer = setTimeout(() => {
      generateProfessors();
    }, 1500);

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