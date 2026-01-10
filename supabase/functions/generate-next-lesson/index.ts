import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const xaiApiKey = Deno.env.get("XAI_API_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get existing lesson content skill IDs
    const { data: existingContent } = await supabase
      .from("lesson_content")
      .select("skill_id");

    const existingSkillIds = new Set(
      (existingContent || []).map(c => c.skill_id)
    );

    // Find ONE skill that doesn't have content yet
    const { data: allSkills, error: skillsError } = await supabase
      .from("curriculum_skills")
      .select("*")
      .order("subject_code", { ascending: true });

    if (skillsError) throw skillsError;

    if (!allSkills || allSkills.length === 0) {
      return new Response(
        JSON.stringify({ error: "No skills found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find first skill without content
    const skillToProcess = allSkills.find(
      skill => !existingSkillIds.has(skill.id)
    );

    if (!skillToProcess) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "All skills already have content!",
          total_skills: allSkills.length,
          completed: existingSkillIds.size
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing: ${skillToProcess.skill_name}`);

    const prompt = `You are an expert K-12 curriculum designer. Generate comprehensive lesson content for:

SKILL: ${skillToProcess.skill_name}
SUBJECT: ${skillToProcess.subject_code}
SKILL CODE: ${skillToProcess.skill_code}
DESCRIPTION: ${skillToProcess.skill_description || skillToProcess.skill_name}

Generate JSON with this EXACT structure:
{
  "rules_text": "2-3 clear paragraphs explaining the concept in simple language",
  "rules_audio_script": "A conversational script for audio narration (150-200 words)",
  "demo_problems": [
    {"problem": "example problem text", "steps": ["step 1", "step 2"], "answer": "final answer", "explanation": "why this works"}
  ],
  "guided_practice": [
    {"problem": "practice problem", "hints": ["helpful hint 1", "helpful hint 2"], "answer": "correct answer", "explanation": "detailed solution"}
  ],
  "independent_practice": [
    {"problem": "independent problem", "answer": "correct answer", "difficulty": "easy", "wrong_answers": ["wrong 1", "wrong 2", "wrong 3"]}
  ],
  "challenge_problems": [
    {"problem": "challenging problem", "answer": "correct answer", "explanation": "solution approach"}
  ],
  "quiz_questions": [
    {"question": "quiz question", "answer": "correct answer", "wrong_answers": ["wrong 1", "wrong 2", "wrong 3"], "points": 10}
  ],
  "review_questions": [
    {"question": "review question", "answer": "correct answer", "explanation": "why this is correct"}
  ]
}

Include at least 3 items in each array. Return ONLY valid JSON, no markdown formatting.`;

    const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${xaiApiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!grokResponse.ok) {
      const errorBody = await grokResponse.text();
      throw new Error(`Grok API error: ${grokResponse.status} - ${errorBody}`);
    }

    const grokData = await grokResponse.json();
    let contentText = grokData.choices[0].message.content.trim();

    // Clean up markdown formatting
    if (contentText.startsWith("```json")) {
      contentText = contentText.substring(7);
    }
    if (contentText.startsWith("```")) {
      contentText = contentText.substring(3);
    }
    if (contentText.endsWith("```")) {
      contentText = contentText.slice(0, -3);
    }
    contentText = contentText.trim();

    const content = JSON.parse(contentText);

    // Save to lesson_content
    const { error: saveError } = await supabase
      .from("lesson_content")
      .insert({
        skill_id: skillToProcess.id,
        subject_code: skillToProcess.subject_code,
        skill_name: skillToProcess.skill_name,
        rules_text: content.rules_text || "",
        rules_audio_script: content.rules_audio_script || "",
        demo_problems: content.demo_problems || [],
        guided_practice: content.guided_practice || [],
        independent_practice: content.independent_practice || [],
        challenge_problems: content.challenge_problems || [],
        quiz_questions: content.quiz_questions || [],
        review_questions: content.review_questions || [],
      });

    if (saveError) throw saveError;

    console.log(`✓ Generated content for: ${skillToProcess.skill_name}`);

    const remaining = allSkills.length - (existingSkillIds.size + 1);

    return new Response(
      JSON.stringify({
        success: true,
        generated_skill: skillToProcess.skill_name,
        skill_code: skillToProcess.skill_code,
        subject_code: skillToProcess.subject_code,
        progress: {
          total_skills: allSkills.length,
          completed: existingSkillIds.size + 1,
          remaining: remaining
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred",
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});