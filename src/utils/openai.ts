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
    
    return {
      name: `Dr. ${['Jane', 'John', 'Sarah', 'Michael', 'Emily'][index % 5]} ${lastName}`,
      email: `professor${index + 1}@university.edu`,
      position: ['Assistant Professor', 'Associate Professor', 'Full Professor', 'Distinguished Professor', 'Research Professor'][index % 5],
      institution: [`Stanford University`, `MIT`, `Harvard University`, `UC Berkeley`, `Carnegie Mellon`][index % 5],
      recentWork: `${fieldOfInterest} Research Project ${index + 1}`,
      generatedEmail: `Dear Professor ${lastName},

I hope this email finds you well. I am writing to express my sincere interest in pursuing research opportunities in your lab at ${[`Stanford University`, `MIT`, `Harvard University`, `UC Berkeley`, `Carnegie Mellon`][index % 5]}. Your groundbreaking work in ${fieldOfInterest}, particularly your recent research on ${fieldOfInterest} Research Project ${index + 1}, has deeply resonated with my academic interests and career aspirations.

Throughout my academic journey, I have developed a strong foundation in ${fieldOfInterest} through coursework and independent projects. Your innovative approaches to ${fieldOfInterest}, especially in your role as ${['Assistant Professor', 'Associate Professor', 'Full Professor', 'Distinguished Professor', 'Research Professor'][index % 5]}, align perfectly with my research interests and long-term goals in academia.

I am particularly drawn to your lab's focus on ${fieldOfInterest} Research Project ${index + 1}. The methodologies and insights from your work have significantly influenced my understanding of the field. I believe that contributing to your research would not only allow me to apply my skills but also help advance your lab's objectives in pushing the boundaries of ${fieldOfInterest}.

My background includes extensive coursework in related areas, and I have developed strong analytical and programming skills that I believe would be valuable to your research team. I am eager to contribute to your ongoing projects while learning from your expertise and the collaborative environment in your lab.

Would it be possible to schedule a brief meeting to discuss potential research opportunities in your lab? I would greatly appreciate the chance to learn more about your current projects and explore how my skills and interests could contribute to your research goals.

Thank you for considering my request. I look forward to the possibility of discussing this further and potentially joining your research team.

Best regards,
[Your name]`
    }
  });

  return mockProfessors;
};