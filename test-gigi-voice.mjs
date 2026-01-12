#!/usr/bin/env node

/**
 * Test if Gigi's voice (ElevenLabs) is working
 */

import 'dotenv/config'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = 'XB0fDUnXU5powFXDhCwa'

console.log('🎤 Testing Gigi\'s Voice\n')
console.log(`Voice ID: ${VOICE_ID}`)
console.log(`API Key: ${ELEVENLABS_API_KEY ? ELEVENLABS_API_KEY.substring(0, 10) + '...' : 'NOT FOUND'}\n`)

if (!ELEVENLABS_API_KEY) {
  console.log('❌ No ELEVENLABS_API_KEY in .env')
  process.exit(1)
}

// First, list available voices
console.log('📋 Fetching your available voices...\n')

try {
  const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY
    }
  })

  if (!voicesResponse.ok) {
    const errorText = await voicesResponse.text()
    console.log(`❌ Failed to fetch voices: ${voicesResponse.status}`)
    console.log(errorText)
    process.exit(1)
  }

  const voicesData = await voicesResponse.json()
  const voices = voicesData.voices || []

  console.log(`✅ Found ${voices.length} voices in your account:\n`)
  voices.forEach((v, i) => {
    const isCurrent = v.voice_id === VOICE_ID
    console.log(`${i + 1}. ${v.name} (${v.voice_id})${isCurrent ? ' ← CURRENT' : ''}`)
  })

  // Check if current voice exists
  const currentVoice = voices.find(v => v.voice_id === VOICE_ID)

  if (currentVoice) {
    console.log(`\n✅ Current voice "${currentVoice.name}" exists!`)
    console.log(`   Testing TTS generation...`)

    // Test generating audio
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: 'Hi! I\'m Gigi, your learning helper!',
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.85,
            similarity_boost: 0.3
          }
        })
      }
    )

    if (ttsResponse.ok) {
      console.log(`\n✅ TTS TEST PASSED!`)
      console.log(`   Gigi's voice is working perfectly.`)
    } else {
      const errorText = await ttsResponse.text()
      console.log(`\n❌ TTS generation failed: ${ttsResponse.status}`)
      console.log(errorText)
    }

  } else {
    console.log(`\n❌ Current voice ID "${VOICE_ID}" NOT FOUND in your account!`)
    console.log(`\n📋 To fix:`)
    console.log(`   1. Pick a voice from the list above`)
    console.log(`   2. Update app/api/tts/route.ts line 134`)
    console.log(`   3. Change: const voiceId = 'NEW_VOICE_ID'`)

    if (voices.length > 0) {
      console.log(`\n💡 Suggestion: Use "${voices[0].name}" (${voices[0].voice_id})`)
    }
  }

} catch (error) {
  console.log(`\n❌ Error: ${error.message}`)
  process.exit(1)
}
