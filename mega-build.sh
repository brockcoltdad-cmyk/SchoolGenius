#!/bin/bash

echo "=== MEGA BUILD STARTED: $(date) ==="

echo ""
echo "=== STEP 1: FINISH LESSONS (50 calls) ==="
for i in {1..50}; do
  echo "Lesson $i:"
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-lesson \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}"
  sleep 2
done
echo "LESSONS DONE: $(date)"

echo ""
echo "=== STEP 2: FINISH STORIES (400 calls) ==="
for i in {1..400}; do
  echo "Story $i:"
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-story \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}"
  sleep 2
done
echo "STORIES DONE: $(date)"

echo ""
echo "=== STEP 3: SPELLING WORDS (300 calls) ==="
for i in {1..300}; do
  echo "Spelling batch $i:"
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-spelling-words \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}"
  sleep 2
done
echo "SPELLING DONE: $(date)"

echo ""
echo "=== STEP 4: WRITING PROMPTS (500 calls) ==="
for i in {1..500}; do
  echo "Writing prompt $i:"
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-writing-prompts \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}"
  sleep 2
done

echo ""
echo "=== ALL COMPLETE: $(date) ==="
echo "Total iterations: 1,250"
