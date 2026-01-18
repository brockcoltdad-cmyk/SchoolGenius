import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// DeepInfra hosted Chatterbox API (paid service - no local install needed)
const DEEPINFRA_CHATTERBOX_URL = 'https://api.deepinfra.com/v1/inference/ResembleAI/chatterbox'
const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY

// Legacy local Chatterbox (fallback if DeepInfra not configured)
const LOCAL_CHATTERBOX_URL = process.env.CHATTERBOX_API_URL || 'http://localhost:4123'

// Default Gigi voice - friendly female voice for kids
const DEFAULT_VOICE = 'Emily.wav'

// CLOSED LOOP SYSTEM - Create hash for audio caching
function hashText(text: string, voiceType?: string): string {
  const input = voiceType ? `${text}_${voiceType}` : text
  return crypto.createHash('sha256').update(input.toLowerCase().trim()).digest('hex')
}

// Get parent's cloned voice for a child
async function getClonedVoice(childId: string) {
  const supabase = await createServerSupabaseClient()

  // First check child's preferred voice setting
  const { data: child } = await supabase
    .from('children')
    .select('preferred_voice_type')
    .eq('id', childId)
    .single()

  const voiceType = child?.preferred_voice_type || 'default'

  if (voiceType === 'default') {
    return null // Use default Gigi voice
  }

  // Get the cloned voice with DeepInfra voice ID
  const { data: voice } = await supabase
    .from('voice_clones')
    .select('audio_url, voice_type, deepinfra_voice_id')
    .eq('child_id', childId)
    .eq('voice_type', voiceType)
    .single()

  return voice || null
}

// Generate TTS using DeepInfra hosted Chatterbox (PAID SERVICE - NO LOCAL INSTALL!)
async function generateDeepInfraTTS(text: string, voiceId?: string): Promise<ArrayBuffer | null> {
  if (!DEEPINFRA_API_KEY) {
    console.log('⚠️ DeepInfra API key not configured')
    return null
  }

  try {
    console.log(`🎙️ Generating TTS with DeepInfra Chatterbox`)

    const response = await fetch(DEEPINFRA_CHATTERBOX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${DEEPINFRA_API_KEY}`
      },
      body: JSON.stringify({
        text: text,
        response_format: 'wav',
        exaggeration: 0.7,      // Engaging for kids (0-1)
        cfg: 0.5,               // Clarity/consistency
        temperature: 0.8,       // Natural variation
        ...(voiceId && { voice_id: voiceId })  // Custom voice if provided
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepInfra Chatterbox error:', errorText)
      return null
    }

    const data = await response.json()

    // DeepInfra returns audio as "data:audio/wav;base64,..." - need to strip prefix
    if (data.audio) {
      console.log(`✅ DeepInfra TTS generated (${data.input_character_length} chars, cost: $${data.inference_status?.cost?.toFixed(6) || 'unknown'})`)
      // Strip the data URL prefix if present
      const base64Data = data.audio.replace(/^data:audio\/\w+;base64,/, '')
      return Buffer.from(base64Data, 'base64')
    }

    return null
  } catch (error) {
    console.error('DeepInfra TTS error:', error)
    return null
  }
}

// Generate TTS using LOCAL Chatterbox with predefined voice (FALLBACK)
async function generateLocalChatterboxTTS(text: string, voiceId: string = DEFAULT_VOICE): Promise<ArrayBuffer | null> {
  try {
    console.log(`🎙️ Generating TTS with LOCAL Chatterbox (voice: ${voiceId})`)

    const response = await fetch(`${LOCAL_CHATTERBOX_URL}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        predefined_voice_id: voiceId,
        voice_mode: 'predefined',
        output_format: 'wav',
        exaggeration: 0.8,  // Engaging for kids
        cfg_weight: 0.5,    // Clear pacing
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Local Chatterbox error:', errorText)
      return null
    }

    return await response.arrayBuffer()
  } catch (error) {
    console.error('Local Chatterbox TTS error:', error)
    return null
  }
}

// Generate TTS using Chatterbox with voice cloning (parent's voice - FREE!)
async function generateChatterboxCloneTTS(text: string, voiceUrl: string): Promise<ArrayBuffer | null> {
  try {
    console.log(`🎤 Generating TTS with voice clone`)

    // Fetch the voice sample
    const voiceResponse = await fetch(voiceUrl)
    if (!voiceResponse.ok) {
      console.error('Could not fetch voice file')
      return null
    }

    const voiceBlob = await voiceResponse.blob()

    // Use multipart form for voice cloning
    const formData = new FormData()
    formData.append('text', text)
    formData.append('voice_mode', 'clone')
    formData.append('output_format', 'wav')
    formData.append('exaggeration', '0.7')
    formData.append('cfg_weight', '0.4')
    formData.append('reference_audio', voiceBlob, 'voice.wav')

    const response = await fetch(`${LOCAL_CHATTERBOX_URL}/tts`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      console.error('Chatterbox clone error:', await response.text())
      return null
    }

    return await response.arrayBuffer()
  } catch (error) {
    console.error('Chatterbox clone TTS error:', error)
    return null
  }
}

