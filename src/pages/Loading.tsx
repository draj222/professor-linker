import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/universities");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#403E43] flex items-center justify-center">
      <div className="relative p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl -z-10" />
        <div className="text-center space-y-6">
          <div className="relative">
            <Sparkles className="w-16 h-16 text-[#9b87f5] animate-float mx-auto" />
            <div className="absolute inset-0 animate-pulse bg-[#9b87f5]/20 rounded-full blur-xl" />
          </div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Finding Your Perfect Match
          </h1>
          <p className="text-gray-400 max-w-md">
            Analyzing your academic profile to find the best universities that align with your interests...
          </p>
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] animate-shine" 
                 style={{width: '60%'}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;