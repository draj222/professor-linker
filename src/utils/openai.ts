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
  
  // Get user's name from Supabase auth
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name || "Student";
  
  // Generate professors and emails using the Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('getprofessors', {
      body: { fieldOfInterest, userName },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating professors:', error);
    throw error;
  }
};