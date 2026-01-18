#!/usr/bin/env node
/**
 * Test Claude API Quality vs Grok
 * Sprint 0, Task 3
 *
 * Compares response quality for lesson content generation
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const GROK_KEY = process.env.XAI_API_KEY;
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

// Test prompt: Generate a simple math explanation
const testPrompt = `Generate a simple, encouraging explanation for how to add fractions with different denominators.

Target audience: 4th grade student (age 9-10)
Tone: Friendly, encouraging
Length: 2-3 short paragraphs

Example problem: 1/3 + 1/4 = ?`;

console.log('🧪 CLAUDE API vs GROK QUALITY TEST');
console.log('='.repeat(80));

// Test Claude API
async function testClaude() {
  console.log('\n📘 Testing Claude API (Sonnet 4.5)...\n');

  try {
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

    const startTime = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: testPrompt
      }]
    });
    const duration = Date.now() - startTime;

    const response = message.content[0].text;
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const cost = (inputTokens / 1000000 * 3) + (outputTokens / 1000000 * 15);

    console.log('CLAUDE RESPONSE:');
    console.log('-'.repeat(80));
    console.log(response);
    console.log('-'.repeat(80));
    console.log(`\n⏱️  Duration: ${duration}ms`);
    console.log(`💰 Cost: $${cost.toFixed(6)} (${inputTokens} in, ${outputTokens} out)`);
    console.log(`📏 Length: ${response.length} chars, ${response.split(' ').length} words`);

    return { response, duration, cost, tokens: { input: inputTokens, output: outputTokens } };
  } catch (error) {
    console.error('❌ Claude API Error:', error.message);
    return null;
  }
}

// Test Grok API
async function testGrok() {
  console.log('\n📗 Testing Grok API (grok-3)...\n');

  try {
    const startTime = Date.now();
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{ role: 'user', content: testPrompt }],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const duration = Date.now() - startTime;
    const data = await response.json();
    const content = data.choices[0].message.content;

    // Grok pricing is flat $0.001/request (no token-based pricing published)
    const cost = 0.001;

    console.log('GROK RESPONSE:');
    console.log('-'.repeat(80));
    console.log(content);
    console.log('-'.repeat(80));
    console.log(`\n⏱️  Duration: ${duration}ms`);
    console.log(`💰 Cost: $${cost.toFixed(6)} (flat rate per request)`);
    console.log(`📏 Length: ${content.length} chars, ${content.split(' ').length} words`);

    return { response: content, duration, cost };
  } catch (error) {
    console.error('❌ Grok API Error:', error.message);
    return null;
  }
}

// Run comparison
async function runComparison() {
  const claudeResult = await testClaude();
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 sec delay
  const grokResult = await testGrok();

  if (!claudeResult || !grokResult) {
    console.error('\n❌ Test failed - could not get responses from both APIs');
    return;
  }

  console.log('\n\n📊 COMPARISON SUMMARY');
  console.log('='.repeat(80));

  // Cost comparison
  console.log('\n💰 COST:');
  console.log(`   Claude: $${claudeResult.cost.toFixed(6)}`);
  console.log(`   Grok:   $${grokResult.cost.toFixed(6)}`);
  console.log(`   Ratio:  ${(claudeResult.cost / grokResult.cost).toFixed(1)}x more expensive`);

  // Speed comparison
  console.log('\n⚡ SPEED:');
  console.log(`   Claude: ${claudeResult.duration}ms`);
  console.log(`   Grok:   ${grokResult.duration}ms`);
  console.log(`   Winner: ${claudeResult.duration < grokResult.duration ? 'Claude' : 'Grok'}`);

  // Length comparison
  console.log('\n📏 LENGTH:');
  console.log(`   Claude: ${claudeResult.response.length} chars`);
  console.log(`   Grok:   ${grokResult.response.length} chars`);

  // Quality assessment (manual)
  console.log('\n🎯 QUALITY ASSESSMENT (Manual Review):');
  console.log('   Review both responses above and assess:');
  console.log('   - Tone appropriateness for 4th grader');
  console.log('   - Clarity of explanation');
  console.log('   - Encouragement and positivity');
  console.log('   - Technical accuracy');

  console.log('\n💡 RECOMMENDATION:');
  console.log('   - Use Grok for: High-volume cached content (explanations, analogies, greetings)');
  console.log('   - Use Claude for: Real-time dynamic content requiring nuance');
  console.log(`   - Cost savings: ${(claudeResult.cost / grokResult.cost).toFixed(0)}x cheaper with Grok`);

  console.log('\n✅ Quality test complete! Review responses above to make final decision.');
}

runComparison();
