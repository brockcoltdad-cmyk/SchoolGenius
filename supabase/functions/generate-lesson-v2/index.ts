// @ts-nocheck - Deno runtime, TypeScript errors expected
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
      return new Response(JSON.stringify({ error: "XAI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let targetSkillId: string | null = null;
    try {
      const body = await req.json();
      targetSkillId = body.skill_id || null;
    } catch {}

    let skill;
    if (targetSkillId) {
      const { data } = await supabase.from("curriculum_skills").select("*").eq("id", targetSkillId).maybeSingle();
      skill = data;
    } else {
      const { data: existingContent } = await supabase.from("lesson_content").select("skill_id");
      const existingSkillIds = existingContent?.map((c) => c.skill_id) || [];
      const { data: skills } = await supabase.from("curriculum_skills").select("*").eq("is_active", true).order("grade_level", { ascending: true });
      skill = skills?.find((s) => !existingSkillIds.includes(s.id));
    }

    if (!skill) {
      return new Response(JSON.stringify({ message: "All done!", status: "complete" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const visualType = getVisualType(skill.subject_code, skill.skill_name);
    const gradeDescription = GRADE_DESCRIPTIONS[skill.grade_level] || GRADE_DESCRIPTIONS[5];

    // ENHANCED PROMPT with multi-level explanations
    const prompt = `You are an expert K-12 curriculum designer creating a comprehensive lesson for SchoolGenius.

SKILL: ${skill.skill_name}
SUBJECT: ${skill.subject_code}
GRADE LEVEL: ${skill.grade_level}
GRADE CONTEXT: ${gradeDescription}

Generate JSON with this EXACT structure:

{
  "rules_text": "2-3 paragraphs explaining the concept",
  "rules_audio_script": "Conversational script for Gigi (150-200 words). Start with 'Hi! Today we're learning about...'",

  "demo_problems": [
    {
      "problem": "Example problem",
      "steps": ["Step 1...", "Step 2...", "Step 3..."],
      "think_aloud": "Hmm, let me think...",
      "answer": "The answer",
      "explanation": "Why this works"
    }
  ],

  "guided_practice": [
    {
      "problem": "Practice problem",
      "answer": "Correct answer",
      "acceptable_answers": ["Answer", "Alternate form"],
      "hints": ["Hint 1", "Hint 2", "Hint 3"],
      "explanation_if_wrong": "Not quite! Remember...",

      "multi_level_explanations": {
        "level_1": "Standard explanation if they don't understand",
        "level_2": "Simpler breakdown with more steps if still confused",
        "level_3": "Most basic explanation with real-world analogy for struggling students",
        "visual": "Picture this in your mind...",
        "story": "Imagine a story where...",
        "step_by_step": "Let's do this one tiny step at a time..."
      }
    }
  ],

  "independent_practice": {
    "easy": [
      {
        "problem": "Easy problem",
        "answer": "A",
        "wrong_answers": ["B", "C", "D"],
        "mistake_patterns": {
          "B": "I see you chose B. That's what you'd get if... Let me show you why A is correct.",
          "C": "C is close, but remember...",
          "D": "That would work if..., but in this case..."
        },
        "explanation": "Why A is correct"
      }
    ],
    "medium": [...],
    "hard": [...]
  },

  "quiz_questions": [
    {
      "question": "Quiz question",
      "choices": {"A": "...", "B": "...", "C": "...", "D": "..."},
      "correct": "A",
      "explanation": "Why A is correct",
      "wrong_explanations": {
        "B": "If you chose B, you might have...",
        "C": "C would be right if...",
        "D": "D is incorrect because..."
      }
    }
  ],

  "challenge_problems": [{"problem": "Hard challenge", "answer": "...", "explanation": "..."}],
  "review_questions": [{"question": "Review", "answer": "...", "explanation": "..."}]
}

REQUIREMENTS:
- 2 demo_problems
- 3 guided_practice (each with multi_level_explanations)
- independent_practice: 3 easy, 3 medium, 3 hard (each with mistake_patterns)
- 5 quiz_questions (each with wrong_explanations)
- 2 challenge_problems
- 2 review_questions

CRITICAL: For guided_practice, provide ALL 6 explanation types (level_1, level_2, level_3, visual, story, step_by_step).
CRITICAL: For independent_practice, provide specific feedback for EACH wrong answer (B, C, D).

Return ONLY valid JSON. No markdown, no explanation, just the JSON object.`;

    console.log("Calling Grok with enhanced prompt...");

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${grokKey}` },
      body: JSON.stringify({
        model: "grok-2-1212",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 12000  // Increased for multi-level content
      }),
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
      throw new Error(`Failed to parse Grok response: ${e.message}`);
    }

    // Insert lesson content
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

    const { error: insertError } = await supabase.from("lesson_content").insert(insertPayload);

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    // PHASE 2: Save multi-level explanations to explanation_library
    console.log("Saving multi-level explanations...");

    const explanations = [];

    // Extract from guided_practice
    if (content.guided_practice) {
      for (const practice of content.guided_practice) {
        if (practice.multi_level_explanations) {
          explanations.push({
            subject_code: skill.subject_code,
            skill_id: skill.id,
            skill_name: skill.skill_name,
            problem_text: practice.problem,
            level_1: practice.multi_level_explanations.level_1,
            level_2: practice.multi_level_explanations.level_2,
            level_3: practice.multi_level_explanations.level_3,
            visual_explanation: practice.multi_level_explanations.visual,
            story_explanation: practice.multi_level_explanations.story,
            step_by_step: practice.multi_level_explanations.step_by_step,
            generated_by: 'grok',
            times_used: 0
          });
        }
      }
    }

    if (explanations.length > 0) {
      const { error: explError } = await supabase
        .from("explanation_library")
        .insert(explanations);

      if (explError) {
        console.error("Error saving explanations:", explError);
      } else {
        console.log(`✅ Saved ${explanations.length} multi-level explanations`);
      }
    }

    // PHASE 2: Save mistake patterns to mistake_patterns table
    console.log("Saving mistake patterns...");

    const mistakes = [];

    // Extract from independent_practice
    if (content.independent_practice) {
      for (const difficulty of ['easy', 'medium', 'hard']) {
        const problems = content.independent_practice[difficulty] || [];
        for (const problem of problems) {
          if (problem.mistake_patterns) {
            for (const [wrongAns, feedback] of Object.entries(problem.mistake_patterns)) {
              mistakes.push({
                subject_code: skill.subject_code,
                skill_id: skill.id,
                problem_text: problem.problem,
                correct_answer: problem.answer,
                wrong_answer: wrongAns,
                why_kid_chose: `Chose ${wrongAns} instead of ${problem.answer}`,
                feedback: feedback as string,
                times_seen: 0,
                times_helped: 0
              });
            }
          }
        }
      }
    }

    if (mistakes.length > 0) {
      const { error: mistakeError } = await supabase
        .from("mistake_patterns")
        .insert(mistakes);

      if (mistakeError) {
        console.error("Error saving mistakes:", mistakeError);
      } else {
        console.log(`✅ Saved ${mistakes.length} mistake patterns`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        skill: skill.skill_name,
        grade_level: skill.grade_level,
        visual_type: visualType,
        explanations_saved: explanations.length,
        mistakes_saved: mistakes.length,
        message: "Lesson with multi-level explanations generated successfully!"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-lesson-v2:", error);
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
