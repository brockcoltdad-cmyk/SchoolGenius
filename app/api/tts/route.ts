import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// CLOSED LOOP SYSTEM - Create hash for audio caching
function hashText(text: string): string {
  return crypto.createHash('sha256').update(text.toLowerCase().trim()).digest('hex')
}

// CLOSED LOOP SYSTEM - Check if audio already exists
async function checkAudioCache(text: string) {
  const supabase = await createServerSupabaseClient()
  const textHash = hashText(text)

  const { data, error } = await supabase
    .from('qa_library')
    .select('audio_url')
    .eq('question_hash', textHash)
    .not('audio_url', 'is', null)
    .maybeSingle()

  if (error) {
    console.error('Error checking audio cache:', error)
    return null
  }

  if (data?.audio_url) {
    console.log('✅ Audio found in cache (FREE!)')
    return data.audio_url
  }

  return null
}

// CLOSED LOOP SYSTEM - Save audio to Supabase Storage and update qa_library
async function saveAudioToCache(text: string, audioBuffer: ArrayBuffer) {
  const supabase = await createServerSupabaseClient()
  const textHash = hashText(text)
  const fileName = `tts/${textHash}.mp3`

  try {
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading audio:', uploadError)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('audio')
      .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl

    // Update qa_library with audio URL (or create entry if doesn't exist)
    const { data: existing } = await supabase
      .from('qa_library')
      .select('id')
      .eq('question_hash', textHash)
      .maybeSingle()

    if (existing) {
      // Update existing entry
      await supabase
        .from('qa_library')
        .update({ audio_url: publicUrl })
        .eq('id', existing.id)
    } else {
      // Create new entry just for the audio
      await supabase
        .from('qa_library')
        .insert({
          question_text: text,
          question_hash: textHash,
          answer_text: '', // Will be filled later if used as Q&A
          audio_url: publicUrl,
          created_by: 'tts',
          user_type: 'system',
          times_served: 0
        })
    }

    console.log('💾 Saved audio to cache - next time this is FREE!')
    return publicUrl

  } catch (error) {
    console.error('Error saving audio to cache:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { text, slow } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const limitedText = text.slice(0, 2500)

    // CLOSED LOOP SYSTEM - Check cache first (FREE if exists)
    console.log('🔍 Checking audio cache...')
    const cachedAudioUrl = await checkAudioCache(limitedText)

    if (cachedAudioUrl) {
      // Fetch the cached audio and return it
      const audioResponse = await fetch(cachedAudioUrl)
      const audioBuffer = await audioResponse.arrayBuffer()
      const base64Audio = Buffer.from(audioBuffer).toString('base64')

      return NextResponse.json({
        audio: base64Audio,
        source: 'cache',
        url: cachedAudioUrl
      })
    }

    console.log('❌ Not in cache - generating audio (costs money)')

    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const voiceId = 'cgSgspJ2msm6clMCkdW9' // Jessica - Playful, Bright, Warm

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

    // CLOSED LOOP SYSTEM - Save to cache (FREE next time!)
    const savedUrl = await saveAudioToCache(limitedText, audioBuffer)

    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
      audio: base64Audio,
      source: 'generated',
      url: savedUrl
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'TTS failed', message: error.message }, { status: 500 })
  }
}
