import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SPELLING_RULES = [
  "short_vowels", "long_vowels", "consonant_blends", "digraphs", "silent_e",
  "vowel_teams", "r_controlled", "diphthongs", "prefixes", "suffixes",
  "double_consonants", "soft_c_g", "homophones", "irregular", "compound_words"
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
      .from("spelling_words")
      .select("id", { count: "exact", head: true });

    const totalWords = existingCount || 0;

    if (totalWords >= 5000) {
      return new Response(JSON.stringify({
        message: "All spelling words generated!",
        total: totalWords
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const gradeLevel = Math.floor(Math.random() * 9);
    const weekNumber = Math.floor(totalWords / 20) + 1;
    const ruleCode = SPELLING_RULES[Math.floor(Math.random() * SPELLING_RULES.length)];
    const difficulty = gradeLevel < 2 ? "easy" : gradeLevel < 5 ? "medium" : "hard";

    const prompt = `Generate 10 spelling words for grade ${gradeLevel} students.
Rule focus: ${ruleCode}
Difficulty: ${difficulty}

Requirements:
- Age-appropriate words
- Follow the ${ruleCode} spelling pattern
- Varied difficulty within the grade level
- Real English words that students would encounter
- No proper nouns

Return ONLY a JSON array of 10 words, like: ["word1", "word2", "word3", ...]`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${grokKey}`
      },
      body: JSON.stringify({
        model: "grok-2-1212",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
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

    const words = JSON.parse(contentStr);

    if (!Array.isArray(words) || words.length === 0) {
      throw new Error("Invalid words format from API");
    }

    const wordsToInsert = words.slice(0, 10).map(word => ({
      grade_level: gradeLevel,
      week_number: weekNumber,
      word: word.toLowerCase().trim(),
      rule_code: ruleCode,
      difficulty: difficulty
    }));

    const { error: insertError } = await supabase
      .from("spelling_words")
      .insert(wordsToInsert);

    if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);

    return new Response(JSON.stringify({
      success: true,
      words_added: wordsToInsert.length,
      grade_level: gradeLevel,
      rule_code: ruleCode,
      total_words: totalWords + wordsToInsert.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in generate-spelling-words:", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
