import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { GIGI_SYSTEM_PROMPT } from '@/lib/ai/prompts'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// CLOSED LOOP SYSTEM - Create hash for question lookup
function hashQuestion(question: string): string {
  return crypto.createHash('sha256').update(question.toLowerCase().trim()).digest('hex')
}

// CLOSED LOOP SYSTEM - Check if answer exists in library
async function checkQALibrary(question: string, childId: string) {
  const supabase = await createServerSupabaseClient()
  const questionHash = hashQuestion(question)

  const { data, error } = await supabase
    .from('qa_library')
    .select('*')
    .eq('question_hash', questionHash)
    .maybeSingle()

  if (error) {
    console.error('Error checking qa_library:', error)
    return null
  }

  if (data) {
    // Found in library! Increment times_served
    await supabase
      .from('qa_library')
      .update({
        times_served: (data.times_served || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id)

    console.log('✅ Answer found in qa_library (FREE!). Times served:', (data.times_served || 0) + 1)
  }

  return data
}

// CLOSED LOOP SYSTEM - Save Claude's answer to library for future use
async function saveToQALibrary(question: string, answer: string, childId: string, category?: string) {
  const supabase = await createServerSupabaseClient()
  const questionHash = hashQuestion(question)

  // Get child's grade level for context
  const { data: child } = await supabase
    .from('children')
    .select('grade_level')
    .eq('id', childId)
    .maybeSingle()

  const { error } = await supabase
    .from('qa_library')
    .insert({
      question_text: question,
      question_hash: questionHash,
      answer_text: answer,
      created_by: 'claude',
      user_type: 'child',
      category: category || 'general',
      grade_level: child?.grade_level || null,
      times_served: 0,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error saving to qa_library:', error)
  } else {
    console.log('💾 Saved to qa_library - next time this question is FREE!')
  }
}

async function buildPersonalizedSystemPrompt(childId: string): Promise<string> {
  const supabase = await createServerSupabaseClient()

  const { data: child } = await supabase
    .from('children')
    .select('name, grade_level, interests')
    .eq('id', childId)
    .maybeSingle()

  const { data: profile } = await supabase
    .from('learning_profiles')
    .select('*')
    .eq('child_id', childId)
    .maybeSingle()

  if (!child) {
    return `You are Gigi, a friendly and encouraging AI tutor.`
  }

  if (!profile) {
    return GIGI_SYSTEM_PROMPT
      .replace('{studentName}', child.name)
      .replace('{age}', 'unknown')
      .replace('{gradeLevel}', child.grade_level?.toString() || 'unknown')
      .replace('{interests}', child.interests?.join(', ') || 'various things')
  }

  const learningStyleMap: Record<string, string> = {
    visual: 'visual examples, diagrams, and pictures',
    auditory: 'verbal explanations and talking through problems',
    reading: 'written instructions and text-based explanations',
    kinesthetic: 'hands-on examples and real-world applications'
  }

  const paceMap: Record<string, string> = {
    slow: 'a slower pace with extra examples and patience',
    medium: 'a balanced pace',
    fast: 'a faster pace with more challenging content'
  }

  const confidenceMap: Record<string, string> = {
    low: 'extra encouragement and support',
    medium: 'steady guidance',
    high: 'more challenging problems and independence'
  }

  const learningStyle = learningStyleMap[profile.primary_learning_style] || 'visual examples'
  const pace = paceMap[profile.preferred_pace] || 'a balanced pace'
  const confidence = confidenceMap[profile.confidence_level] || 'steady guidance'

  const strugglingSubjects = profile.weakest_subjects?.length > 0
    ? `${child.name} is working on ${profile.weakest_subjects.join(' and ')} - be patient and provide extra support in these areas.`
    : ''

  const exampleTopics = [
    ...(child.interests || []),
    ...(profile.preferred_example_types || [])
  ].filter(Boolean)

  const interestExamples = exampleTopics.length > 0
    ? `Use examples related to ${exampleTopics.join(', ')} - ${child.name} loves these topics!`
    : ''

  const accuracy = Math.round((profile.overall_accuracy || 0) * 100)
  const stats = `${child.name} has answered ${profile.total_questions_answered || 0} questions with ${accuracy}% accuracy.`

  return `You are Gigi, a friendly and encouraging AI tutor helping ${child.name}, a ${child.grade_level} grade student.

LEARNING PROFILE:
- Learning Style: ${child.name} learns best with ${learningStyle}
- Pace: Prefers ${pace}
- Confidence: ${child.name} needs ${confidence}
${strugglingSubjects ? `- ${strugglingSubjects}` : ''}
${interestExamples ? `- ${interestExamples}` : ''}
- Performance: ${stats}
- Frustration Point: If ${child.name} gets ${profile.frustration_threshold || 3}+ questions wrong in a row, offer a different explanation or take a break
${profile.needs_more_examples ? `- Extra Examples: ${child.name} often needs more examples - be generous with them` : ''}
${profile.responds_to_encouragement ? `- Motivation: ${child.name} responds well to encouragement and praise` : ''}
${profile.responds_to_challenges ? `- Challenges: ${child.name} enjoys being challenged - don't be afraid to push a bit` : ''}

Adapt your teaching style to match this profile while staying encouraging and supportive.`
}

export async function POST(request: Request) {
  try {
    // Check API key first
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { messages, studentId, childId } = body

    const id = childId || studentId
    if (!id) {
      return NextResponse.json({ error: 'Child ID is required' }, { status: 400 })
    }

    console.log('Chat API called for child:', id)

    const supabase = await createServerSupabaseClient()

    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (childError) {
      console.error('Supabase error:', childError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    console.log('Found child:', child.name)

    // CLOSED LOOP SYSTEM - Check qa_library FIRST (FREE if exists)
    const userMessage = messages[messages.length - 1]?.content || ''
    if (userMessage && typeof userMessage === 'string') {
      console.log('🔍 Checking qa_library for existing answer...')
      const cachedAnswer = await checkQALibrary(userMessage, id)

      if (cachedAnswer) {
        // Found in library - return immediately (FREE!)
        return NextResponse.json({
          message: cachedAnswer.answer_text,
          source: 'library',
          times_served: cachedAnswer.times_served
        })
      }

      console.log('❌ Not in library - calling Claude (costs money)')
    }

    const systemPrompt = await buildPersonalizedSystemPrompt(id)

    console.log('Calling Anthropic API...')

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }))
    })

    console.log('Anthropic response received')

    const textContent = response.content.find(block => block.type === 'text')
    const messageText = textContent && textContent.type === 'text'
      ? textContent.text
      : "I'm having trouble responding right now!"

    // CLOSED LOOP SYSTEM - Save Claude's answer to library (FREE next time!)
    if (userMessage && typeof userMessage === 'string') {
      await saveToQALibrary(userMessage, messageText, id)
    }

    const today = new Date().toISOString().split('T')[0]
    if (child.last_activity_date !== today) {
      await supabase
        .from('children')
        .update({
          last_activity_date: today,
          coins: (child.coins || 0) + 5
        })
        .eq('id', id)
    }

    return NextResponse.json({ message: messageText, source: 'claude' })

  } catch (error: any) {
    console.error('Chat API error:', error?.message || error)
    return NextResponse.json(
      { error: error?.message || 'Failed to get response' },
      { status: 500 }
    )
  }
}
