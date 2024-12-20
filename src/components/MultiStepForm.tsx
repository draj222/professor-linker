import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fieldOfInterest, setFieldOfInterest] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProfileSubmit = async () => {
    if (!fullName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name before proceeding.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "User not found. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setStep(2);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFieldSubmit = () => {
    if (!fieldOfInterest.trim()) {
      toast({
        title: "Field Required",
        description: "Please enter your field of interest before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('fieldOfInterest', fieldOfInterest);
    navigate('/loading');
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-panel p-6 shadow-xl bg-white/10 backdrop-blur-lg border-gray-700">
      {step === 1 ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white/20 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-white">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-white/20 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleProfileSubmit}
          >
            Next
          </Button>
        </div>
      ) : (
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
            onClick={handleFieldSubmit}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
};