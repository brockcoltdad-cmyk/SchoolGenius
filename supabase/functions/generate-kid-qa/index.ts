// @ts-nocheck - Deno runtime, TypeScript errors expected
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Common kid questions about SchoolGenius organized by category
const KID_QUESTIONS = {
  "website_navigation": [
    "How do I change my theme?",
    "Where do I see my coins?",
    "How do I find my achievements?",
    "Where is my profile?",
    "How do I log out?",
    "Where do I see my level?",
    "How do I find my dashboard?",
    "Where are the lessons?",
    "How do I see my streak?",
    "Where do I check my progress?",
    "How do I go back to home?",
    "Where is the menu?",
    "How do I change my avatar?",
    "Where do I see my badges?",
    "How do I find the reward shop?"
  ],
  "learning_mechanics": [
    "What's a demo problem?",
    "How do practice problems work?",
    "What happens if I fail the quiz?",
    "Can I skip the rules?",
    "What are the 5 phases of a lesson?",
    "What's the difference between practice and challenge?",
    "How many questions are in a quiz?",
    "What score do I need to pass?",
    "Can I redo a lesson?",
    "What happens when I complete a lesson?",
    "Why do I have to watch the demo?",
    "Can I go faster through lessons?",
    "What if I don't understand something?",
    "How do I know if I'm ready for the quiz?",
    "What happens if I get stuck?",
    "Can I ask Gigi questions?",
    "How does the help button work?",
    "What are hints?",
    "Can I see the answer?",
    "Why can't I skip to the quiz?",
    "What's a challenge problem?",
    "How do I unlock harder lessons?",
    "Can I learn faster if I'm good at this?",
    "What if a lesson is too easy?",
    "What if a lesson is too hard?"
  ],
  "coins_and_rewards": [
    "How do I earn coins?",
    "What can I buy with coins?",
    "How much do themes cost?",
    "Can I get coins back?",
    "Why did I lose coins?",
    "How do I earn more coins faster?",
    "What gives the most coins?",
    "Can I give coins to friends?",
    "What happens to coins if I delete my account?",
    "Do coins expire?",
    "What's the fastest way to get 1000 coins?",
    "How do I redeem a reward?",
    "What rewards can I get?",
    "Can I ask for real-world rewards?",
    "How do I know if my parent approved my reward?"
  ],
  "themes_personalization": [
    "How do I unlock Minecraft theme?",
    "What themes are there?",
    "Can I change back to my old theme?",
    "What's the coolest theme?",
    "Are all themes free?",
    "How do I buy a new theme?",
    "Can I try a theme before buying?",
    "What happens when I change themes?",
    "Do I lose progress if I change themes?",
    "Can I have multiple themes?",
    "What's the most expensive theme?",
    "Can I create my own theme?"
  ],
  "progress_achievements": [
    "How do I get badges?",
    "What's my streak?",
    "How do I level up?",
    "What level am I?",
    "What are achievements?",
    "How do I get the perfect score badge?",
    "What's the fire streak thing?",
    "How many badges are there?",
    "What happens if I break my streak?",
    "Can I see my friends' achievements?",
    "What's the highest level?",
    "How do I get better grades?",
    "Why didn't I get a badge?",
    "Can badges give me coins?"
  ],
  "general_help": [
    "I'm stuck, what do I do?",
    "Can I ask questions during lessons?",
    "Who is Gigi?",
    "Can Gigi help me with homework?",
    "Is this like a video game?",
    "Can I play with friends?",
    "How long are lessons?",
    "Do I have to do lessons every day?",
    "What if I don't want to learn today?",
    "Can I choose what to learn?",
    "Is this fun?",
    "Why do I have to learn?",
    "Can I skip subjects I don't like?",
    "What if I'm bored?",
    "Can I learn faster?",
    "What if I already know this?",
    "Can I challenge myself?",
    "Is there a leaderboard?",
    "Can my parents see what I do?",
    "Is my data private?"
  ]
};

function hashQuestion(question: string): string {
  return createHash('sha256').update(question.toLowerCase().trim()).digest('hex');
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
      return new Response(
        JSON.stringify({ error: "XAI_API_KEY not configured in Supabase" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check existing Q&A
    const { data: existingQA } = await supabase
      .from("qa_library")
      .select("question_hash");

    const existingHashes = new Set(
      existingQA?.map(qa => qa.question_hash) || []
    );

    // Find questions to generate
    const questionsToGenerate = [];
    for (const [category, questions] of Object.entries(KID_QUESTIONS)) {
      for (const question of questions) {
        const hash = hashQuestion(question);
        if (!existingHashes.has(hash)) {
          questionsToGenerate.push({ category, question, hash });
        }
      }
    }

    if (questionsToGenerate.length === 0) {
      const totalQuestions = Object.values(KID_QUESTIONS).flat().length;
      return new Response(
        JSON.stringify({
          message: "All kid Q&A already generated!",
          status: "complete",
          total: totalQuestions
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 10 Q&A per call
    const batch = questionsToGenerate.slice(0, 10);
    const results = [];

    for (const { category, question, hash } of batch) {
      console.log(`Generating answer for: ${question}`);

      const prompt = `You are Gigi, the friendly AI tutor for SchoolGenius. A kid just asked you this question about the website:

"${question}"

Generate a helpful, friendly answer. Guidelines:

1. TONE: Super friendly, warm, encouraging - like talking to a curious 5-12 year old
2. LENGTH: 2-3 short sentences (50-100 words max)
3. LANGUAGE: Simple, clear, no jargon - explain like they're 8 years old
4. STRUCTURE:
   - Answer their question directly first
   - Add a helpful tip or encouragement
   - Use "you" and keep it conversational
5. PERSONALITY: Enthusiastic, supportive, makes learning sound fun
6. EXAMPLES: Give concrete examples they can visualize
7. EMOJIS: Use 1-2 friendly emojis (✨ 🎉 🌟 💪 🎮)

Write ONLY the answer. No "Answer:", no headers - just the friendly response Gigi would say.`;

      try {
        const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${grokKey}`
          },
          body: JSON.stringify({
            model: "grok-beta",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 300
          })
        });

        if (!grokResponse.ok) {
          console.error(`Grok API error for "${question}":`, await grokResponse.text());
          continue;
        }

        const grokData = await grokResponse.json();
        const answer = grokData.choices?.[0]?.message?.content?.trim() || "";

        if (answer) {
          // Save to qa_library
          const { error: insertError } = await supabase
            .from("qa_library")
            .insert({
              question_text: question,
              question_hash: hash,
              answer_text: answer,
              created_by: 'grok',
              user_type: 'child',
              category,
              times_served: 0,
              created_at: new Date().toISOString()
            });

          if (insertError) {
            console.error(`Error saving "${question}":`, insertError);
          } else {
            console.log(`✅ Saved: "${question}"`);
            results.push({ question, success: true });
          }
        }

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error generating "${question}":`, error);
        results.push({ question, success: false, error: error.message });
      }
    }

    const totalGenerated = (existingQA?.length || 0) + results.filter(r => r.success).length;
    const totalQuestions = Object.values(KID_QUESTIONS).flat().length;

    return new Response(
      JSON.stringify({
        message: `Generated ${results.filter(r => r.success).length} new kid Q&A`,
        status: "batch_complete",
        progress: `${totalGenerated}/${totalQuestions}`,
        remaining: totalQuestions - totalGenerated,
        results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
