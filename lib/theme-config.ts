import { ThemeId } from './theme-context';

export interface ThemePrice {
  themeId: ThemeId;
  price: number;
  featured?: boolean;
}

export const FREE_THEMES_BY_GRADE: Record<string, ThemeId[]> = {
  'K': ['dinosaur', 'monster', 'hero', 'space', 'robot', 'unicorn', 'mermaid', 'princess', 'rainbow', 'butterfly'],
  '1': ['dinosaur', 'monster', 'hero', 'space', 'robot', 'unicorn', 'mermaid', 'princess', 'rainbow', 'butterfly'],
  '2': ['dinosaur', 'monster', 'hero', 'space', 'robot', 'unicorn', 'mermaid', 'princess', 'rainbow', 'butterfly'],

  '3': ['ninja', 'zombie', 'racecar', 'mech', 'battle', 'popstar', 'cupcake', 'friendship', 'kawaii', 'glam', 'slime', 'bracelet'],
  '4': ['ninja', 'zombie', 'racecar', 'mech', 'battle', 'popstar', 'cupcake', 'friendship', 'kawaii', 'glam', 'slime', 'bracelet'],
  '5': ['ninja', 'zombie', 'racecar', 'mech', 'battle', 'popstar', 'cupcake', 'friendship', 'kawaii', 'glam', 'slime', 'bracelet'],

  '6': ['neon', 'anime', 'sneaker', 'esports', 'graffiti', 'aesthetic', 'kpop', 'softgirl', 'cottagecore', 'y2k'],
  '7': ['neon', 'anime', 'sneaker', 'esports', 'graffiti', 'aesthetic', 'kpop', 'softgirl', 'cottagecore', 'y2k'],
  '8': ['neon', 'anime', 'sneaker', 'esports', 'graffiti', 'aesthetic', 'kpop', 'softgirl', 'cottagecore', 'y2k'],

  '9': ['lofi', 'finance', 'gym', 'nightowl', 'minimal', 'cleangirl', 'sage', 'coffee', 'study', 'parisian'],
  '10': ['lofi', 'finance', 'gym', 'nightowl', 'minimal', 'cleangirl', 'sage', 'coffee', 'study', 'parisian'],
  '11': ['lofi', 'finance', 'gym', 'nightowl', 'minimal', 'cleangirl', 'sage', 'coffee', 'study', 'parisian'],
  '12': ['lofi', 'finance', 'gym', 'nightowl', 'minimal', 'cleangirl', 'sage', 'coffee', 'study', 'parisian'],
};

export const THEMES_BY_GRADE: Record<string, ThemeId[]> = {
  'K': ['dinosaur', 'monster', 'hero', 'space', 'robot', 'pirate', 'shark', 'unicorn', 'mermaid', 'princess', 'rainbow', 'butterfly', 'kitten', 'fairy', 'ballerina', 'safari', 'farm', 'candy', 'construction', 'firefighter', 'ocean', 'jungle', 'arctic', 'teddy', 'puppy', 'bug', 'train', 'beach', 'camping', 'volcano', 'planet'],
  '1': ['dinosaur', 'monster', 'hero', 'space', 'robot', 'pirate', 'shark', 'unicorn', 'mermaid', 'princess', 'rainbow', 'butterfly', 'kitten', 'fairy', 'ballerina', 'safari', 'farm', 'candy', 'construction', 'firefighter', 'ocean', 'jungle', 'arctic', 'teddy', 'puppy', 'bug', 'train', 'beach', 'camping', 'volcano', 'planet'],
  '2': ['dinosaur', 'monster', 'hero', 'space', 'robot', 'pirate', 'shark', 'unicorn', 'mermaid', 'princess', 'rainbow', 'butterfly', 'kitten', 'fairy', 'ballerina', 'safari', 'farm', 'candy', 'construction', 'firefighter', 'ocean', 'jungle', 'arctic', 'teddy', 'puppy', 'bug', 'train', 'beach', 'camping', 'volcano', 'planet'],

  '3': ['ninja', 'zombie', 'racecar', 'mech', 'battle', 'builder', 'web', 'creatures', 'popstar', 'cupcake', 'friendship', 'kawaii', 'glam', 'fashion', 'ice', 'pony', 'slime', 'bracelet', 'artstudio', 'spaday', 'petgroomer', 'moviestar'],
  '4': ['ninja', 'zombie', 'racecar', 'mech', 'battle', 'builder', 'web', 'creatures', 'popstar', 'cupcake', 'friendship', 'kawaii', 'glam', 'fashion', 'ice', 'pony', 'slime', 'bracelet', 'artstudio', 'spaday', 'petgroomer', 'moviestar'],
  '5': ['ninja', 'zombie', 'racecar', 'mech', 'battle', 'builder', 'web', 'creatures', 'popstar', 'cupcake', 'friendship', 'kawaii', 'glam', 'fashion', 'ice', 'pony', 'slime', 'bracelet', 'artstudio', 'spaday', 'petgroomer', 'moviestar'],

  '6': ['neon', 'anime', 'sneaker', 'esports', 'graffiti', 'hiphop', 'scifi', 'darkninja', 'aesthetic', 'kpop', 'softgirl', 'cottagecore', 'y2k', 'zodiac', 'bookworm', 'dance'],
  '7': ['neon', 'anime', 'sneaker', 'esports', 'graffiti', 'hiphop', 'scifi', 'darkninja', 'aesthetic', 'kpop', 'softgirl', 'cottagecore', 'y2k', 'zodiac', 'bookworm', 'dance'],
  '8': ['neon', 'anime', 'sneaker', 'esports', 'graffiti', 'hiphop', 'scifi', 'darkninja', 'aesthetic', 'kpop', 'softgirl', 'cottagecore', 'y2k', 'zodiac', 'bookworm', 'dance'],

  '9': ['lofi', 'finance', 'gym', 'nightowl', 'minimal', 'cyberpunk', 'coder', 'streetwear', 'cleangirl', 'sage', 'coffee', 'study', 'parisian', 'wellness', 'vintage', 'moonlight', 'wwe'],
  '10': ['lofi', 'finance', 'gym', 'nightowl', 'minimal', 'cyberpunk', 'coder', 'streetwear', 'cleangirl', 'sage', 'coffee', 'study', 'parisian', 'wellness', 'vintage', 'moonlight', 'wwe'],
  '11': ['lofi', 'finance', 'gym', 'nightowl', 'minimal', 'cyberpunk', 'coder', 'streetwear', 'cleangirl', 'sage', 'coffee', 'study', 'parisian', 'wellness', 'vintage', 'moonlight', 'wwe'],
  '12': ['lofi', 'finance', 'gym', 'nightowl', 'minimal', 'cyberpunk', 'coder', 'streetwear', 'cleangirl', 'sage', 'coffee', 'study', 'parisian', 'wellness', 'vintage', 'moonlight', 'wwe'],
};

