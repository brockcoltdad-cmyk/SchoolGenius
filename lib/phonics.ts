export interface PhonicsChunk {
  letters: string
  sound: string
  type: 'vowel' | 'consonant' | 'team'
}

const SOUND_MAP: Record<string, string> = {
  'b': 'buh', 'c': 'kuh', 'd': 'duh', 'f': 'fuh', 'g': 'guh',
  'h': 'huh', 'j': 'juh', 'k': 'kuh', 'l': 'luh', 'm': 'muh',
  'n': 'nuh', 'p': 'puh', 'r': 'ruh', 's': 'suh', 't': 'tuh',
  'a': 'aaa', 'e': 'eh', 'i': 'ih', 'o': 'ah', 'u': 'uh',
  'ch': 'ch', 'sh': 'sh', 'th': 'th', 'wh': 'wh',
  'ai': 'ay', 'ea': 'ee', 'oa': 'oh'
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])

export function breakIntoPhonics(word: string): PhonicsChunk[] {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!clean) return []
  const chunks: PhonicsChunk[] = []
  let i = 0
  while (i < clean.length) {
    const twoChars = clean.slice(i, i + 2)
    if (twoChars.length === 2 && SOUND_MAP[twoChars]) {
      chunks.push({ letters: twoChars, sound: SOUND_MAP[twoChars], type: 'team' })
      i += 2
      continue
    }
    const char = clean[i]
    chunks.push({ letters: char, sound: SOUND_MAP[char] || char, type: VOWELS.has(char) ? 'vowel' : 'consonant' })
    i++
  }
  return chunks
}

export function getSoundTypeColor(type: PhonicsChunk['type']): string {
  switch (type) {
    case 'vowel': return 'bg-red-100 border-red-300 text-red-800'
    case 'consonant': return 'bg-blue-100 border-blue-300 text-blue-800'
    case 'team': return 'bg-purple-100 border-purple-300 text-purple-800'
    default: return 'bg-gray-100 border-gray-300 text-gray-800'
  }
}
