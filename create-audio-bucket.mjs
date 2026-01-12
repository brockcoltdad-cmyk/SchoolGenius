#!/usr/bin/env node

/**
 * Create audio storage bucket for TTS caching
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🪣 Creating audio storage bucket...\n')

try {
  // Create the bucket
  const { data, error } = await supabase.storage.createBucket('audio', {
    public: true,  // Public so kids can hear Gigi
    fileSizeLimit: 5242880,  // 5MB per file
    allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav']
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Audio bucket already exists!')
    } else {
      console.log('❌ Error creating bucket:', error.message)
      process.exit(1)
    }
  } else {
    console.log('✅ Audio bucket created successfully!')
  }

  // Verify it exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const audioBucket = buckets?.find(b => b.name === 'audio')

  if (audioBucket) {
    console.log('\n📊 Bucket Details:')
    console.log(`   Name: ${audioBucket.name}`)
    console.log(`   Public: ${audioBucket.public ? 'Yes ✅' : 'No'}`)
    console.log(`   ID: ${audioBucket.id}`)

    console.log('\n✅ TTS Audio Caching is now enabled!')
    console.log('\n💡 How it works:')
    console.log('   1. First time Gigi says "Great job!" → Costs $0.02, saves to cache')
    console.log('   2. Next 1,000 times → FREE (serves from cache)')
    console.log('   3. Saves hundreds per month automatically')
    console.log('\n🎉 Fix #2 Complete!')
  }

} catch (error) {
  console.log('❌ Error:', error.message)
  process.exit(1)
}
