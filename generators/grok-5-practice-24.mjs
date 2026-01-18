#!/usr/bin/env node
// GROK AGENT 5: Phase 4 Practice Problems - Grades 2 & 4 (888 items)
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const GROK_KEY = process.env.XAI_API_KEY;

console.log('='.repeat(60));
console.log('GROK AGENT 5: Phase 4 Practice Problems');
console.log('Grades 2 (+500) and 4 (+388) = 888 items');
console.log('='.repeat(60));

const BATCHES = [
  { grade: 2, target: 500, skills: ['top row', 'bottom row', 'shift key', 'all letters'] },
  { grade: 4, target: 388, skills: ['special characters', 'keyboard shortcuts', 'speed building'] }
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
  const prompt = `Generate ${count} typing practice problems for Grade ${grade}.

Skill: ${skill}
Subject: typing

Return JSON array:
[
  {
    "id": "TYPE-G${grade}-SKILL-0001",
    "subject": "typing",
    "grade": ${grade},
    "skill": "${skill}",
    "standard": "ISTE.1c",
    "question": "Typing task",
    "answer": "correct answer",
    "options": null,
    "tier1": { "teach": "Help (25 words)", "steps": [{ "step": 1, "visual": { "type": "keyboard", "data": { "highlight_keys": ["keys"] } }, "voice_text": "Help", "duration": 4000 }] },
    "tier2": { "teach": "Simpler (20 words)", "steps": [{ "step": 1, "visual": { "type": "keyboard", "data": { "highlight_keys": ["key"], "labels": true } }, "voice_text": "Simple", "duration": 4000 }] }
  }
]

Make unique problems for Grade ${grade}.`;
  return await callGrok(prompt);
}

async function main() {
  let totalCompleted = 0, totalErrors = 0;

  for (const batch of BATCHES) {
    console.log(`\nGrade ${batch.grade}: ${batch.target} items`);
    let gradeCompleted = 0;
    const itemsPerSkill = Math.ceil(batch.target / batch.skills.length);

    for (const skill of batch.skills) {
      let skillNum = 1;
      const batchSize = 10;

      while (gradeCompleted < batch.target && skillNum <= itemsPerSkill) {
        try {
          const count = Math.min(batchSize, batch.target - gradeCompleted);
          console.log(`  [${gradeCompleted + 1}-${gradeCompleted + count}] ${skill}`);
          const items = await generateBatch(batch.grade, skill, skillNum, count);

          for (let i = 0; i < items.length; i++) {
            items[i].id = `TYPE-G${batch.grade}-${skill.toUpperCase().replace(/\s+/g, '').substring(0,8)}-${String(skillNum + i).padStart(4, '0')}`;
            const { error } = await supabase.from('practice_problems').insert(items[i]);
            if (!error) { gradeCompleted++; totalCompleted++; }
            else { totalErrors++; }
          }
          skillNum += count;
          console.log(`    ✅ Saved (total: ${totalCompleted})`);
          await new Promise(r => setTimeout(r, 5000));
        } catch (e) { console.log(`    ❌ ${e.message}`); totalErrors += 10; break; }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`GROK AGENT 5 COMPLETE: ${totalCompleted}/888`);
  console.log('='.repeat(60));
}

main();
