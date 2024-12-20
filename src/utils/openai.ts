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
  const mockProfessors: Professor[] = Array.from({ length: 50 }, (_, index) => {
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'];
    const lastName = lastNames[index % 5];
    const institutions = ['Stanford University', 'MIT', 'Harvard University', 'UC Berkeley', 'Carnegie Mellon'];
    const institution = institutions[index % 5];
    const titles = ['Professor', 'Doctor', 'Dr.'];
    const title = titles[index % 3];
    
    return {
      name: `${title} ${['Jane', 'John', 'Sarah', 'Michael', 'Emily'][index % 5]} ${lastName}`,
      email: `professor${index + 1}@university.edu`,
      position: ['Assistant Professor', 'Associate Professor', 'Full Professor', 'Distinguished Professor', 'Research Professor'][index % 5],
      institution: institution,
      recentWork: `${fieldOfInterest} Research Project ${index + 1}`,
      generatedEmail: '' // Will be populated by OpenAI
    };
  });

  // Generate personalized emails using OpenAI for each professor
  const professorsWithEmails = await Promise.all(
    mockProfessors.map(async (professor) => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-email', {
          body: { professor, fieldOfInterest },
        });

        if (error) throw error;
        
        return {
          ...professor,
          generatedEmail: data.generatedEmail,
        };
      } catch (error) {
        console.error('Error generating email for professor:', professor.name, error);
        return professor;
      }
    })
  );

  return professorsWithEmails;
};