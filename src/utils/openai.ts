import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  recentWork: string;
  generatedEmail: string;
}

export const generatePersonalizedEmails = async (fieldOfInterest: string): Promise<Professor[]> => {
  console.log("Generating emails for field:", fieldOfInterest);
  
  // Return a mock professor for testing
  const mockProfessor: Professor = {
    name: "Dr. Jane Smith",
    email: "jane.smith@university.edu",
    position: "Associate Professor",
    institution: "University of Technology",
    recentWork: "Machine Learning Applications in Healthcare",
    generatedEmail: "Dear Dr. Smith, I am writing to express my interest in your research..."
  };

  return [mockProfessor];
};