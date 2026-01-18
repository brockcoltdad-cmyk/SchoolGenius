import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This endpoint creates the voice-clones storage bucket
// Uses service role key to bypass RLS
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials. Set SUPABASE_SERVICE_ROLE_KEY in .env' },
        { status: 500 }
      );
    }

    // Create admin client with service role
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const bucketExists = buckets?.some(b => b.name === 'voice-clones');

    if (bucketExists) {
      return NextResponse.json({
        success: true,
        message: 'voice-clones bucket already exists',
        existed: true
      });
    }

    // Create the bucket
    const { data, error: createError } = await supabase.storage.createBucket('voice-clones', {
      public: true,
      fileSizeLimit: 10485760, // 10MB max
      allowedMimeTypes: ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg']
    });

    if (createError) {
      console.error('Error creating bucket:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'voice-clones bucket created successfully',
      existed: false
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Check if bucket exists
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        configured: false,
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY'
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      return NextResponse.json({ configured: false, error: error.message });
    }

    const bucketExists = buckets?.some(b => b.name === 'voice-clones');

    return NextResponse.json({
      configured: bucketExists,
      buckets: buckets?.map(b => b.name)
    });

  } catch (error: any) {
    return NextResponse.json({ configured: false, error: error.message });
  }
}
