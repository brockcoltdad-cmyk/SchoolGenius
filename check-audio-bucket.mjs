#!/usr/bin/env node

/**
 * Check if 'audio' storage bucket exists in Supabase
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🪣 Checking Supabase Storage for audio bucket...\n')

try {
  // List all buckets
  const { data: buckets, error } = await supabase.storage.listBuckets()

  if (error) {
    console.log('❌ Error listing buckets:', error.message)
    process.exit(1)
  }

  console.log(`Found ${buckets.length} storage buckets:\n`)
  buckets.forEach((bucket, i) => {
    const isAudio = bucket.name === 'audio'
    console.log(`${i + 1}. ${bucket.name} ${bucket.public ? '(public)' : '(private)'}${isAudio ? ' ← NEEDED' : ''}`)
  })

  const audioBucket = buckets.find(b => b.name === 'audio')

  if (audioBucket) {
    console.log('\n✅ Audio bucket exists!')
    console.log(`   Public: ${audioBucket.public}`)

    // Test listing files
    const { data: files, error: filesError } = await supabase.storage
      .from('audio')
      .list('tts', { limit: 10 })

    if (filesError) {
      console.log(`\n⚠️  Can't list files: ${filesError.message}`)
    } else {
      console.log(`\n📁 Audio cache has ${files?.length || 0} files`)
      if (files && files.length > 0) {
        console.log('\n   Recent files:')
        files.slice(0, 5).forEach(f => {
          console.log(`   - ${f.name}`)
        })
      }
    }

    console.log('\n✅ TTS Audio Caching is ready to use!')

  } else {
    console.log('\n❌ Audio bucket does NOT exist!')
    console.log('\n📋 To create it:')
    console.log('   1. Go to: https://supabase.com/dashboard')
    console.log('   2. Select your project (eczpdbkslqbduiesbqcm)')
    console.log('   3. Click "Storage" in sidebar')
    console.log('   4. Click "New bucket"')
    console.log('   5. Name: "audio"')
    console.log('   6. Make it PUBLIC (so kids can hear Gigi)')
    console.log('   7. Click "Create bucket"')
  }

} catch (error) {
  console.log(`\n❌ Error: ${error.message}`)
  process.exit(1)
}
