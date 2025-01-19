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
            content: `Generate exactly ${count} universities that excel in ${fieldOfInterest}${educationLevel ? ` for ${educationLevel} students` : ''}. Return a JSON array with objects containing: name (string), country (string), ranking (optional number), academic_focus (string array), research_funding_level (string: 'high'/'medium'/'low').`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" }
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
      
      universities = typeof content === 'string' 
        ? JSON.parse(content) 
        : content;

      if (!Array.isArray(universities) && universities.universities) {
        universities = universities.universities;
      }

      if (!Array.isArray(universities)) {
        console.error("❌ Parsed content is not an array:", universities);
        throw new Error('Response is not an array');
      }

      universities = universities.map(uni => ({
        id: crypto.randomUUID(),
        name: uni.name,
        country: uni.country,
        ranking: uni.ranking || null,
        academic_focus: Array.isArray(uni.academic_focus) ? uni.academic_focus : [fieldOfInterest],
        research_funding_level: uni.research_funding_level || 'medium'
      }));

      console.log(`✅ Successfully processed ${universities.length} universities`);
      console.log("🎓 Final universities data:", JSON.stringify(universities, null, 2));

    } catch (parseError) {
      console.error('❌ Error parsing OpenAI response:', parseError);
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
        details: 'Failed to generate universities. Please try again.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});