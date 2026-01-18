// @ts-nocheck - Deno runtime
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const xaiApiKey = Deno.env.get("XAI_API_KEY")!

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { studentId, extractedText, items, subject, docId } = await req.json()

    console.log(`📋 Analyzing syllabus for student ${studentId}`)
    console.log(`Extracted text length: ${extractedText?.length || 0} chars`)
    console.log(`Items found: ${items?.length || 0}`)

    // Get child's grade level
    const { data: child } = await supabase
      .from("children")
      .select("grade_level, name")
      .eq("id", studentId)
      .maybeSingle()

    if (!child) {
      throw new Error("Child not found")
    }

    const gradeLevel = child.grade_level || 3

    // Call Grok to analyze syllabus and map to curriculum
    const grokPrompt = `You are an expert curriculum mapper for SchoolGenius.ai.

TASK: Analyze this school syllabus and create a prep learning schedule.

STUDENT: ${child.name}, Grade ${gradeLevel}

SYLLABUS TEXT:
${extractedText}

TOPICS EXTRACTED:
${JSON.stringify(items, null, 2)}

YOUR JOB:
1. Identify all learning topics mentioned (e.g., "Fractions", "Multiplication", "Reading Comprehension")
2. For each topic, determine:
   - What week/date it will be taught in school
   - What subject it belongs to (Math, Reading, etc.)
   - How many prep lessons the kid needs BEFORE school teaches it
3. Create prep lessons that happen 1-3 days BEFORE the school lesson

RULES:
- Kid should do prep lessons BEFORE school teaches the topic
- Each prep lesson = 20-30 minutes
- Break complex topics into multiple lessons
- Start simple, build up
- Goal: Kid walks into class already knowing it

OUTPUT: Return JSON array of prep lessons:
[
  {
    "topic": "Introduction to Fractions",
    "subject": "Math",
    "school_teaches_date": "2026-01-20",
    "prep_date": "2026-01-17",
    "lesson_title": "Fractions Prep: What is a Fraction?",
    "description": "Learn fraction basics before class",
    "estimated_minutes": 25,
    "order_index": 1
  }
]

IMPORTANT:
- Return ONLY valid JSON array
- Use ISO date format (YYYY-MM-DD)
- Schedule prep lessons 1-3 days before school teaches
- If no dates in syllabus, start from today and estimate weekly schedule`

    const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${xaiApiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3",
        messages: [{ role: "user", content: grokPrompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!grokResponse.ok) {
      const errorBody = await grokResponse.text()
      throw new Error(`Grok API error: ${grokResponse.status} - ${errorBody}`)
    }

    const grokData = await grokResponse.json()
    let contentText = grokData.choices[0].message.content.trim()

    // Clean up markdown formatting
    if (contentText.startsWith("```json")) {
      contentText = contentText.substring(7)
    }
    if (contentText.startsWith("```")) {
      contentText = contentText.substring(3)
    }
    if (contentText.endsWith("```")) {
      contentText = contentText.slice(0, -3)
    }
    contentText = contentText.trim()

    let prepLessons
    try {
      prepLessons = JSON.parse(contentText)
    } catch (parseError) {
      console.error("Failed to parse Grok response:", contentText)
      throw new Error("Grok returned invalid JSON")
    }

    if (!Array.isArray(prepLessons)) {
      throw new Error("Grok did not return an array of lessons")
    }

    console.log(`✅ Grok generated ${prepLessons.length} prep lessons`)

    // Insert prep lessons into daily_schedule
    let insertedCount = 0

    for (const lesson of prepLessons) {
      try {
        const { error: insertError } = await supabase
          .from("daily_schedule")
          .insert({
            child_id: studentId,
            date: lesson.prep_date,
            order_index: lesson.order_index || 1,
            lesson_type: "prep",
            subject_code: lesson.subject?.toUpperCase() || "GENERAL",
            title: lesson.lesson_title,
            description: lesson.description,
            estimated_minutes: lesson.estimated_minutes || 25,
            completed: false,
            from_syllabus: true,
            created_at: new Date().toISOString(),
          })

        if (insertError) {
          console.error(`Error inserting lesson "${lesson.lesson_title}":`, insertError)
        } else {
          insertedCount++
        }
      } catch (itemError) {
        console.error("Error processing lesson:", itemError)
      }
    }

    console.log(`💾 Inserted ${insertedCount} lessons into daily_schedule`)

    return new Response(
      JSON.stringify({
        success: true,
        lessons_analyzed: prepLessons.length,
        lessons_created: insertedCount,
        schedule_generated: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Syllabus analysis error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
