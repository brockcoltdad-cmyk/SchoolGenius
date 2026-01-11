// @ts-nocheck - Deno runtime, TypeScript errors expected
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PROMPT_TYPES = [
  "narrative", "descriptive", "persuasive", "expository", "creative",
  "opinion", "compare_contrast", "cause_effect", "how_to", "personal_narrative"
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const grokKey = Deno.env.get("XAI_API_KEY");

    if (!grokKey) {
      return new Response(JSON.stringify({ error: "XAI_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existingCount } = await supabase
      .from("writing_prompts")
      .select("id", { count: "exact", head: true });

    const totalPrompts = existingCount || 0;

    if (totalPrompts >= 2000) {
      return new Response(JSON.stringify({
        message: "All writing prompts generated!",
        total: totalPrompts
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const gradeLevel = Math.floor(Math.random() * 9);
    const promptType = PROMPT_TYPES[Math.floor(Math.random() * PROMPT_TYPES.length)];

    const minWords = 50 + (gradeLevel * 30);
    const maxWords = minWords + 100;
    const coinsReward = 20 + (gradeLevel * 10);

    const prompt = `Create an engaging ${promptType} writing prompt for grade ${gradeLevel} students.

Requirements:
- Age-appropriate topic and vocabulary
- Clear and specific instructions
- Encourages creativity and critical thinking
- Relevant to students' lives and interests
- Should inspire ${minWords}-${maxWords} word responses

Return a JSON object with this structure:
{
  "title": "A catchy title for the prompt",
  "prompt_text": "The detailed writing prompt (2-3 sentences with clear instructions)",
  "rubric": {
    "ideas": "What makes a strong response in terms of ideas and content",
    "organization": "What makes a well-organized response",
    "voice": "What voice and style to use",
    "word_choice": "What kind of vocabulary to use",
    "sentence_fluency": "What makes good sentence structure",
    "conventions": "Grammar and mechanics expectations"
  }
}

Return ONLY valid JSON.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${grokKey}`
      },
      body: JSON.stringify({
        model: "grok-2-1212",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    let contentStr = data.choices?.[0]?.message?.content?.trim();

    if (!contentStr) throw new Error("No content from Grok API");

    if (contentStr.startsWith("```json")) contentStr = contentStr.slice(7);
    if (contentStr.startsWith("```")) contentStr = contentStr.slice(3);
    if (contentStr.endsWith("```")) contentStr = contentStr.slice(0, -3);
    contentStr = contentStr.trim();

    const content = JSON.parse(contentStr);

    if (!content.title || !content.prompt_text || !content.rubric) {
      throw new Error("Invalid prompt format from API");
    }

    const { error: insertError } = await supabase.from("writing_prompts").insert({
      grade_level: gradeLevel,
      prompt_type: promptType,
      title: content.title,
      prompt_text: content.prompt_text,
      min_words: minWords,
      max_words: maxWords,
      rubric: content.rubric,
      coins_reward: coinsReward
    });

    if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);

    return new Response(JSON.stringify({
      success: true,
      prompt_number: totalPrompts + 1,
      grade_level: gradeLevel,
      prompt_type: promptType,
      title: content.title
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in generate-writing-prompts:", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
