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
    const institutions = [`Stanford University`, `MIT`, `Harvard University`, `UC Berkeley`, `Carnegie Mellon`];
    const institution = institutions[index % 5];
    const titles = ['Professor', 'Doctor', 'Dr.'];
    const title = titles[index % 3];
    
    return {
      name: `${title} ${['Jane', 'John', 'Sarah', 'Michael', 'Emily'][index % 5]} ${lastName}`,
      email: `professor${index + 1}@university.edu`,
      position: ['Assistant Professor', 'Associate Professor', 'Full Professor', 'Distinguished Professor', 'Research Professor'][index % 5],
      institution: institution,
      recentWork: `${fieldOfInterest} Research Project ${index + 1}`,
      generatedEmail: `Dear Dr. ${lastName},

I am writing to express my sincere interest in pursuing research opportunities in your laboratory at ${institution}. Your groundbreaking work in ${fieldOfInterest}, particularly your innovative research on ${fieldOfInterest} Research Project ${index + 1}, has deeply resonated with my academic interests and career aspirations. After thoroughly reviewing your recent publications and your lab's research focus, I have been particularly impressed by your methodological approaches and the significant contributions your work has made to advancing our understanding of complex problems in ${fieldOfInterest}. The innovative frameworks you have developed for analyzing and interpreting data in this field have been especially inspiring to me. Your recent publications demonstrate a remarkable ability to bridge theoretical concepts with practical applications, which aligns perfectly with my research interests.

Throughout my academic journey, I have developed a comprehensive foundation in ${fieldOfInterest} through both rigorous coursework and extensive hands-on research experience. I have completed advanced courses in statistical analysis, machine learning algorithms, and computational modeling, consistently maintaining excellent academic performance while actively engaging in research projects. My current research focuses on developing novel approaches to data analysis and algorithm optimization, which I believe could contribute meaningfully to your ongoing work. I have gained valuable experience in experimental design, data collection, and analysis, utilizing various programming languages including Python, R, and MATLAB. Additionally, I have become proficient in implementing deep learning frameworks and developing custom analytical tools for processing complex datasets.

I am particularly excited about the potential to contribute to your lab's ongoing work on ${fieldOfInterest} Research Project ${index + 1}. Your innovative methodology aligns perfectly with my research interests, and I believe my background in advanced statistical analysis and machine learning could bring a valuable perspective to your team. I have specific experience in developing automated data processing pipelines and implementing novel machine learning algorithms, which I believe could be particularly relevant to your current research objectives. My collaborative work has resulted in several peer-reviewed publications and conference presentations, demonstrating my ability to contribute meaningfully to academic research and effectively communicate scientific findings. Furthermore, my experience in scientific writing and data visualization, combined with my strong programming skills, would enable me to contribute effectively to both the technical and communication aspects of your research projects.

Would it be possible to schedule a brief meeting to discuss potential research opportunities in your lab? I would greatly appreciate the chance to learn more about your current projects and explore how my skills and interests could contribute to your research goals. I am available at your convenience and would be happy to provide any additional information you might need, including my full CV, transcripts, or references.

Thank you for considering my request. I look forward to the possibility of discussing this further and potentially joining your research team.

Best regards,
[Your name]`
    }
  });

  return mockProfessors;
};