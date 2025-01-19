import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GeneratingResults = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const generateProfessors = async () => {
      try {
        const selectedUniversities = JSON.parse(localStorage.getItem("selectedUniversities") || "[]");
        const fieldOfInterest = localStorage.getItem("fieldOfInterest");
        const numberOfEmails = parseInt(localStorage.getItem("selectedEmailCount") || "10");
        
        console.log(`Generating ${numberOfEmails} emails from selected universities:`, selectedUniversities);
        
        const { data, error } = await supabase.functions.invoke('getprofessors', {
          body: { 
            fieldOfInterest,
            numberOfProfessors: numberOfEmails,
            universities: selectedUniversities
          }
        });

        if (error) throw error;

        console.log("Generated professors:", data);
        localStorage.setItem("generatedProfessors", JSON.stringify(data));
        navigate("/results");
        
      } catch (error) {
        console.error("Error generating professors:", error);
        toast.error("Failed to generate professors. Please try again.");
        navigate("/results");
      }
    };

    generateProfessors();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#403E43] flex items-center justify-center p-4">
      <div className="relative max-w-md w-full p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl -z-10" />
        
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="relative inline-block">
              <Mail className="w-20 h-20 text-[#9b87f5] animate-float mx-auto" />
              <div className="absolute inset-0 animate-pulse bg-[#9b87f5]/20 rounded-full blur-xl" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Crafting Your Emails
            </h1>
            <p className="text-gray-400 max-w-md">
              Our AI is personalizing each email based on professor research interests...
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={75} className="h-2 bg-gray-700" />
            <p className="text-[#9b87f5] text-sm animate-pulse">
              Generating personalized content...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingResults;