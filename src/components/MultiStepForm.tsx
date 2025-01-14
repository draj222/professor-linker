import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const MultiStepForm = () => {
  const [fieldOfInterest, setFieldOfInterest] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldOfInterest) {
      toast.error("Please enter your field of interest");
      return;
    }

    setIsLoading(true);
    // Store the field of interest in localStorage for later use
    localStorage.setItem("fieldOfInterest", fieldOfInterest);
    localStorage.setItem("userName", userName);
    
    // Navigate to the loading page first
    navigate("/loading");
  };

  return (
    <Card className="max-w-xl mx-auto bg-transparent backdrop-blur-lg border border-white/10">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={fieldOfInterest}
              onChange={(e) => setFieldOfInterest(e.target.value)}
              placeholder="Field of Interest (e.g., Machine Learning)"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg h-12"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};