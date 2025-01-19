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
    console.log("Starting university generation request");
    const { fieldOfInterest, educationLevel, numberOfUniversities = 6 } = await req.json();
    
    if (!fieldOfInterest) {
      console.error("No field of interest provided");
      throw new Error('Field of interest is required');
    }

    console.log(`Generating ${numberOfUniversities} universities for field: ${fieldOfInterest}, education level: ${educationLevel}`);

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
            content: `You are an AI that generates university suggestions based on academic interests and goals.
            Focus on lesser-known but high-quality institutions that specialize in specific fields.
            Avoid very popular or highly ranked universities (avoid top 20 globally ranked universities).
            Prioritize universities known for unique programs or specialized research in specific fields.
            Return ONLY a raw JSON array of ${numberOfUniversities} university objects.
            NO markdown, NO backticks, NO additional text.
            Each object must have these exact fields:
            - id (string, uuid v4)
            - name (string)
            - country (string)
            - ranking (number, optional)
            - academic_focus (string array)
            - research_funding_level (string: 'high', 'medium', or 'low')
            Example format: [{"id": "uuid", "name": "MIT",...}]
            Focus on universities that excel in the given field and are appropriate for the education level.`
          },
          {
            role: 'user',
            content: `Generate ${numberOfUniversities} specialized, less commonly known universities that excel in ${fieldOfInterest}${educationLevel ? ` and are suitable for ${educationLevel} students` : ''}. Prioritize universities with unique programs or research focus. Return ONLY the JSON array.`
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
      const universities = JSON.parse(content);
      
      if (!Array.isArray(universities)) {
        console.error("Response is not an array:", universities);
        throw new Error('Invalid response format: not an array');
      }

      // Add match scores to universities based on field alignment
      const universitiesWithScores = universities.map(uni => ({
        ...uni,
        matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100 for now
      }));

      return new Response(JSON.stringify(universitiesWithScores), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error(`Error parsing OpenAI response: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Error in getuniversities function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate universities. Please check the logs for more information.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});