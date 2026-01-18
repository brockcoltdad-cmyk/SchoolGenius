#!/usr/bin/env node
// GROK AGENT 8: Phase 4 Practice Problems - Grade 7 (1,794 items)
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const GROK_KEY = process.env.XAI_API_KEY;

console.log('='.repeat(60));
console.log('GROK AGENT 8: Phase 4 Practice - Grade 7');
console.log('Target: 1,794 items');
console.log('='.repeat(60));

const SKILLS = ['speed optimization', 'error recovery', 'rhythm typing', 'professional documents', 'advanced shortcuts'];

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

async function main() {
  let completed = 0, errors = 0;
  const target = 1794;
  const itemsPerSkill = Math.ceil(target / SKILLS.length);

  for (const skill of SKILLS) {
    let skillNum = 1;
    while (completed < target && skillNum <= itemsPerSkill) {
      try {
        const count = Math.min(10, target - completed);
        console.log(`[${completed + 1}-${completed + count}] ${skill}`);

        const prompt = `Generate ${count} advanced typing practice problems for Grade 7, skill: ${skill}. Target 40 WPM. Return JSON array with question, answer, tier1, tier2.`;
        const items = await callGrok(prompt);

        for (let i = 0; i < (Array.isArray(items) ? items.length : 1); i++) {
          const raw = Array.isArray(items) ? items[i] : items;
          const item = {
            id: `TYPE-G7-${skill.toUpperCase().replace(/\s+/g, '').substring(0,8)}-${String(skillNum + i).padStart(4, '0')}`,
            subject: 'typing', grade: 7, skill, standard: 'ISTE.1c',
            question: raw.question || `${skill} challenge ${skillNum + i}`,
            answer: raw.answer || 'typed text',
            tier1: raw.tier1 || { teach: 'Keep a steady rhythm', steps: [] },
            tier2: raw.tier2 || { teach: 'Slow down if needed', steps: [] }
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
  console.log(`GROK AGENT 8 COMPLETE: ${completed}/${target}`);
  console.log('='.repeat(60));
}

main();
