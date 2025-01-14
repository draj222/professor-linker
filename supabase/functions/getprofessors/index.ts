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
    console.log("Starting professor generation request");
    const { fieldOfInterest, userName } = await req.json();
    
    if (!fieldOfInterest) {
      console.error("No field of interest provided");
      throw new Error('Field of interest is required');
    }

    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      throw new Error('OpenAI API key is not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get user's activities
    const { data: authData } = await supabase.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] || '');
    if (!authData.user) {
      throw new Error('User not authenticated');
    }

    console.log('Fetching activities for user:', authData.user.id);
    const { data: activitiesData, error: activitiesError } = await supabase
      .from('user_activities')
      .select('activities')
      .eq('user_id', authData.user.id)
      .single();

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      throw activitiesError;
    }

    const userActivities = activitiesData?.activities || '';
    console.log('User activities:', userActivities);

    console.log(`Generating professors for field: ${fieldOfInterest}`);

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
            content: `You are an expert academic researcher with deep knowledge of universities and research institutions worldwide. 
            Your task is to identify 5 promising researchers in ${fieldOfInterest} who would be excellent potential advisors.
            
            Focus on:
            1. Early to mid-career professors doing innovative work
            2. Researchers at reputable institutions with active research programs
            3. Scientists publishing significant work in ${fieldOfInterest} within the last 2-3 years
            
            For each researcher, provide:
            - Full name with appropriate title (Dr./Prof.)
            - Institutional email (use only real university domains)
            - Current academic position
            - Full institution name
            - A detailed 2-3 sentence description of their recent, specific research contributions
            
            Ensure all information is current and verifiable. Return ONLY a JSON array of objects with these exact fields:
            - name (string)
            - email (string)
            - position (string)
            - institution (string)
            - recentWork (string)`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response format from OpenAI:", data);
      throw new Error('Invalid response format from OpenAI');
    }

    let professors;
    try {
      const content = data.choices[0].message.content;
      professors = typeof content === 'string' ? JSON.parse(content) : content;
      
      if (!Array.isArray(professors)) {
        console.error("Response is not an array:", professors);
        throw new Error('Invalid response format: not an array');
      }

      console.log(`Successfully generated ${professors.length} professors`);
      
      // Generate personalized email for each professor
      professors = professors.map(prof => ({
        ...prof,
        generatedEmail: `Dear Dr. ${prof.name.split(' ').pop()},

I hope this email finds you well. My name is ${userName}, and I am a high school student deeply passionate about ${fieldOfInterest}. I am reaching out to express my interest in working on research projects under your guidance.

I was particularly intrigued by your recent work on ${prof.recentWork}. Your innovative approach aligns perfectly with my interests and aspirations in ${fieldOfInterest}.

${userActivities ? `Through my experiences, I have developed relevant skills and demonstrated my commitment to research. ${userActivities}` : ''}

I would greatly appreciate any opportunity to contribute to your research projects under your expertise and guidance. As a committed and passionate student, I am open to working in any capacity that would allow me to learn and make meaningful contributions to your work.

Thank you for considering my request. I am available to discuss potential opportunities at your convenience.

Best regards,
${userName}`
      }));

    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse researcher data from OpenAI response');
    }

    return new Response(JSON.stringify(professors), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in getprofessors function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate professors. Please try again.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});