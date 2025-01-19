import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, LoaderCircle, Mail, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const GeneratingResults = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This is just for visual feedback, the actual generation happens in Results.tsx
    const timer = setTimeout(() => {
      navigate("/results");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#403E43] flex items-center justify-center p-4">
      <div className="relative max-w-md w-full p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl -z-10" />
        
        <div className="text-center space-y-6">
          <div className="relative flex justify-center">
            <div className="relative">
              <Brain className="w-16 h-16 text-[#9b87f5] animate-float mx-auto" />
              <div className="absolute inset-0 animate-pulse bg-[#9b87f5]/20 rounded-full blur-xl" />
            </div>
            <Mail className="w-12 h-12 text-[#9b87f5] animate-bounce absolute -right-4 top-0" />
            <Sparkles className="w-8 h-8 text-[#9b87f5] animate-pulse absolute -left-2 bottom-0" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Generating Personalized Emails
            </h1>
            <p className="text-gray-400 max-w-md">
              Our AI is crafting tailored emails based on each professor's research interests...
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={75} className="h-2 bg-gray-700" />
            <div className="flex items-center justify-center gap-2 text-[#9b87f5]">
              <LoaderCircle className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingResults;