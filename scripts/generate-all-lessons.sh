#!/bin/bash

# Load environment variables
source .env

echo "Starting lesson generation..."
echo "================================"

# Counter
count=0
max_iterations=70

# Keep calling until all lessons are generated
while [ $count -lt $max_iterations ]; do
  count=$((count + 1))

  echo ""
  echo "Call #$count"
  echo "------------"

  response=$(curl -s -X POST \
    "${VITE_SUPABASE_URL}/functions/v1/generate-next-lesson" \
    -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json")

  echo "$response" | jq '.'

  # Check if we're done
  if echo "$response" | jq -e '.message == "All skills already have content!"' > /dev/null 2>&1; then
    echo ""
    echo "================================"
    echo "✓ All lessons generated!"
    echo "================================"
    break
  fi

  # Check for errors
  if echo "$response" | jq -e '.success == false' > /dev/null 2>&1; then
    echo "⚠ Error encountered, continuing..."
  fi

  # Small delay between calls
  sleep 1
done

echo ""
echo "Script completed after $count calls"
