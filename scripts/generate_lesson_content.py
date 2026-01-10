#!/usr/bin/env python3
"""
Generate lesson content for all curriculum skills using Grok AI
"""
import os
import json
import time
from dotenv import load_dotenv
import requests

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
XAI_API_KEY = os.getenv('GROK_API_KEY')

if not all([SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, XAI_API_KEY]):
    print("ERROR: Missing required environment variables!")
    print(f"SUPABASE_URL: {'✓' if SUPABASE_URL else '✗'}")
    print(f"SUPABASE_SERVICE_ROLE_KEY: {'✓' if SUPABASE_SERVICE_ROLE_KEY else '✗'}")
    print(f"GROK_API_KEY (XAI_API_KEY): {'✓' if XAI_API_KEY else '✗'}")
    exit(1)

GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

def supabase_request(method, endpoint, data=None):
    """Make a request to Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }

    if method == 'GET':
        response = requests.get(url, headers=headers)
    elif method == 'POST':
        response = requests.post(url, headers=headers, json=data)
    elif method == 'PATCH':
        response = requests.patch(url, headers=headers, json=data)

    response.raise_for_status()

    if method == 'GET':
        return response.json()
    return None

def get_all_skills():
    """Fetch all curriculum skills"""
    print("Fetching curriculum skills...")
    skills = supabase_request('GET', 'curriculum_skills?select=*&order=subject_code,skill_code')
    print(f"Found {len(skills)} skills")
    return skills

def check_existing_content(skill_id):
    """Check if content already exists for this skill"""
    endpoint = f'lesson_content?skill_id=eq.{skill_id}&select=id'
    try:
        existing = supabase_request('GET', endpoint)
        return len(existing) > 0
    except:
        return False

def generate_content_with_grok(skill):
    """Generate lesson content using Grok API"""
    prompt = f"""You are an expert K-12 curriculum designer. Generate comprehensive lesson content for:

SKILL: {skill['skill_name']}
SUBJECT: {skill['subject_code']}
SKILL CODE: {skill['skill_code']}
DESCRIPTION: {skill.get('skill_description', skill['skill_name'])}

Generate JSON with this EXACT structure:
{{
  "rules_text": "2-3 clear paragraphs explaining the concept in simple language",
  "rules_audio_script": "A conversational script for audio narration (150-200 words)",
  "demo_problems": [
    {{"problem": "example problem text", "steps": ["step 1", "step 2"], "answer": "final answer", "explanation": "why this works"}}
  ],
  "guided_practice": [
    {{"problem": "practice problem", "hints": ["helpful hint 1", "helpful hint 2"], "answer": "correct answer", "explanation": "detailed solution"}}
  ],
  "independent_practice": [
    {{"problem": "independent problem", "answer": "correct answer", "difficulty": "easy", "wrong_answers": ["wrong 1", "wrong 2", "wrong 3"]}}
  ],
  "challenge_problems": [
    {{"problem": "challenging problem", "answer": "correct answer", "explanation": "solution approach"}}
  ],
  "quiz_questions": [
    {{"question": "quiz question", "answer": "correct answer", "wrong_answers": ["wrong 1", "wrong 2", "wrong 3"], "points": 10}}
  ],
  "review_questions": [
    {{"question": "review question", "answer": "correct answer", "explanation": "why this is correct"}}
  ]
}}

Include at least 3 items in each array. Return ONLY valid JSON, no markdown formatting."""

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {XAI_API_KEY}'
    }

    payload = {
        'model': 'grok-beta',
        'messages': [{'role': 'user', 'content': prompt}],
        'temperature': 0.7,
        'max_tokens': 4000
    }

    response = requests.post(GROK_API_URL, headers=headers, json=payload)
    response.raise_for_status()

    data = response.json()
    content_text = data['choices'][0]['message']['content']

    # Clean up markdown formatting if present
    content_text = content_text.strip()
    if content_text.startswith('```json'):
        content_text = content_text[7:]
    if content_text.startswith('```'):
        content_text = content_text[3:]
    if content_text.endswith('```'):
        content_text = content_text[:-3]
    content_text = content_text.strip()

    return json.loads(content_text)

def save_lesson_content(skill, content):
    """Save lesson content to Supabase using exact column names"""

    # Prepare the data with exact column names
    lesson_data = {
        'skill_id': skill['id'],
        'subject_code': skill['subject_code'],
        'skill_name': skill['skill_name'],
        'rules_text': content.get('rules_text', ''),
        'rules_audio_script': content.get('rules_audio_script', ''),
        'demo_problems': content.get('demo_problems', []),
        'guided_practice': content.get('guided_practice', []),
        'independent_practice': content.get('independent_practice', []),
        'challenge_problems': content.get('challenge_problems', []),
        'quiz_questions': content.get('quiz_questions', []),
        'review_questions': content.get('review_questions', [])
    }

    # Insert into lesson_content table
    supabase_request('POST', 'lesson_content', lesson_data)

def main():
    print("=" * 60)
    print("LESSON CONTENT GENERATION SCRIPT")
    print("=" * 60)
    print()

    # Get all skills
    skills = get_all_skills()

    print()
    print(f"Processing {len(skills)} skills...")
    print("=" * 60)

    success_count = 0
    skip_count = 0
    error_count = 0

    for idx, skill in enumerate(skills, 1):
        skill_label = f"{skill['subject_code']}/{skill['skill_code']} - {skill['skill_name']}"
        print(f"\n[{idx}/{len(skills)}] {skill_label}")

        # Check if content already exists
        if check_existing_content(skill['id']):
            print("  ⏭️  Content already exists, skipping...")
            skip_count += 1
            continue

        try:
            # Generate content with Grok
            print("  🤖 Generating content with Grok...")
            content = generate_content_with_grok(skill)

            # Save to database
            print("  💾 Saving to database...")
            save_lesson_content(skill, content)

            print("  ✅ Success!")
            success_count += 1

            # Delay between API calls
            if idx < len(skills):
                print("  ⏳ Waiting 3 seconds...")
                time.sleep(3)

        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            error_count += 1
            # Still wait on error to avoid rate limits
            time.sleep(3)

    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully generated: {success_count}")
    print(f"⏭️  Skipped (already exists): {skip_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📊 Total processed: {len(skills)}")
    print()

if __name__ == '__main__':
    main()
