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
    const { fieldOfInterest, numberOfProfessors = 5 } = await req.json();
    
    console.log(`Generating ${numberOfProfessors} professors for field: ${fieldOfInterest}`);

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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI that generates professor information.
            Generate EXACTLY ${numberOfProfessors} professors, no more, no less.
            Return ONLY a raw JSON array of professor objects.
            NO markdown, NO backticks, NO additional text.
            Each object must have these exact fields:
            - name (string)
            - email (string)
            - position (string)
            - institution (string)
            - recentWork (string)
            Example format: [{"name": "Dr. Smith",...}]
            The array MUST contain exactly ${numberOfProfessors} items.`
          },
          {
            role: 'user',
            content: `Generate exactly ${numberOfProfessors} professors in ${fieldOfInterest}. Return ONLY the JSON array.`
          }
        ],
        temperature: 0.7,
      }),
    });

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

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid response format from OpenAI:", data);
      throw new Error('Invalid response format from OpenAI');
    }

    let content = data.choices[0].message.content;
    console.log("Raw content from OpenAI:", content);

    // Clean the content more aggressively
    content = content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*\[\s*/, '[')
      .replace(/\s*\]\s*$/, ']')
      .trim();

    console.log("Cleaned content:", content);

    try {
      const professors = JSON.parse(content);
      
      if (!Array.isArray(professors)) {
        console.error("Response is not an array:", professors);
        throw new Error('Invalid response format: not an array');
      }

      if (professors.length !== numberOfProfessors) {
        console.error(`Expected ${numberOfProfessors} professors but got ${professors.length}`);
        throw new Error(`Invalid number of professors generated`);
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