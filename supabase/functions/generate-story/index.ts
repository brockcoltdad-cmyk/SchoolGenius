// @ts-nocheck - Deno runtime, TypeScript errors expected
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GENRES = ["Adventure", "Mystery", "Fantasy", "Science Fiction", "Realistic Fiction", "Historical Fiction", "Sports", "Animals", "Humor"];
const LEXILE_BANDS = ["100-300", "300-500", "500-700", "700-900", "900-1100", "1100-1300"];

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
      .from("stories")
      .select("id", { count: "exact", head: true });

    const totalStories = existingCount || 0;

    if (totalStories >= 1000) {
      return new Response(JSON.stringify({
        message: "All stories generated!",
        total: totalStories
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const gradeLevel = Math.floor(Math.random() * 9);
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const lexileBand = LEXILE_BANDS[Math.min(Math.floor(gradeLevel / 2), LEXILE_BANDS.length - 1)];
    const genderTarget = ["boys", "girls", "neutral"][Math.floor(Math.random() * 3)];

    const wordCount = 100 + (gradeLevel * 50) + Math.floor(Math.random() * 100);

    const prompt = `Write an engaging ${genre} story for grade ${gradeLevel} students (Lexile ${lexileBand}).
Target audience: ${genderTarget}.
Word count: approximately ${wordCount} words.

Requirements:
- Age-appropriate vocabulary and themes
- Clear narrative structure with beginning, middle, and end
- Engaging characters and plot
- Educational value while being entertaining
- Proper grammar and punctuation

Return ONLY the story text, no titles or metadata.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${grokKey}`
      },
      body: JSON.stringify({
        model: "grok-2-1212",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    const storyContent = data.choices?.[0]?.message?.content?.trim();

    if (!storyContent) throw new Error("No content from Grok API");

    const actualWordCount = storyContent.split(/\s+/).length;
    const expectedTime = Math.ceil(actualWordCount / 100);
    const coinsReward = 10 + (gradeLevel * 5) + Math.floor(actualWordCount / 50);

    const { error: insertError } = await supabase.from("stories").insert({
      lexile_band: lexileBand,
      grade_level: gradeLevel,
      genre: genre,
      gender_target: genderTarget,
      title: `${genre} Story ${totalStories + 1}`,
      content: storyContent,
      word_count: actualWordCount,
      expected_time_minutes: expectedTime,
      coins_reward: coinsReward,
      bonus_coins: Math.floor(coinsReward * 0.5),
      is_active: true,
    });

    if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);

    return new Response(JSON.stringify({
      success: true,
      story_number: totalStories + 1,
      grade_level: gradeLevel,
      genre: genre,
      word_count: actualWordCount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in generate-story:", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
