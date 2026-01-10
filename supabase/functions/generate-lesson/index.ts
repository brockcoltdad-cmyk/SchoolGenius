import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VISUAL_TYPE_MAP: Record<string, Record<string, string>> = {
  MATH: { "counting": "counting_objects", "addition": "counting_objects", "subtraction": "counting_objects", "number_sense": "number_line", "number_line": "number_line", "place_value": "place_value", "multiplication": "array", "division": "array", "arrays": "array", "fractions": "fraction", "decimals": "fraction", "percents": "fraction", "word_problems": "bar_model", "equations": "balance_scale", "pre_algebra": "balance_scale", "algebra": "equation_steps", "linear": "equation_steps", "graphing": "graph", "coordinate": "graph", "functions": "graph", "default": "counting_objects" },
  READ: { "letters": "letter", "alphabet": "letter", "phonics": "phonics", "sounds": "phonics", "blending": "word_building", "cvc": "word_building", "sight_words": "sight_word", "high_frequency": "sight_word", "syllables": "syllable", "default": "letter" },
  LANG: { "parts_of_speech": "sentence_builder", "nouns": "sentence_builder", "verbs": "sentence_builder", "grammar": "sentence_builder", "sentences": "sentence_builder", "default": "sentence_builder" },
  SPELL: { "spelling": "spelling_rule", "suffixes": "spelling_rule", "prefixes": "spelling_rule", "roots": "spelling_rule", "default": "spelling_rule" },
  TYPE: { "typing": "keyboard", "keyboard": "keyboard", "default": "keyboard" },
  CODE: { "variables": "variable_box", "loops": "loop_animation", "output": "output", "print": "output", "blocks": "code_block", "scratch": "code_block", "conditionals": "conditional", "if_else": "conditional", "default": "code_block" }
};

const GRADE_DESCRIPTIONS: Record<number, string> = {
  0: "Kindergarten (ages 5-6): Very simple words, lots of emojis, single-digit numbers, 1-2 sentence explanations",
  1: "1st Grade (ages 6-7): Simple sentences, numbers 0-20, basic sight words",
  2: "2nd Grade (ages 7-8): Short paragraphs, numbers 0-100, two-step problems",
  3: "3rd Grade (ages 8-9): Multi-step problems, multiplication/division, intro fractions",
  4: "4th Grade (ages 9-10): Multi-digit operations, fractions, decimals",
  5: "5th Grade (ages 10-11): Complex fractions, decimals, percents, pre-algebra",
  6: "6th Grade (ages 11-12): Ratios, proportions, negative numbers, basic algebra",
  7: "7th Grade (ages 12-13): Algebraic expressions, equations, geometry",
  8: "8th Grade (ages 13-14): Linear equations, functions, Pythagorean theorem",
  9: "9th Grade (ages 14-15): Algebra I, quadratics, systems of equations",
  10: "10th Grade (ages 15-16): Geometry proofs, Algebra II",
  11: "11th Grade (ages 16-17): Advanced Algebra, trigonometry, SAT prep",
  12: "12th Grade (ages 17-18): Pre-calculus, college prep"
};

