#!/usr/bin/env node
// GROK AGENT 2: Phase 2 Demo Problems (60 demos - 3 per rule)
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const GROK_KEY = process.env.XAI_API_KEY;

console.log('='.repeat(60));
console.log('GROK AGENT 2: Phase 2 Demo Problems');
console.log('Target: 60 demos (3 per rule)');
console.log('='.repeat(60));

const DEMO_CONFIGS = [
  // Grade K demos
  { grade: 0, rule_id: 'TYPE-R-K-001', demos: ['Find letter A', 'Find letter M', 'Find letter S'] },
  { grade: 0, rule_id: 'TYPE-R-K-002', demos: ['Press spacebar once', 'Add space between words', 'Space after period'] },
  { grade: 0, rule_id: 'TYPE-R-K-003', demos: ['Press Enter to go down', 'Start new line', 'Enter after sentence'] },
  { grade: 0, rule_id: 'TYPE-R-K-004', demos: ['Sit up straight', 'Feet on floor', 'Arms relaxed'] },
  // Grade 1 demos
  { grade: 1, rule_id: 'TYPE-R-G1-001', demos: ['Type asdf', 'Type jkl;', 'Type home row words'] },
  { grade: 1, rule_id: 'TYPE-R-G1-002', demos: ['Left pinky on A', 'Right index on J', 'All fingers home'] },
  { grade: 1, rule_id: 'TYPE-R-G1-003', demos: ['Eyes on screen', 'Feel the bumps', 'Type without looking'] },
  // Grade 2 demos
  { grade: 2, rule_id: 'TYPE-R-G2-001', demos: ['Type qwerty', 'Type top row', 'Reach up from home'] },
  { grade: 2, rule_id: 'TYPE-R-G2-002', demos: ['Type zxcvb', 'Type nm,./', 'Reach down from home'] },
  { grade: 2, rule_id: 'TYPE-R-G2-003', demos: ['Type capital A', 'Type Hello', 'Shift + letter'] },
  // Grade 3 demos
  { grade: 3, rule_id: 'TYPE-R-G3-001', demos: ['Type 123', 'Type 2024', 'Numbers in words'] },
  { grade: 3, rule_id: 'TYPE-R-G3-002', demos: ['End with period', 'Use comma', 'Question mark'] },
  { grade: 3, rule_id: 'TYPE-R-G3-003', demos: ['Type for 1 minute', 'Beat your speed', 'Accuracy first'] },
  // Grade 4 demos
  { grade: 4, rule_id: 'TYPE-R-G4-001', demos: ['Type email @', 'Use # hashtag', 'Dollar sign $'] },
  { grade: 4, rule_id: 'TYPE-R-G4-002', demos: ['Copy with Ctrl+C', 'Paste with Ctrl+V', 'Undo with Ctrl+Z'] },
  // Grade 5 demos
  { grade: 5, rule_id: 'TYPE-R-G5-001', demos: ['Use semicolon', 'Use colon', 'Use quotes'] },
  { grade: 5, rule_id: 'TYPE-R-G5-002', demos: ['1 minute test', '3 minute test', 'Check WPM'] },
  // Grade 6 demos
  { grade: 6, rule_id: 'TYPE-R-G6-001', demos: ['Tab for indent', 'Bullet points', 'Paragraph format'] },
  { grade: 6, rule_id: 'TYPE-R-G6-002', demos: ['Listen and type', 'Dictation practice', 'Real-time typing'] },
  // Grade 7 demos
  { grade: 7, rule_id: 'TYPE-R-G7-001', demos: ['Rhythm typing', 'Error recovery', 'Speed drills'] }
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

async function generateDemo(config, demoIndex, demoTask) {
  const prompt = `Generate a Demo Problem for typing education where Gigi shows the student how to do it.

Rule ID: ${config.rule_id}
Demo Task: ${demoTask}
Grade: ${config.grade === 0 ? 'Kindergarten' : 'Grade ' + config.grade}

Return JSON:
{
  "demo_id": "DEMO-${config.rule_id}-${String(demoIndex + 1).padStart(3, '0')}",
  "rule_id": "${config.rule_id}",
  "subject": "typing",
  "grade": ${config.grade},
  "standard": "ISTE.1c",
  "problem": "${demoTask}",
  "answer": "The correct result",
  "walkthrough": {
    "steps": [
      { "step": 1, "action": "What Gigi does first", "visual": { "type": "keyboard", "data": { "highlight_keys": ["keys"] } }, "voice_text": "Watch me do this!" },
      { "step": 2, "action": "Second step", "visual": { "type": "keyboard", "data": { "highlight_keys": ["keys"] } }, "voice_text": "Now I press..." },
      { "step": 3, "action": "Complete the task", "voice_text": "And that's how you do it!" }
    ]
  }
}`;
  return await callGrok(prompt);
}

async function main() {
  let completed = 0, errors = 0, total = DEMO_CONFIGS.reduce((sum, c) => sum + c.demos.length, 0);

  for (const config of DEMO_CONFIGS) {
    for (let i = 0; i < config.demos.length; i++) {
      try {
        console.log(`[${completed + 1}/${total}] Demo: ${config.demos[i]}`);
        const result = await generateDemo(config, i, config.demos[i]);
        const { error } = await supabase.from('demo_problems').insert(result);
        if (error) { console.log(`  DB Error: ${error.message}`); errors++; }
        else { console.log(`  ✅ Saved`); completed++; }
        await new Promise(r => setTimeout(r, 5000));
      } catch (e) { console.log(`  ❌ ${e.message}`); errors++; }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`GROK AGENT 2 COMPLETE: ${completed}/${total} demos`);
  console.log('='.repeat(60));
}

main();
