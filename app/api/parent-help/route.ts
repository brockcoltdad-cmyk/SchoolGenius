import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { PARENT_HELPER_PROMPT } from '@/lib/ai/prompts'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { messages, parentId } = await request.json()

    const supabase = await createServerSupabaseClient()

    // Get parent info
    const { data: parent } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', parentId)
      .single()

    // Get children names
    const { data: children } = await supabase
      .from('students')
      .select('name')
      .eq('parent_id', parentId)

    const childrenNames = children?.map(c => c.name).join(', ') || 'None yet'

    // Personalize prompt
    const systemPrompt = PARENT_HELPER_PROMPT
      .replace('{parentName}', parent?.name || 'there')
      .replace('{childrenNames}', childrenNames)
      .replace('{subscriptionStatus}', parent?.subscription_status || 'Free Trial')

    // Call Claude
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }))
    })

    const textContent = response.content.find(block => block.type === 'text')
    const messageText = textContent ? textContent.text : "I'm having trouble responding. Please try again!"

    return NextResponse.json({ message: messageText })

  } catch (error) {
    console.error('Parent Help API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
