#!/usr/bin/env node
/**
 * TEST: Generate one story to verify everything works
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1'
});

async function testOneStory() {
  console.log('🧪 TESTING: Generate 1 story with Grok...');
  console.log('');

  const prompt = `You are an Arizona curriculum expert creating a Lexile-leveled reading story.

REQUIREMENTS:
- Grade Level: 3
- Lexile Range: 400L-600L
- Target Word Count: 400 words
- Category: Wizard Academy
- Target Audience: Boys (action, adventure themes)

Generate a complete story with EXACTLY 10 comprehension questions.

OUTPUT JSON FORMAT (return ONLY this JSON, no other text):
{
  "title": "Story Title",
  "content": "Full story text here (400 words)...",
  "word_count": 400,
  "vocabulary": [
    {"word": "example", "definition": "meaning", "sentence": "example sentence"}
  ],
  "reading_strategy": "main_idea",
  "strategy_tip": "While reading, ask: What is this story mostly about?",
  "comprehension_questions": [
    {
      "question_number": 1,
      "question_type": "main_idea",
      "question_text": "What is this story mostly about?",
      "choice_a": "Option A",
      "choice_b": "Option B",
      "choice_c": "Option C",
      "choice_d": "Option D",
      "correct_answer": "B"
    }
  ]
}`;

  try {
    console.log('📡 Calling Grok API...');
    const startTime = Date.now();

    const response = await grok.chat.completions.create({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Response received in ${elapsed}s`);

    const content = response.choices[0].message.content;

    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('❌ ERROR: No JSON found in response');
      console.log('Raw response:', content.substring(0, 500));
      return;
    }

    const storyData = JSON.parse(jsonMatch[0]);
    console.log('');
    console.log('📖 GENERATED STORY:');
    console.log('   Title:', storyData.title);
    console.log('   Words:', storyData.word_count || 'N/A');
    console.log('   Content length:', storyData.content?.length || 0, 'chars');
    console.log('   Vocabulary:', storyData.vocabulary?.length || 0, 'words');
    console.log('   Questions:', storyData.comprehension_questions?.length || 0);
    console.log('');

    // Save to database
    console.log('💾 Saving to database...');
    const { data, error } = await supabase
      .from('stories')
      .insert({
        title: storyData.title,
        content: storyData.content,
        genre: 'Wizard Academy',
        reading_level: '400L',
        word_count: storyData.word_count || 400,
        lexile_band: '400L-600L',
        grade_level: 3,
        expected_time_minutes: 25,
        gender_target: 'boys',
        category: 'Wizard Academy',
        vocabulary: storyData.vocabulary || [],
        reading_strategy: storyData.reading_strategy || 'main_idea',
        strategy_tip: storyData.strategy_tip || '',
        times_read: 0,
        comprehension_questions: storyData.comprehension_questions || []
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Save ERROR:', error.message);
    } else {
      console.log('✅ SUCCESS! Story saved with ID:', data.id);
      console.log('');
      console.log('🚀 Ready for full generation!');
      console.log('');
      console.log('Run: node scripts/reading-library/generate-reading-stories.mjs --start=K --end=2');
    }

  } catch (err) {
    console.log('❌ API ERROR:', err.message);
    if (err.message.includes('429')) {
      console.log('   Rate limit hit! Wait a minute and try again.');
    }
  }
}

testOneStory().catch(console.error);
