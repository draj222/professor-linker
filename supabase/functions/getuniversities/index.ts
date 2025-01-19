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
    console.log("🚀 Starting university generation request");
    const { fieldOfInterest, educationLevel, universityCount = "6" } = await req.json();
    
    if (!fieldOfInterest) {
      console.error("❌ No field of interest provided");
      throw new Error('Field of interest is required');
    }

    if (!openAIApiKey) {
      console.error("❌ OpenAI API key not configured");
      throw new Error('OpenAI API key is not configured');
    }

    console.log(`📚 Generating ${universityCount} universities for field: ${fieldOfInterest}`);

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
            content: `You are a university recommendation system. Generate ${universityCount} real universities that excel in ${fieldOfInterest}${educationLevel ? ` for ${educationLevel} students` : ''}.
            Return ONLY a JSON array of university objects.
            Each object MUST have these exact fields:
            - id (string, UUID format)
            - name (string)
            - country (string)
            - ranking (number between 1-1000)
            - academic_focus (array of strings)
            - research_funding_level (string: 'high'/'medium'/'low')
            Example: [{"id": "uuid", "name": "MIT", "country": "USA", "ranking": 1, "academic_focus": ["Computer Science"], "research_funding_level": "high"}]`
          },
          {
            role: 'user',
            content: `Generate ${universityCount} universities specializing in ${fieldOfInterest}. Return ONLY the JSON array.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error(`❌ OpenAI API error (${response.status}):`, await response.text());
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Raw OpenAI response:", JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.content) {
      console.error("❌ Invalid response format from OpenAI:", data);
      throw new Error('Invalid response format from OpenAI');
    }

    let content = data.choices[0].message.content.trim();
    console.log("🔍 Processing content:", content);

    // Clean the content
    content = content
      .replace(/```json\s*|\s*```/g, '')
      .trim();

    const universities = JSON.parse(content);

    if (!Array.isArray(universities)) {
      console.error("❌ Response is not an array:", universities);
      throw new Error('Invalid response format: not an array');
    }

    // Validate and normalize each university
    const validatedUniversities = universities.map(uni => ({
      id: uni.id || crypto.randomUUID(),
      name: uni.name || 'Unknown University',
      country: uni.country || 'Unknown Country',
      ranking: typeof uni.ranking === 'number' ? Math.min(Math.max(1, uni.ranking), 1000) : 999,
      academic_focus: Array.isArray(uni.academic_focus) ? uni.academic_focus : [fieldOfInterest],
      research_funding_level: ['high', 'medium', 'low'].includes(uni.research_funding_level?.toLowerCase()) 
        ? uni.research_funding_level.toLowerCase() 
        : 'medium',
      matchScore: calculateMatchScore(uni, fieldOfInterest)
    }));

    console.log(`✅ Successfully processed ${validatedUniversities.length} universities`);

    return new Response(JSON.stringify(validatedUniversities), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in getuniversities function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate universities. Please try again.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculateMatchScore(university: any, fieldOfInterest: string): number {
  let score = 70; // Base score

  // Boost score based on ranking
  if (university.ranking) {
    if (university.ranking <= 10) score += 15;
    else if (university.ranking <= 50) score += 10;
    else if (university.ranking <= 100) score += 5;
  }

  // Boost score based on research funding
  if (university.research_funding_level?.toLowerCase() === 'high') score += 10;
  else if (university.research_funding_level?.toLowerCase() === 'medium') score += 5;

  // Boost score based on academic focus match
  if (Array.isArray(university.academic_focus)) {
    const focusMatch = university.academic_focus.some(
      (focus: string) => focus.toLowerCase().includes(fieldOfInterest.toLowerCase())
    );
    if (focusMatch) score += 5;
  }

  return Math.min(100, Math.max(0, score));
}