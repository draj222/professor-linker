import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@4.14.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fieldOfInterest } = await req.json();
    console.log("Received field of interest:", fieldOfInterest);

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Generate 5 realistic but fictional professors who specialize in ${fieldOfInterest}. For each professor, include:
    1. Full name
    2. Email address (use university.edu domain)
    3. Position/title
    4. Institution
    5. A personalized email template that a student would send to inquire about research opportunities.
    Format as JSON array.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const responseContent = completion.data.choices[0].message?.content || "[]";
    console.log("Generated response:", responseContent);

    return new Response(responseContent, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in getprofessors function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);