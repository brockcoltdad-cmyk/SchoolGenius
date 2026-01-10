import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { studentId, studentName, age, interests, theme, subject } = await request.json()

    const themeDescriptions: Record<string, string> = {
      adventure: 'an exciting adventure in a magical forest',
      space: 'an amazing journey through outer space',
      ocean: 'an underwater exploration of the ocean',
      dinosaur: 'a thrilling time-travel trip to see dinosaurs',
      magic: 'a magical adventure in an enchanted kingdom',
      superhero: 'an action-packed superhero mission'
    }

    const subjectLessons: Record<string, string> = {
      math: 'counting, numbers, or basic math concepts',
      reading: 'the joy of reading and learning new words',
      science: 'an interesting science fact about nature or the world',
      friendship: 'the importance of being a good friend',
      courage: 'being brave and trying new things'
    }

    const themeDesc = themeDescriptions[theme] || 'an exciting adventure'
    const lessonDesc = subjectLessons[subject] || 'something new and exciting'

    const storyPrompt = `Write a short, engaging story (about 300 words) for a ${age}-year-old child named ${studentName}.

The story should be about ${themeDesc}.
The story should teach about ${lessonDesc}.
${interests?.length ? `Try to include references to their interests: ${interests.join(', ')}.` : ''}

Make ${studentName} the main character of the story.
Use simple, age-appropriate language.
Include dialogue and action.
End with a happy conclusion and a gentle lesson learned.

Write ONLY the story, no title or introduction.`

    const storyResponse = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: storyPrompt }]
    })

    const storyContent = storyResponse.content.find(block => block.type === 'text')
    const story = storyContent && storyContent.type === 'text'
      ? storyContent.text
      : `Once upon a time, ${studentName} went on an amazing adventure and learned something wonderful!`

    const titlePrompt = `Create a short, catchy title (max 6 words) for a children's story about ${studentName} having ${themeDesc}. Return ONLY the title, nothing else.`

    const titleResponse = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 50,
      messages: [{ role: 'user', content: titlePrompt }]
    })

    const titleContent = titleResponse.content.find(block => block.type === 'text')
    const title = titleContent && titleContent.type === 'text'
      ? titleContent.text.replace(/"/g, '').trim()
      : `${studentName}'s ${theme.charAt(0).toUpperCase() + theme.slice(1)} Adventure`

    if (studentId) {
      const supabase = await createServerSupabaseClient()

      await supabase.from('stories').insert({
        student_id: studentId,
        title: title,
        content: story,
        genre: theme,
        reading_level: age <= 6 ? 'early' : age <= 9 ? 'intermediate' : 'advanced',
        word_count: story.split(/\s+/).length
      })

      const { data: student } = await supabase
        .from('children')
        .select('coins')
        .eq('id', studentId)
        .single()

      await supabase
        .from('children')
        .update({ coins: (student?.coins || 0) + 15 })
        .eq('id', studentId)

      await supabase.from('coin_transactions').insert({
        student_id: studentId,
        amount: 15,
        reason: `Read story: ${title}`
      })
    }

    return NextResponse.json({ title, content: story })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: stories, error } = await supabase
      .from('stories')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Fetch stories error:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}
