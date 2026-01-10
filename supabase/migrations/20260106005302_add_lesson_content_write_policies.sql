/*
  # Add Write Policies for lesson_content Table

  ## Purpose
  Enable Python script (using service_role key) to insert and update lesson content data.

  ## Changes Made
  
  1. **New Policies**
     - INSERT policy for service_role
       - Allows backend scripts to create new lesson content records
       - No restrictions (service_role is trusted)
     
     - UPDATE policy for service_role
       - Allows backend scripts to modify existing lesson content
       - No restrictions (service_role is trusted)

  ## Security Notes
  - service_role bypasses RLS by default, but explicit policies provide better documentation
  - Existing SELECT policy for authenticated users remains unchanged
  - Frontend users (authenticated) can still only read, not write
*/

-- INSERT policy for service_role
CREATE POLICY "Service role can insert lesson content"
  ON lesson_content
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- UPDATE policy for service_role
CREATE POLICY "Service role can update lesson content"
  ON lesson_content
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);