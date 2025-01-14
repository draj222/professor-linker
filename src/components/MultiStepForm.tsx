import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, ArrowRight, User, Briefcase, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Extracurriculars", icon: Award },
  { id: 3, title: "Field Selection", icon: Briefcase },
];

export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldOfInterest, setFieldOfInterest] = useState("");
  const [userName, setUserName] = useState("");
  const [extracurriculars, setExtracurriculars] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep === 1 && !userName) {
      toast.error("Please enter your name");
      return;
    }
    if (currentStep === 2 && !extracurriculars) {
      toast.error("Please enter your extracurricular activities");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldOfInterest) {
      toast.error("Please enter your field of interest");
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to continue");
        return;
      }

      // Store activities in the database
      const { error: activitiesError } = await supabase
        .from('user_activities')
        .upsert({
          user_id: user.id,
          activities: extracurriculars
        });

      if (activitiesError) {
        console.error('Error storing activities:', activitiesError);
        throw activitiesError;
      }

      // Store data in localStorage for the next page
      localStorage.setItem("fieldOfInterest", fieldOfInterest);
      localStorage.setItem("userName", userName);
      localStorage.setItem("extracurriculars", extracurriculars);
      
      navigate("/loading");
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex-1 relative"
            >
              <div
                className={`flex items-center justify-center ${
                  currentStep >= step.id
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                    ${
                      currentStep >= step.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }
                  `}
                >
                  {<step.icon className="w-5 h-5" />}
                </div>
                <div className="absolute -bottom-6 w-full text-center text-sm font-medium">
                  {step.title}
                </div>
              </div>
              {step.id !== steps.length && (
                <div
                  className={`absolute top-5 w-full h-[2px] left-1/2 
                    ${currentStep > step.id ? "bg-blue-500" : "bg-gray-300"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-white/10 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-center">
            {currentStep === 1 
              ? "Tell us about yourself" 
              : currentStep === 2 
              ? "Share your activities" 
              : "Choose your field"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 ? (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
                    required
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 absolute right-3 top-3 text-white/50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your full name as you'd like it to appear in emails</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg h-12 group"
                >
                  Next Step
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : currentStep === 2 ? (
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={extracurriculars}
                    onChange={(e) => setExtracurriculars(e.target.value)}
                    placeholder="List your extracurricular activities, research experience, or relevant projects"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[120px]"
                    required
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 absolute right-3 top-3 text-white/50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share activities that demonstrate your interest and experience in your field</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold text-lg h-12"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg h-12 group"
                  >
                    Next Step
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="relative">
                  <Input
                    type="text"
                    value={fieldOfInterest}
                    onChange={(e) => setFieldOfInterest(e.target.value)}
                    placeholder="Field of Interest (e.g., Machine Learning)"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
                    required
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 absolute right-3 top-3 text-white/50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your research field or area of academic interest</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold text-lg h-12"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg h-12 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <span>Generate Professors</span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};