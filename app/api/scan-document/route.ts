import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

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

    // Retry logic for Gemini API (handles 503 overload errors)
    let geminiResponse
    let lastError
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

        if (geminiResponse.ok) {
          break // Success, exit retry loop
        }

        const errorText = await geminiResponse.text()
        lastError = errorText

        // If 503 (overloaded) and not last attempt, wait and retry
        if (geminiResponse.status === 503 && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff: 2s, 4s
          console.log(`Gemini overloaded, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }

        // Other error or last attempt failed
        throw new Error(`Gemini API error: ${errorText}`)
      } catch (fetchError: any) {
        lastError = fetchError.message
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000
          console.log(`Gemini request failed, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
        throw fetchError
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      throw new Error(`Gemini API error after ${maxRetries} attempts: ${lastError}`)
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
      .from('scanned_homework')
      .insert({
        child_id: studentId,
        category: docType,
        image_url: publicUrl,
        file_name: fileName,
        file_size: image.size,
        subject: parsed.subject || subject,
        notes: parsed.extracted_text,
        ai_analysis: parsed.summary
      })
      .select()
      .single()

    if (saveError) {
      throw new Error(`Save failed: ${saveError.message}`)
    }

    // Handle syllabus: Call Grok to analyze and generate daily schedule
    if (docType === 'syllabus') {
      console.log('📋 Syllabus detected - calling Grok to generate prep schedule...')

      try {
        const { data: supabaseUrl } = supabase.storage.from('scanned-docs').getPublicUrl('dummy')
        const baseUrl = supabaseUrl.publicUrl.split('/storage/')[0]

        const grokResponse = await fetch(`${baseUrl}/functions/v1/analyze-syllabus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            studentId: studentId,
            extractedText: parsed.extracted_text,
            items: parsed.items || [],
            subject: parsed.subject || subject,
            docId: savedDoc.id
          })
        })

        if (grokResponse.ok) {
          const grokResult = await grokResponse.json()
          console.log(`✅ Generated ${grokResult.lessons_created || 0} prep lessons`)
        } else {
          console.error('Grok syllabus analysis failed:', await grokResponse.text())
        }
      } catch (grokError: any) {
        console.error('Error calling Grok for syllabus:', grokError.message)
        // Don't fail the whole scan if Grok fails
      }
    }

    // Handle calendar items (extract to separate table)
    if (docType === 'calendar' && parsed.items && parsed.items.length > 0) {
      for (const item of parsed.items) {
        await supabase.from('extracted_calendar_events').insert({
          child_id: studentId,
          document_id: savedDoc.id,
          event_title: item.title || 'Untitled Event',
          event_date: item.date || null,
          event_type: item.type || 'other',
          description: item.details
        })
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
