-- Create audio storage bucket for TTS caching
-- Run this in Supabase SQL Editor

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  true,  -- Public so kids can hear Gigi
  5242880,  -- 5MB limit per file
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the audio bucket
-- Allow public read access (kids need to hear audio)
CREATE POLICY "Public can read audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');

-- Allow authenticated users to upload audio
CREATE POLICY "Authenticated can upload audio"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio'
  AND auth.role() = 'authenticated'
);

-- Allow service role to do anything (for TTS API)
CREATE POLICY "Service role can manage audio"
ON storage.objects FOR ALL
USING (bucket_id = 'audio')
WITH CHECK (bucket_id = 'audio');
