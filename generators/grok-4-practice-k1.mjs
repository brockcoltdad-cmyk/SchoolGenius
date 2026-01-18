#!/usr/bin/env node
// GROK AGENT 4: Phase 4 Practice Problems - Grades K & 1 (1,250 items)
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const GROK_KEY = process.env.XAI_API_KEY;

console.log('='.repeat(60));
console.log('GROK AGENT 4: Phase 4 Practice Problems');
console.log('Grades K (+250) and 1 (+1,000) = 1,250 items');
console.log('='.repeat(60));

const BATCHES = [
  { grade: 0, target: 250, skills: ['finding letters', 'spacebar', 'enter key', 'keyboard awareness'] },
  { grade: 1, target: 1000, skills: ['home row', 'finger placement', 'touch typing basics', 'simple words'] }
];

async function callGrok(prompt) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROK_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'grok-3', messages: [{ role: 'user', content: prompt }], temperature: 0.8, max_tokens: 4000 })
  });
  if (!response.ok) throw new Error(`Grok API error: ${response.status}`);
  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/);
  return JSON.parse(jsonMatch ? jsonMatch[1] : content);
}

async function generateBatch(grade, skill, startNum, count) {
  const prompt = `Generate ${count} typing practice problems for Grade ${grade === 0 ? 'K' : grade}.

Skill: ${skill}
Subject: typing

Return JSON array of ${count} items:
[
  {
    "id": "TYPE-G${grade}-${skill.toUpperCase().replace(/\s+/g, '')}-${String(startNum).padStart(4, '0')}",
    "subject": "typing",
    "grade": ${grade},
    "skill": "${skill}",
    "standard": "ISTE.1c",
    "question": "The typing task",
    "answer": "correct answer (what they should type)",
    "options": null,
    "tier1": {
      "teach": "Helpful explanation (max 25 words)",
      "steps": [{ "step": 1, "visual": { "type": "keyboard", "data": { "highlight_keys": ["relevant"], "finger_to_use": "correct finger" } }, "voice_text": "Help text (max 20 words)", "duration": 4000 }]
    },
    "tier2": {
      "teach": "Simpler explanation (max 20 words)",
      "steps": [{ "step": 1, "visual": { "type": "keyboard", "data": { "highlight_keys": ["key"], "labels": true } }, "voice_text": "Even simpler (max 15 words)", "duration": 4000 }]
    }
  }
]

Make each problem unique. Age-appropriate for ${grade === 0 ? 'Kindergarten' : 'Grade 1'}.`;

  return await callGrok(prompt);
}

async function main() {
  let totalCompleted = 0, totalErrors = 0;

  for (const batch of BATCHES) {
    console.log(`\nStarting Grade ${batch.grade === 0 ? 'K' : batch.grade}: ${batch.target} items`);
    let gradeCompleted = 0;
    const itemsPerSkill = Math.ceil(batch.target / batch.skills.length);

    for (const skill of batch.skills) {
      let skillNum = 1;
      const batchSize = 10;
      const batches = Math.ceil(itemsPerSkill / batchSize);

      for (let b = 0; b < batches && gradeCompleted < batch.target; b++) {
        try {
          const count = Math.min(batchSize, batch.target - gradeCompleted);
          console.log(`  [${gradeCompleted + 1}-${gradeCompleted + count}] ${skill}`);

          const items = await generateBatch(batch.grade, skill, skillNum, count);

          for (let i = 0; i < items.length; i++) {
            items[i].id = `TYPE-G${batch.grade}-${skill.toUpperCase().replace(/\s+/g, '').substring(0,8)}-${String(skillNum + i).padStart(4, '0')}`;
            const { error } = await supabase.from('practice_problems').insert(items[i]);
            if (!error) { gradeCompleted++; totalCompleted++; }
            else { totalErrors++; console.log(`    DB Error: ${error.message}`); }
          }
          skillNum += count;
          console.log(`    ✅ Batch saved (total: ${totalCompleted})`);
          await new Promise(r => setTimeout(r, 5000));
        } catch (e) { console.log(`    ❌ ${e.message}`); totalErrors += batchSize; }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`GROK AGENT 4 COMPLETE: ${totalCompleted}/1250 practice problems`);
  console.log('='.repeat(60));
}

main();
