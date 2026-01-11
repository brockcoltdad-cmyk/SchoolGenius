import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { anthropic, AI_MODEL } from '@/lib/ai/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      skillId,
      problemText,
      level,           // 1, 2, 3, 'visual', 'story', 'step_by_step'
      childId,
      subject
    } = body

    if (!skillId && !problemText) {
      return NextResponse.json(
        { error: 'Either skillId or problemText required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // PHASE 2: Check explanation_library FIRST (FREE if exists)
    console.log(`🔍 Checking explanation_library for level: ${level}`)

    let query = supabase
      .from('explanation_library')
      .select('*')

    if (skillId) {
      query = query.eq('skill_id', skillId)
    }

    if (problemText) {
      query = query.eq('problem_text', problemText)
    }

    const { data: explanations, error: queryError } = await query.maybeSingle()

    if (queryError) {
      console.error('Error querying explanation_library:', queryError)
    }

    if (explanations) {
      // Found in library! Return the appropriate level
      let explanation = null
      let audioScript = null

      switch (level) {
        case 1:
        case '1':
          explanation = explanations.level_1
          audioScript = explanations.level_1_audio_script
          break
        case 2:
        case '2':
          explanation = explanations.level_2
          audioScript = explanations.level_2_audio_script
          break
        case 3:
        case '3':
          explanation = explanations.level_3
          audioScript = explanations.level_3_audio_script
          break
        case 'visual':
          explanation = explanations.visual_explanation
          audioScript = explanations.visual_audio_script
          break
        case 'story':
          explanation = explanations.story_explanation
          audioScript = explanations.story_audio_script
          break
        case 'step_by_step':
          explanation = explanations.step_by_step
          break
      }

      if (explanation) {
        // Update usage tracking
        await supabase
          .from('explanation_library')
          .update({
            times_used: (explanations.times_used || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', explanations.id)

        console.log(`✅ Explanation level ${level} found (FREE!). Times used: ${(explanations.times_used || 0) + 1}`)

        return NextResponse.json({
          explanation,
          audioScript,
          source: 'library',
          level,
          timesUsed: (explanations.times_used || 0) + 1
        })
      }
    }

    console.log(`❌ Level ${level} not in library - calling Claude (costs money)`)

    // Not in library - Call Claude LIVE (expensive)
    if (!childId) {
      return NextResponse.json(
        { error: 'childId required for Claude call' },
        { status: 400 }
      )
    }

    // Get child info for personalization
    const { data: child } = await supabase
      .from('children')
      .select('name, grade_level')
      .eq('id', childId)
      .maybeSingle()

    const childName = child?.name || 'there'
    const gradeLevel = child?.grade_level || 5

    // Build Claude prompt based on level requested
    let prompt = ''

    switch (level) {
      case 1:
      case '1':
        prompt = `${childName} is having trouble understanding this problem: "${problemText}".

Give a clear, standard explanation appropriate for grade ${gradeLevel}. Be encouraging and helpful.`
        break

      case 2:
      case '2':
        prompt = `${childName} (grade ${gradeLevel}) still doesn't understand after a standard explanation: "${problemText}".

Break it down into simpler steps with easier language. Be patient and encouraging.`
        break

      case 3:
      case '3':
        prompt = `${childName} (grade ${gradeLevel}) is really struggling with: "${problemText}".

Give the MOST BASIC explanation like they've never seen this concept. Use a real-world analogy or story. Be super encouraging!`
        break

      case 'visual':
        prompt = `${childName} (grade ${gradeLevel}) learns best visually. Explain: "${problemText}".

Describe a picture or diagram they can imagine in their mind. Use phrases like "Picture this..." or "Imagine..."'`
        break

      case 'story':
        prompt = `${childName} (grade ${gradeLevel}) learns best through stories. Explain: "${problemText}".

Tell a short story or use an analogy that illustrates the concept. Make it relatable and fun!`
        break

      case 'step_by_step':
        prompt = `${childName} (grade ${gradeLevel}) needs detailed step-by-step guidance: "${problemText}".

Break it into tiny, numbered steps. Make each step very clear and simple.`
        break

      default:
        prompt = `Help ${childName} (grade ${gradeLevel}) understand: "${problemText}". Be encouraging and clear.`
    }

    console.log('Calling Claude for custom explanation...')

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 800,
      system: `You are Gigi, a friendly AI tutor for ${childName}. Be encouraging, patient, and clear.`,
      messages: [{ role: 'user', content: prompt }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    const explanation = textContent && textContent.type === 'text'
      ? textContent.text
      : "I'm having trouble explaining this right now. Let's try a different approach!"

    // PHASE 2: Save Claude's explanation to library (FREE next time!)
    if (skillId) {
      console.log('💾 Saving Claude explanation to library...')

      // Check if entry exists
      const { data: existing } = await supabase
        .from('explanation_library')
        .select('id')
        .eq('skill_id', skillId)
        .eq('problem_text', problemText || '')
        .maybeSingle()

      const levelField = `level_${level}`

      if (existing) {
        // Update existing entry
        await supabase
          .from('explanation_library')
          .update({ [levelField]: explanation })
          .eq('id', existing.id)
      } else {
        // Create new entry
        await supabase
          .from('explanation_library')
          .insert({
            skill_id: skillId,
            subject_code: subject || 'GENERAL',
            problem_text: problemText || '',
            [levelField]: explanation,
            generated_by: 'claude',
            times_used: 0
          })
      }

      console.log('✅ Saved - next time this level is FREE!')
    }

    return NextResponse.json({
      explanation,
      source: 'claude',
      level
    })

  } catch (error: any) {
    console.error('Explanations API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to get explanation' },
      { status: 500 }
    )
  }
}
