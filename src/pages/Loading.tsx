import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Loading = () => {
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

        // Store the results in localStorage
        localStorage.setItem("generatedProfessors", JSON.stringify(data));
        
        // Navigate to results page
        navigate("/results");
      } catch (error) {
        console.error("Error fetching professors:", error);
        // Navigate to results anyway, the error will be handled there
        navigate("/results");
      }
    };

    fetchProfessors();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-white mb-2">Finding Professors</h2>
        <p className="text-gray-300">Please wait while we search for relevant professors...</p>
      </div>
    </div>
  );
};

export default Loading;