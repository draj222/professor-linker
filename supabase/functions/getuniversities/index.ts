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

    const count = parseInt(universityCount);
    console.log(`📚 Generating ${count} universities for field: ${fieldOfInterest}, education level: ${educationLevel}`);

    console.log("🤖 Making request to OpenAI API...");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a university recommendation expert. Generate exactly ${count} real, existing universities that excel in ${fieldOfInterest}${educationLevel ? ` for ${educationLevel} students` : ''}.
            
            Rules:
            1. Only include real, existing universities
            2. Focus on universities known for ${fieldOfInterest}
            3. Include a mix of universities from different countries
            4. Ensure accurate rankings (if provided)
            5. Research funding levels must be 'high', 'medium', or 'low'
            6. Academic focus must be an array of strings
            
            Return ONLY a JSON array with objects containing these exact fields:
            - name (string, required)
            - country (string, required)
            - ranking (number, optional)
            - academic_focus (string array, required)
            - research_funding_level (string: 'high'/'medium'/'low', required)
            
            Example format:
            [
              {
                "name": "Massachusetts Institute of Technology",
                "country": "United States",
                "ranking": 1,
                "academic_focus": ["Computer Science", "Engineering", "Mathematics"],
                "research_funding_level": "high"
              }
            ]`
          }
        ],
        temperature: 0.7
      }),
    });

    console.log("📡 Received response from OpenAI");
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ OpenAI API error response:", errorData);
      
      if (response.status === 401) {
        console.error("🔑 Invalid OpenAI API key");
        throw new Error('Invalid OpenAI API key');
      } else if (response.status === 429) {
        console.error("⏰ Rate limit exceeded or insufficient credits");
        throw new Error('OpenAI API rate limit exceeded or insufficient credits');
      } else {
        console.error(`❌ OpenAI API error: ${response.status}`);
        throw new Error(`OpenAI API error: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log("📦 Raw OpenAI response:", JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.content) {
      console.error("❌ Invalid response format from OpenAI:", data);
      throw new Error('Invalid response format from OpenAI');
    }

    let universities;
    try {
      const content = data.choices[0].message.content;
      console.log("🔍 Parsing content:", content);
      
      // Handle both string and parsed JSON responses
      universities = typeof content === 'string' ? JSON.parse(content) : content;

      // If the response is wrapped in a universities property, extract it
      if (!Array.isArray(universities) && universities.universities) {
        universities = universities.universities;
      }

      if (!Array.isArray(universities)) {
        console.error("❌ Parsed content is not an array:", universities);
        throw new Error('Response is not an array');
      }

      // Validate and clean up each university object
      universities = universities.map((uni, index) => {
        console.log(`🏛️ Processing university ${index + 1}:`, uni);
        
        if (!uni.name || !uni.country) {
          console.error("❌ Missing required fields for university:", uni);
          throw new Error('Missing required fields in university data');
        }

        // Calculate a more meaningful match score based on various factors
        const matchScore = calculateMatchScore(uni, fieldOfInterest);

        return {
          id: crypto.randomUUID(),
          name: uni.name,
          country: uni.country,
          ranking: typeof uni.ranking === 'number' ? uni.ranking : null,
          academic_focus: Array.isArray(uni.academic_focus) ? uni.academic_focus : [fieldOfInterest],
          research_funding_level: ['high', 'medium', 'low'].includes(uni.research_funding_level?.toLowerCase()) 
            ? uni.research_funding_level.toLowerCase() 
            : 'medium',
          matchScore
        };
      });

      console.log(`✅ Successfully processed ${universities.length} universities`);
      console.log("🎓 Final universities data:", JSON.stringify(universities, null, 2));

    } catch (parseError) {
      console.error('❌ Error parsing OpenAI response:', parseError);
      console.error('Content that failed to parse:', data.choices[0].message.content);
      throw new Error(`Failed to parse universities: ${parseError.message}`);
    }

    return new Response(JSON.stringify(universities), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in getuniversities function:', error);
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

// Helper function to calculate match score based on various factors
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

  // Ensure score stays within 0-100 range
  return Math.min(100, Math.max(0, score));
}