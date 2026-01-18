#!/usr/bin/env node
// GROK AGENT 6: Phase 4 Practice Problems - Grade 5 (1,094 items)
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const GROK_KEY = process.env.XAI_API_KEY;

console.log('='.repeat(60));
console.log('GROK AGENT 6: Phase 4 Practice - Grade 5');
console.log('Target: 1,094 items');
console.log('='.repeat(60));

const SKILLS = ['advanced punctuation', 'timed tests', 'paragraph typing', 'speed accuracy'];

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

async function generateBatch(skill, startNum, count) {
  const prompt = `Generate ${count} typing practice problems for Grade 5.
Skill: ${skill}

Return JSON array with tier1/tier2 help, keyboard visuals. Make problems appropriate for 10-11 year olds.`;
  return await callGrok(prompt);
}

async function main() {
  let completed = 0, errors = 0;
  const target = 1094;
  const itemsPerSkill = Math.ceil(target / SKILLS.length);

  for (const skill of SKILLS) {
    let skillNum = 1;
    while (completed < target && skillNum <= itemsPerSkill) {
      try {
        const count = Math.min(10, target - completed);
        console.log(`[${completed + 1}-${completed + count}] ${skill}`);
        const items = await generateBatch(skill, skillNum, count);

        for (let i = 0; i < items.length; i++) {
          const item = {
            id: `TYPE-G5-${skill.toUpperCase().replace(/\s+/g, '').substring(0,8)}-${String(skillNum + i).padStart(4, '0')}`,
            subject: 'typing', grade: 5, skill, standard: 'ISTE.1c',
            question: items[i].question || `Type: ${skill} practice ${skillNum + i}`,
            answer: items[i].answer || 'typed text',
            tier1: items[i].tier1 || { teach: 'Use correct fingers', steps: [] },
            tier2: items[i].tier2 || { teach: 'Watch the keyboard', steps: [] }
          };
          const { error } = await supabase.from('practice_problems').insert(item);
          if (!error) completed++;
          else errors++;
        }
        skillNum += count;
        console.log(`  ✅ (${completed}/${target})`);
        await new Promise(r => setTimeout(r, 5000));
      } catch (e) { console.log(`  ❌ ${e.message}`); errors += 10; break; }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`GROK AGENT 6 COMPLETE: ${completed}/${target}`);
  console.log('='.repeat(60));
}

main();
