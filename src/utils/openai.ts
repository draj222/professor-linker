import { supabase } from "@/integrations/supabase/client";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  recentWork: string;
  generatedEmail: string;
  matchScore?: {
    total: number;
    breakdown: {
      researchInterests: number;
      citations: number;
      activity: number;
    };
  };
}

export const generatePersonalizedEmails = async (fieldOfInterest: string): Promise<Professor[]> => {
  console.log("Generating emails for field:", fieldOfInterest);
  
  // Get user's name from Supabase auth
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name || "Student";
  
  // Generate professors and emails using the Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('getprofessors', {
      body: { fieldOfInterest, userName },
    });

    if (error) throw error;

    // Add match scores to professors
    const professorsWithScores = data.map((professor: Professor) => ({
      ...professor,
      matchScore: {
        total: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        breakdown: {
          researchInterests: Math.floor(Math.random() * 30) + 70,
          citations: Math.floor(Math.random() * 30) + 70,
          activity: Math.floor(Math.random() * 30) + 70,
        },
      },
    }));

    return professorsWithScores;
  } catch (error) {
    console.error('Error generating professors:', error);
    throw error;
  }
};