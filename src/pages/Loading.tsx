import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time (3 seconds) then navigate to pricing
    const timer = setTimeout(() => {
      navigate("/pricing");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative w-32 h-32 mx-auto">
          {/* Outer spinning circle */}
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"></div>
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Loading Your Journey</h2>
          <p className="text-xl text-blue-300">Preparing your academic adventure...</p>
          <div className="text-gray-400 animate-pulse">Please wait</div>
        </div>
      </div>
    </div>
  );
};

export default Loading;