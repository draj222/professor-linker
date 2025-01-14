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
    const { fieldOfInterest } = await req.json();
    
    if (!fieldOfInterest) {
      console.error("No field of interest provided");
      throw new Error('Field of interest is required');
    }

    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      throw new Error('OpenAI API key is not configured');
    }

    console.log(`Generating professors for field: ${fieldOfInterest}`);

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
            content: `You are an expert in academic research and university faculty. Generate a list of 5 emerging researchers in ${fieldOfInterest}, focusing on:
              1. Early-career professors or assistant professors who are doing innovative work
              2. Outstanding PhD candidates or postdoctoral researchers at top universities
              3. Researchers who are publishing interesting work in ${fieldOfInterest}
              
              For each person, provide:
              - name
              - email (use real university domains)
              - position
              - institution
              - recentWork (a brief description of their recent research)
              
              Return ONLY a JSON array of objects with these exact fields. Do not include any other text or explanation.`
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
      
      // Validate and sanitize each professor object
      professors = professors.map(prof => ({
        name: prof.name || 'Unknown',
        email: prof.email || 'no-email@university.edu',
        position: prof.position || 'Researcher',
        institution: prof.institution || 'Unknown Institution',
        recentWork: prof.recentWork || 'Recent research information not available',
        generatedEmail: `Dear ${prof.name},\n\nI hope this email finds you well. I am writing to express my interest in your research work on ${prof.recentWork}. Your work aligns perfectly with my academic interests, and I would be grateful for the opportunity to discuss potential research opportunities.\n\nBest regards`
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