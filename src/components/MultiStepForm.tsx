import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const MultiStepForm = () => {
  const navigate = useNavigate();
  const [fieldOfInterest, setFieldOfInterest] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with field of interest:', fieldOfInterest);
    
    if (!fieldOfInterest) {
      toast({
        title: "Missing Information",
        description: "Please enter your field of interest.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to continue.",
          variant: "destructive",
        });
        return;
      }

      // Update user metadata with field of interest
      const { error: updateError } = await supabase.auth.updateUser({
        data: { field_of_interest: fieldOfInterest }
      });

      if (updateError) throw updateError;

      // Store in localStorage for the pricing page
      localStorage.setItem('fieldOfInterest', fieldOfInterest);
      
      console.log('Navigating to loading screen...');
      navigate('/loading');
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save your field of interest. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-panel p-6 shadow-xl bg-white/10 backdrop-blur-lg border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fieldOfInterest" className="text-white">What field would you like to pursue?</Label>
          <Input
            id="fieldOfInterest"
            value={fieldOfInterest}
            onChange={(e) => setFieldOfInterest(e.target.value)}
            placeholder="e.g., Machine Learning, Quantum Computing"
            className="glass-panel bg-white/5 text-white placeholder:text-gray-400"
          />
          <p className="text-sm text-gray-300">
            Examples: Artificial Intelligence, Molecular Biology, Environmental Science
          </p>
        </div>

        <Button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue to Plans
        </Button>
      </form>
    </Card>
  );
};