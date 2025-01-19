import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MultiStepFormProps {
  onSubmit?: () => void;
}

export const MultiStepForm = ({ onSubmit }: MultiStepFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fieldOfInterest: "",
    userName: "",
    educationLevel: "",
    researchExperience: "",
    academicGoals: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fieldOfInterest || !formData.userName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    // Store the form data in localStorage for later use
    localStorage.setItem("fieldOfInterest", formData.fieldOfInterest);
    localStorage.setItem("userName", formData.userName);
    localStorage.setItem("educationLevel", formData.educationLevel);
    localStorage.setItem("researchExperience", formData.researchExperience);
    localStorage.setItem("academicGoals", formData.academicGoals);
    
    // Navigate to universities page
    navigate('/universities');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 animate-fade-in">
      <CardHeader className="space-y-4">
        <CardTitle className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-400" />
          Academic Profile
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Help us understand your academic background to connect you with the right professors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name *</label>
            <div className="relative">
              <Input
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                placeholder="Your Full Name"
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Field of Interest *</label>
            <div className="relative">
              <Input
                type="text"
                value={formData.fieldOfInterest}
                onChange={(e) => handleInputChange("fieldOfInterest", e.target.value)}
                placeholder="e.g., Machine Learning, Quantum Physics"
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                required
              />
              <BookOpen className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Education Level</label>
            <Select
              value={formData.educationLevel}
              onValueChange={(value) => handleInputChange("educationLevel", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undergraduate">Undergraduate Student</SelectItem>
                <SelectItem value="masters">Master's Student</SelectItem>
                <SelectItem value="phd">PhD Student</SelectItem>
                <SelectItem value="postdoc">Postdoctoral Researcher</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Research Experience</label>
            <Textarea
              value={formData.researchExperience}
              onChange={(e) => handleInputChange("researchExperience", e.target.value)}
              placeholder="Briefly describe your research experience (if any)"
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Academic Goals</label>
            <Textarea
              value={formData.academicGoals}
              onChange={(e) => handleInputChange("academicGoals", e.target.value)}
              placeholder="What are your academic and research goals?"
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg h-12 transition-all duration-200 transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <GraduationCap className="animate-spin h-5 w-5" />
                Processing...
              </div>
            ) : (
              "Continue to University Selection"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};