import { supabase } from "@/integrations/supabase/client";

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
  
  // Generate 50 mock professors for testing
  const mockProfessors: Professor[] = Array.from({ length: 50 }, (_, index) => ({
    name: `Dr. ${['Jane', 'John', 'Sarah', 'Michael', 'Emily'][index % 5]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][index % 5]}`,
    email: `professor${index + 1}@university.edu`,
    position: ['Assistant Professor', 'Associate Professor', 'Full Professor', 'Distinguished Professor', 'Research Professor'][index % 5],
    institution: [`Stanford University`, `MIT`, `Harvard University`, `UC Berkeley`, `Carnegie Mellon`][index % 5],
    recentWork: `${fieldOfInterest} Research Project ${index + 1}`,
    generatedEmail: `Dear Professor,\n\nI am writing to express my interest in your research on ${fieldOfInterest}. Your recent work on ${fieldOfInterest} Research Project ${index + 1} particularly caught my attention...\n\nBest regards,\n[Your name]`
  }));

  return mockProfessors;
};