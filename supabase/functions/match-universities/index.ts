import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fieldOfInterest, educationLevel, researchExperience, academicGoals } = await req.json();
    
    if (!fieldOfInterest) {
      throw new Error('Field of interest is required');
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // First, get all universities from the database
    const { data: universities, error: dbError } = await supabase
      .from('universities')
      .select('*');

    if (dbError) throw dbError;

    // Generate match scores using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI that matches universities to student profiles.
            Given a list of universities and a student profile, return a JSON array of university objects with match scores.
            Each university should include:
            - id (from input)
            - name (from input)
            - matchScore (0-100)
            - matchReason (brief explanation)
            Base the match on academic focus, research opportunities, and alignment with student goals.`
          },
          {
            role: 'user',
            content: `Student Profile:
            - Field of Interest: ${fieldOfInterest}
            - Education Level: ${educationLevel}
            - Research Experience: ${researchExperience}
            - Academic Goals: ${academicGoals}

            Universities to match:
            ${JSON.stringify(universities)}

            Return ONLY a JSON array of matched universities with scores and reasons.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const matches = JSON.parse(data.choices[0].message.content);

    // Filter out any matches with a score less than 20
    const validMatches = matches.filter((match: any) => match.matchScore >= 20);

    return new Response(JSON.stringify(validMatches), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in match-universities function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to match universities. Please check the logs for more information.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});