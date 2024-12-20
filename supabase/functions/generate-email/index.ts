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
    const { professor, fieldOfInterest } = await req.json();
    console.log("Generating email for professor:", professor.name);

    const systemPrompt = `You are an expert at writing professional academic emails. 
    Write a 200-word email to a professor expressing interest in their research.
    The email should be formal, well-structured, and demonstrate knowledge of their work.
    Always address the professor as "Dr." followed by their last name.
    Use proper grammar and punctuation.`;

    const userPrompt = `Write an email to Dr. ${professor.name} at ${professor.institution}.
    Their recent work focuses on: ${professor.recentWork}
    Field of interest: ${fieldOfInterest}
    The email should express interest in their research and potential collaboration opportunities.`;

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