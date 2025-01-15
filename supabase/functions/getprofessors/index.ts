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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that generates information about professors. 
            Generate a JSON array containing exactly 5 professor objects.
            Do not include any markdown formatting, backticks, or additional text.
            Return only the raw JSON array with these exact fields:
            {
              "name": "string",
              "email": "string",
              "position": "string",
              "institution": "string",
              "recentWork": "string"
            }`
          },
          {
            role: 'user',
            content: `Generate 5 professors in ${fieldOfInterest}. Return only a raw JSON array, no markdown or formatting.`
          }
        ],
        temperature: 0.7,
      }),
    });

    console.log("Received response from OpenAI with status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error response:", errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded or insufficient credits');
      } else {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log("Received response from OpenAI:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response format from OpenAI:", data);
      throw new Error('Invalid response format from OpenAI');
    }

    try {
      const content = data.choices[0].message.content;
      console.log("Raw content from OpenAI:", content);
      
      // Clean the content by removing any markdown formatting
      let cleanContent = content
        .replace(/```json\s*/g, '') // Remove ```json
        .replace(/```\s*/g, '')     // Remove remaining ```
        .trim();                    // Remove whitespace
      
      console.log("Cleaned content before parsing:", cleanContent);
      
      const professors = JSON.parse(cleanContent);
      
      if (!Array.isArray(professors)) {
        console.error("Response is not an array:", professors);
        throw new Error('Invalid response format: not an array');
      }

      console.log(`Successfully generated ${professors.length} professors`);
      
      // Add email templates to professors
      const professorsWithEmails = professors.map(prof => ({
        ...prof,
        generatedEmail: `Dear ${prof.name},

I hope this email finds you well. I am writing to express my sincere interest in your research work, particularly your recent contributions to ${prof.recentWork}. Your innovative approach and findings in this area align perfectly with my academic interests and career goals.

I am particularly impressed by your work at ${prof.institution} and would be grateful for the opportunity to discuss potential research opportunities in your lab. Your expertise in ${fieldOfInterest} would provide invaluable guidance for my academic journey.

I would appreciate the chance to learn more about your current research projects and explore possibilities for collaboration. Would you be available for a brief discussion about potential research opportunities in your group?

Thank you for considering my request. I look forward to your response.

Best regards,
[Your name]`
      }));

      return new Response(JSON.stringify(professorsWithEmails), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Failed content:', data.choices[0].message.content);
      throw new Error('Failed to parse researcher data from OpenAI response');
    }
  } catch (error: any) {
    console.error('Error in getprofessors function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate professors. Please check the logs for more information.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});