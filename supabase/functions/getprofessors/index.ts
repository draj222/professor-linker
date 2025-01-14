import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are an expert in academic research and university faculty. Generate a list of emerging researchers, focusing on:
1. Early-career professors or assistant professors who are doing innovative work but aren't widely known yet
2. Outstanding PhD candidates or postdoctoral researchers at top universities who are making significant contributions
3. Researchers who are publishing interesting work but haven't achieved mainstream recognition yet

For each person, ensure they are from reputable universities but prioritize those who are not yet widely known in their field. Return the response as a JSON array of objects, where each object has: name, email, position, institution, and recentWork. Use real university domains for emails.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fieldOfInterest, userName, numberOfProfessors = 10 } = await req.json();
    console.log("Generating researchers for field:", fieldOfInterest);
    console.log("User name:", userName);
    console.log("Number of researchers requested:", numberOfProfessors);

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
            content: `Generate ${numberOfProfessors} emerging researchers specializing in ${fieldOfInterest}. Include early-career professors, promising PhD candidates, and postdoctoral researchers. Include their name, email (using real university domains), position, institution, and a brief description of their recent innovative work. Focus on those making interesting contributions but who aren't yet widely known in their field.` 
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

    // Generate personalized emails for each researcher
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
                content: `You are an expert at writing professional academic emails from the perspective of a passionate high school student.
                Write a 200-word email to a researcher expressing interest in their work.
                The email should:
                - Be formal and well-structured
                - Show genuine interest in their specific research area
                - Mention that you are a high school student passionate about their field
                - Express enthusiasm for learning and potentially contributing
                - Request an opportunity to learn more about their research or possibly shadow/intern
                - Use proper grammar and punctuation
                - Address PhD students as Mr./Ms. and professors as Dr.
                - Be exactly 200 words
                - Never use placeholders like [Your Name], always use the actual name provided` 
              },
              { 
                role: 'user', 
                content: `Write an email to ${prof.position.includes('PhD') || prof.position.includes('Postdoc') ? 'Mr./Ms.' : 'Dr.'} ${prof.name} at ${prof.institution}.
                The email should be from ${userName}, a high school student interested in ${fieldOfInterest}.
                Their recent work focuses on: ${prof.recentWork}
                Make it exactly 200 words, formal, and enthusiastic.
                Use the name "${userName}" in the email signature, not [Your Name] or any other placeholder.`
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
        console.error('Error generating email for researcher:', prof.name, error);
        return prof;
      }
    }));

    console.log(`Successfully generated ${professors.length} researchers with emails`);

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