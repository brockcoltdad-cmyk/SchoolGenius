/**
 * Generate Gigi Theme Images using DeepInfra Flux API
 *
 * Usage: node scripts/generate-gigi-themes.mjs
 *
 * This script generates themed Gigi mascot images for all SchoolGenius themes
 * using the DeepInfra Flux API (already have API key!)
 *
 * Cost estimate: ~85 images × $0.03 = ~$2.55 total
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
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'gigi-themes');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Base Gigi description for consistency
const GIGI_BASE = `friendly cartoon giraffe mascot named Gigi, cute big eyes with long eyelashes, warm smile, soft orange and brown spotted pattern, small red bow tie, Pixar Disney 3D animation style, high quality render, white background, front-facing portrait`;

// All theme prompts
const THEME_PROMPTS = {
  // GRADES K-2 (Ages 5-8)
  'dinosaur': `${GIGI_BASE}, wearing dinosaur costume hoodie with T-Rex spikes, prehistoric jungle background, playful pose, vibrant green colors`,
  'monster': `${GIGI_BASE}, as friendly fuzzy monster with colorful fur patches, silly expression, monster feet slippers, purple and green colors`,
  'hero': `${GIGI_BASE}, as superhero with flowing red cape, golden star emblem on chest, heroic pose, comic book style`,
  'space': `${GIGI_BASE}, astronaut in white NASA spacesuit, glass helmet, floating in space, planets and stars background`,
  'robot': `${GIGI_BASE}, as friendly robot with metallic silver body, glowing blue LED eyes, circuit patterns, futuristic style`,
  'pirate': `${GIGI_BASE}, as pirate captain with tricorn hat, eye patch, treasure map, wooden ship deck background`,
  'shark': `${GIGI_BASE}, wearing shark costume hoodie with fin, underwater ocean scene, bubbles, cute style`,
  'unicorn': `${GIGI_BASE}, with magical unicorn horn, rainbow mane, sparkles, enchanted forest, pastel pink and purple`,
  'mermaid': `${GIGI_BASE}, as mermaid with shimmering teal fish tail, seashell accessories, underwater coral reef`,
  'princess': `${GIGI_BASE}, as royal princess in pink ball gown, golden tiara with jewels, fairy tale castle background`,
  'rainbow': `${GIGI_BASE}, surrounded by magical rainbow arcs, rainbow-striped outfit, clouds and sunshine`,
  'butterfly': `${GIGI_BASE}, with beautiful monarch butterfly wings, flower crown, garden full of flowers`,
  'kitten': `${GIGI_BASE}, wearing cat ear headband, whisker face paint, fluffy cat costume, cozy home setting`,
  'fairy': `${GIGI_BASE}, as tiny fairy with translucent wings, flower petal dress, magic wand with star`,
  'ballerina': `${GIGI_BASE}, as graceful ballerina in pink tutu, ballet slippers, elegant dance pose`,
  'safari': `${GIGI_BASE}, as safari explorer with khaki vest and hat, binoculars, African savanna background`,
  'farm': `${GIGI_BASE}, as farmer with straw hat and overalls, basket of vegetables, red barn background`,
  'candy': `${GIGI_BASE}, in candy land with lollipops, cotton candy clouds, sweet pastel colors`,
  'construction': `${GIGI_BASE}, as construction worker with yellow hard hat, orange safety vest, building site`,
  'firefighter': `${GIGI_BASE}, as brave firefighter in red coat and helmet, fire truck background`,
  'ocean': `${GIGI_BASE}, in scuba diving gear, colorful tropical fish, coral reef underwater`,
  'jungle': `${GIGI_BASE}, as jungle explorer with explorer hat, tropical rainforest, parrots and vines`,
  'arctic': `${GIGI_BASE}, in cozy winter parka with fur hood, ice and snow, northern lights sky`,
  'teddy': `${GIGI_BASE}, cuddling teddy bear plushie, cozy pajamas with stars, soft bedroom setting`,
  'puppy': `${GIGI_BASE}, wearing puppy dog ears, spotted costume, holding tennis ball, dog park`,
  'bug': `${GIGI_BASE}, as friendly ladybug with red spotted shell, antenna headband, garden flowers`,
  'train': `${GIGI_BASE}, as train conductor with blue cap, colorful steam locomotive, railroad tracks`,
  'beach': `${GIGI_BASE}, at sunny beach with sunglasses, Hawaiian shirt, sandcastle, palm trees`,
  'camping': `${GIGI_BASE}, roasting marshmallows at campfire, camping tent, starry night sky`,
  'volcano': `${GIGI_BASE}, as adventurer near volcano, wearing adventure gear, dramatic red lava glow`,
  'planet': `${GIGI_BASE}, standing on colorful alien planet, space explorer suit, multiple moons in sky`,

  // GRADES 3-5 (Ages 8-11)
  'ninja': `${GIGI_BASE}, as stealthy ninja warrior, black ninja outfit with red accents, Japanese dojo`,
  'zombie': `${GIGI_BASE}, in zombie apocalypse survivor gear, tattered but cute, spooky graveyard, Halloween`,
  'racecar': `${GIGI_BASE}, as race car driver in racing suit, checkered flag helmet, race track`,
  'mech': `${GIGI_BASE}, piloting giant robot mech suit, mechanical armor, futuristic city`,
  'battle': `${GIGI_BASE}, as medieval knight in shining armor, sword and shield, castle fortress`,
  'builder': `${GIGI_BASE}, made of blocky pixels and cubes, Minecraft style, holding pickaxe, voxel art`,
  'web': `${GIGI_BASE}, with spider web pattern costume, climbing pose, comic book action style`,
  'creatures': `${GIGI_BASE}, as creature trainer with pokeball-style orbs, cute companions, anime style`,
  'popstar': `${GIGI_BASE}, as famous pop singer with microphone, sparkly stage costume, concert lights`,
  'cupcake': `${GIGI_BASE}, as baker with chef hat and apron, decorating cupcakes, bakery kitchen`,
  'friendship': `${GIGI_BASE}, with best friends group hug pose, friendship bracelets, heart decorations`,
  'kawaii': `${GIGI_BASE}, super cute Japanese kawaii style, big sparkly anime eyes, pastel colors, chibi`,
  'glam': `${GIGI_BASE}, as glamorous fashion diva, sparkly dress and jewelry, red carpet`,
  'fashion': `${GIGI_BASE}, as fashion designer with sketch pad, trendy outfit, runway background`,
  'ice': `${GIGI_BASE}, as ice skating princess on frozen pond, sparkly skating dress, winter wonderland`,
  'pony': `${GIGI_BASE}, with colorful pony mane and tail, magical pony land, friendship is magic style`,
  'slime': `${GIGI_BASE}, playing with colorful glitter slime, stretchy gooey fun, neon pink and blue`,
  'bracelet': `${GIGI_BASE}, making friendship bracelets, beads and string, creative workspace`,
  'artstudio': `${GIGI_BASE}, as artist with paint palette and brush, colorful paint splatters, art studio`,
  'spaday': `${GIGI_BASE}, relaxing at spa with cucumber eyes, fluffy robe, peaceful zen setting`,
  'petgroomer': `${GIGI_BASE}, as pet groomer with cute dog client, grooming tools, pet salon`,
  'moviestar': `${GIGI_BASE}, as Hollywood movie star, director chair, film set, golden award trophy`,

  // GRADES 6-8 (Ages 11-14)
  'neon': `${GIGI_BASE}, in neon cyberpunk style, glowing LED outfit, dark city with neon signs, synthwave`,
  'anime': `${GIGI_BASE}, as anime protagonist, dramatic wind-blown pose, cherry blossoms, Japanese animation`,
  'sneaker': `${GIGI_BASE}, as sneakerhead collector, fresh limited kicks, streetwear outfit, urban style`,
  'esports': `${GIGI_BASE}, as professional esports gamer, gaming headset, RGB keyboard, tournament stage`,
  'graffiti': `${GIGI_BASE}, as street artist with spray paint, colorful graffiti wall, hip hop style`,
  'hiphop': `${GIGI_BASE}, as hip hop artist with gold chain, boombox, urban street, streetwear`,
  'scifi': `${GIGI_BASE}, in sci-fi space station, holographic displays, futuristic technology`,
  'darkninja': `${GIGI_BASE}, as shadow ninja master, all black stealth outfit, moonlit rooftop`,
  'aesthetic': `${GIGI_BASE}, in dreamy aesthetic setting, fairy lights and plants, Instagram aesthetic`,
  'kpop': `${GIGI_BASE}, as K-pop idol star, stylish stage outfit, concert lightsticks, pink and purple`,
  'softgirl': `${GIGI_BASE}, in soft girl aesthetic, pastel pink outfit, blush cheeks, clouds, dreamy`,
  'cottagecore': `${GIGI_BASE}, in cottagecore countryside, floral dress, picking wildflowers, cozy cottage`,
  'y2k': `${GIGI_BASE}, in Y2K 2000s fashion, butterfly clips, early 2000s aesthetic, pink and silver`,
  'zodiac': `${GIGI_BASE}, surrounded by zodiac constellations, celestial mystical setting, cosmic purple`,
  'bookworm': `${GIGI_BASE}, as studious reader with glasses, cozy library with books, warm lighting`,
  'dance': `${GIGI_BASE}, as professional dancer, dance studio with mirrors, dynamic contemporary pose`,

  // GRADES 9-12 (Ages 14-18)
  'lofi': `${GIGI_BASE}, studying with lofi beats aesthetic, cozy desk with plants, rainy window, warm lamp`,
  'finance': `${GIGI_BASE}, as young entrepreneur, business casual, laptop and coffee, modern office`,
  'gym': `${GIGI_BASE}, as fitness enthusiast, workout outfit, gym equipment, motivational athletic pose`,
  'nightowl': `${GIGI_BASE}, as late-night studier, desk lamp glow, coffee cup, moon outside window`,
  'minimal': `${GIGI_BASE}, in minimalist aesthetic, clean simple background, neutral colors, Scandinavian`,
  'cyberpunk': `${GIGI_BASE}, in full cyberpunk style, neon city, tech implants, Blade Runner aesthetic`,
  'coder': `${GIGI_BASE}, as software developer, multiple monitors with code, mechanical keyboard, matrix green`,
  'streetwear': `${GIGI_BASE}, in hypebeast streetwear, designer brands, urban city, black and earth tones`,
  'cleangirl': `${GIGI_BASE}, in clean girl aesthetic, minimal makeup, slicked hair, gold hoops, neutral tones`,
  'sage': `${GIGI_BASE}, in sage green aesthetic, plants and crystals, peaceful meditation, wellness vibes`,
  'coffee': `${GIGI_BASE}, in coffee shop aesthetic, latte art, cozy cafe, book in hand, warm brown tones`,
  'study': `${GIGI_BASE}, in study aesthetic, organized desk, stationery, planner, productive vibes`,
  'parisian': `${GIGI_BASE}, in Parisian chic style, beret and striped shirt, Eiffel Tower, French cafe`,
  'wellness': `${GIGI_BASE}, in wellness lifestyle, yoga pose, meditation cushion, plants, zen aesthetic`,
  'vintage': `${GIGI_BASE}, in vintage retro style, 70s fashion, vinyl records, nostalgic film grain`,
  'moonlight': `${GIGI_BASE}, in moonlight aesthetic, stargazing at night, celestial, deep blue and silver`,
  'wwe': `${GIGI_BASE}, as wrestling champion, championship belt, wrestling ring, dramatic powerful pose`,

  // SPECIAL THEMES
  'dreams': `${GIGI_BASE}, in battle royale victory pose, Victory Royale text, Fortnite style, purple and gold`,
  'victory': `${GIGI_BASE}, as champion athlete, gold medal and trophy, stadium, celebration, golden colors`,
  'cube': `${GIGI_BASE}, in blocky Roblox style, simple geometric shapes, colorful game world, pixelated`,
  'default': `${GIGI_BASE}, neutral friendly pose, clean white background, mascot presentation style`,
};

// Generate image using DeepInfra Flux API
async function generateImage(prompt, outputPath) {
  // Using FLUX-1-schnell for speed and cost efficiency ($0.0005/image)
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
      num_inference_steps: 4, // schnell is optimized for fewer steps
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  if (data.images && data.images[0]) {
    // Handle both base64 and URL responses
    if (data.images[0].startsWith('http')) {
      const imgResponse = await fetch(data.images[0]);
      const buffer = Buffer.from(await imgResponse.arrayBuffer());
      fs.writeFileSync(outputPath, buffer);
    } else {
      const base64Data = data.images[0].replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(outputPath, buffer);
    }
    return true;
  }

  throw new Error('No image in response');
}

// Main function
async function main() {
  console.log('🦒 Gigi Theme Image Generator');
  console.log('=============================\n');

  if (!DEEPINFRA_API_KEY) {
    console.error('❌ DEEPINFRA_API_KEY not found in .env');
    process.exit(1);
  }

  const themes = Object.keys(THEME_PROMPTS);
  console.log(`📋 Total themes to generate: ${themes.length}`);
  console.log(`💰 Estimated cost: ~$${(themes.length * 0.03).toFixed(2)} (using FLUX-1-dev)\n`);

  // Check which themes already exist
  const existing = themes.filter(theme =>
    fs.existsSync(path.join(OUTPUT_DIR, `gigi-${theme}.png`))
  );

  const toGenerate = themes.filter(theme =>
    !fs.existsSync(path.join(OUTPUT_DIR, `gigi-${theme}.png`))
  );

  console.log(`✅ Already generated: ${existing.length}`);
  console.log(`🎨 Need to generate: ${toGenerate.length}\n`);

  if (toGenerate.length === 0) {
    console.log('All themes already generated! Delete files to regenerate.');
    return;
  }

  // Ask for confirmation
  console.log('Themes to generate:');
  toGenerate.forEach(t => console.log(`  - ${t}`));
  console.log('\nStarting in 3 seconds... (Ctrl+C to cancel)\n');
  await new Promise(r => setTimeout(r, 3000));

  let success = 0;
  let failed = 0;

  for (const theme of toGenerate) {
    const outputPath = path.join(OUTPUT_DIR, `gigi-${theme}.png`);
    const prompt = THEME_PROMPTS[theme];

    try {
      console.log(`🎨 Generating: ${theme}...`);
      await generateImage(prompt, outputPath);
      console.log(`   ✅ Saved: gigi-${theme}.png`);
      success++;

      // Rate limit: wait between requests
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      failed++;
    }
  }

  console.log('\n=============================');
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
}

main().catch(console.error);
