import { ThemeId } from './theme-context';

export interface ThemeSkin {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  description: string;
  requiredLevel: number;
  coinCost: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  unlocked?: boolean;
}

export const THEME_SKINS: Record<ThemeId, ThemeSkin[]> = {
  default: [
    { id: 'default', name: 'Classic', rarity: 'common', icon: '🐨', description: 'The classic look', requiredLevel: 1, coinCost: 0, colors: { primary: '#3B82F6', secondary: '#8B5CF6', accent: '#FBBF24' } },
  ],

  battle: [
    { id: 'shadow-ops', name: 'Shadow Ops', rarity: 'legendary', icon: '🥷', description: 'Elite stealth operative', requiredLevel: 1, coinCost: 0, colors: { primary: '#FFD700', secondary: '#FFA500', accent: '#FFFF00' } },
    { id: 'cyber-warrior', name: 'Cyber Warrior', rarity: 'epic', icon: '🤖', description: 'Tech-enhanced fighter', requiredLevel: 5, coinCost: 500, colors: { primary: '#B24BF3', secondary: '#8B1BF3', accent: '#E24BF3' } },
    { id: 'storm-knight', name: 'Storm Knight', rarity: 'rare', icon: '⚡', description: 'Master of lightning', requiredLevel: 10, coinCost: 1000, colors: { primary: '#4B9EF3', secondary: '#1B6EF3', accent: '#7BBEF3' } },
    { id: 'desert-scout', name: 'Desert Scout', rarity: 'common', icon: '🏜️', description: 'Desert recon specialist', requiredLevel: 15, coinCost: 1500, colors: { primary: '#D4A574', secondary: '#8B7355', accent: '#F4D5A4' } },
  ],

  builder: [
    { id: 'steve', name: 'Steve', rarity: 'common', icon: '👷', description: 'The original builder', requiredLevel: 1, coinCost: 0, colors: { primary: '#22C55E', secondary: '#16A34A', accent: '#4ADE80' } },
    { id: 'alex', name: 'Alex', rarity: 'common', icon: '👩‍🔧', description: 'Master crafter', requiredLevel: 5, coinCost: 300, colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' } },
    { id: 'diamond-warrior', name: 'Diamond Warrior', rarity: 'epic', icon: '💎', description: 'Legendary armor set', requiredLevel: 10, coinCost: 800, colors: { primary: '#22D3EE', secondary: '#0891B2', accent: '#67E8F9' } },
    { id: 'ender-dragon', name: 'Ender Dragon', rarity: 'mythic', icon: '🐉', description: 'Ultimate boss form', requiredLevel: 20, coinCost: 2000, colors: { primary: '#7C3AED', secondary: '#5B21B6', accent: '#A78BFA' } },
  ],

  pirate: [
    { id: 'captain', name: 'Captain', rarity: 'common', icon: '🏴‍☠️', description: 'Fearless pirate captain', requiredLevel: 1, coinCost: 0, colors: { primary: '#DC2626', secondary: '#991B1B', accent: '#F87171' } },
    { id: 'buccaneer', name: 'Buccaneer', rarity: 'rare', icon: '⚔️', description: 'Swashbuckling hero', requiredLevel: 5, coinCost: 400, colors: { primary: '#F97316', secondary: '#C2410C', accent: '#FB923C' } },
    { id: 'ghost-pirate', name: 'Ghost Pirate', rarity: 'epic', icon: '👻', description: 'Cursed sea spirit', requiredLevel: 10, coinCost: 900, colors: { primary: '#14B8A6', secondary: '#0F766E', accent: '#5EEAD4' } },
    { id: 'kraken-lord', name: 'Kraken Lord', rarity: 'mythic', icon: '🐙', description: 'Master of the deep', requiredLevel: 20, coinCost: 2000, colors: { primary: '#6366F1', secondary: '#4338CA', accent: '#818CF8' } },
  ],

  zombie: [
    { id: 'zombie', name: 'Classic Zombie', rarity: 'common', icon: '🧟', description: 'Basic undead', requiredLevel: 1, coinCost: 0, colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' } },
    { id: 'mummy', name: 'Ancient Mummy', rarity: 'rare', icon: '🧟‍♂️', description: 'Wrapped in mystery', requiredLevel: 5, coinCost: 400, colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' } },
    { id: 'vampire', name: 'Vampire Lord', rarity: 'epic', icon: '🧛', description: 'Creature of the night', requiredLevel: 10, coinCost: 900, colors: { primary: '#DC2626', secondary: '#991B1B', accent: '#F87171' } },
    { id: 'frankenstein', name: 'Frankenstein', rarity: 'legendary', icon: '🧟‍♀️', description: 'Reanimated monster', requiredLevel: 15, coinCost: 1500, colors: { primary: '#10B981', secondary: '#059669', accent: '#6EE7B7' } },
  ],

  anime: [
    { id: 'hero', name: 'Hero Academia', rarity: 'common', icon: '🦸', description: 'Plus Ultra!', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#DC2626', accent: '#F87171' } },
    { id: 'ninja', name: 'Shadow Ninja', rarity: 'rare', icon: '🥷', description: 'Believe it!', requiredLevel: 5, coinCost: 450, colors: { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C' } },
    { id: 'saiyan', name: 'Super Saiyan', rarity: 'epic', icon: '⚡', description: 'Over 9000!', requiredLevel: 10, coinCost: 950, colors: { primary: '#FBBF24', secondary: '#F59E0B', accent: '#FDE047' } },
    { id: 'titan', name: 'Attack Titan', rarity: 'legendary', icon: '👹', description: 'Colossal power', requiredLevel: 15, coinCost: 1600, colors: { primary: '#DC2626', secondary: '#991B1B', accent: '#FCA5A5' } },
  ],

  unicorn: [
    { id: 'rainbow', name: 'Rainbow Unicorn', rarity: 'common', icon: '🦄', description: 'Magical rainbow friend', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#F472B6' } },
    { id: 'starlight', name: 'Starlight', rarity: 'rare', icon: '✨', description: 'Sparkles everywhere', requiredLevel: 5, coinCost: 400, colors: { primary: '#A855F7', secondary: '#7C3AED', accent: '#C084FC' } },
    { id: 'moonbeam', name: 'Moonbeam', rarity: 'epic', icon: '🌙', description: 'Lunar magic', requiredLevel: 10, coinCost: 900, colors: { primary: '#6366F1', secondary: '#4F46E5', accent: '#818CF8' } },
    { id: 'celestial', name: 'Celestial Queen', rarity: 'mythic', icon: '👑', description: 'Ultimate unicorn form', requiredLevel: 20, coinCost: 2000, colors: { primary: '#F472B6', secondary: '#EC4899', accent: '#FBCFE8' } },
  ],

  dinosaur: [
    { id: 'trex', name: 'T-Rex', rarity: 'common', icon: '🦖', description: 'King of dinosaurs', requiredLevel: 1, coinCost: 0, colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' } },
    { id: 'raptor', name: 'Velociraptor', rarity: 'rare', icon: '🦕', description: 'Clever girl', requiredLevel: 5, coinCost: 400, colors: { primary: '#14B8A6', secondary: '#0F766E', accent: '#2DD4BF' } },
    { id: 'pterodactyl', name: 'Pterodactyl', rarity: 'epic', icon: '🦅', description: 'Ruler of the skies', requiredLevel: 10, coinCost: 900, colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' } },
    { id: 'indominus', name: 'Indominus Rex', rarity: 'mythic', icon: '👹', description: 'Hybrid super-predator', requiredLevel: 20, coinCost: 2000, colors: { primary: '#DC2626', secondary: '#991B1B', accent: '#FCA5A5' } },
  ],

  space: [
    { id: 'astronaut', name: 'Astronaut', rarity: 'common', icon: '👨‍🚀', description: 'Space explorer', requiredLevel: 1, coinCost: 0, colors: { primary: '#3B82F6', secondary: '#2563EB', accent: '#60A5FA' } },
    { id: 'alien', name: 'Friendly Alien', rarity: 'rare', icon: '👽', description: 'From another world', requiredLevel: 5, coinCost: 400, colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' } },
    { id: 'robot', name: 'Space Robot', rarity: 'epic', icon: '🤖', description: 'AI companion', requiredLevel: 10, coinCost: 900, colors: { primary: '#A855F7', secondary: '#9333EA', accent: '#C084FC' } },
    { id: 'galaxy', name: 'Galaxy Guardian', rarity: 'mythic', icon: '🌟', description: 'Cosmic protector', requiredLevel: 20, coinCost: 2000, colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#C4B5FD' } },
  ],

  // Add default single skin for all other themes for now
  monster: [{ id: 'default', name: 'Classic Monster', rarity: 'common', icon: '👹', description: 'Classic look', requiredLevel: 1, coinCost: 0, colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' } }],
  hero: [{ id: 'default', name: 'Classic Hero', rarity: 'common', icon: '🦸', description: 'Classic hero', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#DC2626', accent: '#F87171' } }],
  robot: [{ id: 'default', name: 'Classic Robot', rarity: 'common', icon: '🤖', description: 'Classic robot', requiredLevel: 1, coinCost: 0, colors: { primary: '#6B7280', secondary: '#4B5563', accent: '#9CA3AF' } }],
  mermaid: [{ id: 'default', name: 'Classic Mermaid', rarity: 'common', icon: '🧜‍♀️', description: 'Ocean princess', requiredLevel: 1, coinCost: 0, colors: { primary: '#06B6D4', secondary: '#0891B2', accent: '#22D3EE' } }],
  princess: [{ id: 'default', name: 'Classic Princess', rarity: 'common', icon: '👸', description: 'Royal princess', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' } }],
  rainbow: [{ id: 'default', name: 'Classic Rainbow', rarity: 'common', icon: '🌈', description: 'Rainbow magic', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#8B5CF6', accent: '#F59E0B' } }],
  butterfly: [{ id: 'default', name: 'Classic Butterfly', rarity: 'common', icon: '🦋', description: 'Flutter around', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#F472B6' } }],
  dreams: [{ id: 'default', name: 'Dreamer', rarity: 'common', icon: '💭', description: 'Dream big', requiredLevel: 1, coinCost: 0, colors: { primary: '#A855F7', secondary: '#7C3AED', accent: '#C084FC' } }],
  victory: [{ id: 'default', name: 'Victor', rarity: 'common', icon: '🏆', description: 'Always winning', requiredLevel: 1, coinCost: 0, colors: { primary: '#FBBF24', secondary: '#F59E0B', accent: '#FDE047' } }],
  cube: [{ id: 'default', name: 'Cube', rarity: 'common', icon: '🎲', description: 'Cubic style', requiredLevel: 1, coinCost: 0, colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' } }],
  web: [{ id: 'default', name: 'Web Crawler', rarity: 'common', icon: '🕷️', description: 'Spin webs', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#DC2626', accent: '#3B82F6' } }],
  creatures: [{ id: 'default', name: 'Creature', rarity: 'common', icon: '🐉', description: 'Mythical creature', requiredLevel: 1, coinCost: 0, colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' } }],
  glam: [{ id: 'default', name: 'Glamorous', rarity: 'common', icon: '💅', description: 'Fabulous style', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#FBBF24' } }],
  fashion: [{ id: 'default', name: 'Fashionista', rarity: 'common', icon: '👗', description: 'Always in style', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#F472B6' } }],
  ice: [{ id: 'default', name: 'Ice Queen', rarity: 'common', icon: '❄️', description: 'Frozen powers', requiredLevel: 1, coinCost: 0, colors: { primary: '#06B6D4', secondary: '#0891B2', accent: '#67E8F9' } }],
  pony: [{ id: 'default', name: 'My Pony', rarity: 'common', icon: '🐴', description: 'Friendship magic', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#F472B6' } }],
  neon: [{ id: 'default', name: 'Neon Glow', rarity: 'common', icon: '💡', description: 'Bright lights', requiredLevel: 1, coinCost: 0, colors: { primary: '#06B6D4', secondary: '#F59E0B', accent: '#EC4899' } }],
  sneaker: [{ id: 'default', name: 'Sneakerhead', rarity: 'common', icon: '👟', description: 'Fresh kicks', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#3B82F6', accent: '#FBBF24' } }],
  esports: [{ id: 'default', name: 'Pro Gamer', rarity: 'common', icon: '🎮', description: 'Esports legend', requiredLevel: 1, coinCost: 0, colors: { primary: '#8B5CF6', secondary: '#3B82F6', accent: '#10B981' } }],
  graffiti: [{ id: 'default', name: 'Street Artist', rarity: 'common', icon: '🎨', description: 'Urban art', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#F59E0B', accent: '#10B981' } }],
  hiphop: [{ id: 'default', name: 'MC', rarity: 'common', icon: '🎤', description: 'Drop beats', requiredLevel: 1, coinCost: 0, colors: { primary: '#FBBF24', secondary: '#EF4444', accent: '#3B82F6' } }],
  scifi: [{ id: 'default', name: 'Sci-Fi Explorer', rarity: 'common', icon: '🚀', description: 'Future tech', requiredLevel: 1, coinCost: 0, colors: { primary: '#06B6D4', secondary: '#8B5CF6', accent: '#10B981' } }],
  darkninja: [{ id: 'default', name: 'Shadow Warrior', rarity: 'common', icon: '🥷', description: 'Silent assassin', requiredLevel: 1, coinCost: 0, colors: { primary: '#1F2937', secondary: '#DC2626', accent: '#6B7280' } }],
  aesthetic: [{ id: 'default', name: 'Aesthetic Vibes', rarity: 'common', icon: '✨', description: 'Soft aesthetic', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#F472B6' } }],
  kpop: [{ id: 'default', name: 'K-Pop Star', rarity: 'common', icon: '⭐', description: 'Idol life', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#8B5CF6', accent: '#FBBF24' } }],
  softgirl: [{ id: 'default', name: 'Soft Girl', rarity: 'common', icon: '🌸', description: 'Soft aesthetic', requiredLevel: 1, coinCost: 0, colors: { primary: '#FBCFE8', secondary: '#F9A8D4', accent: '#FDE68A' } }],
  cottagecore: [{ id: 'default', name: 'Cottage Dweller', rarity: 'common', icon: '🌿', description: 'Nature vibes', requiredLevel: 1, coinCost: 0, colors: { primary: '#84CC16', secondary: '#CA8A04', accent: '#F87171' } }],
  minimal: [{ id: 'default', name: 'Minimalist', rarity: 'common', icon: '⚪', description: 'Less is more', requiredLevel: 1, coinCost: 0, colors: { primary: '#1F2937', secondary: '#6B7280', accent: '#F3F4F6' } }],
  cyberpunk: [{ id: 'default', name: 'Cyber Runner', rarity: 'common', icon: '🤖', description: 'Neon future', requiredLevel: 1, coinCost: 0, colors: { primary: '#06B6D4', secondary: '#F59E0B', accent: '#EC4899' } }],
  coder: [{ id: 'default', name: 'Code Ninja', rarity: 'common', icon: '💻', description: 'Programming pro', requiredLevel: 1, coinCost: 0, colors: { primary: '#10B981', secondary: '#3B82F6', accent: '#8B5CF6' } }],
  streetwear: [{ id: 'default', name: 'Streetwear Icon', rarity: 'common', icon: '🧥', description: 'Street fashion', requiredLevel: 1, coinCost: 0, colors: { primary: '#1F2937', secondary: '#EF4444', accent: '#FBBF24' } }],
  y2k: [{ id: 'default', name: 'Y2K Trendsetter', rarity: 'common', icon: '📱', description: '2000s vibes', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#8B5CF6', accent: '#06B6D4' } }],
  zodiac: [{ id: 'default', name: 'Star Sign', rarity: 'common', icon: '⭐', description: 'Cosmic energy', requiredLevel: 1, coinCost: 0, colors: { primary: '#8B5CF6', secondary: '#3B82F6', accent: '#FBBF24' } }],
  bookworm: [{ id: 'default', name: 'Book Lover', rarity: 'common', icon: '📚', description: 'Reading time', requiredLevel: 1, coinCost: 0, colors: { primary: '#92400E', secondary: '#059669', accent: '#F59E0B' } }],
  dance: [{ id: 'default', name: 'Dancer', rarity: 'common', icon: '💃', description: 'Dance moves', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#F472B6' } }],
  lofi: [{ id: 'default', name: 'Lofi Vibes', rarity: 'common', icon: '🎧', description: 'Chill beats', requiredLevel: 1, coinCost: 0, colors: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#F59E0B' } }],
  finance: [{ id: 'default', name: 'Finance Bro', rarity: 'common', icon: '💰', description: 'Money moves', requiredLevel: 1, coinCost: 0, colors: { primary: '#10B981', secondary: '#1F2937', accent: '#FBBF24' } }],
  gym: [{ id: 'default', name: 'Gym Rat', rarity: 'common', icon: '💪', description: 'Gains time', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#1F2937', accent: '#F59E0B' } }],
  nightowl: [{ id: 'default', name: 'Night Owl', rarity: 'common', icon: '🦉', description: 'Late night', requiredLevel: 1, coinCost: 0, colors: { primary: '#6366F1', secondary: '#1F2937', accent: '#8B5CF6' } }],
  cleangirl: [{ id: 'default', name: 'Clean Girl', rarity: 'common', icon: '🤍', description: 'Clean aesthetic', requiredLevel: 1, coinCost: 0, colors: { primary: '#F5F5F4', secondary: '#D6D3D1', accent: '#A8A29E' } }],
  sage: [{ id: 'default', name: 'Sage Soul', rarity: 'common', icon: '🌿', description: 'Calm vibes', requiredLevel: 1, coinCost: 0, colors: { primary: '#84CC16', secondary: '#65A30D', accent: '#A3E635' } }],
  coffee: [{ id: 'default', name: 'Coffee Lover', rarity: 'common', icon: '☕', description: 'Caffeine fix', requiredLevel: 1, coinCost: 0, colors: { primary: '#92400E', secondary: '#78350F', accent: '#FDE68A' } }],
  study: [{ id: 'default', name: 'Study Buddy', rarity: 'common', icon: '📝', description: 'Study time', requiredLevel: 1, coinCost: 0, colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#FBBF24' } }],
  parisian: [{ id: 'default', name: 'Parisian Chic', rarity: 'common', icon: '🗼', description: 'French style', requiredLevel: 1, coinCost: 0, colors: { primary: '#1F2937', secondary: '#EF4444', accent: '#F3F4F6' } }],
  wellness: [{ id: 'default', name: 'Wellness Guru', rarity: 'common', icon: '🧘', description: 'Mind & body', requiredLevel: 1, coinCost: 0, colors: { primary: '#10B981', secondary: '#059669', accent: '#D1FAE5' } }],
  vintage: [{ id: 'default', name: 'Vintage Soul', rarity: 'common', icon: '📻', description: 'Retro vibes', requiredLevel: 1, coinCost: 0, colors: { primary: '#92400E', secondary: '#F59E0B', accent: '#FDE68A' } }],
  moonlight: [{ id: 'default', name: 'Moonchild', rarity: 'common', icon: '🌙', description: 'Lunar magic', requiredLevel: 1, coinCost: 0, colors: { primary: '#6366F1', secondary: '#4F46E5', accent: '#C7D2FE' } }],
  ninja: [{ id: 'default', name: 'Ninja Master', rarity: 'common', icon: '🥷', description: 'Stealth mode', requiredLevel: 1, coinCost: 0, colors: { primary: '#1F2937', secondary: '#DC2626', accent: '#6B7280' } }],
  racecar: [{ id: 'default', name: 'Speed Racer', rarity: 'common', icon: '🏎️', description: 'Fast & furious', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#1F2937', accent: '#FBBF24' } }],
  mech: [{ id: 'default', name: 'Mech Pilot', rarity: 'common', icon: '🤖', description: 'Giant robot', requiredLevel: 1, coinCost: 0, colors: { primary: '#6B7280', secondary: '#EF4444', accent: '#3B82F6' } }],
  popstar: [{ id: 'default', name: 'Pop Star', rarity: 'common', icon: '⭐', description: 'Fame & fortune', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#FBBF24' } }],
  cupcake: [{ id: 'default', name: 'Cupcake Cutie', rarity: 'common', icon: '🧁', description: 'Sweet treats', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#F472B6', accent: '#FDE68A' } }],
  friendship: [{ id: 'default', name: 'Best Friend', rarity: 'common', icon: '💖', description: 'Friendship power', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#F472B6' } }],
  kawaii: [{ id: 'default', name: 'Kawaii Character', rarity: 'common', icon: '🌸', description: 'Super cute', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#F472B6', accent: '#FDE68A' } }],
  shark: [{ id: 'default', name: 'Shark', rarity: 'common', icon: '🦈', description: 'Ocean predator', requiredLevel: 1, coinCost: 0, colors: { primary: '#0891B2', secondary: '#164E63', accent: '#22D3EE' } }],
  kitten: [{ id: 'default', name: 'Kitten', rarity: 'common', icon: '🐱', description: 'Cute kitty', requiredLevel: 1, coinCost: 0, colors: { primary: '#F97316', secondary: '#EA580C', accent: '#FED7AA' } }],
  fairy: [{ id: 'default', name: 'Fairy', rarity: 'common', icon: '🧚', description: 'Magical fairy', requiredLevel: 1, coinCost: 0, colors: { primary: '#A855F7', secondary: '#9333EA', accent: '#E9D5FF' } }],
  ballerina: [{ id: 'default', name: 'Ballerina', rarity: 'common', icon: '🩰', description: 'Dance gracefully', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#FBCFE8' } }],
  safari: [
    { id: 'lion-pride', name: 'Lion Pride', rarity: 'common', icon: '🦁', description: 'King of the savanna', requiredLevel: 1, coinCost: 0, colors: { primary: '#F59E0B', secondary: '#78350F', accent: '#EAB308' } },
    { id: 'giraffe-tower', name: 'Giraffe Tower', rarity: 'rare', icon: '🦒', description: 'Reach for the stars', requiredLevel: 5, coinCost: 400, colors: { primary: '#F97316', secondary: '#FBBF24', accent: '#FED7AA' } },
    { id: 'elephant-herd', name: 'Elephant Herd', rarity: 'epic', icon: '🐘', description: 'Mighty and wise', requiredLevel: 10, coinCost: 900, colors: { primary: '#6B7280', secondary: '#F59E0B', accent: '#D1D5DB' } },
    { id: 'safari-ranger', name: 'Safari Ranger', rarity: 'legendary', icon: '🏕️', description: 'Ultimate guide', requiredLevel: 15, coinCost: 1500, colors: { primary: '#92400E', secondary: '#16A34A', accent: '#FDE68A' } },
  ],

  farm: [
    { id: 'red-barn', name: 'Red Barn', rarity: 'common', icon: '🏠', description: 'Classic farmhouse', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#22C55E', accent: '#FBBF24' } },
    { id: 'cow-dairy', name: 'Dairy Cow', rarity: 'rare', icon: '🐮', description: 'Moo-velous friend', requiredLevel: 5, coinCost: 400, colors: { primary: '#1F2937', secondary: '#F3F4F6', accent: '#EC4899' } },
    { id: 'golden-harvest', name: 'Golden Harvest', rarity: 'epic', icon: '🌾', description: 'Bountiful crops', requiredLevel: 10, coinCost: 900, colors: { primary: '#FBBF24', secondary: '#F59E0B', accent: '#FDE68A' } },
    { id: 'farm-tractor', name: 'Mega Tractor', rarity: 'legendary', icon: '🚜', description: 'Power farmer', requiredLevel: 15, coinCost: 1500, colors: { primary: '#16A34A', secondary: '#DC2626', accent: '#FCD34D' } },
  ],

  candy: [
    { id: 'lollipop-swirl', name: 'Lollipop Swirl', rarity: 'common', icon: '🍭', description: 'Sweet and twirly', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#F472B6', accent: '#FBBF24' } },
    { id: 'cotton-candy', name: 'Cotton Candy', rarity: 'rare', icon: '🍬', description: 'Fluffy clouds', requiredLevel: 5, coinCost: 400, colors: { primary: '#F0ABFC', secondary: '#A78BFA', accent: '#93C5FD' } },
    { id: 'cupcake-castle', name: 'Cupcake Castle', rarity: 'epic', icon: '🧁', description: 'Frosted kingdom', requiredLevel: 10, coinCost: 900, colors: { primary: '#F472B6', secondary: '#FBBF24', accent: '#FDE68A' } },
    { id: 'candy-king', name: 'Candy King', rarity: 'legendary', icon: '👑', description: 'Ruler of sweets', requiredLevel: 15, coinCost: 1500, colors: { primary: '#EC4899', secondary: '#A855F7', accent: '#FCD34D' } },
  ],

  construction: [
    { id: 'hard-hat', name: 'Hard Hat', rarity: 'common', icon: '👷', description: 'Safety first', requiredLevel: 1, coinCost: 0, colors: { primary: '#F59E0B', secondary: '#000000', accent: '#FBBF24' } },
    { id: 'excavator', name: 'Excavator', rarity: 'rare', icon: '🚜', description: 'Dig deep', requiredLevel: 5, coinCost: 400, colors: { primary: '#FBBF24', secondary: '#1F2937', accent: '#F97316' } },
    { id: 'crane-master', name: 'Crane Master', rarity: 'epic', icon: '🏗️', description: 'Build high', requiredLevel: 10, coinCost: 900, colors: { primary: '#3B82F6', secondary: '#FBBF24', accent: '#EF4444' } },
    { id: 'foreman', name: 'Site Foreman', rarity: 'legendary', icon: '⚠️', description: 'Boss builder', requiredLevel: 15, coinCost: 1500, colors: { primary: '#DC2626', secondary: '#FBBF24', accent: '#1F2937' } },
  ],

  firefighter: [
    { id: 'rookie', name: 'Rookie Firefighter', rarity: 'common', icon: '🚒', description: 'Ready to serve', requiredLevel: 1, coinCost: 0, colors: { primary: '#DC2626', secondary: '#F59E0B', accent: '#FBBF24' } },
    { id: 'dalmatian', name: 'Firehouse Dog', rarity: 'rare', icon: '🐕', description: 'Loyal companion', requiredLevel: 5, coinCost: 400, colors: { primary: '#1F2937', secondary: '#EF4444', accent: '#F3F4F6' } },
    { id: 'fire-captain', name: 'Fire Captain', rarity: 'epic', icon: '👨‍🚒', description: 'Lead the crew', requiredLevel: 10, coinCost: 900, colors: { primary: '#EF4444', secondary: '#FBBF24', accent: '#1F2937' } },
    { id: 'fire-chief', name: 'Fire Chief', rarity: 'legendary', icon: '⭐', description: 'Ultimate hero', requiredLevel: 15, coinCost: 1500, colors: { primary: '#B91C1C', secondary: '#FCD34D', accent: '#DC2626' } },
  ],

  ocean: [
    { id: 'tropical-fish', name: 'Tropical Fish', rarity: 'common', icon: '🐠', description: 'Colorful swimmer', requiredLevel: 1, coinCost: 0, colors: { primary: '#0EA5E9', secondary: '#06B6D4', accent: '#FBBF24' } },
    { id: 'sea-turtle', name: 'Sea Turtle', rarity: 'rare', icon: '🐢', description: 'Wise and slow', requiredLevel: 5, coinCost: 400, colors: { primary: '#10B981', secondary: '#0891B2', accent: '#FCD34D' } },
    { id: 'octopus', name: 'Clever Octopus', rarity: 'epic', icon: '🐙', description: 'Eight arms strong', requiredLevel: 10, coinCost: 900, colors: { primary: '#A855F7', secondary: '#0EA5E9', accent: '#F472B6' } },
    { id: 'dolphin-pod', name: 'Dolphin Pod', rarity: 'legendary', icon: '🐬', description: 'Ocean legends', requiredLevel: 15, coinCost: 1500, colors: { primary: '#0284C7', secondary: '#22D3EE', accent: '#F0F9FF' } },
  ],

  jungle: [
    { id: 'monkey-swinger', name: 'Monkey Swinger', rarity: 'common', icon: '🐒', description: 'Vine master', requiredLevel: 1, coinCost: 0, colors: { primary: '#16A34A', secondary: '#84CC16', accent: '#FBBF24' } },
    { id: 'parrot', name: 'Tropical Parrot', rarity: 'rare', icon: '🦜', description: 'Colorful flyer', requiredLevel: 5, coinCost: 400, colors: { primary: '#EF4444', secondary: '#10B981', accent: '#3B82F6' } },
    { id: 'tiger', name: 'Jungle Tiger', rarity: 'epic', icon: '🐅', description: 'Apex predator', requiredLevel: 10, coinCost: 900, colors: { primary: '#F97316', secondary: '#1F2937', accent: '#FBBF24' } },
    { id: 'gorilla-king', name: 'Gorilla King', rarity: 'legendary', icon: '🦍', description: 'Jungle ruler', requiredLevel: 15, coinCost: 1500, colors: { primary: '#1F2937', secondary: '#16A34A', accent: '#6B7280' } },
  ],

  arctic: [
    { id: 'penguin-waddle', name: 'Penguin Waddle', rarity: 'common', icon: '🐧', description: 'Cute slider', requiredLevel: 1, coinCost: 0, colors: { primary: '#0EA5E9', secondary: '#E0F2FE', accent: '#FBBF24' } },
    { id: 'polar-bear', name: 'Polar Bear', rarity: 'rare', icon: '🐻‍❄️', description: 'Arctic giant', requiredLevel: 5, coinCost: 400, colors: { primary: '#F3F4F6', secondary: '#0EA5E9', accent: '#93C5FD' } },
    { id: 'seal', name: 'Playful Seal', rarity: 'epic', icon: '🦭', description: 'Ice acrobat', requiredLevel: 10, coinCost: 900, colors: { primary: '#6B7280', secondary: '#0EA5E9', accent: '#E0F2FE' } },
    { id: 'aurora', name: 'Aurora Spirit', rarity: 'legendary', icon: '❄️', description: 'Northern lights', requiredLevel: 15, coinCost: 1500, colors: { primary: '#8B5CF6', secondary: '#10B981', accent: '#06B6D4' } },
  ],
  teddy: [{ id: 'default', name: 'Teddy Bear', rarity: 'common', icon: '🧸', description: 'Cuddly friend', requiredLevel: 1, coinCost: 0, colors: { primary: '#92400E', secondary: '#78350F', accent: '#FED7AA' } }],
  puppy: [{ id: 'default', name: 'Puppy', rarity: 'common', icon: '🐶', description: 'Best friend', requiredLevel: 1, coinCost: 0, colors: { primary: '#F97316', secondary: '#EA580C', accent: '#FED7AA' } }],
  bug: [{ id: 'default', name: 'Bug Collector', rarity: 'common', icon: '🐛', description: 'Tiny critters', requiredLevel: 1, coinCost: 0, colors: { primary: '#10B981', secondary: '#059669', accent: '#D1FAE5' } }],
  train: [{ id: 'default', name: 'Train Conductor', rarity: 'common', icon: '🚂', description: 'All aboard', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#DC2626', accent: '#FEE2E2' } }],
  beach: [{ id: 'default', name: 'Beach Bum', rarity: 'common', icon: '🏖️', description: 'Sand & sun', requiredLevel: 1, coinCost: 0, colors: { primary: '#06B6D4', secondary: '#0891B2', accent: '#FDE68A' } }],
  camping: [{ id: 'default', name: 'Camper', rarity: 'common', icon: '⛺', description: 'Outdoor adventure', requiredLevel: 1, coinCost: 0, colors: { primary: '#84CC16', secondary: '#65A30D', accent: '#FEF08A' } }],
  volcano: [{ id: 'default', name: 'Volcano Explorer', rarity: 'common', icon: '🌋', description: 'Hot lava', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#DC2626', accent: '#F97316' } }],
  planet: [{ id: 'default', name: 'Planet Explorer', rarity: 'common', icon: '🪐', description: 'Space voyage', requiredLevel: 1, coinCost: 0, colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#E9D5FF' } }],

  wwe: [
    { id: 'the-rock', name: 'The People\'s Champ', rarity: 'legendary', icon: '💪', description: 'Can you smell what The Rock is cooking?', requiredLevel: 1, coinCost: 0, colors: { primary: '#FFD700', secondary: '#1F2937', accent: '#EF4444' } },
    { id: 'undertaker', name: 'The Deadman', rarity: 'mythic', icon: '⚰️', description: 'Rest in peace', requiredLevel: 5, coinCost: 800, colors: { primary: '#7C3AED', secondary: '#1F2937', accent: '#6B7280' } },
    { id: 'john-cena', name: 'The Champ', rarity: 'legendary', icon: '👋', description: 'You can\'t see me!', requiredLevel: 10, coinCost: 1200, colors: { primary: '#3B82F6', secondary: '#F97316', accent: '#10B981' } },
    { id: 'stone-cold', name: 'Stone Cold', rarity: 'legendary', icon: '💀', description: 'And that\'s the bottom line!', requiredLevel: 15, coinCost: 1500, colors: { primary: '#1F2937', secondary: '#EAB308', accent: '#DC2626' } },
    { id: 'rey-mysterio', name: 'The Luchador', rarity: 'epic', icon: '🎭', description: 'High-flying champion', requiredLevel: 8, coinCost: 900, colors: { primary: '#7C3AED', secondary: '#10B981', accent: '#F97316' } },
    { id: 'roman-reigns', name: 'Tribal Chief', rarity: 'mythic', icon: '👑', description: 'Acknowledge me!', requiredLevel: 20, coinCost: 2000, colors: { primary: '#DC2626', secondary: '#1F2937', accent: '#FFD700' } },
    { id: 'bianca-belair', name: 'The EST', rarity: 'epic', icon: '💁‍♀️', description: 'Strongest & fastest', requiredLevel: 12, coinCost: 1100, colors: { primary: '#EC4899', secondary: '#3B82F6', accent: '#10B981' } },
    { id: 'hulk-hogan', name: 'Hulkamania', rarity: 'legendary', icon: '💪', description: 'Whatcha gonna do?', requiredLevel: 18, coinCost: 1800, colors: { primary: '#EF4444', secondary: '#EAB308', accent: '#F97316' } },
  ],

  slime: [
    { id: 'classic-slime', name: 'Classic Slime', rarity: 'common', icon: '💚', description: 'Original green goo', requiredLevel: 1, coinCost: 0, colors: { primary: '#10B981', secondary: '#A855F7', accent: '#F472B6' } },
    { id: 'glitter-bomb', name: 'Glitter Bomb', rarity: 'rare', icon: '✨', description: 'Sparkly perfection', requiredLevel: 5, coinCost: 400, colors: { primary: '#EC4899', secondary: '#FCD34D', accent: '#C084FC' } },
    { id: 'rainbow-swirl', name: 'Rainbow Swirl', rarity: 'epic', icon: '🌈', description: 'All colors mixed', requiredLevel: 10, coinCost: 900, colors: { primary: '#F472B6', secondary: '#8B5CF6', accent: '#10B981' } },
    { id: 'galaxy-slime', name: 'Galaxy Slime', rarity: 'legendary', icon: '🌌', description: 'Cosmic creation', requiredLevel: 15, coinCost: 1500, colors: { primary: '#6366F1', secondary: '#EC4899', accent: '#FCD34D' } },
  ],

  bracelet: [
    { id: 'friendship-basic', name: 'Friendship Basic', rarity: 'common', icon: '💖', description: 'Simple and sweet', requiredLevel: 1, coinCost: 0, colors: { primary: '#EC4899', secondary: '#8B5CF6', accent: '#FBBF24' } },
    { id: 'charm-master', name: 'Charm Master', rarity: 'rare', icon: '⭐', description: 'Add cute charms', requiredLevel: 5, coinCost: 400, colors: { primary: '#A855F7', secondary: '#EC4899', accent: '#FCD34D' } },
    { id: 'gemstone-pro', name: 'Gemstone Pro', rarity: 'epic', icon: '💎', description: 'Precious stones', requiredLevel: 10, coinCost: 900, colors: { primary: '#06B6D4', secondary: '#EC4899', accent: '#F0ABFC' } },
    { id: 'designer-deluxe', name: 'Designer Deluxe', rarity: 'legendary', icon: '👑', description: 'Ultimate jewelry', requiredLevel: 15, coinCost: 1500, colors: { primary: '#FBBF24', secondary: '#EC4899', accent: '#8B5CF6' } },
  ],

  artstudio: [
    { id: 'sketcher', name: 'Sketcher', rarity: 'common', icon: '✏️', description: 'Draw your dreams', requiredLevel: 1, coinCost: 0, colors: { primary: '#F59E0B', secondary: '#EC4899', accent: '#8B5CF6' } },
    { id: 'watercolor', name: 'Watercolor', rarity: 'rare', icon: '🖌️', description: 'Fluid artist', requiredLevel: 5, coinCost: 400, colors: { primary: '#06B6D4', secondary: '#EC4899', accent: '#A855F7' } },
    { id: 'master-painter', name: 'Master Painter', rarity: 'epic', icon: '🎨', description: 'Gallery worthy', requiredLevel: 10, coinCost: 900, colors: { primary: '#EF4444', secondary: '#FBBF24', accent: '#10B981' } },
    { id: 'renaissance', name: 'Renaissance', rarity: 'legendary', icon: '🖼️', description: 'True masterpiece', requiredLevel: 15, coinCost: 1500, colors: { primary: '#8B5CF6', secondary: '#F59E0B', accent: '#EC4899' } },
  ],

  spaday: [
    { id: 'facial-fresh', name: 'Facial Fresh', rarity: 'common', icon: '💆', description: 'Glow up time', requiredLevel: 1, coinCost: 0, colors: { primary: '#A855F7', secondary: '#EC4899', accent: '#06B6D4' } },
    { id: 'nail-artist', name: 'Nail Artist', rarity: 'rare', icon: '💅', description: 'Perfect manicure', requiredLevel: 5, coinCost: 400, colors: { primary: '#EC4899', secondary: '#F472B6', accent: '#FCD34D' } },
    { id: 'spa-specialist', name: 'Spa Specialist', rarity: 'epic', icon: '🧖', description: 'Full treatment', requiredLevel: 10, coinCost: 900, colors: { primary: '#8B5CF6', secondary: '#06B6D4', accent: '#F0ABFC' } },
    { id: 'zen-master', name: 'Zen Master', rarity: 'legendary', icon: '🌸', description: 'Ultimate relaxation', requiredLevel: 15, coinCost: 1500, colors: { primary: '#C084FC', secondary: '#F0ABFC', accent: '#93C5FD' } },
  ],

  petgroomer: [
    { id: 'puppy-care', name: 'Puppy Care', rarity: 'common', icon: '🐶', description: 'Wash cute puppies', requiredLevel: 1, coinCost: 0, colors: { primary: '#F97316', secondary: '#EC4899', accent: '#10B981' } },
    { id: 'kitty-stylist', name: 'Kitty Stylist', rarity: 'rare', icon: '🐱', description: 'Pamper kittens', requiredLevel: 5, coinCost: 400, colors: { primary: '#EC4899', secondary: '#F97316', accent: '#8B5CF6' } },
    { id: 'pet-designer', name: 'Pet Designer', rarity: 'epic', icon: '🎀', description: 'Fashion pets', requiredLevel: 10, coinCost: 900, colors: { primary: '#A855F7', secondary: '#EC4899', accent: '#FBBF24' } },
    { id: 'pro-groomer', name: 'Pro Groomer', rarity: 'legendary', icon: '⭐', description: 'Elite pet care', requiredLevel: 15, coinCost: 1500, colors: { primary: '#10B981', secondary: '#F97316', accent: '#EC4899' } },
  ],

  moviestar: [
    { id: 'extra', name: 'Extra', rarity: 'common', icon: '🎬', description: 'Start small', requiredLevel: 1, coinCost: 0, colors: { primary: '#EF4444', secondary: '#FBBF24', accent: '#8B5CF6' } },
    { id: 'supporting-role', name: 'Supporting Role', rarity: 'rare', icon: '🎭', description: 'Getting noticed', requiredLevel: 5, coinCost: 400, colors: { primary: '#8B5CF6', secondary: '#FBBF24', accent: '#EC4899' } },
    { id: 'leading-lady', name: 'Leading Lady', rarity: 'epic', icon: '👗', description: 'Main character', requiredLevel: 10, coinCost: 900, colors: { primary: '#EC4899', secondary: '#EF4444', accent: '#FBBF24' } },
    { id: 'a-list-star', name: 'A-List Star', rarity: 'legendary', icon: '⭐', description: 'Hollywood royalty', requiredLevel: 15, coinCost: 1500, colors: { primary: '#FBBF24', secondary: '#EF4444', accent: '#8B5CF6' } },
  ],
};

export function getSkinsForTheme(themeId: ThemeId): ThemeSkin[] {
  return THEME_SKINS[themeId] || [THEME_SKINS.default[0]];
}

export function getSkinById(themeId: ThemeId, skinId: string): ThemeSkin | undefined {
  const skins = getSkinsForTheme(themeId);
  return skins.find(skin => skin.id === skinId);
}

export function getDefaultSkin(themeId: ThemeId): ThemeSkin {
  const skins = getSkinsForTheme(themeId);
  return skins[0] || THEME_SKINS.default[0];
}

export function getRarityColor(rarity: ThemeSkin['rarity']): string {
  const colors = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#F59E0B',
    mythic: '#EC4899',
  };
  return colors[rarity];
}

export function getRarityGlow(rarity: ThemeSkin['rarity']): string {
  const glows = {
    common: '0 0 10px rgba(156, 163, 175, 0.3)',
    rare: '0 0 20px rgba(59, 130, 246, 0.5)',
    epic: '0 0 25px rgba(168, 85, 247, 0.6)',
    legendary: '0 0 30px rgba(245, 158, 11, 0.7)',
    mythic: '0 0 40px rgba(236, 72, 153, 0.8)',
  };
  return glows[rarity];
}
