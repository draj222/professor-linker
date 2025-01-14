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
    const { fieldOfInterest } = await req.json();
    console.log('Received field of interest:', fieldOfInterest);
    
    if (!fieldOfInterest) {
      throw new Error('Field of interest is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get user's activities
    const { data: authData } = await supabase.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] || '');
    if (!authData.user) {
      throw new Error('User not authenticated');
    }

    const { data: activitiesData } = await supabase
      .from('user_activities')
      .select('activities')
      .eq('user_id', authData.user.id)
      .single();

    const userActivities = activitiesData?.activities || '';
    console.log('User activities:', userActivities);

    const prompt = `Generate 5 professors who are experts in ${fieldOfInterest}. For each professor, provide:
    1. Full name
    2. Email (institutional email)
    3. Current position
    4. Institution name
    5. Recent research contributions or areas of focus

    Format the response as a JSON array where each object has these properties:
    {
      "name": "Full Name",
      "email": "institutional.email@university.edu",
      "position": "Current Position",
      "institution": "University Name",
      "recentWork": "Brief description of recent research"
    }`;

    console.log('Sending request to OpenAI...');
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
            content: 'You are a helpful assistant that generates information about professors in specific academic fields. Always respond with valid JSON arrays containing professor information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    let professors;
    try {
      professors = JSON.parse(data.choices[0].message.content);
      console.log('Parsed professors data:', professors);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse professor data from OpenAI response');
    }

    if (!Array.isArray(professors)) {
      throw new Error('Invalid response format: expected an array of professors');
    }

    const processedProfessors = professors.map(prof => ({
      ...prof,
      generatedEmail: `Dear Dr. ${prof.name.split(' ').pop()},

I hope this email finds you well. I am a student deeply passionate about ${fieldOfInterest}. I am reaching out to express my interest in working on research projects under your guidance.

I was particularly intrigued by your recent work on ${prof.recentWork}. Your innovative approach aligns perfectly with my interests and aspirations in ${fieldOfInterest}.

${userActivities ? `Through my experiences, I have developed relevant skills and demonstrated my commitment to research. ${userActivities}` : ''}

I would greatly appreciate any opportunity to contribute to your research projects under your expertise and guidance. I am open to working in any capacity that would allow me to learn and make meaningful contributions to your work.

Thank you for considering my request. I am available to discuss potential opportunities at your convenience.

Best regards,
[Your Name]`
    }));

    console.log('Sending response with processed professors');
    return new Response(JSON.stringify(processedProfessors), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in getprofessors function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Please try again or contact support if the issue persists.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});