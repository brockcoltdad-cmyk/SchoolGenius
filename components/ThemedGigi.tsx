'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

interface ThemedGigiProps {
  /** Override the theme (otherwise uses context) */
  theme?: string;
  /** Size in pixels */
  size?: number;
  /** CSS class name */
  className?: string;
  /** Animation on mount */
  animate?: boolean;
  /** Expression/mood variant */
  mood?: 'default' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  /** Alt text */
  alt?: string;
  /** Click handler */
  onClick?: () => void;
}

// All available themed Gigi images
const AVAILABLE_THEMES = [
  'default', 'dinosaur', 'monster', 'hero', 'space', 'robot', 'pirate', 'shark',
  'unicorn', 'mermaid', 'princess', 'rainbow', 'butterfly', 'kitten', 'fairy',
  'ballerina', 'safari', 'farm', 'candy', 'construction', 'firefighter', 'ocean',
  'jungle', 'arctic', 'teddy', 'puppy', 'bug', 'train', 'beach', 'camping',
  'volcano', 'planet', 'ninja', 'zombie', 'racecar', 'mech', 'battle', 'builder',
  'web', 'creatures', 'popstar', 'cupcake', 'friendship', 'kawaii', 'glam',
  'fashion', 'ice', 'pony', 'slime', 'bracelet', 'artstudio', 'spaday',
  'petgroomer', 'moviestar', 'neon', 'anime', 'sneaker', 'esports', 'graffiti',
  'hiphop', 'scifi', 'darkninja', 'aesthetic', 'kpop', 'softgirl', 'cottagecore',
  'y2k', 'zodiac', 'bookworm', 'dance', 'lofi', 'finance', 'gym', 'nightowl',
  'minimal', 'cyberpunk', 'coder', 'streetwear', 'cleangirl', 'sage', 'coffee',
  'study', 'parisian', 'wellness', 'vintage', 'moonlight', 'wwe', 'dreams',
  'victory', 'cube'
];

/**
 * ThemedGigi - Displays the Gigi mascot in the kid's selected theme
 *
 * Usage:
 * ```tsx
 * // Uses theme from context
 * <ThemedGigi size={150} />
 *
 * // Override with specific theme
 * <ThemedGigi theme="dinosaur" size={200} animate />
 *
 * // With click handler
 * <ThemedGigi size={100} onClick={() => playSound()} />
 * ```
 */
export default function ThemedGigi({
  theme: themeOverride,
  size = 150,
  className = '',
  animate = false,
  mood = 'default',
  alt = 'Gigi the Giraffe',
  onClick,
}: ThemedGigiProps) {
  const { currentTheme } = useTheme();

  // Use override or context theme (currentTheme is a Theme object with id property)
  const theme = themeOverride || currentTheme?.id || 'default';

  // Check if theme has an image, fallback to default
  const imageTheme = AVAILABLE_THEMES.includes(theme) ? theme : 'default';
  const imagePath = `/images/gigi-themes/gigi-${imageTheme}.png`;

  const imageElement = (
    <Image
      src={imagePath}
      alt={`${alt} - ${theme} theme`}
      width={size}
      height={size}
      className={`object-contain ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      priority={size > 100} // Prioritize larger images
    />
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {imageElement}
      </motion.div>
    );
  }

  return imageElement;
}

/**
 * GigiAvatar - Circular themed Gigi for profile/avatar use
 */
export function GigiAvatar({
  theme,
  size = 48,
  className = '',
  onClick,
}: {
  theme?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100 ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <ThemedGigi theme={theme} size={size} />
    </div>
  );
}

/**
 * GigiSpeaking - Gigi with speech bubble
 */
export function GigiSpeaking({
  theme,
  message,
  size = 120,
  className = '',
}: {
  theme?: string;
  message: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <ThemedGigi theme={theme} size={size} animate />
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative bg-white rounded-2xl rounded-bl-none p-4 shadow-lg max-w-xs"
      >
        <p className="text-gray-800">{message}</p>
        {/* Speech bubble tail */}
        <div className="absolute left-0 bottom-0 w-4 h-4 bg-white transform -translate-x-2 rotate-45" />
      </motion.div>
    </div>
  );
}

/**
 * GigiCelebrating - Gigi with confetti animation for correct answers
 */
export function GigiCelebrating({
  theme,
  size = 150,
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
        y: [0, -10, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: 3,
        repeatType: 'reverse',
      }}
    >
      <ThemedGigi theme={theme} size={size} animate />
      {/* Sparkles around Gigi */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            repeat: 2,
          }}
        >
          ✨
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Get the image path for a specific theme
 */
export function getGigiImagePath(theme: string): string {
  const imageTheme = AVAILABLE_THEMES.includes(theme) ? theme : 'default';
  return `/images/gigi-themes/gigi-${imageTheme}.png`;
}

/**
 * Check if a theme has a Gigi image
 */
export function hasGigiImage(theme: string): boolean {
  return AVAILABLE_THEMES.includes(theme);
}
