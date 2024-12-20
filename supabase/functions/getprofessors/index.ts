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
    const { fieldOfInterest } = await req.json();
    console.log("Generating professors for field:", fieldOfInterest);

    if (!fieldOfInterest) {
      throw new Error('Field of interest is required');
    }

    const prompt = `Generate a detailed list of 50 realistic professors who specialize in ${fieldOfInterest}. Focus on professors from top universities like Stanford, MIT, Harvard, UC Berkeley, Carnegie Mellon, and other leading institutions.

For each professor, provide:
1. Full name (use realistic academic names)
2. Email (use their actual university domain, e.g., @stanford.edu, @mit.edu, etc.)
3. Current position/title (be specific with their academic role)
4. Institution (focus on real top universities)
5. A brief description of their recent work or research interests related to ${fieldOfInterest}
6. A personalized email template that a student would send to inquire about research opportunities, mentioning their specific work.

Format the response as a JSON array of objects with these fields: name, email, position, institution, recentWork, generatedEmail.

Make sure each professor's details are realistic and their research aligns with ${fieldOfInterest}. Use actual university email domains and realistic academic titles.`;

    console.log("Sending request to OpenAI...");
    
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
            content: 'You are an expert in academic research and university faculty. Generate detailed, accurate information about professors and their research work in JSON format.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }  // Ensure JSON response
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI:", data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid OpenAI response:', data);
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = data.choices[0].message.content;
    let professors;
    
    try {
      professors = JSON.parse(generatedContent);
      console.log(`Successfully parsed professor data. Generated ${professors.length} professors`);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse professor data');
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