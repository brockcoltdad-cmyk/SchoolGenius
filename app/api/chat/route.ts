import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { GIGI_SYSTEM_PROMPT } from '@/lib/ai/prompts'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

  const learningStyleMap = {
    visual: 'visual examples, diagrams, and pictures',
    auditory: 'verbal explanations and talking through problems',
    reading: 'written instructions and text-based explanations',
    kinesthetic: 'hands-on examples and real-world applications'
  }

  const paceMap = {
    slow: 'a slower pace with extra examples and patience',
    medium: 'a balanced pace',
    fast: 'a faster pace with more challenging content'
  }

  const confidenceMap = {
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

  const accuracy = Math.round(profile.overall_accuracy * 100)
  const stats = `${child.name} has answered ${profile.total_questions_answered} questions with ${accuracy}% accuracy.`

  return `You are Gigi, a friendly and encouraging AI tutor helping ${child.name}, a ${child.grade_level} grade student.

LEARNING PROFILE:
- Learning Style: ${child.name} learns best with ${learningStyle}
- Pace: Prefers ${pace}
- Confidence: ${child.name} needs ${confidence}
${strugglingSubjects ? `- ${strugglingSubjects}` : ''}
${interestExamples ? `- ${interestExamples}` : ''}
- Performance: ${stats}
- Frustration Point: If ${child.name} gets ${profile.frustration_threshold}+ questions wrong in a row, offer a different explanation or take a break
${profile.needs_more_examples ? `- Extra Examples: ${child.name} often needs more examples - be generous with them` : ''}
${profile.responds_to_encouragement ? `- Motivation: ${child.name} responds well to encouragement and praise` : ''}
${profile.responds_to_challenges ? `- Challenges: ${child.name} enjoys being challenged - don't be afraid to push a bit` : ''}

Adapt your teaching style to match this profile while staying encouraging and supportive.`
}

export async function POST(request: Request) {
  try {
    const { messages, studentId, childId } = await request.json()

    const id = childId || studentId
    if (!id) {
      return NextResponse.json({ error: 'Child ID is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: child } = await supabase
      .from('children')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    const systemPrompt = await buildPersonalizedSystemPrompt(id)

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }))
    })

    const textContent = response.content.find(block => block.type === 'text')
    const messageText = textContent && textContent.type === 'text'
      ? textContent.text
      : "I'm having trouble responding right now!"

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

    return NextResponse.json({ message: messageText })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
