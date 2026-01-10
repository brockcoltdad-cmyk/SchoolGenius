import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { text, slow } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const limitedText = text.slice(0, 2500)

    const voiceId = 'XB0fDUnXU5powFXDhCwa'

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: limitedText,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.85,
            similarity_boost: 0.3,
            style: 0.1,
            use_speaker_boost: false
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: 'ElevenLabs failed', details: errorText }, { status: 500 })
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({ audio: base64Audio })
  } catch (error: any) {
    return NextResponse.json({ error: 'TTS failed', message: error.message }, { status: 500 })
  }
}
