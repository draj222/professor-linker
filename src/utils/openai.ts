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
    generatedEmail: `Dear ${['Dr. Jane Smith', 'Dr. John Johnson', 'Dr. Sarah Williams', 'Dr. Michael Brown', 'Dr. Emily Davis'][index % 5]},

I hope this email finds you well. I am writing to express my sincere interest in pursuing research opportunities in your lab at ${[`Stanford University`, `MIT`, `Harvard University`, `UC Berkeley`, `Carnegie Mellon`][index % 5]}. Your groundbreaking work in ${fieldOfInterest}, particularly your recent research on ${fieldOfInterest} Research Project ${index + 1}, has deeply resonated with my academic interests.

As a student deeply passionate about ${fieldOfInterest}, I was particularly intrigued by the innovative approaches you've taken in your research. Your position as ${['Assistant Professor', 'Associate Professor', 'Full Professor', 'Distinguished Professor', 'Research Professor'][index % 5]} and your contributions to the field have been truly inspiring.

I would be grateful for the opportunity to discuss potential research positions in your lab, whether for an internship or research assistantship. I am particularly interested in contributing to projects similar to your work on ${fieldOfInterest} Research Project ${index + 1}, and I believe my background and enthusiasm for this field would make me a valuable addition to your research team.

Would it be possible to schedule a brief meeting to discuss potential opportunities in your lab? I would greatly appreciate the chance to learn more about your current research projects and how I might contribute to your ongoing work.

Thank you for considering my request. I look forward to the possibility of discussing this further.

Best regards,
[Your name]`
  }));

  return mockProfessors;
};