/**
 * =========================================
 * TO BE REPLACED WITH RIVE
 * =========================================
 * This is SVG + Framer Motion - NOT real Rive.
 * Replace with actual .riv file: /public/rive/gigi-character.riv
 * See: library/RIVE-INSTRUCTIONS.md
 * =========================================
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme, type ThemeId } from '@/lib/theme-context';

interface GigiConfig {
  character: string;
  name: string;
  greeting: string;
  personality: string;
  idleAnimation: 'bounce' | 'float' | 'pulse' | 'sway' | 'spin';
  bgEffect?: string;
}

const GIGI_FORMS: Record<ThemeId, GigiConfig> = {
  default: {
    character: '🤖',
    name: 'Gigi',
    greeting: 'Hi! I\'m here to help you learn!',
    personality: 'friendly and helpful',
    idleAnimation: 'bounce',
  },

  dinosaur: {
    character: '🦖',
    name: 'Dino Gigi',
    greeting: 'RAWR! Let\'s stomp through some learning!',
    personality: 'playful and energetic',
    idleAnimation: 'bounce',
    bgEffect: '🌋',
  },

  monster: {
    character: '👾',
    name: 'Monster Gigi',
    greeting: 'GRRR! Time to monster-mash some homework!',
    personality: 'silly and fun',
    idleAnimation: 'bounce',
  },

  hero: {
    character: '🦸',
    name: 'Hero Gigi',
    greeting: 'Up, up and away! Let\'s save the day with knowledge!',
    personality: 'brave and encouraging',
    idleAnimation: 'float',
  },

  space: {
    character: '🚀',
    name: 'Space Gigi',
    greeting: 'Prepare for liftoff! Let\'s explore the galaxy of learning!',
    personality: 'adventurous and curious',
    idleAnimation: 'float',
    bgEffect: '⭐',
  },

  robot: {
    character: '🤖',
    name: 'Robo Gigi',
    greeting: 'BEEP BOOP! Computing... Ready to learn!',
    personality: 'logical and precise',
    idleAnimation: 'pulse',
  },

  pirate: {
    character: '🏴‍☠️',
    name: 'Captain Gigi',
    greeting: 'Ahoy matey! Let\'s sail the seas of knowledge!',
    personality: 'adventurous and bold',
    idleAnimation: 'sway',
  },

  shark: {
    character: '🦈',
    name: 'Shark Gigi',
    greeting: 'Let\'s dive deep into learning! Don\'t worry, I don\'t bite!',
    personality: 'cool and confident',
    idleAnimation: 'sway',
  },

  unicorn: {
    character: '🦄',
    name: 'Unicorn Gigi',
    greeting: 'Magical sparkles! Let\'s make learning enchanting!',
    personality: 'magical and dreamy',
    idleAnimation: 'float',
    bgEffect: '✨',
  },

  mermaid: {
    character: '🧜‍♀️',
    name: 'Mermaid Gigi',
    greeting: 'Dive into the ocean of knowledge with me!',
    personality: 'graceful and mysterious',
    idleAnimation: 'sway',
  },

  princess: {
    character: '👸',
    name: 'Princess Gigi',
    greeting: 'Welcome to the castle of learning, dear friend!',
    personality: 'elegant and kind',
    idleAnimation: 'float',
  },

  rainbow: {
    character: '🌈',
    name: 'Rainbow Gigi',
    greeting: 'Let\'s paint the world with colorful knowledge!',
    personality: 'bright and cheerful',
    idleAnimation: 'float',
  },

  butterfly: {
    character: '🦋',
    name: 'Butterfly Gigi',
    greeting: 'Let\'s flutter through beautiful lessons together!',
    personality: 'gentle and inspiring',
    idleAnimation: 'float',
  },

  kitten: {
    character: '🐱',
    name: 'Kitten Gigi',
    greeting: 'Meow! Let\'s pounce on some learning fun!',
    personality: 'playful and curious',
    idleAnimation: 'bounce',
  },

  fairy: {
    character: '🧚',
    name: 'Fairy Gigi',
    greeting: 'Sprinkle some fairy dust and let\'s learn magic!',
    personality: 'whimsical and helpful',
    idleAnimation: 'float',
    bgEffect: '✨',
  },

  ballerina: {
    character: '🩰',
    name: 'Ballerina Gigi',
    greeting: 'Let\'s dance through learning gracefully!',
    personality: 'elegant and dedicated',
    idleAnimation: 'sway',
  },

  ninja: {
    character: '🥷',
    name: 'Ninja Gigi',
    greeting: 'Silent but powerful! Let\'s master these skills!',
    personality: 'focused and skilled',
    idleAnimation: 'pulse',
  },

  zombie: {
    character: '🧟',
    name: 'Zombie Gigi',
    greeting: 'BRAAAINS! Let\'s feed yours with knowledge!',
    personality: 'silly and determined',
    idleAnimation: 'sway',
  },

  racecar: {
    character: '🏎️',
    name: 'Racer Gigi',
    greeting: 'Rev those engines! Let\'s speed through learning!',
    personality: 'fast and competitive',
    idleAnimation: 'pulse',
  },

  mech: {
    character: '🤖',
    name: 'Mech Gigi',
    greeting: 'Activating learning protocols! Giant robot mode engaged!',
    personality: 'powerful and tactical',
    idleAnimation: 'pulse',
  },

  battle: {
    character: '⚔️',
    name: 'Warrior Gigi',
    greeting: 'Ready for battle! Let\'s conquer these challenges!',
    personality: 'fierce and strategic',
    idleAnimation: 'pulse',
  },

  builder: {
    character: '🧱',
    name: 'Builder Gigi',
    greeting: 'Let\'s construct some awesome knowledge!',
    personality: 'creative and methodical',
    idleAnimation: 'bounce',
  },

  web: {
    character: '🕷️',
    name: 'Spider Gigi',
    greeting: 'Spinning a web of knowledge! Let\'s catch some facts!',
    personality: 'clever and strategic',
    idleAnimation: 'bounce',
  },

  creatures: {
    character: '🐉',
    name: 'Dragon Gigi',
    greeting: 'Mythical learning awaits! Let\'s unleash your potential!',
    personality: 'wise and powerful',
    idleAnimation: 'float',
  },

  popstar: {
    character: '🎤',
    name: 'Popstar Gigi',
    greeting: 'Are you ready to rock this lesson? Let\'s hit the high notes!',
    personality: 'confident and energetic',
    idleAnimation: 'bounce',
  },

  cupcake: {
    character: '🧁',
    name: 'Baker Gigi',
    greeting: 'Sweet treats and sweeter learning! Let\'s bake some smarts!',
    personality: 'sweet and nurturing',
    idleAnimation: 'bounce',
  },

  friendship: {
    character: '💖',
    name: 'Friend Gigi',
    greeting: 'BFF! Let\'s learn together and have the best time!',
    personality: 'caring and supportive',
    idleAnimation: 'pulse',
  },

  kawaii: {
    character: '🌸',
    name: 'Kawaii Gigi',
    greeting: 'Kawaii desu ne! Let\'s make learning super cute!',
    personality: 'adorable and cheerful',
    idleAnimation: 'bounce',
  },

  glam: {
    character: '💅',
    name: 'Glam Gigi',
    greeting: 'Darling, let\'s make learning absolutely fabulous!',
    personality: 'stylish and confident',
    idleAnimation: 'sway',
  },

  fashion: {
    character: '👗',
    name: 'Fashion Gigi',
    greeting: 'Let\'s style up your brain with trending knowledge!',
    personality: 'trendy and creative',
    idleAnimation: 'sway',
  },

  ice: {
    character: '❄️',
    name: 'Ice Gigi',
    greeting: 'Cool as ice! Let\'s freeze-frame these concepts!',
    personality: 'calm and elegant',
    idleAnimation: 'float',
  },

  pony: {
    character: '🐴',
    name: 'Pony Gigi',
    greeting: 'Galloping into learning! Neigh-thing can stop us!',
    personality: 'energetic and loyal',
    idleAnimation: 'bounce',
  },

  neon: {
    character: '⚡',
    name: 'Neon Gigi',
    greeting: 'Lighting up the scene! Let\'s electrify your knowledge!',
    personality: 'energetic and modern',
    idleAnimation: 'pulse',
  },

  anime: {
    character: '🎌',
    name: 'Anime Gigi',
    greeting: 'Yosh! Let\'s power up your skills to MAX LEVEL!',
    personality: 'determined and passionate',
    idleAnimation: 'pulse',
  },

  sneaker: {
    character: '👟',
    name: 'Sneaker Gigi',
    greeting: 'Lace up! We\'re stepping into fresh knowledge!',
    personality: 'cool and collected',
    idleAnimation: 'bounce',
  },

  esports: {
    character: '🎮',
    name: 'Pro Gigi',
    greeting: 'GG! Let\'s level up your brain stats!',
    personality: 'competitive and strategic',
    idleAnimation: 'pulse',
  },

  graffiti: {
    character: '🎨',
    name: 'Artist Gigi',
    greeting: 'Yo! Let\'s spray some knowledge on these walls!',
    personality: 'creative and bold',
    idleAnimation: 'bounce',
  },

  hiphop: {
    character: '🎧',
    name: 'DJ Gigi',
    greeting: 'Drop the beat! Let\'s remix your learning!',
    personality: 'cool and rhythmic',
    idleAnimation: 'bounce',
  },

  scifi: {
    character: '👽',
    name: 'Alien Gigi',
    greeting: 'Greetings Earthling! Let\'s explore new dimensions of knowledge!',
    personality: 'mysterious and intelligent',
    idleAnimation: 'float',
  },

  darkninja: {
    character: '🌙',
    name: 'Shadow Gigi',
    greeting: 'From the shadows I emerge... to teach you ancient wisdom!',
    personality: 'mysterious and skilled',
    idleAnimation: 'pulse',
  },

  aesthetic: {
    character: '🌙',
    name: 'Aesthetic Gigi',
    greeting: 'Vibes immaculate~ Let\'s curate your knowledge collection!',
    personality: 'chill and artistic',
    idleAnimation: 'float',
  },

  kpop: {
    character: '💫',
    name: 'Idol Gigi',
    greeting: 'Annyeong! Ready to stan your education? Let\'s debut!',
    personality: 'energetic and polished',
    idleAnimation: 'bounce',
  },

  softgirl: {
    character: '🧸',
    name: 'Soft Gigi',
    greeting: 'Cozy vibes only! Let\'s learn in comfort and style!',
    personality: 'gentle and aesthetic',
    idleAnimation: 'float',
  },

  cottagecore: {
    character: '🌿',
    name: 'Cottage Gigi',
    greeting: 'Welcome to the garden! Let\'s grow your knowledge naturally!',
    personality: 'peaceful and nurturing',
    idleAnimation: 'sway',
  },

  y2k: {
    character: '📱',
    name: 'Y2K Gigi',
    greeting: 'OMG like totally ready to learn! So fetch!',
    personality: 'nostalgic and bubbly',
    idleAnimation: 'bounce',
  },

  zodiac: {
    character: '♈',
    name: 'Mystic Gigi',
    greeting: 'The stars align for your learning journey!',
    personality: 'mystical and insightful',
    idleAnimation: 'float',
  },

  bookworm: {
    character: '📚',
    name: 'Scholar Gigi',
    greeting: 'Ah, a fellow reader! Let\'s dive into the pages of wisdom!',
    personality: 'intellectual and warm',
    idleAnimation: 'sway',
  },

  dance: {
    character: '💃',
    name: 'Dancer Gigi',
    greeting: 'Let\'s groove through this lesson with style!',
    personality: 'energetic and expressive',
    idleAnimation: 'bounce',
  },

  lofi: {
    character: '🎧',
    name: 'Lofi Gigi',
    greeting: 'Chill beats for studying... Let\'s vibe and learn.',
    personality: 'relaxed and focused',
    idleAnimation: 'sway',
  },

  finance: {
    character: '📈',
    name: 'Investor Gigi',
    greeting: 'Time to invest in yourself! Let\'s maximize your returns!',
    personality: 'analytical and ambitious',
    idleAnimation: 'pulse',
  },

  gym: {
    character: '💪',
    name: 'Coach Gigi',
    greeting: 'No pain, no gain! Let\'s work out that brain!',
    personality: 'motivating and strong',
    idleAnimation: 'pulse',
  },

  nightowl: {
    character: '🦉',
    name: 'Owl Gigi',
    greeting: 'Burning the midnight oil? I\'m here to guide you through!',
    personality: 'wise and understanding',
    idleAnimation: 'sway',
  },

  minimal: {
    character: '▪️',
    name: 'Minimal Gigi',
    greeting: 'Less is more. Let\'s focus on what matters.',
    personality: 'calm and efficient',
    idleAnimation: 'pulse',
  },

  cyberpunk: {
    character: '🤖',
    name: 'Cyber Gigi',
    greeting: 'Jacking into the system... Knowledge download initiated!',
    personality: 'futuristic and edgy',
    idleAnimation: 'pulse',
  },

  coder: {
    character: '💻',
    name: 'Dev Gigi',
    greeting: 'Console.log("Let\'s debug your knowledge gaps!");',
    personality: 'logical and precise',
    idleAnimation: 'pulse',
  },

  streetwear: {
    character: '🧥',
    name: 'Street Gigi',
    greeting: 'Drip check! Your knowledge fit is about to be fire!',
    personality: 'confident and trendy',
    idleAnimation: 'bounce',
  },

  cleangirl: {
    character: '🥥',
    name: 'Clean Gigi',
    greeting: 'Fresh, natural, effortless! Let\'s purify your mind!',
    personality: 'polished and serene',
    idleAnimation: 'float',
  },

  sage: {
    character: '🍃',
    name: 'Sage Gigi',
    greeting: 'Inner peace through knowledge. Let\'s find balance.',
    personality: 'wise and calming',
    idleAnimation: 'float',
  },

  coffee: {
    character: '☕',
    name: 'Barista Gigi',
    greeting: 'Brewing up some fresh knowledge! Extra shot of wisdom?',
    personality: 'warm and energizing',
    idleAnimation: 'sway',
  },

  study: {
    character: '✍️',
    name: 'Study Gigi',
    greeting: 'Highlighters ready? Let\'s ace this material!',
    personality: 'focused and supportive',
    idleAnimation: 'pulse',
  },

  parisian: {
    character: '🥐',
    name: 'Parisian Gigi',
    greeting: 'Bonjour! Let\'s learn with a touch of je ne sais quoi!',
    personality: 'sophisticated and charming',
    idleAnimation: 'sway',
  },

  wellness: {
    character: '🧘',
    name: 'Wellness Gigi',
    greeting: 'Mind, body, knowledge. Let\'s nurture all three!',
    personality: 'balanced and holistic',
    idleAnimation: 'float',
  },

  vintage: {
    character: '📻',
    name: 'Vintage Gigi',
    greeting: 'Taking it back to the classics! Timeless wisdom awaits!',
    personality: 'nostalgic and refined',
    idleAnimation: 'sway',
  },

  moonlight: {
    character: '🌙',
    name: 'Moonlight Gigi',
    greeting: 'Under the moon\'s glow, let\'s illuminate your path!',
    personality: 'ethereal and mysterious',
    idleAnimation: 'float',
  },

  dreams: {
    character: '💭',
    name: 'Dream Gigi',
    greeting: 'In the realm of dreams, anything is possible!',
    personality: 'imaginative and inspiring',
    idleAnimation: 'float',
  },

  victory: {
    character: '🏆',
    name: 'Champion Gigi',
    greeting: 'Victory is yours! Let\'s claim that knowledge trophy!',
    personality: 'triumphant and motivating',
    idleAnimation: 'pulse',
  },

  cube: {
    character: '🎲',
    name: 'Puzzle Gigi',
    greeting: 'Let\'s solve the puzzle of learning together!',
    personality: 'curious and analytical',
    idleAnimation: 'spin',
  },

  safari: {
    character: '🦁',
    name: 'Safari Gigi',
    greeting: 'ROAR! Let\'s explore the wild world of learning!',
    personality: 'adventurous and brave',
    idleAnimation: 'bounce',
  },

  farm: {
    character: '🐮',
    name: 'Farm Gigi',
    greeting: 'MOO! Let\'s harvest some knowledge today!',
    personality: 'friendly and cheerful',
    idleAnimation: 'sway',
  },

  candy: {
    character: '🍭',
    name: 'Candy Gigi',
    greeting: 'Sweet! Let\'s make learning delicious!',
    personality: 'sweet and bubbly',
    idleAnimation: 'spin',
  },

  construction: {
    character: '🚜',
    name: 'Builder Gigi',
    greeting: 'Let\'s build your knowledge brick by brick!',
    personality: 'hardworking and strong',
    idleAnimation: 'bounce',
  },

  firefighter: {
    character: '🚒',
    name: 'Hero Gigi',
    greeting: 'Fire up your learning! Let\'s save the day!',
    personality: 'brave and heroic',
    idleAnimation: 'pulse',
  },

  ocean: {
    character: '🐠',
    name: 'Ocean Gigi',
    greeting: 'Dive into learning! Let\'s explore the deep!',
    personality: 'calm and curious',
    idleAnimation: 'float',
  },

  jungle: {
    character: '🐒',
    name: 'Jungle Gigi',
    greeting: 'Ooh-ooh-ah-ah! Let\'s swing into learning!',
    personality: 'playful and wild',
    idleAnimation: 'bounce',
  },

  arctic: {
    character: '🐧',
    name: 'Penguin Gigi',
    greeting: 'Slide into learning! It\'s snow much fun!',
    personality: 'cool and friendly',
    idleAnimation: 'sway',
  },

  teddy: {
    character: '🧸',
    name: 'Teddy Gigi',
    greeting: 'Welcome to our picnic! Let\'s share sweet learning!',
    personality: 'cozy and warm',
    idleAnimation: 'bounce',
  },

  puppy: {
    character: '🐶',
    name: 'Puppy Gigi',
    greeting: 'WOOF! Let\'s fetch some knowledge together!',
    personality: 'playful and loyal',
    idleAnimation: 'bounce',
  },

  bug: {
    character: '🐛',
    name: 'Bug Gigi',
    greeting: 'Let\'s crawl into the wonderful world of learning!',
    personality: 'curious and tiny',
    idleAnimation: 'sway',
  },

  train: {
    character: '🚂',
    name: 'Train Gigi',
    greeting: 'All aboard! Next stop: Knowledge Station!',
    personality: 'reliable and strong',
    idleAnimation: 'bounce',
  },

  beach: {
    character: '🏖️',
    name: 'Beach Gigi',
    greeting: 'Surf\'s up! Let\'s ride the waves of learning!',
    personality: 'sunny and relaxed',
    idleAnimation: 'float',
  },

  camping: {
    character: '⛺',
    name: 'Camp Gigi',
    greeting: 'Let\'s pitch a tent and explore nature\'s lessons!',
    personality: 'outdoorsy and adventurous',
    idleAnimation: 'sway',
  },

  volcano: {
    character: '🌋',
    name: 'Volcano Gigi',
    greeting: 'Get ready to ERUPT with excitement!',
    personality: 'explosive and energetic',
    idleAnimation: 'pulse',
  },

  planet: {
    character: '🪐',
    name: 'Planet Gigi',
    greeting: 'Let\'s orbit around amazing discoveries!',
    personality: 'cosmic and wonder-filled',
    idleAnimation: 'float',
  },
  wwe: {
    character: '🎤',
    name: 'Manager Gigi',
    greeting: 'Listen up, champ! Time to defend those titles!',
    personality: 'hyped and motivational',
    idleAnimation: 'bounce',
    bgEffect: 'pyro',
  },
  slime: {
    character: '💚',
    name: 'Slime Gigi',
    greeting: 'Let\'s mix up something amazing today!',
    personality: 'playful and creative',
    idleAnimation: 'bounce',
    bgEffect: 'bubbles',
  },
  bracelet: {
    character: '📿',
    name: 'Crafty Gigi',
    greeting: 'Ready to make beautiful creations?',
    personality: 'artistic and encouraging',
    idleAnimation: 'bounce',
    bgEffect: 'sparkle',
  },
  artstudio: {
    character: '🎨',
    name: 'Artist Gigi',
    greeting: 'Time to paint your masterpiece!',
    personality: 'creative and inspiring',
    idleAnimation: 'bounce',
    bgEffect: 'paint-splash',
  },
  spaday: {
    character: '💆',
    name: 'Spa Gigi',
    greeting: 'Relax and learn at your own pace!',
    personality: 'calm and soothing',
    idleAnimation: 'float',
    bgEffect: 'zen',
  },
  petgroomer: {
    character: '🐾',
    name: 'Pet Gigi',
    greeting: 'Let\'s take care of our furry friends!',
    personality: 'caring and gentle',
    idleAnimation: 'bounce',
    bgEffect: 'paw-prints',
  },
  moviestar: {
    character: '⭐',
    name: 'Star Gigi',
    greeting: 'Lights, camera, learning action!',
    personality: 'glamorous and confident',
    idleAnimation: 'float',
    bgEffect: 'spotlight',
  },
};

const bounceAnimation = {
  y: [0, -20, 0],
};

const floatAnimation = {
  y: [0, -15, 0],
};

const pulseAnimation = {
  scale: [1, 1.1, 1],
};

const swayAnimation = {
  rotate: [-5, 5, -5],
};

const spinAnimation = {
  rotate: [0, 360],
};

const animations = {
  bounce: bounceAnimation,
  float: floatAnimation,
  pulse: pulseAnimation,
  sway: swayAnimation,
  spin: spinAnimation,
};

const animationTransitions = {
  bounce: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
  float: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
  pulse: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
  sway: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
  spin: {
    duration: 4,
    repeat: Infinity,
    ease: 'linear' as const,
  },
};

interface GigiCharacterProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGreeting?: boolean;
  showName?: boolean;
  className?: string;
}

export default function GigiCharacter({
  size = 'md',
  showGreeting = false,
  showName = true,
  className = '',
}: GigiCharacterProps) {
  const { currentTheme } = useTheme();
  const gigiConfig = GIGI_FORMS[currentTheme.id] || GIGI_FORMS.default;
  const [isSpinning, setIsSpinning] = useState(false);

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-9xl',
  };

  const handleClick = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000);
  };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme.id}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative cursor-pointer"
          onClick={handleClick}
        >
          <motion.div
            animate={isSpinning ? { rotate: 360 } : animations[gigiConfig.idleAnimation]}
            transition={isSpinning ? { duration: 1, ease: 'easeInOut' } : animationTransitions[gigiConfig.idleAnimation]}
            className={`${sizeClasses[size]} relative z-10`}
          >
            {gigiConfig.character}
          </motion.div>

          {gigiConfig.bgEffect && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center text-8xl opacity-20"
            >
              {gigiConfig.bgEffect}
            </motion.div>
          )}

          <motion.div
            className="absolute inset-0 rounded-full blur-2xl opacity-50"
            style={{
              background: `radial-gradient(circle, ${currentTheme.colors.primary}, transparent)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {showName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center"
        >
          <h3
            className="text-2xl font-bold"
            style={{ color: currentTheme.colors.primary }}
          >
            {gigiConfig.name}
          </h3>
        </motion.div>
      )}

      {showGreeting && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 max-w-md rounded-2xl p-4 text-center shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}15, ${currentTheme.colors.secondary}15)`,
            border: `2px solid ${currentTheme.colors.primary}30`,
          }}
        >
          <p
            className="text-lg font-medium"
            style={{ color: currentTheme.colors.text }}
          >
            {gigiConfig.greeting}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export function getGigiConfig(themeId: ThemeId): GigiConfig {
  return GIGI_FORMS[themeId] || GIGI_FORMS.default;
}
