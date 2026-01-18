-- Fix RLS policies for scanned_homework - add authenticated user access
DROP POLICY IF EXISTS "Parents can read child's scanned homework" ON scanned_homework;
CREATE POLICY "Parents can read child's scanned homework"
  ON scanned_homework FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = scanned_homework.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Fix RLS policies for daily_schedule - add authenticated user access  
DROP POLICY IF EXISTS "Parents can view child daily schedule" ON daily_schedule;
CREATE POLICY "Parents can view child daily schedule"
  ON daily_schedule FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = daily_schedule.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Also add UPDATE policy so lessons can be marked complete
CREATE POLICY "Parents can update child daily schedule" ON daily_schedule
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = daily_schedule.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = daily_schedule.child_id
      AND children.parent_id = auth.uid()
    )
  );
