/**
 * Test DeepInfra Flux API - Single Image Generation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY;

async function testImageGeneration() {
  console.log('🧪 Testing DeepInfra Flux API...\n');

  if (!DEEPINFRA_API_KEY) {
    console.error('❌ DEEPINFRA_API_KEY not found');
    return;
  }

  console.log(`API Key: ${DEEPINFRA_API_KEY.substring(0, 8)}...`);

  const prompt = `friendly cartoon giraffe mascot named Gigi, cute big eyes with long eyelashes, warm smile, soft orange and brown spotted pattern, small red bow tie, Pixar Disney 3D animation style, high quality render, white background, front-facing portrait`;

  console.log('\n📝 Prompt:', prompt.substring(0, 80) + '...');
  console.log('\n⏳ Generating image (this may take 10-30 seconds)...\n');

  try {
    const response = await fetch('https://api.deepinfra.com/v1/inference/black-forest-labs/FLUX-1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPINFRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 1024,
        height: 1024,
        num_inference_steps: 4, // schnell is fast with fewer steps
      }),
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API Error: ${error}`);
      return;
    }

    const data = await response.json();
    console.log('Response keys:', Object.keys(data));

    if (data.images && data.images[0]) {
      const outputPath = path.join(__dirname, '..', 'public', 'images', 'gigi-themes', 'gigi-test.png');

      // Handle both base64 and URL responses
      if (data.images[0].startsWith('http')) {
        // It's a URL, download it
        console.log('📥 Downloading from URL...');
        const imgResponse = await fetch(data.images[0]);
        const buffer = Buffer.from(await imgResponse.arrayBuffer());
        fs.writeFileSync(outputPath, buffer);
      } else {
        // It's base64
        const base64Data = data.images[0].replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(outputPath, buffer);
      }

      console.log(`\n✅ SUCCESS! Image saved to:`);
      console.log(`   ${outputPath}`);
      console.log(`\n💰 Cost: ~$0.0005 (FLUX-1-schnell)`);
    } else {
      console.log('Response data:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testImageGeneration();
