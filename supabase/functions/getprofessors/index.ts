import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { fieldOfInterest, numberOfProfessors = 5, universities = [] } = await req.json();
    
    if (!fieldOfInterest) {
      console.error("No field of interest provided");
      throw new Error('Field of interest is required');
    }

    if (!universities.length) {
      console.error("No universities provided");
      throw new Error('At least one university is required');
    }

    console.log(`Generating ${numberOfProfessors} professors for field: ${fieldOfInterest}`);

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
            content: `You are an AI that generates professor information.
            Return ONLY a raw JSON array of ${numberOfProfessors} professor objects.
            NO markdown, NO backticks, NO additional text.
            Each object must have these exact fields:
            - name (string)
            - email (string)
            - position (string)
            - institution (string, must be one from the provided list)
            - recentWork (string)
            Example format: [{"name": "Dr. Smith",...}]
            Only generate professors from these universities: ${universities.map(u => u.name).join(', ')}`
          },
          {
            role: 'user',
            content: `Generate ${numberOfProfessors} professors in ${fieldOfInterest} who work at the following universities: ${universities.map(u => u.name).join(', ')}. Return ONLY the JSON array.`
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
    console.log("Received response from OpenAI");

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid response format from OpenAI:", data);
      throw new Error('Invalid response format from OpenAI');
    }

    let content = data.choices[0].message.content;
    console.log("Raw content from OpenAI:", content);

    content = content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*\[\s*/, '[')
      .replace(/\s*\]\s*$/, ']')
      .trim();

    try {
      const professors = JSON.parse(content);
      
      if (!Array.isArray(professors)) {
        console.error("Response is not an array:", professors);
        throw new Error('Invalid response format: not an array');
      }

      console.log(`Successfully parsed ${professors.length} professors`);
      
      // Add email templates to professors
      const professorsWithEmails = professors.map(prof => ({
        ...prof,
        generatedEmail: `Dear Dr. ${prof.name},

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
      console.error('Content that failed to parse:', content);
      throw new Error(`Error parsing OpenAI response: ${error.message}`);
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