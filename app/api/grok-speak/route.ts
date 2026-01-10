import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const apiKey = process.env.GROK_API_KEY

    if (!apiKey) {
      console.log('No GROK_API_KEY, falling back to ElevenLabs')
      return NextResponse.json({ error: 'Grok API key not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.grok.x.ai/v1/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        text: text,
        voice: 'ara'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Grok API error:', errorText)
      return NextResponse.json({ error: 'Grok API failed', details: errorText }, { status: 500 })
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({ audio: base64Audio })
  } catch (error: any) {
    console.error('Grok speak error:', error)
    return NextResponse.json({ error: 'Speech failed', message: error.message }, { status: 500 })
  }
}
