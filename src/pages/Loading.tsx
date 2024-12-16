import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

const Loading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          navigate('/pricing');
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-black p-4">
      <div className="w-full max-w-xl space-y-8">
        <h2 className="text-4xl font-bold text-white text-center mb-8 animate-pulse">
          Searching for Professors...
        </h2>
        
        <div className="space-y-4">
          <Progress value={progress} className="h-4 bg-blue-950" />
          <div className="flex justify-between text-sm text-blue-200">
            <span>Scanning academic databases...</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-blue-200 animate-pulse">Analyzing research papers</p>
          <p className="text-blue-300 animate-pulse delay-100">Matching expertise</p>
          <p className="text-blue-400 animate-pulse delay-200">Generating personalized emails</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;