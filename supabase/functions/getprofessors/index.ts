import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are an expert in academic research and university faculty. Generate a list of professors who specialize in the given field. Return the response as a JSON array of objects, where each object has the following properties: name, email, position, institution, and recentWork. Make sure to use real university domains for emails and focus on top universities.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fieldOfInterest } = await req.json();
    console.log("Generating professors for field:", fieldOfInterest);

    if (!fieldOfInterest) {
      throw new Error('Field of interest is required');
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
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Generate 10 professors specializing in ${fieldOfInterest}. Include their name, email (using real university domains), position, institution, and a brief description of their recent work. Make it realistic and focused on top universities.` 
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");

    let professors = JSON.parse(data.choices[0].message.content).professors;

    // Generate personalized emails for each professor
    professors = await Promise.all(professors.map(async (prof) => {
      try {
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
                Write a 200-word email to a professor expressing interest in their research.
                The email should be formal, well-structured, and demonstrate knowledge of their work.
                Always address the professor as "Dr." followed by their last name.
                Use proper grammar and punctuation.` 
              },
              { 
                role: 'user', 
                content: `Write an email to Dr. ${prof.name} at ${prof.institution}.
                Their recent work focuses on: ${prof.recentWork}
                Field of interest: ${fieldOfInterest}
                The email should express interest in their research and potential collaboration opportunities.
                Make it exactly 200 words.`
              }
            ],
            temperature: 0.7,
          }),
        });

        if (!emailResponse.ok) {
          throw new Error(`OpenAI API error: ${emailResponse.statusText}`);
        }

        const emailData = await emailResponse.json();
        return {
          ...prof,
          generatedEmail: emailData.choices[0].message.content,
        };
      } catch (error) {
        console.error('Error generating email for professor:', prof.name, error);
        return prof;
      }
    }));

    console.log(`Successfully generated ${professors.length} professors with emails`);

    return new Response(JSON.stringify(professors), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in getprofessors function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});