import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This endpoint creates the voice_clones table
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // Create the voice_clones table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS voice_clones (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
          voice_type VARCHAR(50) NOT NULL,
          voice_name VARCHAR(100),
          audio_url TEXT NOT NULL,
          storage_path TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(child_id, voice_type)
        );

        CREATE INDEX IF NOT EXISTS idx_voice_clones_child_id ON voice_clones(child_id);
        CREATE INDEX IF NOT EXISTS idx_voice_clones_type ON voice_clones(child_id, voice_type);

        ALTER TABLE children
        ADD COLUMN IF NOT EXISTS preferred_voice_type VARCHAR(50) DEFAULT 'default';
      `
    });

    // If exec_sql doesn't exist, try direct SQL via REST
    if (tableError) {
      // Try using the SQL endpoint directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({
          sql: `
            CREATE TABLE IF NOT EXISTS voice_clones (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
              voice_type VARCHAR(50) NOT NULL,
              voice_name VARCHAR(100),
              audio_url TEXT NOT NULL,
              storage_path TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(child_id, voice_type)
            );
          `
        })
      });

      if (!response.ok) {
        // Return instructions to run manually
        return NextResponse.json({
          success: false,
          message: 'Could not create table automatically. Please run the SQL in Supabase SQL editor.',
          sql: `
CREATE TABLE IF NOT EXISTS voice_clones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  voice_type VARCHAR(50) NOT NULL,
  voice_name VARCHAR(100),
  audio_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, voice_type)
);

CREATE INDEX IF NOT EXISTS idx_voice_clones_child_id ON voice_clones(child_id);

ALTER TABLE children
ADD COLUMN IF NOT EXISTS preferred_voice_type VARCHAR(50) DEFAULT 'default';
          `
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'voice_clones table created successfully'
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
