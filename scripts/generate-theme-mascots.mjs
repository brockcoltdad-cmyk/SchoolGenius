/**
 * Generate Theme Mascot Images using DeepInfra Flux API
 *
 * Usage: node scripts/generate-theme-mascots.mjs
 *
 * Each theme gets its OWN unique mascot character that IS the theme.
 * NO giraffe - each mascot represents the theme itself.
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
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'theme-mascots');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Base style for consistency - friendly mascot style
const STYLE = `Pixar Disney 3D animation style, friendly expressive face, warm smile, big expressive eyes, high quality render, clean white background, front-facing portrait, mascot character, appealing to children`;

// Theme mascot prompts - each theme IS its own mascot
const THEME_MASCOTS = {
  // ============== GRADES K-2 (Ages 5-8) ==============
  'dinosaur': `friendly green T-Rex dinosaur character, cute baby dinosaur with tiny arms, happy expression, small sharp teeth showing in smile, ${STYLE}`,

  'monster': `adorable fuzzy purple monster with big googly eyes, fluffy fur, tiny horns, friendly monster like Monsters Inc, ${STYLE}`,

  'hero': `young superhero kid character, flowing red cape, golden star emblem on chest, heroic confident pose, comic book style, ${STYLE}`,

  'space': `cute astronaut character in white NASA spacesuit, glass helmet with reflection, floating pose, stars in background, ${STYLE}`,

  'robot': `friendly robot character with round silver body, glowing blue LED eyes, antenna on head, mechanical joints, futuristic, ${STYLE}`,

  'pirate': `friendly pirate captain character, tricorn hat with skull, eye patch, big grin, holding treasure map, ${STYLE}`,

  'shark': `friendly cartoon shark character, baby shark with big smile, bright blue color, adorable not scary, ocean bubbles, ${STYLE}`,

  'unicorn': `magical unicorn character, rainbow mane flowing, golden spiral horn, sparkles around, pink and purple colors, ${STYLE}`,

  'mermaid': `beautiful mermaid character, shimmering teal fish tail, seashell top, flowing hair, underwater sparkles, ${STYLE}`,

  'princess': `beautiful princess character, pink ball gown dress, golden tiara with jewels, elegant pose, fairy tale style, ${STYLE}`,

  'rainbow': `cute rainbow character with face, colorful arc body, smiling sun nearby, clouds, bright cheerful colors, ${STYLE}`,

  'butterfly': `beautiful monarch butterfly character with face, large orange and black wings, delicate antennae, flowers around, ${STYLE}`,

  'kitten': `adorable fluffy kitten character, big round eyes, soft fur, pink nose, whiskers, playing with yarn, ${STYLE}`,

  'fairy': `tiny fairy character with translucent wings, flower petal dress, magic wand with glowing star, sparkle dust, ${STYLE}`,

  'ballerina': `graceful ballerina character, pink tutu dress, ballet slippers, elegant dance pose on tiptoe, ${STYLE}`,

  'safari': `friendly lion cub character, golden mane starting to grow, explorer hat, African savanna, ${STYLE}`,

  'farm': `cute red tractor character with friendly face, big wheels, hay bales around, barn in background, realistic cool tractor, ${STYLE}`,

  'candy': `cute candy character, lollipop person with swirl pattern, surrounded by sweets, cotton candy clouds, ${STYLE}`,

  'construction': `cool yellow construction excavator with friendly face, big bucket arm, hard hat, construction site, ${STYLE}`,

  'firefighter': `realistic red fire truck character with friendly face, shiny chrome details, water hose, flashing lights, cool detailed firetruck, ${STYLE}`,

  'ocean': `cute sea turtle character, green shell with patterns, swimming pose, tropical fish friends, coral reef, ${STYLE}`,

  'jungle': `friendly baby elephant character, big floppy ears, curled trunk, jungle vines, tropical leaves, ${STYLE}`,

  'arctic': `adorable polar bear cub character, fluffy white fur, black nose, ice and snow, northern lights, ${STYLE}`,

  'teddy': `cuddly teddy bear character, soft brown fur, button eyes, red bow tie, huggable pose, ${STYLE}`,

  'puppy': `adorable golden retriever puppy character, floppy ears, wagging tail, tennis ball, playful pose, ${STYLE}`,

  'bug': `cute ladybug character, red shell with black spots, tiny antennae, sitting on green leaf, garden flowers, ${STYLE}`,

  'train': `friendly steam locomotive character with face, colorful train engine, puffing smoke, railroad tracks, ${STYLE}`,

  'beach': `cool surfboard character with friendly face, beach vibes, palm trees, ocean waves, sunglasses, ${STYLE}`,

  'camping': `friendly campfire character with face, marshmallow on stick, tent nearby, starry night sky, ${STYLE}`,

  'volcano': `friendly volcano character with face, gentle lava glow, tropical island, not scary, adventure themed, ${STYLE}`,

  'planet': `cute Saturn planet character with face, colorful rings, space background, friendly alien friend, ${STYLE}`,

  // ============== GRADES 3-5 (Ages 8-11) ==============
  'ninja': `cool ninja warrior character, black outfit with red accents, mask covering face, martial arts pose, throwing star, ${STYLE}`,

  'zombie': `friendly cartoon zombie character, green skin, torn clothes, goofy expression, Halloween themed, not scary, ${STYLE}`,

  'racecar': `sleek red race car character with face, racing stripes, big wheels, checkered flag, speed lines, realistic cool sports car, ${STYLE}`,

  'mech': `cool robot mech suit character, mechanical armor, glowing eyes, futuristic design, battle ready pose, ${STYLE}`,

  'battle': `brave knight character in shining armor, sword and shield, dragon emblem, castle background, ${STYLE}`,

  'builder': `blocky Minecraft Steve-style character, pixelated cube design, holding diamond pickaxe, voxel art style, ${STYLE}`,

  'web': `friendly spider character, eight legs, web pattern, superhero spider-themed, not scary, ${STYLE}`,

  'creatures': `cute creature companion like Pokemon, fantasy animal, colorful, magical powers, anime inspired, ${STYLE}`,

  'popstar': `young pop star character, sparkly stage outfit, microphone, concert stage lights, confident pose, ${STYLE}`,

  'cupcake': `cute cupcake character with face, pink frosting swirl, cherry on top, sprinkles, bakery themed, ${STYLE}`,

  'friendship': `two best friend characters hugging, diverse kids, friendship bracelets, heart decorations, ${STYLE}`,

  'kawaii': `super cute Japanese kawaii cat character, big sparkly anime eyes, pastel colors, chibi style, ${STYLE}`,

  'glam': `glamorous fashion character, sparkly dress, jewelry, confident pose, runway style, ${STYLE}`,

  'fashion': `stylish fashion designer character, trendy outfit, sketch pad, measuring tape, runway background, ${STYLE}`,

  'ice': `beautiful ice skating character, sparkly skating dress, ice skates, frozen pond, snowflakes, ${STYLE}`,

  'pony': `magical pony character, colorful mane and tail, sparkles, fantasy meadow, My Little Pony inspired, ${STYLE}`,

  'slime': `cute slime blob character with face, colorful glitter inside, stretchy gooey, neon pink and blue, ${STYLE}`,

  'bracelet': `colorful friendship bracelet character, beaded design, crafty and creative, rainbow colors, ${STYLE}`,

  'artstudio': `artist paintbrush character with face, colorful paint splatters, art palette, creative studio, ${STYLE}`,

  'spaday': `relaxed spa character, cucumber eye mask, fluffy robe, peaceful zen expression, candles, ${STYLE}`,

  'petgroomer': `cute groomed poodle character, fluffy styled fur, bow accessories, pet salon themed, ${STYLE}`,

  'moviestar': `Hollywood movie star character, glamorous outfit, sunglasses, red carpet, golden award trophy, ${STYLE}`,

  'monstertruck': `massive monster truck character with face, huge wheels, crushing cars, flames painted on side, realistic cool monster truck, ${STYLE}`,

  // ============== GRADES 6-8 (Ages 11-14) ==============
  'neon': `cyberpunk character with glowing neon outlines, LED accents, dark city background, synthwave colors, ${STYLE}`,

  'anime': `anime protagonist character, dramatic pose, wind-blown hair, cherry blossoms, Japanese animation style, ${STYLE}`,

  'sneaker': `cool limited edition sneaker character with face, streetwear style, urban background, hype beast, ${STYLE}`,

  'esports': `professional gamer character, gaming headset, RGB keyboard glow, esports jersey, tournament ready, ${STYLE}`,

  'graffiti': `street artist character, spray paint can, colorful graffiti wall background, hip hop style, ${STYLE}`,

  'hiphop': `hip hop artist character, gold chain, boombox, urban streetwear, confident pose, ${STYLE}`,

  'scifi': `futuristic sci-fi character, holographic displays, space station, advanced technology, ${STYLE}`,

  'darkninja': `shadow ninja master character, all black stealth outfit, moonlit rooftop, mysterious, ${STYLE}`,

  'aesthetic': `aesthetic character with fairy lights, plants, dreamy soft lighting, Instagram aesthetic, ${STYLE}`,

  'kpop': `K-pop idol character, stylish stage outfit, concert lightsticks, pink and purple lighting, ${STYLE}`,

  'softgirl': `soft girl aesthetic character, pastel pink outfit, blush cheeks, clouds, dreamy expression, ${STYLE}`,

  'cottagecore': `cottagecore character in floral dress, picking wildflowers, cozy cottage background, ${STYLE}`,

  'y2k': `Y2K 2000s style character, butterfly clips, early 2000s fashion, pink and silver colors, ${STYLE}`,

  'zodiac': `mystical zodiac character, constellation patterns, celestial setting, cosmic purple and gold, ${STYLE}`,

  'bookworm': `studious character with round glasses, stack of books, cozy library, warm reading light, ${STYLE}`,

  'dance': `dynamic dancer character, dance studio mirrors, contemporary pose, athletic wear, ${STYLE}`,

  // ============== GRADES 9-12 (Ages 14-18) ==============
  'lofi': `lofi study character, cozy desk setup, plants, rainy window, warm lamp glow, headphones, ${STYLE}`,

  'finance': `young entrepreneur character, business casual, laptop and coffee, modern office, confident, ${STYLE}`,

  'gym': `fitness character, athletic wear, gym equipment, motivational pose, healthy lifestyle, ${STYLE}`,

  'nightowl': `night owl bird character, desk lamp glow, coffee cup, moon outside window, studious, ${STYLE}`,

  'minimal': `minimalist character, clean simple design, neutral colors, Scandinavian aesthetic, ${STYLE}`,

  'cyberpunk': `full cyberpunk character, neon city, tech implants, futuristic Blade Runner aesthetic, ${STYLE}`,

  'coder': `software developer character, multiple monitors with code, mechanical keyboard, hacker aesthetic, ${STYLE}`,

  'streetwear': `streetwear hypebeast character, designer brands, urban city, black and earth tones, ${STYLE}`,

  'cleangirl': `clean girl aesthetic character, minimal makeup, slicked hair, gold hoops, neutral tones, ${STYLE}`,

  'sage': `sage green aesthetic character, surrounded by plants, crystals, peaceful meditation pose, ${STYLE}`,

  'coffee': `coffee cup character with face, latte art design, cozy cafe setting, warm brown tones, ${STYLE}`,

  'study': `organized study character, neat desk, stationery, planner, productive vibes, ${STYLE}`,

  'parisian': `Parisian chic character, beret, striped shirt, Eiffel Tower background, French cafe, ${STYLE}`,

  'wellness': `wellness character in yoga pose, meditation cushion, plants, zen aesthetic, peaceful, ${STYLE}`,

  'vintage': `vintage retro character, 70s fashion, vinyl records, nostalgic film grain look, ${STYLE}`,

  'moonlight': `moonlight aesthetic character, stargazing pose, celestial theme, deep blue and silver, ${STYLE}`,

  // ============== SPECIAL GAMING/ACTION THEMES ==============
  'wwe': `muscular pro wrestler character, championship belt, wrestling ring, dramatic powerful pose, WWE style, ${STYLE}`,

  'dreams': `battle royale soldier character, tactical gear, victory pose, Fortnite inspired, purple and gold, ${STYLE}`,

  'victory': `champion athlete character, gold medal, trophy held high, stadium celebration, golden colors, ${STYLE}`,

  'cube': `blocky Roblox-style character, simple geometric shapes, colorful game world, pixelated style, ${STYLE}`,

  'gaming': `cool game controller character with face, RGB lighting, gaming setup, neon glow effects, ${STYLE}`,

  'fortnite': `battle royale character, tactical military outfit, building materials, victory royale pose, ${STYLE}`,

  'minecraft': `blocky Steve character, pixelated cube style, diamond sword, Minecraft world, voxel art, ${STYLE}`,

  // ============== DEFAULT ==============
  'default': `friendly star mascot character, golden star shape with cute face, sparkles around, welcoming pose, ${STYLE}`,
};

// Generate image using DeepInfra Flux API
async function generateImage(prompt, outputPath) {
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
      num_inference_steps: 4,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  if (data.images && data.images[0]) {
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
  console.log('🎭 Theme Mascot Generator');
  console.log('=========================');
  console.log('Each theme gets its OWN unique mascot - NO giraffe!\n');

  if (!DEEPINFRA_API_KEY) {
    console.error('DEEPINFRA_API_KEY not found in .env');
    process.exit(1);
  }

  const themes = Object.keys(THEME_MASCOTS);
  console.log(`Total themes: ${themes.length}`);
  console.log(`Estimated cost: ~$${(themes.length * 0.0005).toFixed(2)}\n`);

  // Check which already exist
  const existing = themes.filter(theme =>
    fs.existsSync(path.join(OUTPUT_DIR, `mascot-${theme}.png`))
  );

  const toGenerate = themes.filter(theme =>
    !fs.existsSync(path.join(OUTPUT_DIR, `mascot-${theme}.png`))
  );

  console.log(`Already generated: ${existing.length}`);
  console.log(`Need to generate: ${toGenerate.length}\n`);

  if (toGenerate.length === 0) {
    console.log('All mascots already generated! Delete files to regenerate.');
    return;
  }

  console.log('Generating:');
  toGenerate.forEach(t => console.log(`  - ${t}`));
  console.log('\nStarting in 3 seconds... (Ctrl+C to cancel)\n');
  await new Promise(r => setTimeout(r, 3000));

  let success = 0;
  let failed = 0;

  for (const theme of toGenerate) {
    const outputPath = path.join(OUTPUT_DIR, `mascot-${theme}.png`);
    const prompt = THEME_MASCOTS[theme];

    try {
      console.log(`Generating: ${theme}...`);
      await generateImage(prompt, outputPath);
      console.log(`   Saved: mascot-${theme}.png`);
      success++;

      // Rate limit
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.log(`   Failed: ${error.message}`);
      failed++;
    }
  }

  console.log('\n=========================');
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch(console.error);
