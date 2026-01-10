/*
  # Fix lesson_content RLS policy for service role
  
  1. Changes
    - Drop the incorrect "Service can manage" policy
    - Create a new policy that allows service role to bypass RLS
    - Service role access should work via the connection string, not RLS
  
  2. Notes
    - Service role bypasses RLS by default in Supabase
    - The issue is that the edge function might not be using service role correctly
    - We'll add a simpler policy structure
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Service can manage" ON lesson_content;

-- Service role bypasses RLS automatically, but let's ensure it's properly configured
-- Add a policy that allows authenticated service to write
CREATE POLICY "Service role can manage all"
  ON lesson_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);