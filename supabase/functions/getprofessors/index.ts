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
    const { fieldOfInterest, numberOfProfessors = 5 } = await req.json();
    console.log("Generating researchers for field:", fieldOfInterest);
    console.log("Number of researchers requested:", numberOfProfessors);

    if (!fieldOfInterest) {
      throw new Error('Field of interest is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

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
            content: `You are an expert in academic research and university faculty. Generate a list of ${numberOfProfessors} emerging researchers, focusing on:
              1. Early-career professors or assistant professors who are doing innovative work but aren't widely known yet
              2. Outstanding PhD candidates or postdoctoral researchers at top universities who are making significant contributions
              3. Researchers who are publishing interesting work but haven't achieved mainstream recognition yet
              
              For each person, ensure they are from reputable universities but prioritize those who are not yet widely known in their field.
              Return ONLY a JSON array of objects, where each object has: name, email, position, institution, and recentWork.
              Use real university domains for emails.`
          },
          { 
            role: 'user', 
            content: `Generate ${numberOfProfessors} emerging researchers specializing in ${fieldOfInterest}. Include early-career professors, promising PhD candidates, and postdoctoral researchers.` 
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");

    let professors;
    try {
      const content = data.choices[0].message.content;
      professors = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Ensure we have an array of professors
      professors = Array.isArray(professors) ? professors : 
                  Array.isArray(professors.professors) ? professors.professors : 
                  [];
                  
      console.log(`Successfully parsed ${professors.length} researchers`);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse researcher data from OpenAI response');
    }

    return new Response(JSON.stringify(professors), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in getprofessors function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});