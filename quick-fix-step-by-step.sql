-- Quick fix: Add step_by_step to sample data
UPDATE explanation_library 
SET step_by_step = 'Step 1: Look at the first number (2). Step 2: Look at the second number (3). Step 3: Count up from 2: Start at 2, then 3, 4, 5. Step 4: The last number you said is the answer: 5!'
WHERE problem_text = '2 + 3 = ?' AND step_by_step IS NULL;

-- Verify
SELECT problem_text, 
       CASE WHEN step_by_step IS NOT NULL THEN 'YES' ELSE 'NO' END as has_step_by_step
FROM explanation_library 
WHERE problem_text = '2 + 3 = ?';
