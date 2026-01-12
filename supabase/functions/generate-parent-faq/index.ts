// @ts-nocheck - Deno runtime, TypeScript errors expected
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Common parent questions organized by category
const FAQ_CATEGORIES = {
  "account_management": [
    "How do I change my password?",
    "How do I change my email address?",
    "How do I delete my account?",
    "How do I download my data?",
    "How do I update my payment method?"
  ],
  "child_management": [
    "How do I add a child?",
    "How do I edit my child's profile?",
    "How do I delete a child?",
    "How do I reset my child's PIN?",
    "How do I change my child's grade level?",
    "Can I have multiple children on one account?",
    "How do I switch between children?"
  ],
  "coins_and_rewards": [
    "How do coins work?",
    "How do I set up rewards?",
    "How do I create custom rewards?",
    "How do I approve a reward redemption?",
    "How many coins do kids earn per lesson?",
    "What can kids buy with coins?"
  ],
  "lessons_and_learning": [
    "How do lessons work?",
    "What are the 5 phases of a lesson?",
    "How do I skip a lesson?",
    "How do I replay a lesson?",
    "What happens if my child gets stuck?",
    "How does the AI tutor help?",
    "Can my child ask questions during lessons?"
  ],
  "progress_and_reports": [
    "How do I check my kid's progress?",
    "How do I see quiz scores?",
    "How do I download a progress report?",
    "What does each chart mean?",
    "How often should I check progress?",
    "What if my child is falling behind?"
  ],
  "syllabus_and_curriculum": [
    "How do I upload a syllabus?",
    "How do I create a custom syllabus?",
    "What subjects are available?",
    "Can I adjust the difficulty?",
    "How do I skip topics my child already knows?",
    "Can I add my own topics?"
  ],
  "themes_and_personalization": [
    "How do I change my kid's theme?",
    "What themes are available?",
    "How do kids unlock new themes?",
    "Can I create a custom theme?",
    "What's the difference between themes?"
  ],
  "privacy_and_safety": [
    "Is my kid's data safe?",
    "What is COPPA compliance?",
    "How do I download my data?",
    "How do I delete everything?",
    "Who can see my kid's information?",
    "Does SchoolGenius share data with third parties?",
    "How is data encrypted?"
  ],
  "billing_and_subscription": [
    "How do I cancel my subscription?",
    "How do I upgrade my plan?",
    "What's included in the free trial?",
    "How do I get a refund?",
    "When does my subscription renew?",
    "Can I pause my subscription?"
  ],
  "technical_issues": [
    "The app isn't loading",
    "My kid can't log in",
    "Audio isn't working",
    "Videos won't play",
    "The screen is frozen",
    "I'm getting an error message"
  ]
};

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
        JSON.stringify({ error: "XAI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check how many FAQ articles already exist
    const { data: existingArticles } = await supabase
      .from("parent_help_articles")
      .select("category, question_pattern");

    const existingQuestions = new Set(
      existingArticles?.map(a => a.question_pattern) || []
    );

    // Find questions that need to be generated
    const questionsToGenerate = [];
    for (const [category, questions] of Object.entries(FAQ_CATEGORIES)) {
      for (const question of questions) {
        if (!existingQuestions.has(question)) {
          questionsToGenerate.push({ category, question });
        }
      }
    }

    if (questionsToGenerate.length === 0) {
      return new Response(
        JSON.stringify({
          message: "All FAQ articles already generated!",
          status: "complete",
          total: existingArticles?.length || 0
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 5 articles per call to avoid timeout
    const batch = questionsToGenerate.slice(0, 5);
    const results = [];

    for (const { category, question } of batch) {
      console.log(`Generating answer for: ${question}`);

      const prompt = `You are creating helpful FAQ content for SchoolGenius, an AI-powered K-12 learning platform.

QUESTION: "${question}"
CATEGORY: ${category}

Generate a clear, helpful answer for parents. Follow these guidelines:

1. TONE: Friendly, warm, professional - like a helpful customer support agent
2. LENGTH: 2-4 paragraphs (150-300 words)
3. STRUCTURE:
   - Start with a direct answer
   - Provide step-by-step instructions if applicable
   - Add helpful tips or context
   - End with encouragement or reassurance
4. SPECIFICS:
   - Use "you" and "your child"
   - Be specific (actual button names, page names)
   - Include what they'll see on screen
   - Mention timeframes if relevant
   - Address common concerns
5. SAFETY: If privacy/security related, reassure about COPPA compliance and data protection

Write ONLY the answer text. No headers, no "Answer:", just the helpful response.`;

      try {
        const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${grokKey}`
          },
          body: JSON.stringify({
            model: "grok-3",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 800
          })
        });

        if (!grokResponse.ok) {
          console.error(`Grok API error for "${question}":`, await grokResponse.text());
          continue;
        }

        const grokData = await grokResponse.json();
        const answer = grokData.choices?.[0]?.message?.content?.trim() || "";

        if (answer) {
          // Extract keywords from question for search
          const keywords = question
            .toLowerCase()
            .replace(/[?]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3);

          // Save to database
          const { error: insertError } = await supabase
            .from("parent_help_articles")
            .insert({
              category,
              question_pattern: question,
              keywords,
              answer,
              created_at: new Date().toISOString()
            });

          if (insertError) {
            console.error(`Error saving "${question}":`, insertError);
          } else {
            console.log(`✅ Saved: "${question}"`);
            results.push({ question, success: true });
          }
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error generating "${question}":`, error);
        results.push({ question, success: false, error: error.message });
      }
    }

    const totalGenerated = (existingArticles?.length || 0) + results.filter(r => r.success).length;
    const totalQuestions = Object.values(FAQ_CATEGORIES).flat().length;

    return new Response(
      JSON.stringify({
        message: `Generated ${results.filter(r => r.success).length} new FAQ articles`,
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
