import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

const Loading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "Professors appreciate well-researched emails...",
    "Make sure to mention specific papers they've published...",
    "Don't forget to proofread your emails...",
    "Building academic relationships takes time...",
    "Follow up after a week if you don't hear back..."
  ];

  useEffect(() => {
    // Handle progress bar
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

    // Handle rotating tips
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-black p-4">
      <div className="w-full max-w-xl space-y-8">
        {/* Fortnite-style Loading Text */}
        <h2 className="text-6xl font-bold text-white text-center mb-8 animate-pulse tracking-wider">
          LOADING
        </h2>
        
        {/* Progress Bar */}
        <div className="space-y-4">
          <Progress 
            value={progress} 
            className="h-4 bg-blue-950"
          />
          <div className="flex justify-between text-sm text-blue-200">
            <span>Scanning academic databases...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Animated Tips */}
        <div className="mt-12 text-center">
          <div className="h-16"> {/* Fixed height container for smooth transitions */}
            <p className="text-xl text-blue-300 animate-fade-in">
              {tips[currentTip]}
            </p>
          </div>
        </div>

        {/* Animated Icons */}
        <div className="flex justify-center gap-4 mt-8">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-0"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-150"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;