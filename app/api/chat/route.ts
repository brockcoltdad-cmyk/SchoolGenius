import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { GIGI_SYSTEM_PROMPT } from '@/lib/ai/prompts'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { COPPA_SYSTEM_PROMPT } from '@/lib/coppa-chat-helper'

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

async function buildPersonalizedSystemPrompt(childId: string, subject?: string): Promise<string> {
  const supabase = await createServerSupabaseClient()

  // Get child info
  const { data: child } = await supabase
    .from('children')
    .select('name, grade_level, interests')
    .eq('id', childId)
    .maybeSingle()

  if (!child) {
    return `You are Gigi, a learning coach. Keep answers SHORT (1-2 sentences). Never give answers - guide only!`
  }

  // Get learning profile (weaknesses, strengths)
  const { data: profile } = await supabase
    .from('learning_profiles')
    .select('weakest_subjects, strongest_subjects, overall_accuracy, total_questions_answered')
    .eq('child_id', childId)
    .maybeSingle()

  // Get recent lesson performance
  const { data: recentLessons } = await supabase
    .from('lesson_progress')
    .select('subject_code, skill_name, score, completed')
    .eq('child_id', childId)
    .order('last_attempt_at', { ascending: false })
    .limit(5)

  // Build performance insights
  let performanceInsights = ''

  if (profile) {
    const accuracy = Math.round((profile.overall_accuracy || 0) * 100)
    performanceInsights += `\n- Overall accuracy: ${accuracy}%`
    performanceInsights += `\n- Questions answered: ${profile.total_questions_answered || 0}`

    if (profile.weakest_subjects?.length > 0) {
      performanceInsights += `\n- STRUGGLING WITH: ${profile.weakest_subjects.join(', ')} (recommend these!)`
    }
    if (profile.strongest_subjects?.length > 0) {
      performanceInsights += `\n- STRONG AT: ${profile.strongest_subjects.join(', ')}`
    }
  }

  if (recentLessons && recentLessons.length > 0) {
    const lowScores = recentLessons.filter(l => l.score && l.score < 70)
    if (lowScores.length > 0) {
      performanceInsights += `\n- NEEDS PRACTICE: ${lowScores.map(l => l.skill_name).join(', ')}`
    }
  }

  return `You are Gigi, ${child.name}'s learning buddy (grade ${child.grade_level || 'K'}).

RULES - FOLLOW EXACTLY:
1. MAX 1-2 SHORT sentences per response
2. NEVER give answers to questions
3. NEVER teach or explain concepts
4. Just guide them to lessons

${performanceInsights ? `${child.name}'s stats:${performanceInsights}` : ''}

EXAMPLES OF GOOD RESPONSES:
- "Hey! I'm Gigi. What subject - Math, Reading, or Spelling?"
- "Math? Say 'yes' to go!"
- "Nice job on spelling!"
- "I don't give answers. Want to practice?"

ALWAYS BE BRIEF. Kids have short attention spans.`
}

// Store pending navigation (waiting for "yes" confirmation)
let pendingNavigation: { url: string, subject: string } | null = null

// Detect navigation intent - returns suggestion, doesn't auto-navigate
function detectNavigationIntent(message: string, childId: string): { suggestion?: string, url?: string, subject?: string } | null {
  const msg = message.toLowerCase().trim()

  // Check for "yes" confirmation FIRST - if pending navigation exists
  if ((msg === 'yes' || msg === 'yeah' || msg === 'yep' || msg === 'ok' || msg === 'sure') && pendingNavigation) {
    const nav = pendingNavigation
    pendingNavigation = null // Clear it
    return { suggestion: `Let's go!`, url: nav.url, subject: nav.subject }
  }

  // Navigation phrases
  const mathPhrases = ['math', 'addition', 'subtraction', 'multiply', 'divide', 'fractions', 'numbers']
  const readingPhrases = ['reading', 'read', 'comprehension']
  const spellingPhrases = ['spelling', 'spell', 'words']
  const typingPhrases = ['typing', 'type', 'keyboard']
  const shopPhrases = ['shop', 'store', 'buy', 'coins', 'rewards', 'themes']
  const leaderboardPhrases = ['leaderboard', 'rankings', 'score', 'points']
  const storyPhrases = ['story', 'stories']
  const placementPhrases = ['where do i start', 'where should i start', 'placement', 'test me', 'what level', 'i\'m new']

  // Detect subject and store as pending (ask for confirmation)
  if (placementPhrases.some(p => msg.includes(p))) {
    pendingNavigation = { url: `/kid/${childId}/start-day`, subject: 'Placement Quiz' }
    return { suggestion: `I can take you to the Placement Quiz! Say "yes" to go.` }
  }
  if (mathPhrases.some(p => msg.includes(p))) {
    pendingNavigation = { url: `/kid/${childId}/math`, subject: 'Math' }
    return { suggestion: `Math? Say "yes" and I'll take you there!` }
  }
  if (readingPhrases.some(p => msg.includes(p))) {
    pendingNavigation = { url: `/kid/${childId}/reading`, subject: 'Reading' }
    return { suggestion: `Reading? Say "yes" to go!` }
  }
  if (spellingPhrases.some(p => msg.includes(p))) {
    pendingNavigation = { url: `/kid/${childId}/spelling`, subject: 'Spelling' }
    return { suggestion: `Spelling? Say "yes" to start!` }
  }
  if (typingPhrases.some(p => msg.includes(p))) {
    pendingNavigation = { url: `/kid/${childId}/typing`, subject: 'Typing' }
    return { suggestion: `Typing practice? Say "yes" to begin!` }
  }
  if (storyPhrases.some(p => msg.includes(p))) {
    pendingNavigation = { url: `/kid/${childId}/reading`, subject: 'Stories' }
    return { suggestion: `Stories? Say "yes" to read!` }
  }
  if (shopPhrases.some(p => msg.includes(p))) {
    pendingNavigation = { url: `/kid/${childId}/shop`, subject: 'Shop' }
    return { suggestion: `The Shop? Say "yes" to browse!` }
  }
  if (leaderboardPhrases.some(p => msg.includes(p))) {
    pendingNavigation = { url: `/kid/${childId}/leaderboard`, subject: 'Leaderboard' }
    return { suggestion: `Leaderboard? Say "yes" to see rankings!` }
  }

  return null
}

