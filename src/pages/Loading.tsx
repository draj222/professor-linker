import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // After a short delay, navigate to university selection
    const timer = setTimeout(() => {
      navigate("/universities");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <Sparkles className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
        <h1 className="text-2xl font-bold text-white">Finding Your Perfect Match</h1>
        <p className="text-gray-400">Analyzing your academic profile to find the best universities...</p>
      </div>
    </div>
  );
};

export default Loading;