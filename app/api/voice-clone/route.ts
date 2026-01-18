import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY;

// Create a custom voice on DeepInfra for voice cloning
async function createDeepInfraVoice(audioBuffer: Uint8Array, voiceName: string): Promise<string | null> {
  if (!DEEPINFRA_API_KEY) {
    console.log('⚠️ DeepInfra API key not configured - voice cloning disabled');
    return null;
  }

  try {
    console.log(`🎙️ Creating DeepInfra voice: ${voiceName}`);

    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    formData.append('audio', audioBlob, 'voice.wav');
    formData.append('name', voiceName);
    formData.append('description', `${voiceName} - SchoolGenius parent voice`);

    const response = await fetch('https://api.deepinfra.com/v1/voices/add', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${DEEPINFRA_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepInfra voice creation error:', errorText);
      return null;
    }

    const data = await response.json();
    console.log(`✅ DeepInfra voice created: ${data.voice_id}`);
    return data.voice_id;
  } catch (error) {
    console.error('DeepInfra voice creation error:', error);
    return null;
  }
}

// Delete a voice from DeepInfra
async function deleteDeepInfraVoice(voiceId: string): Promise<boolean> {
  if (!DEEPINFRA_API_KEY || !voiceId) return false;

  try {
    console.log(`🗑️ Deleting DeepInfra voice: ${voiceId}`);

    const response = await fetch(`https://api.deepinfra.com/v1/voices/${voiceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `bearer ${DEEPINFRA_API_KEY}`
      }
    });

    if (!response.ok) {
      console.error('DeepInfra voice deletion error:', await response.text());
      return false;
    }

    console.log(`✅ DeepInfra voice deleted`);
    return true;
  } catch (error) {
    console.error('DeepInfra voice deletion error:', error);
    return false;
  }
}

// GET - Retrieve voice samples for a parent
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const childId = searchParams.get('childId');

    if (!childId) {
      return NextResponse.json({ error: 'childId required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Get voice samples for this child's parent
    const { data: voices, error } = await supabase
      .from('voice_clones')
      .select('*')
      .eq('child_id', childId);

    if (error) throw error;

    return NextResponse.json({ voices: voices || [] });
  } catch (error: any) {
    console.error('Get voices error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Save a new voice sample
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const childId = formData.get('childId') as string;
    const voiceType = formData.get('voiceType') as string; // 'mom', 'dad', 'custom'
    const voiceName = formData.get('voiceName') as string || voiceType;

    if (!audioFile || !childId || !voiceType) {
      return NextResponse.json(
        { error: 'audio, childId, and voiceType are required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Convert audio to buffer
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    // Detect file type from the uploaded filename or content type
    const isWav = audioFile.name?.endsWith('.wav') || audioFile.type === 'audio/wav';
    const extension = isWav ? 'wav' : 'webm';
    const contentType = isWav ? 'audio/wav' : 'audio/webm';

    // Generate unique filename
    const filename = `voice_${childId}_${voiceType}_${Date.now()}.${extension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('voice-clones')
      .upload(filename, audioBytes, {
        contentType: contentType,
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Try to create bucket if it doesn't exist
      if (uploadError.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Voice storage not configured. Please create voice-clones bucket in Supabase.' },
          { status: 500 }
        );
      }
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('voice-clones')
      .getPublicUrl(filename);

    // Delete any existing voice of same type for this child (and their DeepInfra voice)
    const { data: existingVoice } = await supabase
      .from('voice_clones')
      .select('deepinfra_voice_id')
      .eq('child_id', childId)
      .eq('voice_type', voiceType)
      .single();

    if (existingVoice?.deepinfra_voice_id) {
      await deleteDeepInfraVoice(existingVoice.deepinfra_voice_id);
    }

    await supabase
      .from('voice_clones')
      .delete()
      .eq('child_id', childId)
      .eq('voice_type', voiceType);

    // Create DeepInfra voice for TTS cloning (only for WAV files)
    let deepinfraVoiceId = null;
    if (isWav) {
      deepinfraVoiceId = await createDeepInfraVoice(audioBytes, `${voiceName}_${childId}`);
    }

    // Save voice record to database
    const { data: voiceRecord, error: dbError } = await supabase
      .from('voice_clones')
      .insert({
        child_id: childId,
        voice_type: voiceType,
        voice_name: voiceName,
        audio_url: urlData.publicUrl,
        storage_path: filename,
        deepinfra_voice_id: deepinfraVoiceId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      voice: voiceRecord
    });

  } catch (error: any) {
    console.error('Save voice error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove a voice sample
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const voiceId = searchParams.get('voiceId');
    const childId = searchParams.get('childId');

    if (!voiceId || !childId) {
      return NextResponse.json(
        { error: 'voiceId and childId required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get the voice record first to get storage path and DeepInfra voice ID
    const { data: voice, error: fetchError } = await supabase
      .from('voice_clones')
      .select('storage_path, deepinfra_voice_id')
      .eq('id', voiceId)
      .eq('child_id', childId)
      .single();

    if (fetchError) throw fetchError;

    // Delete from DeepInfra
    if (voice?.deepinfra_voice_id) {
      await deleteDeepInfraVoice(voice.deepinfra_voice_id);
    }

    // Delete from storage
    if (voice?.storage_path) {
      await supabase.storage
        .from('voice-clones')
        .remove([voice.storage_path]);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('voice_clones')
      .delete()
      .eq('id', voiceId)
      .eq('child_id', childId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete voice error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
