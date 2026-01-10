#!/bin/bash
echo "=== STORIES STARTED: $(date) ===" > stories.log
for i in {1..400}; do
  echo "Story $i:" >> stories.log
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-story \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}" >> stories.log 2>&1
  sleep 2
done
echo "=== STORIES DONE: $(date) ===" >> stories.log
