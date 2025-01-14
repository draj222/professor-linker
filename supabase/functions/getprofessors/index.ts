import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting professor generation request");
    const { fieldOfInterest, userName, numberOfProfessors = 5, extracurriculars } = await req.json();
    
    console.log(`Generating ${numberOfProfessors} professors for field: ${fieldOfInterest}`);
    console.log("User experience:", extracurriculars);
    
    if (!fieldOfInterest) {
      console.error("No field of interest provided");
      throw new Error('Field of interest is required');
    }

    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      throw new Error('OpenAI API key is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert academic researcher with deep knowledge of universities and research institutions worldwide. 
            Your task is to identify ${numberOfProfessors} promising researchers in ${fieldOfInterest} who would be excellent potential advisors.
            
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
            - recentWork (string)
            
            Make the recentWork field specific and technical, mentioning actual research topics and findings.
            
            IMPORTANT: You must return exactly ${numberOfProfessors} professors, no more and no less.`
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

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid response format from OpenAI:", data);
      throw new Error('Invalid response format from OpenAI');
    }

    try {
      const content = data.choices[0].message.content;
      let professors = typeof content === 'string' ? JSON.parse(content) : content;
      
      if (!Array.isArray(professors)) {
        console.error("Response is not an array:", professors);
        throw new Error('Invalid response format: not an array');
      }

      if (professors.length !== numberOfProfessors) {
        console.error(`Expected ${numberOfProfessors} professors but got ${professors.length}`);
        throw new Error(`Invalid number of professors generated`);
      }

      console.log(`Successfully generated ${professors.length} professors`);
      
      // Format extracurriculars as bullet points
      const formattedExperience = extracurriculars
        ? extracurriculars
            .split('\n')
            .map(exp => exp.trim())
            .filter(exp => exp.length > 0)
            .map(exp => `- ${exp}`)
            .join('\n')
        : '[No experience provided]';
      
      professors = professors.map(prof => ({
        ...prof,
        generatedEmail: `Dear Dr. ${prof.name.split(' ').pop()},

I hope this email finds you well. My name is ${userName || '[Your name]'}, and I am a high school student deeply passionate about ${fieldOfInterest}. I am reaching out to express my interest in working on research projects under your guidance.

I was particularly intrigued by your recent work on ${prof.recentWork}. Your innovative approach aligns perfectly with my interests and aspirations in ${fieldOfInterest}.

My experience includes:
${formattedExperience}

I would greatly appreciate any opportunity to contribute to your research projects under your expertise and guidance. As a committed and passionate student, I am open to working in any capacity that would allow me to learn and make meaningful contributions to your work.

Thank you for considering my request. I am available to discuss potential opportunities at your convenience.

Best regards,
${userName || '[Your name]'}`
      }));

      return new Response(JSON.stringify(professors), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse researcher data from OpenAI response');
    }
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