export async function POST(request: Request) {
  try {
    // Check API key first
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { messages, studentId, childId, subject, pageContext, isUnder13 } = body

    const id = childId || studentId
    const currentSubject = subject || pageContext || 'dashboard'

    if (!id) {
      return NextResponse.json({ error: 'Child ID is required' }, { status: 400 })
    }

    console.log('Chat API called for child:', id, 'subject:', currentSubject)

    // Check for navigation intent FIRST (no API call needed!)
    const userMessage = messages[messages.length - 1]?.content || ''
    const navIntent = detectNavigationIntent(userMessage, id)

    if (navIntent) {
      // If there's a URL, they confirmed with "yes" - navigate now
      if (navIntent.url) {
        console.log('🚀 Navigation confirmed:', navIntent.subject)
        return NextResponse.json({
          message: navIntent.suggestion,
          action: { url: navIntent.url },
          source: 'navigation'
        })
      }
      // Otherwise just show the suggestion (waiting for "yes")
      console.log('💬 Navigation suggested:', navIntent.suggestion)
      return NextResponse.json({
        message: navIntent.suggestion,
        source: 'suggestion'
      })
    }

    console.log('Creating Supabase client...')
    const supabase = await createServerSupabaseClient()
    console.log('Supabase client created')

    console.log('Querying children table...')
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    console.log('Query result - child:', child ? 'found' : 'null', 'error:', childError)

    if (childError) {
      console.error('Supabase error:', childError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!child) {
      console.error('Child not found with ID:', id)
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    console.log('Found child:', child.name)

    // CLOSED LOOP SYSTEM - Check qa_library FIRST (FREE if exists)
    // userMessage already defined above for navigation check
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

    let systemPrompt = await buildPersonalizedSystemPrompt(id, currentSubject)

    // COPPA: Add child safety rules for under-13 users
    if (isUnder13) {
      systemPrompt += '\n\n' + COPPA_SYSTEM_PROMPT
      console.log('🛡️ COPPA mode enabled - child safety rules added to prompt')
    }

    console.log('Calling Anthropic API...')

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 50,  // VERY short answers - 1-2 sentences max
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