// CLOSED LOOP SYSTEM - Check if audio already exists
async function checkAudioCache(text: string, voiceType?: string) {
  const supabase = await createServerSupabaseClient()
  const textHash = hashText(text, voiceType)

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
async function saveAudioToCache(text: string, audioBuffer: ArrayBuffer, voiceType?: string) {
  const supabase = await createServerSupabaseClient()
  const textHash = hashText(text, voiceType)
  const fileName = `tts/${textHash}.wav`

  try {
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/wav',
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
          answer_text: '',
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
    const { text, childId, voice } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const limitedText = text.slice(0, 2500)

    // Check if child has a custom cloned voice
    let clonedVoice = null
    if (childId) {
      clonedVoice = await getClonedVoice(childId)
      if (clonedVoice) {
        console.log(`🎤 Using parent's ${clonedVoice.voice_type} voice for child ${childId}`)
      }
    }

    // CLOSED LOOP SYSTEM - Check cache first (FREE if exists)
    console.log('🔍 Checking audio cache...')
    const cachedAudioUrl = await checkAudioCache(limitedText, clonedVoice?.voice_type || voice)

    if (cachedAudioUrl) {
      // Fetch the cached audio and return it
      const audioResponse = await fetch(cachedAudioUrl)
      const audioBuffer = await audioResponse.arrayBuffer()
      const base64Audio = Buffer.from(audioBuffer).toString('base64')

      return NextResponse.json({
        audio: base64Audio,
        source: 'cache',
        url: cachedAudioUrl,
        voice: clonedVoice?.voice_type || voice || 'default'
      })
    }

    console.log('❌ Not in cache - generating new audio')

    let audioBuffer: ArrayBuffer | null = null

    // Priority 1: If parent's cloned voice has a DeepInfra voice ID, use it
    if (clonedVoice?.deepinfra_voice_id && DEEPINFRA_API_KEY) {
      console.log(`🎤 Using DeepInfra cloned voice: ${clonedVoice.voice_type}`)
      audioBuffer = await generateDeepInfraTTS(limitedText, clonedVoice.deepinfra_voice_id)
    }

    // Priority 2: If parent's cloned voice exists but no DeepInfra ID, try LOCAL Chatterbox
    if (!audioBuffer && clonedVoice?.audio_url) {
      console.log(`🎤 Trying local Chatterbox for ${clonedVoice.voice_type} voice...`)
      audioBuffer = await generateChatterboxCloneTTS(limitedText, clonedVoice.audio_url)
    }

    // Priority 3: Use DeepInfra hosted Chatterbox (default voice)
    if (!audioBuffer && DEEPINFRA_API_KEY) {
      console.log('🌐 Using DeepInfra Chatterbox default voice...')
      audioBuffer = await generateDeepInfraTTS(limitedText)
    }

    // Priority 3: Use local Chatterbox with predefined voice
    if (!audioBuffer) {
      console.log('🖥️ Trying local Chatterbox...')
      const selectedVoice = voice || DEFAULT_VOICE
      audioBuffer = await generateLocalChatterboxTTS(limitedText, selectedVoice)
    }

    // Priority 3: Fall back to ElevenLabs if all Chatterbox options fail
    if (!audioBuffer) {
      console.log('⚠️ Chatterbox unavailable, falling back to ElevenLabs')

      const apiKey = process.env.ELEVENLABS_API_KEY
      if (!apiKey) {
        return NextResponse.json({
          error: 'TTS unavailable',
          message: 'Chatterbox not running and no ElevenLabs API key configured'
        }, { status: 503 })
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
        return NextResponse.json({ error: 'TTS failed', details: errorText }, { status: 500 })
      }

      audioBuffer = await response.arrayBuffer()
    }

    if (!audioBuffer) {
      return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 })
    }

    // Save to cache for next time (FREE!)
    const savedUrl = await saveAudioToCache(limitedText, audioBuffer, clonedVoice?.voice_type || voice)

    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
      audio: base64Audio,
      source: DEEPINFRA_API_KEY ? 'deepinfra-chatterbox' : 'local-chatterbox',
      url: savedUrl,
      voice: clonedVoice?.voice_type || voice || 'default'
    })

  } catch (error: any) {
    console.error('TTS error:', error)
    return NextResponse.json({ error: 'TTS failed', message: error.message }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  const status: any = {
    deepinfra: DEEPINFRA_API_KEY ? 'configured' : 'not configured (add DEEPINFRA_API_KEY to .env)',
    fallback_order: ['deepinfra', 'local-chatterbox', 'elevenlabs']
  }

  // Check DeepInfra if configured
  if (DEEPINFRA_API_KEY) {
    status.primary = 'deepinfra-chatterbox'
    status.status = 'ok'
  }

  // Check local Chatterbox
  try {
    const response = await fetch(`${LOCAL_CHATTERBOX_URL}/api/model-info`)
    const data = await response.json()
    status.local_chatterbox = data.loaded ? 'connected' : 'model not loaded'
  } catch (error) {
    status.local_chatterbox = 'not running'
  }

  // Check ElevenLabs
  status.elevenlabs = process.env.ELEVENLABS_API_KEY ? 'configured' : 'not configured'

  if (!DEEPINFRA_API_KEY && status.local_chatterbox === 'not running') {
    status.status = 'degraded'
    status.message = 'Add DEEPINFRA_API_KEY to .env.local for hosted TTS'
  }

  return NextResponse.json(status)
}
