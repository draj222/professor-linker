import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface FormData {
  name: string;
  email: string;
  phone: string;
  fieldOfInterest: string;
}

export const MultiStepForm = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    fieldOfInterest: '',
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.phone)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to continue.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !formData.fieldOfInterest) {
      toast({
        title: "Missing Information",
        description: "Please enter your field of interest.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2) {
      onSubmit(formData);
      navigate('/loading');
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-panel p-6 shadow-xl">
      <TransitionGroup>
        <CSSTransition
          key={step}
          timeout={500}
          classNames="form-transition"
        >
          <div>
            {step === 1 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-center mb-6">Personal Information</h2>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="John Doe"
                    className="glass-panel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john@example.com"
                    className="glass-panel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="(123) 456-7890"
                    className="glass-panel"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-center mb-6">Field of Interest</h2>
                <div className="space-y-2">
                  <Label htmlFor="fieldOfInterest">What field would you like to pursue?</Label>
                  <Input
                    id="fieldOfInterest"
                    value={formData.fieldOfInterest}
                    onChange={(e) => updateFormData('fieldOfInterest', e.target.value)}
                    placeholder="e.g., Machine Learning, Quantum Computing"
                    className="glass-panel"
                  />
                </div>
              </div>
            )}
          </div>
        </CSSTransition>
      </TransitionGroup>

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button
            onClick={handleBack}
            variant="outline"
            className="glass-panel"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          className={`${step === 1 ? 'ml-auto' : ''} glass-panel px-8 py-2 text-lg font-semibold ${
            step === 2 ? 'bg-blue-500 hover:bg-blue-600 text-white w-full' : ''
          }`}
        >
          {step === 2 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </Card>
  );
};