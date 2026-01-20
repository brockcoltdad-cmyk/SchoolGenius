'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

interface ThemeMascotProps {
  /** Override the theme (otherwise uses context) */
  theme?: string;
  /** Size in pixels - default is 200 for prominent display */
  size?: number;
  /** CSS class name */
  className?: string;
  /** Animation on mount */
  animate?: boolean;
  /** Alt text */
  alt?: string;
  /** Click handler */
  onClick?: () => void;
}

// All available theme mascots
const AVAILABLE_THEMES = [
  'default', 'dinosaur', 'monster', 'hero', 'space', 'robot', 'pirate', 'shark',
  'unicorn', 'mermaid', 'princess', 'rainbow', 'butterfly', 'kitten', 'fairy',
  'ballerina', 'safari', 'farm', 'candy', 'construction', 'firefighter', 'ocean',
  'jungle', 'arctic', 'teddy', 'puppy', 'bug', 'train', 'beach', 'camping',
  'volcano', 'planet', 'ninja', 'zombie', 'racecar', 'mech', 'battle', 'builder',
  'web', 'creatures', 'popstar', 'cupcake', 'friendship', 'kawaii', 'glam',
  'fashion', 'ice', 'pony', 'slime', 'bracelet', 'artstudio', 'spaday',
  'petgroomer', 'moviestar', 'monstertruck', 'neon', 'anime', 'sneaker', 'esports',
  'graffiti', 'hiphop', 'scifi', 'darkninja', 'aesthetic', 'kpop', 'softgirl',
  'cottagecore', 'y2k', 'zodiac', 'bookworm', 'dance', 'lofi', 'finance', 'gym',
  'nightowl', 'minimal', 'cyberpunk', 'coder', 'streetwear', 'cleangirl', 'sage',
  'coffee', 'study', 'parisian', 'wellness', 'vintage', 'moonlight', 'wwe',
  'dreams', 'victory', 'cube', 'gaming', 'fortnite', 'minecraft'
];

/**
 * ThemeMascot - Displays the theme's unique mascot character
 *
 * Each theme has its OWN mascot that IS the theme:
 * - WWE theme = wrestler character
 * - Dinosaur theme = dinosaur character
 * - Princess theme = princess character
 *
 * NO circular frame - mascot displays directly on the page.
 * Larger default size (200px) for prominent display.
 */
export default function ThemeMascot({
  theme: themeOverride,
  size = 200,
  className = '',
  animate = false,
  alt = 'Theme Mascot',
  onClick,
}: ThemeMascotProps) {
  const { currentTheme } = useTheme();

  // Use override or context theme
  const theme = themeOverride || currentTheme?.id || 'default';

  // Check if theme has a mascot, fallback to default
  const imageTheme = AVAILABLE_THEMES.includes(theme) ? theme : 'default';
  const imagePath = `/images/theme-mascots/mascot-${imageTheme}.png`;

  const imageElement = (
    <Image
      src={imagePath}
      alt={`${alt} - ${theme}`}
      width={size}
      height={size}
      className={`object-contain ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
      onClick={onClick}
      priority={size > 150}
    />
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        {imageElement}
      </motion.div>
    );
  }

  return imageElement;
}

/**
 * MascotWithMessage - Mascot with speech bubble
 */
export function MascotWithMessage({
  theme,
  message,
  size = 180,
  className = '',
}: {
  theme?: string;
  message: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <ThemeMascot theme={theme} size={size} animate />
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative bg-white/90 backdrop-blur rounded-2xl rounded-bl-sm p-4 shadow-xl max-w-sm"
      >
        <p className="text-gray-800 font-medium">{message}</p>
        {/* Speech bubble pointer */}
        <div className="absolute left-0 bottom-4 w-3 h-3 bg-white/90 transform -translate-x-1.5 rotate-45" />
      </motion.div>
    </div>
  );
}

/**
 * MascotCelebrating - Mascot with celebration animation
 */
export function MascotCelebrating({
  theme,
  size = 200,
  className = '',
}: {
  theme?: string;
  size?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        duration: 0.6,
        repeat: 3,
        repeatType: 'reverse',
      }}
    >
      <ThemeMascot theme={theme} size={size} animate />
      {/* Sparkle effects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
          transition={{
            duration: 0.7,
            delay: i * 0.12,
            repeat: 2,
          }}
        >
          {['✨', '⭐', '🌟', '💫'][i % 4]}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Get the image path for a theme mascot
 */
export function getMascotImagePath(theme: string): string {
  const imageTheme = AVAILABLE_THEMES.includes(theme) ? theme : 'default';
  return `/images/theme-mascots/mascot-${imageTheme}.png`;
}

/**
 * Check if a theme has a mascot image
 */
export function hasMascotImage(theme: string): boolean {
  return AVAILABLE_THEMES.includes(theme);
}
