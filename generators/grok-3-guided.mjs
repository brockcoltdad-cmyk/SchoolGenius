#!/usr/bin/env node
// GROK AGENT 3: Phase 3 Guided Practice (100 items - 5 per rule)
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const GROK_KEY = process.env.XAI_API_KEY;

console.log('='.repeat(60));
console.log('GROK AGENT 3: Phase 3 Guided Practice');
console.log('Target: 100 items (5 per rule)');
console.log('='.repeat(60));

const RULES = [
  { grade: 0, rule_id: 'TYPE-R-K-001', skill: 'finding letters' },
  { grade: 0, rule_id: 'TYPE-R-K-002', skill: 'spacebar' },
  { grade: 0, rule_id: 'TYPE-R-K-003', skill: 'enter key' },
  { grade: 0, rule_id: 'TYPE-R-K-004', skill: 'posture' },
  { grade: 1, rule_id: 'TYPE-R-G1-001', skill: 'home row' },
  { grade: 1, rule_id: 'TYPE-R-G1-002', skill: 'finger placement' },
  { grade: 1, rule_id: 'TYPE-R-G1-003', skill: 'touch typing' },
  { grade: 2, rule_id: 'TYPE-R-G2-001', skill: 'top row' },
  { grade: 2, rule_id: 'TYPE-R-G2-002', skill: 'bottom row' },
  { grade: 2, rule_id: 'TYPE-R-G2-003', skill: 'shift key' },
  { grade: 3, rule_id: 'TYPE-R-G3-001', skill: 'numbers' },
  { grade: 3, rule_id: 'TYPE-R-G3-002', skill: 'punctuation' },
  { grade: 3, rule_id: 'TYPE-R-G3-003', skill: 'speed' },
  { grade: 4, rule_id: 'TYPE-R-G4-001', skill: 'special chars' },
  { grade: 4, rule_id: 'TYPE-R-G4-002', skill: 'shortcuts' },
  { grade: 5, rule_id: 'TYPE-R-G5-001', skill: 'adv punctuation' },
  { grade: 5, rule_id: 'TYPE-R-G5-002', skill: 'timed tests' },
  { grade: 6, rule_id: 'TYPE-R-G6-001', skill: 'formatting' },
  { grade: 6, rule_id: 'TYPE-R-G6-002', skill: 'dictation' },
  { grade: 7, rule_id: 'TYPE-R-G7-001', skill: 'speed optimization' }
];

async function callGrok(prompt) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROK_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'grok-3', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 3000 })
  });
  if (!response.ok) throw new Error(`Grok API error: ${response.status}`);
  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/);
  return JSON.parse(jsonMatch ? jsonMatch[1] : content);
}

async function generateGuidedBatch(rule) {
  const prompt = `Generate 5 Guided Practice problems for typing.

Rule: ${rule.rule_id}
Skill: ${rule.skill}
Grade: ${rule.grade === 0 ? 'K' : rule.grade}

Return JSON array of 5 items:
[
  {
    "guided_id": "${rule.rule_id.replace('TYPE-R', 'GUIDED')}-001",
    "rule_id": "${rule.rule_id}",
    "subject": "typing",
    "grade": ${rule.grade},
    "standard": "ISTE.1c",
    "problem": "The typing task",
    "answer": "correct answer",
    "hints": ["Hint 1: gentle reminder", "Hint 2: more specific help", "Hint 3: step by step"],
    "solution": { "steps": ["Step 1", "Step 2", "Step 3"] },
    "encouragement": "Great job! You're getting better!"
  }
]

Make problems progressively harder (1=easy, 5=challenging). Age-appropriate for grade ${rule.grade === 0 ? 'K' : rule.grade}.`;

  return await callGrok(prompt);
}

async function main() {
  let completed = 0, errors = 0;

  for (const rule of RULES) {
    try {
      console.log(`[Rule ${RULES.indexOf(rule) + 1}/20] ${rule.rule_id}: Generating 5 guided practice items...`);
      const items = await generateGuidedBatch(rule);

      for (let i = 0; i < items.length; i++) {
        items[i].guided_id = `${rule.rule_id.replace('TYPE-R', 'GUIDED')}-${String(i + 1).padStart(3, '0')}`;
        const { error } = await supabase.from('guided_practice').insert(items[i]);
        if (error) { console.log(`  Item ${i+1} DB Error: ${error.message}`); errors++; }
        else { completed++; }
      }
      console.log(`  ✅ Saved 5 items (total: ${completed})`);
      await new Promise(r => setTimeout(r, 6000));
    } catch (e) { console.log(`  ❌ ${e.message}`); errors += 5; }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`GROK AGENT 3 COMPLETE: ${completed}/100 guided practice items`);
  console.log('='.repeat(60));
}

main();
