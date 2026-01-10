#!/bin/bash

echo "=== PRIORITY BUILD STARTED: $(date) ==="

echo "=== SPELLING WORDS ==="
for i in {1..300}; do
  echo "Spelling $i:"
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-spelling-words \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}"
  sleep 2
done

echo "=== WRITING PROMPTS ==="
for i in {1..500}; do
  echo "Writing $i:"
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-writing-prompts \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}"
  sleep 2
done

echo "=== STORIES ==="
for i in {1..400}; do
  echo "Story $i:"
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-story \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}"
  sleep 2
done

echo "=== DONE: $(date) ==="
