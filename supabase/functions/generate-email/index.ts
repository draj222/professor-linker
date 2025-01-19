import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { professor, template, tone, userData } = await req.json();
    
    const systemPrompt = `You are an expert at writing professional academic emails.
    Your task is to generate a well-structured email that naturally incorporates the provided user information.
    The email should maintain a ${tone} tone while seamlessly integrating the user's background and interests.
    Follow these guidelines:
    - Naturally weave in the user's experience and background
    - Maintain proper paragraph structure and flow
    - Ensure smooth transitions between topics
    - Keep the tone ${tone} throughout
    - Make specific connections between the user's background and the professor's research`;

    const userPrompt = `Write an email to Professor ${professor.name} at ${professor.institution}.
    
    Template type: ${template}
    Professor's recent work: ${professor.recentWork}
    
    User Information to integrate naturally:
    - Name: ${userData.userName}
    - Field of Interest: ${userData.fieldOfInterest}
    - Education Level: ${userData.educationLevel}
    - Research Experience: ${userData.researchExperience}
    - Academic Goals: ${userData.academicGoals}
    
    Create a cohesive email that smoothly incorporates this information while maintaining focus on the professor's research interests.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedEmail = data.choices[0].message.content;

    return new Response(JSON.stringify({ generatedEmail }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});