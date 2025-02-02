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
    console.log('Received profile data:', { fieldOfInterest, educationLevel, researchExperience, academicGoals });
    
    if (!fieldOfInterest) {
      throw new Error('Field of interest is required');
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // First, get all universities from the database
    const { data: universities, error: dbError } = await supabase
      .from('universities')
      .select('*');

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log(`Found ${universities?.length || 0} universities in database`);

    // Use OpenAI to analyze and match universities
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a university matching expert. Your task is to analyze student profiles and match them with universities based on their academic interests, goals, and experience. For each university, provide:
            1. A match score (0-100) based on alignment with the student's profile
            2. A detailed breakdown of the match score
            3. A brief explanation of why this university would be a good match
            Return matches as a JSON array.`
          },
          {
            role: 'user',
            content: `Student Profile:
            - Field of Interest: ${fieldOfInterest}
            - Education Level: ${educationLevel || 'Not specified'}
            - Research Experience: ${researchExperience || 'None'}
            - Academic Goals: ${academicGoals || 'Not specified'}

            Available Universities:
            ${JSON.stringify(universities, null, 2)}

            For each university, provide:
            1. The university's id and name (from input data)
            2. A match score (0-100)
            3. A breakdown showing:
               - Research Alignment (0-100)
               - Academic Program Fit (0-100)
               - Resources Match (0-100)
            4. A brief reason for the match

            Return ONLY a JSON array with these fields: id, name, matchScore, matchBreakdown, matchReason`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    let matches = JSON.parse(data.choices[0].message.content);
    console.log('Parsed matches:', matches);

    // Filter out any matches with a score less than 20
    const validMatches = matches.filter((match: any) => {
      const isValid = match && 
        typeof match.id === 'string' && 
        typeof match.name === 'string' && 
        typeof match.matchScore === 'number' && 
        match.matchScore >= 20;
      
      if (!isValid) {
        console.log('Filtered out invalid match:', match);
      }
      return isValid;
    });

    // Sort matches by score
    validMatches.sort((a: any, b: any) => b.matchScore - a.matchScore);

    console.log(`Returning ${validMatches.length} valid matches`);

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