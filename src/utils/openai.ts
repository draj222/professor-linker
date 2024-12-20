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

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generatePersonalizedEmails = async (fieldOfInterest: string): Promise<Professor[]> => {
  try {
    console.log("Generating emails for field:", fieldOfInterest);
    
    // Get the OpenAI API key from Supabase
    const { data: secretData, error: secretError } = await supabase.rpc('get_secret', {
      name: 'OPENAI_API_KEY'
    });

    if (secretError || !secretData?.secret) {
      console.error("Error getting OpenAI API key:", secretError);
      throw new Error("Failed to get OpenAI API key");
    }

    const OPENAI_API_KEY = secretData.secret;

    const systemPrompt = `You are an AI assistant helping to generate a list of 100 professors and their details, 
    along with personalized emails for academic outreach in the field of ${fieldOfInterest}. 
    For each professor, include their name, email, position, institution, and a specific recent research project.
    Make the data realistic but varied across different universities and research areas within ${fieldOfInterest}.
    The professors should be from real universities and their research projects should be based on real academic work.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate 100 professors' information and personalized emails for ${fieldOfInterest}. 
            Format as JSON array with name, email, position, institution, recentWork, and generatedEmail fields.
            Make emails professional, mentioning their specific work, and expressing genuine interest in their research.
            Include real research projects and publications from their field.` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error('Failed to generate emails');
    }

    const responseData = await response.json() as OpenAIResponse;
    const professors: Professor[] = JSON.parse(responseData.choices[0].message.content);
    
    console.log("Successfully generated emails for", professors.length, "professors");
    return professors;

  } catch (error) {
    console.error("Error generating emails:", error);
    toast.error("Failed to generate emails. Please try again.");
    return [];
  }
};