export const THEME_PRICES: Record<ThemeId, number> = {
  default: 0,

  dinosaur: 0,
  monster: 0,
  hero: 0,
  space: 0,
  robot: 0,
  pirate: 150,
  shark: 150,

  unicorn: 0,
  mermaid: 0,
  princess: 0,
  rainbow: 0,
  butterfly: 0,
  kitten: 150,
  fairy: 150,
  ballerina: 150,

  ninja: 0,
  zombie: 0,
  racecar: 0,
  mech: 0,
  battle: 0,
  builder: 200,
  web: 200,
  creatures: 200,

  popstar: 0,
  cupcake: 0,
  friendship: 0,
  kawaii: 0,
  glam: 0,
  fashion: 200,
  ice: 200,
  pony: 200,

  neon: 0,
  anime: 0,
  sneaker: 0,
  esports: 0,
  graffiti: 0,
  hiphop: 250,
  scifi: 250,
  darkninja: 250,

  aesthetic: 0,
  kpop: 0,
  softgirl: 0,
  cottagecore: 0,
  y2k: 0,
  zodiac: 250,
  bookworm: 250,
  dance: 250,

  lofi: 0,
  finance: 0,
  gym: 0,
  nightowl: 0,
  minimal: 0,
  cyberpunk: 300,
  coder: 300,
  streetwear: 300,

  cleangirl: 0,
  sage: 0,
  coffee: 0,
  study: 0,
  parisian: 0,
  wellness: 300,
  vintage: 300,
  moonlight: 300,

  dreams: 200,
  victory: 200,
  cube: 200,

  safari: 150,
  farm: 150,
  candy: 150,
  construction: 150,
  firefighter: 150,
  ocean: 150,
  jungle: 150,
  arctic: 150,

  teddy: 150,
  puppy: 150,
  bug: 150,
  train: 150,
  beach: 150,
  camping: 150,
  volcano: 150,
  planet: 150,
  wwe: 350,

  slime: 0,
  bracelet: 0,
  artstudio: 200,
  spaday: 200,
  petgroomer: 200,
  moviestar: 200,
};

export function getFreeThemesForGrade(gradeLevel: string): ThemeId[] {
  return FREE_THEMES_BY_GRADE[gradeLevel] || [];
}

export function getThemesForGrade(gradeLevel: string): ThemeId[] {
  return THEMES_BY_GRADE[gradeLevel] || [];
}

export function getThemePrice(themeId: ThemeId): number {
  return THEME_PRICES[themeId] || 0;
}

export function isThemeFreeForGrade(themeId: ThemeId, gradeLevel: string): boolean {
  const freeThemes = getFreeThemesForGrade(gradeLevel);
  return freeThemes.includes(themeId);
}

export function getShopThemesForGrade(gradeLevel: string): ThemePrice[] {
  const allThemes = getThemesForGrade(gradeLevel);
  const freeThemes = getFreeThemesForGrade(gradeLevel);

  return allThemes
    .filter(themeId => !freeThemes.includes(themeId))
    .map(themeId => ({
      themeId,
      price: getThemePrice(themeId),
      featured: false,
    }))
    .sort((a, b) => a.price - b.price);
}