function getVisualType(subjectCode: string, skillName: string): string {
  const subjectMap = VISUAL_TYPE_MAP[subjectCode] || {};
  const skillLower = skillName.toLowerCase();
  for (const [keyword, visualType] of Object.entries(subjectMap)) {
    if (keyword !== "default" && skillLower.includes(keyword)) return visualType;
  }
  return subjectMap["default"] || "counting_objects";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const grokKey = Deno.env.get("XAI_API_KEY");

    if (!grokKey) {
      return new Response(JSON.stringify({ error: "XAI_API_KEY not configured", message: "Please set XAI_API_KEY in Supabase secrets" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let targetSkillId: string | null = null;
    try {
      const body = await req.json();
      targetSkillId = body.skill_id || null;
    } catch {}

    let skill;
    let diagnostics: any = {};

    if (targetSkillId) {
      const { data, error: skillError } = await supabase.from("curriculum_skills").select("*").eq("id", targetSkillId).maybeSingle();
      skill = data;
      diagnostics.targetSkillId = targetSkillId;
      diagnostics.skillFound = !!data;
      diagnostics.skillError = skillError?.message;
    } else {
      const { data: existingContent, error: contentError } = await supabase.from("lesson_content").select("skill_id");
      diagnostics.existingLessonsCount = existingContent?.length || 0;
      diagnostics.contentError = contentError?.message;
      
      const existingSkillIds = existingContent?.map((c) => c.skill_id) || [];
      const { data: skills, error: skillsError } = await supabase.from("curriculum_skills").select("*").eq("is_active", true).order("grade_level", { ascending: true }).order("display_order", { ascending: true });
      diagnostics.activeSkillsCount = skills?.length || 0;
      diagnostics.skillsError = skillsError?.message;
      diagnostics.hasXaiKey = !!grokKey;
      
      skill = skills?.find((s) => !existingSkillIds.includes(s.id));
      if (skill) {
        diagnostics.selectedSkill = { name: skill.skill_name, grade: skill.grade_level };
      }
    }

    if (!skill) {
      return new Response(JSON.stringify({
        message: "All done!",
        status: "complete",
        version: "2.0",
        diagnostics
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const visualType = getVisualType(skill.subject_code, skill.skill_name);
    const gradeDescription = GRADE_DESCRIPTIONS[skill.grade_level] || GRADE_DESCRIPTIONS[5];

    const prompt = `You are an expert K-12 curriculum designer creating a lesson for SchoolGenius.\n\nSKILL: ${skill.skill_name}\nSUBJECT: ${skill.subject_code}\nGRADE LEVEL: ${skill.grade_level}\nGRADE CONTEXT: ${gradeDescription}\nVISUAL TYPE: ${visualType}\n\nGenerate JSON with this structure:\n\n{\n  "rules_text": "2-3 paragraphs explaining the concept in age-appropriate language",\n  "rules_audio_script": "Conversational script for Gigi the AI tutor (150-200 words)",\n  "demo_problems": [{"problem": "Problem text", "visual_data": {}, "steps": ["Step 1...", "Step 2...", "Step 3..."], "think_aloud": "Hmm, let me think about this...", "answer": "The answer", "explanation": "Why this is correct"}],\n  "guided_practice": [{"problem": "Practice problem", "visual_data": {}, "answer": "Correct answer", "acceptable_answers": ["Answer", "Alternate form"], "hints": ["Hint 1", "Hint 2", "Hint 3"], "explanation_styles": {"visual": "Picture this...", "step_by_step": "Step 1...", "story": "Imagine...", "analogy": "It's like..."}, "explanation_if_wrong": "Not quite! Remember..."}],\n  "independent_practice": {"easy": [{"problem": "Easy 1", "visual_data": {}, "answer": "A", "acceptable_answers": ["A"], "wrong_answers": ["B", "C", "D"], "explanation": "..."}], "medium": [{"problem": "Med 1", "visual_data": {}, "answer": "A", "acceptable_answers": ["A"], "wrong_answers": ["B", "C", "D"], "explanation": "..."}], "hard": [{"problem": "Hard 1", "visual_data": {}, "answer": "A", "acceptable_answers": ["A"], "wrong_answers": ["B", "C", "D"], "explanation": "..."}]},\n  "challenge_problems": [{"problem": "Challenge 1", "visual_data": {}, "answer": "A", "explanation": "...", "coin_multiplier": 3}],\n  "quiz_questions": [{"question": "Q1", "visual_data": {}, "choices": {"A": "...", "B": "...", "C": "...", "D": "..."}, "correct": "A", "explanation": "...", "points": 10}],\n  "review_questions": [{"question": "Review 1", "answer": "...", "explanation": "..."}]\n}\n\nInclude 2 demo_problems, 2 guided_practice, 3 each for easy/medium/hard, 2 challenge, 5 quiz, 2 review. Return ONLY valid JSON.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${grokKey}` },
      body: JSON.stringify({ model: "grok-2-1212", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 8000 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Grok API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const contentStr = data.choices?.[0]?.message?.content;

    if (!contentStr) throw new Error("No content from Grok API");

    let content;
    try {
      let cleanJson = contentStr.trim();
      if (cleanJson.startsWith("```json")) cleanJson = cleanJson.slice(7);
      if (cleanJson.startsWith("```")) cleanJson = cleanJson.slice(3);
      if (cleanJson.endsWith("```")) cleanJson = cleanJson.slice(0, -3);
      content = JSON.parse(cleanJson.trim());
    } catch (e) {
      throw new Error(`Failed to parse Grok response as JSON: ${e.message}`);
    }

    const insertPayload = {
      skill_id: skill.id,
      skill_code: skill.skill_code,
      subject_code: skill.subject_code,
      skill_name: skill.skill_name,
      grade_level: skill.grade_level,
      visual_type: visualType,
      rules_text: content.rules_text || "",
      rules_audio_script: content.rules_audio_script || "",
      demo_problems: content.demo_problems || [],
      guided_practice: content.guided_practice || [],
      independent_practice: content.independent_practice || {},
      challenge_problems: content.challenge_problems || [],
      quiz_questions: content.quiz_questions || [],
      review_questions: content.review_questions || [],
    };

    const { data: insertData, error: insertError, status, statusText } = await supabase.from("lesson_content").insert(insertPayload);

    if (insertError) {
      console.error("Insert error details:", { error: insertError, status, statusText, payload: insertPayload });
      throw new Error(`Database insert failed: ${insertError.message} (status: ${status})`);
    }

    return new Response(JSON.stringify({ success: true, skill: skill.skill_name, grade_level: skill.grade_level, visual_type: visualType, inserted: !!insertData, debug: { hasError: !!insertError, errorMessage: insertError?.message } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    console.error("Error in generate-lesson:", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
