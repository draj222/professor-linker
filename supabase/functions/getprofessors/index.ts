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

    const systemPrompt = `You are an expert in academic research and university faculty. Generate a list of 50 professors who specialize in ${fieldOfInterest}. For each professor, include their name, email, position, institution, and a brief description of their recent work. Format the response as an array of objects.`;

    console.log("Sending request to OpenAI...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Generate a list of professors specializing in ${fieldOfInterest}. Include their name, email (using real university domains), position, institution, and a brief description of their recent work. Make it realistic and focused on top universities.` 
          }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid OpenAI response:', data);
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = data.choices[0].message.content;
    console.log("Generated content:", generatedContent);

    // Process the response to ensure it's in the correct format
    let professors;
    try {
      // The response might be a string that needs parsing, or might already be an object
      professors = typeof generatedContent === 'string' ? JSON.parse(generatedContent) : generatedContent;
      
      // Ensure it's an array
      if (!Array.isArray(professors)) {
        // If it's an object with a data/results property, try to extract the array
        professors = professors.data || professors.results || professors.professors || [];
      }

      // Generate personalized emails for each professor
      professors = professors.map(prof => ({
        ...prof,
        generatedEmail: `Dear ${prof.name},\n\nI am writing to express my interest in your research work on ${fieldOfInterest}, particularly your recent work on ${prof.recentWork}. Your expertise in this area aligns perfectly with my academic interests and career goals.\n\nI would greatly appreciate the opportunity to discuss potential research opportunities in your lab.\n\nBest regards,\n[Your name]`
      }));

      console.log(`Successfully processed ${professors.length} professors`);
    } catch (error) {
      console.error('Error processing professor data:', error);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to process professor data');
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