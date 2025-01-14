import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="text-white text-xl font-bold">Professor Linker</div>
          <Button 
            variant="outline"
            className="bg-white/10 border-gray-700 text-white hover:bg-white/20"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};