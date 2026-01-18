#!/usr/bin/env node
/**
 * TEST GROK API - Diagnose 400 errors
 */

import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const GROK_API_KEY = process.env.GROK_API_KEY || process.env.XAI_API_KEY;

console.log('🧪 TESTING GROK API');
console.log('='.repeat(80));
console.log(`API Key: ${GROK_API_KEY ? GROK_API_KEY.substring(0, 10) + '...' : 'NOT FOUND'}`);
console.log('');

async function testGrokAPI() {
  const testPayload = {
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Return only valid JSON.'
      },
      {
        role: 'user',
        content: 'Say hello in JSON format: {"message": "your greeting here"}'
      }
    ],
    model: 'grok-3',  // Use grok-3 as in seeding scripts
    temperature: 0.7
  };

  console.log('📤 REQUEST:');
  console.log(JSON.stringify(testPayload, null, 2));
  console.log('');

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify(testPayload)
    });

    console.log('📥 RESPONSE:');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('');

    const responseText = await response.text();

    if (!response.ok) {
      console.error('❌ ERROR RESPONSE:');
      console.error(responseText);

      // Try to parse error details
      try {
        const errorJson = JSON.parse(responseText);
        console.error('\n📋 ERROR DETAILS:');
        console.error(JSON.stringify(errorJson, null, 2));
      } catch (e) {
        // Not JSON, already printed
      }

      // Try with different model name
      console.log('\n\n🔄 TRYING WITH MODEL: grok-2-latest');
      await testWithModel('grok-2-latest');

      return;
    }

    const data = JSON.parse(responseText);
    console.log('✅ SUCCESS:');
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ FETCH ERROR:', error.message);
  }
}

async function testWithModel(modelName) {
  const testPayload = {
    messages: [
      {
        role: 'user',
        content: 'Say hello'
      }
    ],
    model: modelName,
    temperature: 0.7
  };

  console.log(`Testing model: ${modelName}`);

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify(testPayload)
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS WITH THIS MODEL!');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log(`❌ Failed: ${errorText.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Run test
testGrokAPI();
