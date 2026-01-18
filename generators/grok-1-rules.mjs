#!/usr/bin/env node
// GROK AGENT 1: Phase 1 Rule Teaching Scripts (20 typing rules)
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const GROK_KEY = process.env.XAI_API_KEY;

console.log('='.repeat(60));
console.log('GROK AGENT 1: Phase 1 Rule Teaching Scripts');
console.log('Target: 20 typing rules');
console.log('='.repeat(60));

const TYPING_RULES = [
  // Grade K (4 rules)
  { grade: 0, rule_id: 'TYPE-R-K-001', rule_name: 'Finding Letters on the Keyboard', skill: 'letter recognition' },
  { grade: 0, rule_id: 'TYPE-R-K-002', rule_name: 'Using the Spacebar', skill: 'spacebar' },
  { grade: 0, rule_id: 'TYPE-R-K-003', rule_name: 'Using the Enter Key', skill: 'enter key' },
  { grade: 0, rule_id: 'TYPE-R-K-004', rule_name: 'Proper Sitting Position', skill: 'posture' },
  // Grade 1 (3 rules)
  { grade: 1, rule_id: 'TYPE-R-G1-001', rule_name: 'Home Row Keys (ASDF JKL;)', skill: 'home row' },
  { grade: 1, rule_id: 'TYPE-R-G1-002', rule_name: 'Correct Finger Placement', skill: 'finger placement' },
  { grade: 1, rule_id: 'TYPE-R-G1-003', rule_name: 'Looking at the Screen, Not Keyboard', skill: 'touch typing basics' },
  // Grade 2 (3 rules)
  { grade: 2, rule_id: 'TYPE-R-G2-001', rule_name: 'Top Row Keys (QWERTY)', skill: 'top row' },
  { grade: 2, rule_id: 'TYPE-R-G2-002', rule_name: 'Bottom Row Keys (ZXCVBNM)', skill: 'bottom row' },
  { grade: 2, rule_id: 'TYPE-R-G2-003', rule_name: 'Using Shift for Capital Letters', skill: 'shift key' },
  // Grade 3 (3 rules)
  { grade: 3, rule_id: 'TYPE-R-G3-001', rule_name: 'Number Row Keys', skill: 'numbers' },
  { grade: 3, rule_id: 'TYPE-R-G3-002', rule_name: 'Common Punctuation (. , ! ?)', skill: 'punctuation' },
  { grade: 3, rule_id: 'TYPE-R-G3-003', rule_name: 'Building Speed with Accuracy', skill: 'speed building' },
  // Grade 4 (2 rules)
  { grade: 4, rule_id: 'TYPE-R-G4-001', rule_name: 'Special Characters (@#$%)', skill: 'special characters' },
  { grade: 4, rule_id: 'TYPE-R-G4-002', rule_name: 'Keyboard Shortcuts (Ctrl+C, Ctrl+V)', skill: 'shortcuts' },
  // Grade 5 (2 rules)
  { grade: 5, rule_id: 'TYPE-R-G5-001', rule_name: 'Advanced Punctuation (; : " \')', skill: 'advanced punctuation' },
  { grade: 5, rule_id: 'TYPE-R-G5-002', rule_name: 'Timed Typing Tests', skill: 'timed tests' },
  // Grade 6 (2 rules)
  { grade: 6, rule_id: 'TYPE-R-G6-001', rule_name: 'Professional Document Formatting', skill: 'formatting' },
  { grade: 6, rule_id: 'TYPE-R-G6-002', rule_name: 'Typing from Dictation', skill: 'dictation' },
  // Grade 7 (1 rule)
  { grade: 7, rule_id: 'TYPE-R-G7-001', rule_name: 'Speed Optimization Techniques', skill: 'speed optimization' }
];

async function callGrok(prompt) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROK_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/);
  return JSON.parse(jsonMatch ? jsonMatch[1] : content);
}

async function generateRule(rule) {
  const prompt = `Generate a Rule Teaching Script for typing education.

Rule: ${rule.rule_name}
Grade: ${rule.grade === 0 ? 'Kindergarten' : 'Grade ' + rule.grade}
Skill: ${rule.skill}

Return JSON matching this exact format:
{
  "rule_id": "${rule.rule_id}",
  "rule_name": "${rule.rule_name}",
  "subject": "typing",
  "grade": ${rule.grade},
  "standard": "ISTE.1c",
  "teaching_script": {
    "intro": "A friendly 1-2 sentence introduction for Gigi to say",
    "steps": [
      {
        "step": 1,
        "text": "What Gigi explains in this step",
        "visual": { "type": "keyboard", "data": { "highlight_keys": ["relevant", "keys"], "finger_labels": true, "home_row": true } },
        "voice_text": "What Gigi says (max 20 words)",
        "duration": 4000
      },
      {
        "step": 2,
        "text": "Second teaching point",
        "visual": { "type": "keyboard", "data": { "highlight_keys": ["more", "keys"], "finger_to_use": "correct finger" } },
        "voice_text": "Voice narration (max 20 words)",
        "duration": 4000
      },
      {
        "step": 3,
        "text": "Third teaching point with practice cue",
        "visual": { "type": "keyboard", "data": { "highlight_keys": ["practice", "keys"] } },
        "voice_text": "Encouragement to try (max 20 words)",
        "duration": 3000
      }
    ]
  },
  "rule_card": {
    "title": "Short catchy title",
    "rule_text": "The main rule in one clear sentence",
    "examples": ["Example 1", "Example 2"],
    "memory_tip": "A fun tip to remember the rule"
  },
  "total_duration": 11000
}

Make it age-appropriate for grade ${rule.grade === 0 ? 'K' : rule.grade}. Use encouraging, kid-friendly language.`;

  return await callGrok(prompt);
}

async function main() {
  let completed = 0;
  let errors = 0;

  for (const rule of TYPING_RULES) {
    try {
      console.log(`[${completed + 1}/20] Generating: ${rule.rule_name}`);

      const result = await generateRule(rule);

      const { error } = await supabase.from('rule_teaching_scripts').insert(result);

      if (error) {
        console.log(`  DB Error: ${error.message}`);
        errors++;
      } else {
        console.log(`  ✅ Saved to database`);
        completed++;
      }

      // Rate limit: 5 seconds between calls
      await new Promise(r => setTimeout(r, 5000));
    } catch (e) {
      console.log(`  ❌ Error: ${e.message}`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`GROK AGENT 1 COMPLETE`);
  console.log(`Completed: ${completed}/20`);
  console.log(`Errors: ${errors}`);
  console.log('='.repeat(60));
}

main();
