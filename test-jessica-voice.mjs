#!/usr/bin/env node

/**
 * Test Jessica's voice with Gigi's greeting
 */

import 'dotenv/config'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = 'cgSgspJ2msm6clMCkdW9' // Jessica

console.log('🎤 Testing Jessica\'s Voice for Gigi\n')

try {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: 'Hi! I\'m Gigi, your learning helper! Let\'s have fun learning together!',
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

  if (response.ok) {
    console.log('✅ Jessica\'s voice is working!')
    console.log('✅ Gigi can now speak to the kids!')
    console.log('\n📋 Next: Deploy to production')
    console.log('   git add app/api/tts/route.ts')
    console.log('   git commit -m "Fix: Update Gigi voice to Jessica"')
    console.log('   git push')
  } else {
    const errorText = await response.text()
    console.log(`❌ Failed: ${response.status}`)
    console.log(errorText)
  }

} catch (error) {
  console.log(`❌ Error: ${error.message}`)
}
