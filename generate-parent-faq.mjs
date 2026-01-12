#!/usr/bin/env node

/**
 * PARENT FAQ GENERATOR
 *
 * Generates 57 parent FAQ articles using Grok
 * Categories: Account, Children, Rewards, Learning, Progress, Themes, Technical
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GROK_API_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

console.log('🤔 PARENT FAQ GENERATOR')
console.log('=' .repeat(70))
console.log('\nGenerating 57 parent help articles...\n')

const categories = [
  { name: 'Account Management', count: 8 },
  { name: 'Child Management', count: 10 },
  { name: 'Coins & Rewards', count: 8 },
  { name: 'Lessons & Learning', count: 10 },
  { name: 'Progress & Reports', count: 7 },
  { name: 'Themes & Personalization', count: 6 },
  { name: 'Technical Issues', count: 8 }
]

async function callGrok(category, count) {
  const prompt = `Generate ${count} common parent questions and detailed answers for the category: "${category}"

For a K-12 homeschool platform called SchoolGenius with:
- AI tutors (Gigi) that teach using voice
- Lessons with coins and rewards system
- 340+ themes kids can customize (dinosaur, space, princess, etc.)
- Progress tracking and reports
- COPPA compliant - child safety focused
- Parent dashboard to manage multiple children

Generate JSON array with ${count} Q&A pairs:
[
  {
    "category": "${category}",
    "question_pattern": "How do I [specific task]?",
    "keywords": ["relevant", "search", "terms"],
    "answer": "Detailed, step-by-step answer (3-5 paragraphs). Be clear, friendly, and helpful. Include specific steps when applicable."
  }
]

Make answers:
- Clear and action-oriented
- Include specific steps (numbered lists when helpful)
- Friendly but professional tone
- Address common pain points
- 3-5 paragraphs each

Return ONLY valid JSON. No markdown, no explanation.`

  try {
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`)
    }

    const data = await response.json()
    const contentStr = data.choices?.[0]?.message?.content

    if (!contentStr) {
      throw new Error('No content from Grok')
    }

    // Parse JSON
    let cleanJson = contentStr.trim()
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7)
    if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3)
    if (cleanJson.endsWith('```')) cleanJson = cleanJson.slice(0, -3)

    return JSON.parse(cleanJson.trim())

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return null
  }
}

async function saveFAQs(faqs) {
  let saved = 0

  for (const faq of faqs) {
    const { error } = await supabase
      .from('parent_help_articles')
      .insert({
        category: faq.category,
        question_pattern: faq.question_pattern,
        keywords: faq.keywords || [],
        answer: faq.answer
      })

    if (error) {
      console.error(`  ❌ Failed to save: ${faq.question_pattern}`)
    } else {
      console.log(`  ✅ ${faq.question_pattern}`)
      saved++
    }
  }

  return saved
}

async function main() {
  const startTime = Date.now()

  // Check if table exists
  const { data: existing, error: checkError } = await supabase
    .from('parent_help_articles')
    .select('id', { count: 'exact', head: true })

  if (checkError) {
    console.log('❌ Error: parent_help_articles table does not exist!')
    console.log('\nRun this SQL in Supabase:')
    console.log(`
CREATE TABLE IF NOT EXISTS public.parent_help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question_pattern TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  answer TEXT NOT NULL,
  times_served INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parent_help_keywords ON parent_help_articles USING gin(keywords);
CREATE INDEX idx_parent_help_category ON parent_help_articles(category);
`)
    process.exit(1)
  }

  console.log(`Current FAQ count: ${existing?.length || 0}\n`)

  let totalGenerated = 0

  for (const category of categories) {
    console.log(`\n📁 ${category.name} (${category.count} articles)`)
    console.log('─'.repeat(70))

    const faqs = await callGrok(category.name, category.count)

    if (faqs && Array.isArray(faqs)) {
      const saved = await saveFAQs(faqs)
      totalGenerated += saved
      console.log(`\n  💾 Saved ${saved}/${category.count} articles`)
    } else {
      console.log(`  ❌ Failed to generate for this category`)
    }

    // Delay between categories
    if (category !== categories[categories.length - 1]) {
      console.log(`\n  ⏳ Waiting 3 seconds...`)
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(70))
  console.log('\n🎉 FAQ GENERATION COMPLETE!\n')
  console.log(`✅ Generated: ${totalGenerated}/57 articles`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: ~$${(totalGenerated * 0.10).toFixed(2)}`)

  // Verify final count
  const { data: final } = await supabase
    .from('parent_help_articles')
    .select('id', { count: 'exact', head: true })

  console.log(`\n📚 Total in database: ${final?.length || 0} articles`)
  console.log('\n✅ Parent Helper now has instant answers!')
  console.log('   Parents can ask questions and get FREE responses from library\n')
}

main().catch(console.error)
