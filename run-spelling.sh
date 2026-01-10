#!/bin/bash
echo "=== SPELLING WORDS STARTED: $(date) ===" > spelling.log
for i in {1..300}; do
  echo "Spelling $i:" >> spelling.log
  curl -s -X POST https://eczpdbkslqbduiesbqcm.supabase.co/functions/v1/generate-spelling-words \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjenBkYmtzbHFiZHVpZXNicWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI5NDYsImV4cCI6MjA4MjYwODk0Nn0.kvyksMbC8J01iu7s5sHPs9XsojPjRJhgQ496Qr9IPYg" \
    -d "{}" >> spelling.log 2>&1
  sleep 2
done
echo "=== SPELLING DONE: $(date) ===" >> spelling.log
