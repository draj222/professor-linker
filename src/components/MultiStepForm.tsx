import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const MultiStepForm = () => {
  const [fieldOfInterest, setFieldOfInterest] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNext = () => {
    if (!fieldOfInterest.trim()) {
      toast({
        title: "Field Required",
        description: "Please enter your field of interest before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    // Store the field of interest in localStorage before navigating
    localStorage.setItem('fieldOfInterest', fieldOfInterest);
    navigate('/loading');
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-panel p-6 shadow-xl bg-white/10 backdrop-blur-lg border-gray-700">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fieldOfInterest" className="text-white">What field would you like to pursue?</Label>
          <Input
            id="fieldOfInterest"
            type="text"
            placeholder="Enter your field of interest"
            value={fieldOfInterest}
            onChange={(e) => setFieldOfInterest(e.target.value)}
            className="bg-white/20 border-gray-700 text-white placeholder:text-gray-400"
          />
          <p className="text-sm text-gray-300">
            Examples: Artificial Intelligence, Molecular Biology, Environmental Science
          </p>
        </div>

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </Card>
  );
};