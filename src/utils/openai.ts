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

I hope this email finds you well. I am writing to express my sincere interest in pursuing research opportunities in your lab at ${[`Stanford University`, `MIT`, `Harvard University`, `UC Berkeley`, `Carnegie Mellon`][index % 5]}. Your groundbreaking work in ${fieldOfInterest}, particularly your recent research on ${fieldOfInterest} Research Project ${index + 1}, has deeply resonated with my academic interests and career aspirations. After thoroughly reviewing your publications and lab's research focus, I am particularly intrigued by your innovative approaches to solving complex problems in the field. Your recent contributions to advancing our understanding of ${fieldOfInterest} through novel methodological frameworks have been especially inspiring to me.

Throughout my academic journey, I have developed a strong foundation in ${fieldOfInterest} through both rigorous coursework and hands-on research experience. I have completed advanced courses in data analysis, machine learning, and statistical modeling, maintaining a strong academic record while actively participating in research projects. In my current role as a research assistant, I have gained valuable experience in experimental design, data collection, and analysis, using tools such as Python, R, and various specialized software packages. I have also developed strong collaborative skills through working in diverse research teams and presenting findings at departmental seminars. These experiences have equipped me with the technical skills and research mindset necessary to contribute meaningfully to your lab's ongoing projects.

I am particularly excited about the potential to contribute to your lab's work on ${fieldOfInterest} Research Project ${index + 1}. Your innovative methodology aligns perfectly with my research interests, and I believe my background in statistical analysis and machine learning could bring a valuable perspective to your team. I am especially interested in exploring how my experience with [relevant technical skills] could be applied to advance your current research objectives. Additionally, I have experience in scientific writing and have co-authored two papers in related fields, which I believe would be beneficial for contributing to your lab's publication efforts. I am committed to pursuing graduate studies and would be honored to have the opportunity to learn from and contribute to your research group.

Would it be possible to schedule a brief meeting to discuss potential research opportunities in your lab? I would greatly appreciate the chance to learn more about your current projects and explore how my skills and interests could contribute to your research goals. I am available at your convenience and would be happy to provide any additional information you might need, including my full CV, transcripts, or references.

Thank you for considering my request. I look forward to the possibility of discussing this further and potentially joining your research team.

Best regards,
[Your name]`
    }
  });

  return mockProfessors;
};