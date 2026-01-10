import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    const formData = await req.formData()
    const image = formData.get('image') as File
    const docType = formData.get('docType') as string
    const studentId = formData.get('studentId') as string
    const subject = formData.get('subject') as string || 'General'

    if (!image || !studentId) {
      return NextResponse.json({ error: 'Missing image or studentId' }, { status: 400 })
    }

    const fileName = `${studentId}/${Date.now()}-${image.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scanned-docs')
      .upload(fileName, image)

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('scanned-docs')
      .getPublicUrl(fileName)

    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = image.type || 'image/jpeg'

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `You are a helpful assistant that extracts information from school documents.

This is a ${docType}. Please extract ALL text and information from this image.

Then provide a structured summary:
- If HOMEWORK: List each problem/question, subject, due date if visible
- If SYLLABUS: List topics for each day, any test dates, project due dates
- If CALENDAR: List all events with dates

Format your response as JSON:
{
  "extracted_text": "full text from image",
  "doc_type": "${docType}",
  "subject": "detected subject or ${subject}",
  "items": [
    {"type": "assignment/event/topic", "title": "...", "date": "...", "details": "..."}
  ],
  "summary": "brief summary of what this document contains"
}

IMPORTANT: Return ONLY valid JSON, no markdown or extra text.`
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64
                }
              }
            ]
          }]
        })
      }
    )

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text()
      throw new Error(`Gemini API error: ${err}`)
    }

    const geminiData = await geminiResponse.json()
    const aiContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}'

    let parsed
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { extracted_text: aiContent, summary: aiContent }
    } catch {
      parsed = { extracted_text: aiContent, summary: aiContent }
    }

    const { data: savedDoc, error: saveError } = await supabase
      .from('kid_scanned_docs')
      .insert({
        student_id: studentId,
        doc_type: docType,
        image_url: publicUrl,
        extracted_text: parsed.extracted_text,
        ai_summary: parsed.summary,
        subject: parsed.subject || subject
      })
      .select()
      .single()

    if (saveError) {
      throw new Error(`Save failed: ${saveError.message}`)
    }

    if (parsed.items && parsed.items.length > 0) {
      for (const item of parsed.items) {
        if (docType === 'homework' || item.type === 'assignment') {
          await supabase.from('kid_homework').insert({
            student_id: studentId,
            subject: parsed.subject || subject,
            title: item.title,
            description: item.details,
            due_date: item.date || null,
            source_doc_id: savedDoc.id
          })
        } else if (docType === 'calendar' || item.type === 'event') {
          await supabase.from('kid_school_events').insert({
            student_id: studentId,
            event_type: item.type === 'test' ? 'test' : 'event',
            title: item.title,
            subject: parsed.subject || subject,
            event_date: item.date || null,
            notes: item.details,
            source_doc_id: savedDoc.id
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      document: savedDoc,
      extracted: parsed,
      items_created: parsed.items?.length || 0
    })

  } catch (error: any) {
    console.error('Scan error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
