import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const subjectId = searchParams.get('subjectId')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('curriculum_lessons')
      .select('*, curriculum_subjects(name, icon, color)')
      .eq('child_id', studentId)

    if (subjectId) {
      query = query.eq('subject_id', subjectId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ lessons: data })
  } catch (error) {
    console.error('Lessons GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, subjectId, topic } = await request.json()

    if (!studentId || !subjectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: student } = await supabase
      .from('children')
      .select('*')
      .eq('id', studentId)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const { data: subject } = await supabase
      .from('curriculum_subjects')
      .select('*')
      .eq('id', subjectId)
      .single()

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('child_id', studentId)
      .eq('subject_code', subjectId)
      .single()

    const currentLevel = progress?.current_level || 1

    const prompt = `Create a ${subject.name} lesson for a grade ${student.grade_level} student named ${student.name}.

Student Info:
- Age: ${student.age || 'unknown'}
- Current Level: ${currentLevel}
- Interests: ${student.interests?.join(', ') || 'various things'}
${topic ? `- Requested Topic: ${topic}` : ''}

Create an engaging, age-appropriate lesson with:
1. A fun title
2. A brief introduction (2-3 sentences)
3. The main concept explained simply
4. 2-3 examples
5. 5 multiple choice questions (4 options each, mark correct answer)

Respond in JSON format:
{
  "title": "Lesson Title",
  "introduction": "Brief intro...",
  "concept": "Main concept explanation...",
  "examples": ["Example 1", "Example 2"],
  "questions": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Why this is correct..."
    }
  ]
}`

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    let lessonContent
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        lessonContent = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', textContent.text)
      throw new Error('Failed to parse lesson content')
    }

    const coinsReward = 10 + (currentLevel * 2)

    const { data: lesson, error } = await supabase
      .from('curriculum_lessons')
      .insert({
        child_id: studentId,
        subject_id: subjectId,
        title: lessonContent.title,
        content: lessonContent,
        difficulty: currentLevel,
        coins_reward: coinsReward
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Lessons POST error:', error)
    return NextResponse.json({ error: 'Failed to generate lesson' }, { status: 500 })
  }
}
