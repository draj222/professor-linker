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
    const { fieldOfInterest, numberOfProfessors = 5 } = await req.json();
    
    if (!fieldOfInterest) {
      console.error("No field of interest provided");
      throw new Error('Field of interest is required');
    }

    console.log(`Generating ${numberOfProfessors} professors for field: ${fieldOfInterest}`);

    // First generate professors
    const professorsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            - email (string, use realistic university email format)
            - position (string)
            - institution (string)
            - recentWork (string, detailed description of their latest research)
            Example format: [{"name": "Dr. Smith",...}]`
          },
          {
            role: 'user',
            content: `Generate ${numberOfProfessors} professors in ${fieldOfInterest}. Return ONLY the JSON array.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!professorsResponse.ok) {
      const errorData = await professorsResponse.text();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${professorsResponse.status}`);
    }

    const professorsData = await professorsResponse.json();
    let professors = JSON.parse(professorsData.choices[0].message.content);

    console.log("Generated professors:", professors);

    // Now generate personalized emails for each professor
    const professorsWithEmails = await Promise.all(professors.map(async (prof) => {
      const emailResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: `You are an expert at writing professional academic emails.
              Write a personalized email to a professor expressing interest in their research.
              The email should be formal, well-structured, and demonstrate knowledge of their work.
              Include:
              - A formal greeting
              - Brief introduction
              - Specific interest in their research
              - Request for research opportunities
              - Professional closing`
            },
            {
              role: 'user',
              content: `Write an email to ${prof.name} at ${prof.institution} who works on ${prof.recentWork}.
              The email should express interest in their research in ${fieldOfInterest}.`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error(`Failed to generate email for ${prof.name}`);
      }

      const emailData = await emailResponse.json();
      const generatedEmail = emailData.choices[0].message.content;

      return {
        ...prof,
        generatedEmail,
      };
    }));

    console.log("Generated professors with emails:", professorsWithEmails);

    return new Response(JSON.stringify(professorsWithEmails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

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