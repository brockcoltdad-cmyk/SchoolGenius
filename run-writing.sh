#!/bin/bash
echo "=== WRITING PROMPTS STARTED: $(date) ===" > writing.log
for i in {1..500}; do
  echo "Writing $i:" >> writing.log
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-writing-prompts \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}" >> writing.log 2>&1
  sleep 2
done
echo "=== WRITING DONE: $(date) ===" >> writing.log
