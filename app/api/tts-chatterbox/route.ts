import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Chatterbox TTS API
 *
 * This API connects to a self-hosted Chatterbox TTS server.
 * Set CHATTERBOX_API_URL in your .env.local to your Chatterbox server URL.
 *
 * Example: CHATTERBOX_API_URL=http://localhost:4123
 */

const CHATTERBOX_URL = process.env.CHATTERBOX_API_URL || 'http://localhost:4123';

export async function POST(req: NextRequest) {
  try {
    const { text, childId, voiceType } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    let voiceFilePath: string | null = null;

    // If childId provided, try to get their custom voice
    if (childId && voiceType) {
      const supabase = await createServerSupabaseClient();

      const { data: voice } = await supabase
        .from('voice_clones')
        .select('audio_url, storage_path')
        .eq('child_id', childId)
        .eq('voice_type', voiceType)
        .single();

      if (voice?.audio_url) {
        voiceFilePath = voice.audio_url;
      }
    }

    // If no voice preference, check for any saved voice for this child
    if (!voiceFilePath && childId) {
      const supabase = await createServerSupabaseClient();

      // Get child's preferred voice setting
      const { data: child } = await supabase
        .from('children')
        .select('preferred_voice_type')
        .eq('id', childId)
        .single();

      if (child?.preferred_voice_type) {
        const { data: voice } = await supabase
          .from('voice_clones')
          .select('audio_url')
          .eq('child_id', childId)
          .eq('voice_type', child.preferred_voice_type)
          .single();

        if (voice?.audio_url) {
          voiceFilePath = voice.audio_url;
        }
      }
    }

    // Call Chatterbox TTS
    const requestBody: any = {
      input: text,
      exaggeration: 0.7, // Good for educational content - engaging but not over-dramatic
      cfg_weight: 0.4,   // Slightly slower, clearer pacing for kids
    };

    let response: Response;

    if (voiceFilePath) {
      // Use voice cloning with custom voice
      // First, fetch the voice file
      const voiceResponse = await fetch(voiceFilePath);
      if (!voiceResponse.ok) {
        throw new Error('Could not fetch voice file');
      }

      const voiceBlob = await voiceResponse.blob();

      // Use multipart form for voice upload
      const formData = new FormData();
      formData.append('input', text);
      formData.append('exaggeration', '0.7');
      formData.append('cfg_weight', '0.4');
      formData.append('voice_file', voiceBlob, 'voice.webm');

      response = await fetch(`${CHATTERBOX_URL}/v1/audio/speech/upload`, {
        method: 'POST',
        body: formData,
      });
    } else {
      // Use default voice
      response = await fetch(`${CHATTERBOX_URL}/v1/audio/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chatterbox error:', errorText);

      // Fallback to existing TTS if Chatterbox is not available
      return NextResponse.json(
        { error: 'Chatterbox TTS not available. Ensure server is running at ' + CHATTERBOX_URL },
        { status: 503 }
      );
    }

    // Get audio as buffer
    const audioBuffer = await response.arrayBuffer();

    // Convert to base64 for client
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      audio: base64Audio,
      voiceUsed: voiceFilePath ? 'custom' : 'default'
    });

  } catch (error: any) {
    console.error('TTS Chatterbox error:', error);

    // Return a helpful error message
    return NextResponse.json(
      { error: error.message || 'TTS generation failed' },
      { status: 500 }
    );
  }
}

// Health check for Chatterbox server
export async function GET() {
  try {
    const response = await fetch(`${CHATTERBOX_URL}/health`, {
      method: 'GET',
    });

    if (response.ok) {
      return NextResponse.json({
        status: 'ok',
        chatterbox: 'connected',
        url: CHATTERBOX_URL
      });
    } else {
      return NextResponse.json({
        status: 'error',
        chatterbox: 'not connected',
        url: CHATTERBOX_URL
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      chatterbox: 'not running',
      url: CHATTERBOX_URL,
      message: 'Start Chatterbox server or set CHATTERBOX_API_URL'
    }, { status: 503 });
  }
}
