import { PARENT_HELPER_PROMPT } from '@/lib/ai/prompts'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Use Grok for parent helper (xAI API)
const GROK_API_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

export async function POST(request: Request) {
  try {
    const { messages, parentId } = await request.json()

    if (!GROK_API_KEY) {
      return NextResponse.json(
        { error: 'Grok API key not configured' },
        { status: 500 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Get children names
    const { data: children } = await supabase
      .from('children')
      .select('name')
      .eq('parent_id', parentId)

    const childrenNames = children?.map(c => c.name).join(', ') || 'None yet'

    // Personalize prompt (parent name and subscription from auth if available)
    const systemPrompt = PARENT_HELPER_PROMPT
      .replace('{parentName}', 'there')
      .replace('{childrenNames}', childrenNames)
      .replace('{subscriptionStatus}', 'Active')

    console.log('Calling Grok for parent help...')

    // Call Grok API
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Grok API error:', errorText)
      return NextResponse.json(
        {
          error: 'Failed to get response from Grok',
          details: errorText
        },
        { status: 500 }
      )
    }

    const data = await response.json()
    const messageText = data.choices?.[0]?.message?.content || "I'm having trouble responding. Please try again!"

    console.log('Grok parent help response received')

    return NextResponse.json({ message: messageText, source: 'grok' })

  } catch (error) {
    console.error('Parent Help API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to get response',
        details: error instanceof Error ? error.message : 'Unknown error',
        hasGrokKey: !!GROK_API_KEY
      },
      { status: 500 }
    )
  }
}
