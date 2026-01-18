// Generate Typing Content for SchoolGenius K-7
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Finger assignments for each key
const fingerMap = {
  // Left pinky
  'a': 'left pinky', 'q': 'left pinky', 'z': 'left pinky', '1': 'left pinky', '`': 'left pinky',
  // Left ring
  's': 'left ring', 'w': 'left ring', 'x': 'left ring', '2': 'left ring',
  // Left middle
  'd': 'left middle', 'e': 'left middle', 'c': 'left middle', '3': 'left middle',
  // Left index
  'f': 'left index', 'r': 'left index', 'v': 'left index', '4': 'left index',
  'g': 'left index', 't': 'left index', 'b': 'left index', '5': 'left index',
  // Right index
  'h': 'right index', 'y': 'right index', 'n': 'right index', '6': 'right index',
  'j': 'right index', 'u': 'right index', 'm': 'right index', '7': 'right index',
  // Right middle
  'k': 'right middle', 'i': 'right middle', ',': 'right middle', '8': 'right middle',
  // Right ring
  'l': 'right ring', 'o': 'right ring', '.': 'right ring', '9': 'right ring',
  // Right pinky
  ';': 'right pinky', 'p': 'right pinky', '/': 'right pinky', '0': 'right pinky',
  "'": 'right pinky', '[': 'right pinky', ']': 'right pinky', '-': 'right pinky', '=': 'right pinky',
  // Thumbs
  ' ': 'thumb'
}

// Home row keys
const homeRow = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']
const topRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const bottomRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

// Simple CVC words for kindergarten
const simpleWords = [
  'cat', 'dog', 'run', 'sun', 'fun', 'mom', 'dad', 'big', 'pig', 'hat',
  'bat', 'sat', 'mat', 'rat', 'pat', 'can', 'man', 'van', 'pan', 'fan',
  'hot', 'pot', 'dot', 'got', 'lot', 'bed', 'red', 'led', 'fed', 'wed',
  'cup', 'pup', 'up', 'bus', 'us', 'bug', 'hug', 'mug', 'rug', 'tug'
]

// Home row words
const homeRowWords = [
  'dad', 'sad', 'add', 'fad', 'lad', 'ask', 'all', 'fall', 'hall', 'tall',
  'salad', 'flask', 'slash', 'flash', 'class', 'glass', 'grass', 'shall'
]

// Common words by grade
const gradeWords = {
  1: ['the', 'and', 'is', 'it', 'to', 'in', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they'],
  2: ['have', 'from', 'this', 'that', 'will', 'one', 'said', 'what', 'there', 'when', 'your', 'been', 'has'],
  3: ['about', 'would', 'could', 'other', 'their', 'which', 'these', 'first', 'water', 'called', 'people'],
  4: ['through', 'between', 'different', 'important', 'because', 'another', 'something', 'thought'],
  5: ['government', 'development', 'environment', 'information', 'understanding', 'experience'],
  6: ['professional', 'responsibility', 'communication', 'organization', 'achievement'],
  7: ['characteristics', 'circumstances', 'administration', 'representative', 'determination']
}

// Sentences by grade
const gradeSentences = {
  2: [
    'The cat sat on the mat.',
    'I like to run and play.',
    'My dog is very big.',
    'We had fun at the park.',
    'She has a red hat.'
  ],
  3: [
    'The quick brown fox jumps over the lazy dog.',
    'I can type fast if I practice every day.',
    'My favorite subject in school is reading.',
    'We went to the zoo and saw many animals.',
    'The sun is shining bright today.'
  ],
  4: [
    'Practice makes perfect when learning to type.',
    'Keep your fingers on the home row keys.',
    'The keyboard has many different keys to learn.',
    'Speed and accuracy are both important skills.',
    'Touch typing means not looking at the keyboard.'
  ],
  5: [
    'Professional typists can type over sixty words per minute.',
    'The quick brown fox jumps over the lazy dog contains every letter.',
    'Proper finger placement helps you type faster and more accurately.',
    'Regular practice sessions will improve your typing speed significantly.',
    'Learning keyboard shortcuts can save you a lot of time.'
  ],
  6: [
    'Developing strong typing skills is essential for success in the modern workplace.',
    'Efficient keyboard use requires consistent practice and proper technique.',
    'The ability to type without looking at the keyboard is called touch typing.',
    'Maintaining good posture while typing helps prevent strain and injury.',
    'Professional documents require both speed and accuracy in typing.'
  ],
  7: [
    'Mastering the keyboard is a fundamental skill for academic and professional success.',
    'The development of typing proficiency requires dedication and consistent practice.',
    'Understanding proper ergonomics can significantly improve your typing experience.',
    'Advanced typists develop muscle memory that allows for effortless text entry.',
    'The transition from hunt-and-peck to touch typing dramatically increases productivity.'
  ]
}

// Generate a single typing item
function generateTypingItem(grade, skill, skillCode, itemNum, data) {
  const id = `TYPE-G${grade}-${skillCode}-${String(itemNum).padStart(4, '0')}`

  return {
    id,
    subject: 'typing',
    grade,
    skill,
    standard: `WPM-G${grade}`,
    question: data.question,
    answer: data.answer,
    tier1: {
      teach: data.tier1Teach,
      steps: data.tier1Steps
    },
    tier2: {
      teach: data.tier2Teach,
      steps: data.tier2Steps
    },
    visual_type: 'keyboard',
    visual_data: data.visualData
  }
}

// Generate keyboard visual
function keyboardVisual(highlightKeys, targetKey, fingerToUse, showHomeRow = true) {
  return {
    type: 'keyboard',
    data: {
      highlight_keys: highlightKeys,
      finger_labels: true,
      home_row: showHomeRow,
      target_key: targetKey,
      finger_to_use: fingerToUse
    }
  }
}

// Generate Kindergarten content (finding letters, spacebar)
function generateKindergarten() {
  const items = []
  let itemNum = 1

  // Finding individual letters (A-Z)
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

  for (const letter of alphabet) {
    const finger = fingerMap[letter] || 'finger'

    // Find the letter
    items.push(generateTypingItem(0, 'finding letters', 'FIND', itemNum++, {
      question: `Find and press the letter ${letter.toUpperCase()} on the keyboard.`,
      answer: letter,
      tier1Teach: `Look at the keyboard. Find the letter ${letter.toUpperCase()}. It is pressed with your ${finger}.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([letter], letter, finger),
          voice_text: `Find the letter ${letter.toUpperCase()}. It is highlighted on the keyboard.`,
          duration: 4000
        },
        {
          step: 2,
          visual: keyboardVisual([letter], letter, finger),
          voice_text: `Press ${letter.toUpperCase()} with your ${finger}.`,
          duration: 3000
        }
      ],
      tier2Teach: `${letter.toUpperCase()} is highlighted. Press it now.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([letter], letter, finger),
          voice_text: `Press the lit up key. That is ${letter.toUpperCase()}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([letter], letter, finger).data
    }))

    // Type the letter 3 times
    items.push(generateTypingItem(0, 'letter practice', 'FIND', itemNum++, {
      question: `Type the letter ${letter.toUpperCase()} three times: ${letter}${letter}${letter}`,
      answer: `${letter}${letter}${letter}`,
      tier1Teach: `Press ${letter.toUpperCase()} three times in a row. Use your ${finger}.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([letter], letter, finger),
          voice_text: `Press ${letter.toUpperCase()} once.`,
          duration: 3000
        },
        {
          step: 2,
          visual: keyboardVisual([letter], letter, finger),
          voice_text: `Press it again. And one more time.`,
          duration: 3000
        }
      ],
      tier2Teach: `Just press ${letter.toUpperCase()} three times.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([letter], letter, finger),
          voice_text: `${letter.toUpperCase()}, ${letter.toUpperCase()}, ${letter.toUpperCase()}. Three times.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([letter], letter, finger).data
    }))
  }

  // Spacebar practice
  for (let i = 0; i < 20; i++) {
    items.push(generateTypingItem(0, 'spacebar', 'SPCE', itemNum++, {
      question: 'Press the SPACEBAR (the long bar at the bottom).',
      answer: ' ',
      tier1Teach: 'The spacebar is the long key at the bottom. Press it with your thumb.',
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([' '], ' ', 'thumb'),
          voice_text: 'Find the long bar at the bottom. That is the spacebar.',
          duration: 4000
        },
        {
          step: 2,
          visual: keyboardVisual([' '], ' ', 'thumb'),
          voice_text: 'Press it with your thumb.',
          duration: 3000
        }
      ],
      tier2Teach: 'Push the big long key with your thumb.',
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([' '], ' ', 'thumb'),
          voice_text: 'The spacebar makes a space. Press it now.',
          duration: 5000
        }
      ],
      visualData: keyboardVisual([' '], ' ', 'thumb').data
    }))
  }

  // Enter key practice
  for (let i = 0; i < 20; i++) {
    items.push(generateTypingItem(0, 'enter key', 'ENTR', itemNum++, {
      question: 'Press the ENTER key (the big key on the right).',
      answer: '\n',
      tier1Teach: 'The enter key is on the right side. Press it with your right pinky.',
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(['enter'], 'enter', 'right pinky'),
          voice_text: 'Find the big enter key on the right side.',
          duration: 4000
        },
        {
          step: 2,
          visual: keyboardVisual(['enter'], 'enter', 'right pinky'),
          voice_text: 'Press it with your right pinky finger.',
          duration: 3000
        }
      ],
      tier2Teach: 'Push the big key on the right.',
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual(['enter'], 'enter', 'right pinky'),
          voice_text: 'The enter key is highlighted. Press it.',
          duration: 5000
        }
      ],
      visualData: keyboardVisual(['enter'], 'enter', 'right pinky').data
    }))
  }

  // Simple CVC words
  for (const word of simpleWords) {
    const letters = word.split('')
    items.push(generateTypingItem(0, 'simple words', 'FIND', itemNum++, {
      question: `Type the word: ${word}`,
      answer: word,
      tier1Teach: `Type each letter one at a time: ${letters.join('-')}.`,
      tier1Steps: letters.slice(0, 2).map((letter, idx) => ({
        step: idx + 1,
        visual: keyboardVisual([letter], letter, fingerMap[letter] || 'finger'),
        voice_text: `Press ${letter.toUpperCase()}.`,
        duration: 3000
      })),
      tier2Teach: `Just type ${word}. One letter at a time.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([letters[0]], letters[0], fingerMap[letters[0]] || 'finger'),
          voice_text: `Type ${word}. Start with ${letters[0].toUpperCase()}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([letters[0]], letters[0], fingerMap[letters[0]] || 'finger').data
    }))
  }

  // Name typing (common names)
  const names = ['mom', 'dad', 'sam', 'max', 'ben', 'tom', 'bob', 'kim', 'amy', 'joe']
  for (const name of names) {
    items.push(generateTypingItem(0, 'name typing', 'FIND', itemNum++, {
      question: `Type the name: ${name}`,
      answer: name,
      tier1Teach: `Type ${name}. Press each letter.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([name[0]], name[0], fingerMap[name[0]] || 'finger'),
          voice_text: `Start with ${name[0].toUpperCase()}.`,
          duration: 3000
        }
      ],
      tier2Teach: `Type ${name}.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([name[0]], name[0], fingerMap[name[0]] || 'finger'),
          voice_text: `${name}. Just type it.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([name[0]], name[0], fingerMap[name[0]] || 'finger').data
    }))
  }

  // Letter sequences (aa, bb, cc, etc.)
  for (const letter of alphabet.slice(0, 10)) {
    items.push(generateTypingItem(0, 'letter sequences', 'FIND', itemNum++, {
      question: `Type: ${letter}${letter}${letter}${letter}`,
      answer: `${letter}${letter}${letter}${letter}`,
      tier1Teach: `Press ${letter.toUpperCase()} four times.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([letter], letter, fingerMap[letter]),
          voice_text: `Press ${letter.toUpperCase()} four times in a row.`,
          duration: 4000
        }
      ],
      tier2Teach: `Just press ${letter.toUpperCase()} four times.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([letter], letter, fingerMap[letter]),
          voice_text: `${letter.toUpperCase()}, ${letter.toUpperCase()}, ${letter.toUpperCase()}, ${letter.toUpperCase()}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([letter], letter, fingerMap[letter]).data
    }))
  }

  // Two letter combos (ab, cd, etc.)
  const combos = ['ab', 'cd', 'ef', 'gh', 'hi', 'jk', 'lm', 'no', 'pq', 'rs', 'tu', 'vw', 'xy']
  for (const combo of combos) {
    items.push(generateTypingItem(0, 'letter combos', 'FIND', itemNum++, {
      question: `Type: ${combo}`,
      answer: combo,
      tier1Teach: `Type ${combo[0].toUpperCase()} then ${combo[1].toUpperCase()}.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([combo[0]], combo[0], fingerMap[combo[0]]),
          voice_text: `First press ${combo[0].toUpperCase()}.`,
          duration: 3000
        },
        {
          step: 2,
          visual: keyboardVisual([combo[1]], combo[1], fingerMap[combo[1]]),
          voice_text: `Then press ${combo[1].toUpperCase()}.`,
          duration: 3000
        }
      ],
      tier2Teach: `Press ${combo[0].toUpperCase()}, then ${combo[1].toUpperCase()}.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([combo[0], combo[1]], combo[0], fingerMap[combo[0]]),
          voice_text: `${combo[0].toUpperCase()} and ${combo[1].toUpperCase()}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([combo[0], combo[1]], combo[0], fingerMap[combo[0]]).data
    }))
  }

  // Fill to 1000 with more letter practice
  while (items.length < 1000) {
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)]
    const repeatCount = Math.floor(Math.random() * 3) + 2
    const answer = letter.repeat(repeatCount)

    items.push(generateTypingItem(0, 'letter practice', 'FIND', itemNum++, {
      question: `Type: ${answer}`,
      answer: answer,
      tier1Teach: `Press ${letter.toUpperCase()} ${repeatCount} times.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([letter], letter, fingerMap[letter]),
          voice_text: `Find ${letter.toUpperCase()} and press it ${repeatCount} times.`,
          duration: 4000
        }
      ],
      tier2Teach: `Press ${letter.toUpperCase()} ${repeatCount} times.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([letter], letter, fingerMap[letter]),
          voice_text: `${letter.toUpperCase()}, ${repeatCount} times.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([letter], letter, fingerMap[letter]).data
    }))
  }

  return items.slice(0, 1000)
}

// Generate Grade 1 content (home row focus)
function generateGrade1() {
  const items = []
  let itemNum = 1

  // Home row keys individual practice
  for (const key of homeRow) {
    // Single key
    for (let i = 0; i < 5; i++) {
      items.push(generateTypingItem(1, 'home row keys', 'HOME', itemNum++, {
        question: `Press the home row key: ${key.toUpperCase()}`,
        answer: key,
        tier1Teach: `${key.toUpperCase()} is on the home row. Your ${fingerMap[key]} rests here.`,
        tier1Steps: [
          {
            step: 1,
            visual: keyboardVisual(homeRow, key, fingerMap[key]),
            voice_text: `The home row is highlighted. Find ${key.toUpperCase()}.`,
            duration: 4000
          },
          {
            step: 2,
            visual: keyboardVisual([key], key, fingerMap[key]),
            voice_text: `Press ${key.toUpperCase()} with your ${fingerMap[key]}.`,
            duration: 3000
          }
        ],
        tier2Teach: `Press ${key.toUpperCase()}. It is on the home row.`,
        tier2Steps: [
          {
            step: 1,
            visual: keyboardVisual([key], key, fingerMap[key]),
            voice_text: `${key.toUpperCase()} is lit up. Press it.`,
            duration: 5000
          }
        ],
        visualData: keyboardVisual(homeRow, key, fingerMap[key]).data
      }))
    }

    // Repeated key
    items.push(generateTypingItem(1, 'home row keys', 'HOME', itemNum++, {
      question: `Type: ${key}${key}${key}${key}`,
      answer: `${key}${key}${key}${key}`,
      tier1Teach: `Press ${key.toUpperCase()} four times without looking.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([key], key, fingerMap[key]),
          voice_text: `Your ${fingerMap[key]} stays on ${key.toUpperCase()}. Press it 4 times.`,
          duration: 4000
        }
      ],
      tier2Teach: `Just press ${key.toUpperCase()} four times.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([key], key, fingerMap[key]),
          voice_text: `${key.toUpperCase()}, ${key.toUpperCase()}, ${key.toUpperCase()}, ${key.toUpperCase()}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([key], key, fingerMap[key]).data
    }))
  }

  // Home row combinations
  const homeRowCombos = ['asdf', 'jkl;', 'asd', 'jkl', 'fdsa', ';lkj', 'asdfg', 'hjkl;']
  for (const combo of homeRowCombos) {
    items.push(generateTypingItem(1, 'home row sequence', 'HOME', itemNum++, {
      question: `Type the home row sequence: ${combo}`,
      answer: combo,
      tier1Teach: `Type ${combo}. Keep your fingers on the home row.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(homeRow, combo[0], fingerMap[combo[0]]),
          voice_text: `Start with ${combo[0].toUpperCase()}. Then type the rest in order.`,
          duration: 4000
        }
      ],
      tier2Teach: `Type ${combo}. One key at a time.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual(combo.split(''), combo[0], fingerMap[combo[0]]),
          voice_text: `Follow the highlighted keys.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(homeRow, combo[0], fingerMap[combo[0]]).data
    }))
  }

  // Home row words
  for (const word of homeRowWords) {
    items.push(generateTypingItem(1, 'home row words', 'HOME', itemNum++, {
      question: `Type the home row word: ${word}`,
      answer: word,
      tier1Teach: `${word} uses only home row keys. Type each letter.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(homeRow, word[0], fingerMap[word[0]]),
          voice_text: `Type ${word}. All the letters are on the home row.`,
          duration: 4000
        }
      ],
      tier2Teach: `Type ${word}. Keep fingers on home row.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual(word.split(''), word[0], fingerMap[word[0]]),
          voice_text: `${word}. Just type it.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(homeRow, word[0], fingerMap[word[0]]).data
    }))
  }

  // Finger placement exercises
  const fingerGroups = [
    { name: 'left hand', keys: ['a', 's', 'd', 'f'] },
    { name: 'right hand', keys: ['j', 'k', 'l', ';'] }
  ]

  for (const group of fingerGroups) {
    for (let i = 0; i < 20; i++) {
      const sequence = group.keys.join('')
      items.push(generateTypingItem(1, 'finger placement', 'HOME', itemNum++, {
        question: `Type with your ${group.name}: ${sequence}`,
        answer: sequence,
        tier1Teach: `Use your ${group.name} to type ${sequence}.`,
        tier1Steps: [
          {
            step: 1,
            visual: keyboardVisual(group.keys, group.keys[0], fingerMap[group.keys[0]]),
            voice_text: `Your ${group.name} covers these keys. Type them in order.`,
            duration: 4000
          }
        ],
        tier2Teach: `Type ${sequence} with your ${group.name}.`,
        tier2Steps: [
          {
            step: 1,
            visual: keyboardVisual(group.keys, group.keys[0], fingerMap[group.keys[0]]),
            voice_text: `${sequence}. One finger at a time.`,
            duration: 5000
          }
        ],
        visualData: keyboardVisual(group.keys, group.keys[0], fingerMap[group.keys[0]]).data
      }))
    }
  }

  // Spacebar with home row
  for (let i = 0; i < 30; i++) {
    const word = homeRowWords[Math.floor(Math.random() * homeRowWords.length)]
    items.push(generateTypingItem(1, 'spacebar practice', 'SPCE', itemNum++, {
      question: `Type with a space: ${word} ${word}`,
      answer: `${word} ${word}`,
      tier1Teach: `Type ${word}, press spacebar, type ${word} again.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([...homeRow, ' '], word[0], fingerMap[word[0]]),
          voice_text: `Type ${word}. Then press spacebar with your thumb.`,
          duration: 4000
        },
        {
          step: 2,
          visual: keyboardVisual([' '], ' ', 'thumb'),
          voice_text: `Now type ${word} again.`,
          duration: 3000
        }
      ],
      tier2Teach: `${word} space ${word}. Use thumb for space.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([' '], ' ', 'thumb'),
          voice_text: `Type the words with a space between them.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([...homeRow, ' '], ' ', 'thumb').data
    }))
  }

  // Common words
  for (const word of gradeWords[1]) {
    items.push(generateTypingItem(1, 'common words', 'HOME', itemNum++, {
      question: `Type the common word: ${word}`,
      answer: word,
      tier1Teach: `Type ${word}. It is a very common word.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(word.split('').slice(0, 4), word[0], fingerMap[word[0]]),
          voice_text: `Type ${word}. Start with ${word[0].toUpperCase()}.`,
          duration: 4000
        }
      ],
      tier2Teach: `Just type ${word}.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([word[0]], word[0], fingerMap[word[0]]),
          voice_text: `${word}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([word[0]], word[0], fingerMap[word[0]]).data
    }))
  }

  // Fill to 1500
  while (items.length < 1500) {
    const word = [...homeRowWords, ...gradeWords[1]][Math.floor(Math.random() * (homeRowWords.length + gradeWords[1].length))]
    items.push(generateTypingItem(1, 'word practice', 'HOME', itemNum++, {
      question: `Type: ${word}`,
      answer: word,
      tier1Teach: `Type ${word}. Keep fingers on home row.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(homeRow, word[0], fingerMap[word[0]] || 'finger'),
          voice_text: `Type ${word}.`,
          duration: 4000
        }
      ],
      tier2Teach: `Type ${word}.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger'),
          voice_text: `${word}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(homeRow, word[0], fingerMap[word[0]] || 'finger').data
    }))
  }

  return items.slice(0, 1500)
}

// Generate Grade 2 content (all letters, capitals, basic punctuation)
function generateGrade2() {
  const items = []
  let itemNum = 1

  // Top row practice
  for (const key of topRow) {
    items.push(generateTypingItem(2, 'top row keys', 'TOP', itemNum++, {
      question: `Press the top row key: ${key.toUpperCase()}`,
      answer: key,
      tier1Teach: `${key.toUpperCase()} is on the top row. Reach up from home row.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(topRow, key, fingerMap[key]),
          voice_text: `Find ${key.toUpperCase()} on the top row.`,
          duration: 4000
        },
        {
          step: 2,
          visual: keyboardVisual([key], key, fingerMap[key]),
          voice_text: `Press it with your ${fingerMap[key]}.`,
          duration: 3000
        }
      ],
      tier2Teach: `Press ${key.toUpperCase()} on the top row.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([key], key, fingerMap[key]),
          voice_text: `${key.toUpperCase()} is highlighted. Press it.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(topRow, key, fingerMap[key]).data
    }))
  }

  // Bottom row practice
  for (const key of bottomRow) {
    items.push(generateTypingItem(2, 'bottom row keys', 'BOT', itemNum++, {
      question: `Press the bottom row key: ${key}`,
      answer: key,
      tier1Teach: `${key.toUpperCase()} is on the bottom row. Reach down from home row.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(bottomRow, key, fingerMap[key]),
          voice_text: `Find ${key} on the bottom row.`,
          duration: 4000
        },
        {
          step: 2,
          visual: keyboardVisual([key], key, fingerMap[key]),
          voice_text: `Press it with your ${fingerMap[key]}.`,
          duration: 3000
        }
      ],
      tier2Teach: `Press ${key} on the bottom row.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([key], key, fingerMap[key]),
          voice_text: `${key} is highlighted. Press it.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(bottomRow, key, fingerMap[key]).data
    }))
  }

  // Capital letters with shift
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  for (const letter of alphabet.slice(0, 13)) {
    items.push(generateTypingItem(2, 'capital letters', 'SHFT', itemNum++, {
      question: `Type a capital letter: ${letter.toUpperCase()}`,
      answer: letter.toUpperCase(),
      tier1Teach: `Hold SHIFT and press ${letter.toUpperCase()} to make a capital letter.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(['shift', letter], 'shift', 'pinky'),
          voice_text: `Hold SHIFT with your pinky.`,
          duration: 3000
        },
        {
          step: 2,
          visual: keyboardVisual([letter], letter, fingerMap[letter]),
          voice_text: `While holding SHIFT, press ${letter.toUpperCase()}.`,
          duration: 3000
        }
      ],
      tier2Teach: `SHIFT + ${letter.toUpperCase()} makes a capital.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual(['shift', letter], letter, fingerMap[letter]),
          voice_text: `Hold SHIFT and press ${letter.toUpperCase()}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(['shift', letter], letter, fingerMap[letter]).data
    }))
  }

  // Basic punctuation
  const punctuation = ['.', ',', '!', '?']
  for (const p of punctuation) {
    for (let i = 0; i < 10; i++) {
      items.push(generateTypingItem(2, 'punctuation', 'PUNC', itemNum++, {
        question: `Type the punctuation mark: ${p}`,
        answer: p,
        tier1Teach: `The ${p} is used at the end of sentences.`,
        tier1Steps: [
          {
            step: 1,
            visual: keyboardVisual([p], p, fingerMap[p] || 'right pinky'),
            voice_text: `Find ${p} and press it.`,
            duration: 4000
          }
        ],
        tier2Teach: `Press ${p}.`,
        tier2Steps: [
          {
            step: 1,
            visual: keyboardVisual([p], p, fingerMap[p] || 'right pinky'),
            voice_text: `${p} is highlighted.`,
            duration: 5000
          }
        ],
        visualData: keyboardVisual([p], p, fingerMap[p] || 'right pinky').data
      }))
    }
  }

  // Simple sentences
  for (const sentence of gradeSentences[2]) {
    items.push(generateTypingItem(2, 'sentences', 'SENT', itemNum++, {
      question: `Type the sentence: ${sentence}`,
      answer: sentence,
      tier1Teach: `Type the sentence. Start with a capital. End with punctuation.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(['shift'], 'shift', 'pinky'),
          voice_text: `Start with SHIFT for the capital letter.`,
          duration: 3000
        },
        {
          step: 2,
          visual: keyboardVisual(['.'], '.', 'right ring'),
          voice_text: `End with the period.`,
          duration: 3000
        }
      ],
      tier2Teach: `Type: ${sentence}`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual(homeRow, sentence[0].toLowerCase(), fingerMap[sentence[0].toLowerCase()]),
          voice_text: `Just type the sentence.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(homeRow, sentence[0].toLowerCase(), fingerMap[sentence[0].toLowerCase()]).data
    }))
  }

  // Words with all rows
  const allRowWords = ['quick', 'jump', 'zebra', 'extra', 'prize', 'glove', 'black', 'brown', 'cream', 'dream']
  for (const word of allRowWords) {
    items.push(generateTypingItem(2, 'all letter rows', 'TOP', itemNum++, {
      question: `Type: ${word}`,
      answer: word,
      tier1Teach: `Type ${word}. Use all three rows of letters.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([...homeRow, ...topRow, ...bottomRow], word[0], fingerMap[word[0]]),
          voice_text: `Type ${word}. Move your fingers to reach all the letters.`,
          duration: 4000
        }
      ],
      tier2Teach: `Type ${word}.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual(word.split(''), word[0], fingerMap[word[0]]),
          voice_text: `${word}. One letter at a time.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(word.split(''), word[0], fingerMap[word[0]]).data
    }))
  }

  // Fill to 2000
  const allWords = [...gradeWords[2], ...allRowWords, 'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out']
  while (items.length < 2000) {
    const word = allWords[Math.floor(Math.random() * allWords.length)]
    items.push(generateTypingItem(2, 'word practice', 'TOP', itemNum++, {
      question: `Type: ${word}`,
      answer: word,
      tier1Teach: `Type ${word}.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger'),
          voice_text: `Type ${word}.`,
          duration: 4000
        }
      ],
      tier2Teach: `Type ${word}.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger'),
          voice_text: `${word}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger').data
    }))
  }

  return items.slice(0, 2000)
}

// Generate Grade 3-7 content (simplified for higher grades)
function generateHigherGrade(grade, target, skillFocus, sentences, words) {
  const items = []
  let itemNum = 1

  // Number row for grade 3
  if (grade === 3) {
    for (const num of numberRow) {
      for (let i = 0; i < 5; i++) {
        items.push(generateTypingItem(grade, 'number keys', 'NUMS', itemNum++, {
          question: `Type the number: ${num}`,
          answer: num,
          tier1Teach: `${num} is on the number row. Reach up from home row.`,
          tier1Steps: [
            {
              step: 1,
              visual: keyboardVisual(numberRow, num, fingerMap[num]),
              voice_text: `Find ${num} on the top row.`,
              duration: 4000
            }
          ],
          tier2Teach: `Press ${num}.`,
          tier2Steps: [
            {
              step: 1,
              visual: keyboardVisual([num], num, fingerMap[num]),
              voice_text: `${num} is highlighted.`,
              duration: 5000
            }
          ],
          visualData: keyboardVisual(numberRow, num, fingerMap[num]).data
        }))
      }
    }
  }

  // Sentences
  for (const sentence of sentences) {
    items.push(generateTypingItem(grade, skillFocus, 'SENT', itemNum++, {
      question: `Type: ${sentence}`,
      answer: sentence,
      tier1Teach: `Type accurately. Watch your capitalization and punctuation.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual(homeRow, sentence[0].toLowerCase(), fingerMap[sentence[0].toLowerCase()] || 'finger'),
          voice_text: `Type the sentence carefully.`,
          duration: 4000
        }
      ],
      tier2Teach: `Type the sentence.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual(homeRow, sentence[0].toLowerCase(), fingerMap[sentence[0].toLowerCase()] || 'finger'),
          voice_text: `Just type it.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual(homeRow, sentence[0].toLowerCase(), fingerMap[sentence[0].toLowerCase()] || 'finger').data
    }))
  }

  // Words
  for (const word of words) {
    items.push(generateTypingItem(grade, skillFocus, 'WORD', itemNum++, {
      question: `Type: ${word}`,
      answer: word,
      tier1Teach: `Type ${word} accurately.`,
      tier1Steps: [
        {
          step: 1,
          visual: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger'),
          voice_text: `Type ${word}.`,
          duration: 4000
        }
      ],
      tier2Teach: `Type ${word}.`,
      tier2Steps: [
        {
          step: 1,
          visual: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger'),
          voice_text: `${word}.`,
          duration: 5000
        }
      ],
      visualData: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger').data
    }))
  }

  // Fill remaining with mixed practice
  while (items.length < target) {
    const useWord = Math.random() > 0.3
    if (useWord) {
      const word = words[Math.floor(Math.random() * words.length)]
      items.push(generateTypingItem(grade, skillFocus, 'WORD', itemNum++, {
        question: `Type: ${word}`,
        answer: word,
        tier1Teach: `Type ${word}.`,
        tier1Steps: [
          {
            step: 1,
            visual: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger'),
            voice_text: `Type ${word}.`,
            duration: 4000
          }
        ],
        tier2Teach: `${word}.`,
        tier2Steps: [
          {
            step: 1,
            visual: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger'),
            voice_text: `${word}.`,
            duration: 5000
          }
        ],
        visualData: keyboardVisual([word[0]], word[0], fingerMap[word[0]] || 'finger').data
      }))
    } else {
      const sentence = sentences[Math.floor(Math.random() * sentences.length)]
      items.push(generateTypingItem(grade, skillFocus, 'SENT', itemNum++, {
        question: `Type: ${sentence}`,
        answer: sentence,
        tier1Teach: `Type accurately.`,
        tier1Steps: [
          {
            step: 1,
            visual: keyboardVisual(homeRow, 't', 'left index'),
            voice_text: `Type the sentence.`,
            duration: 4000
          }
        ],
        tier2Teach: `Type it.`,
        tier2Steps: [
          {
            step: 1,
            visual: keyboardVisual(homeRow, 't', 'left index'),
            voice_text: `Type.`,
            duration: 5000
          }
        ],
        visualData: keyboardVisual(homeRow, 't', 'left index').data
      }))
    }
  }

  return items.slice(0, target)
}

// Main execution
async function main() {
  console.log('\n=== GENERATING TYPING CONTENT ===\n')

  // Generate content for each grade
  const allItems = []

  console.log('Generating Kindergarten (1,000 items)...')
  const kItems = generateKindergarten()
  allItems.push(...kItems)
  console.log(`  Generated: ${kItems.length} items`)

  console.log('Generating Grade 1 (1,500 items)...')
  const g1Items = generateGrade1()
  allItems.push(...g1Items)
  console.log(`  Generated: ${g1Items.length} items`)

  console.log('Generating Grade 2 (2,000 items)...')
  const g2Items = generateGrade2()
  allItems.push(...g2Items)
  console.log(`  Generated: ${g2Items.length} items`)

  console.log('Generating Grade 3 (2,000 items)...')
  const g3Items = generateHigherGrade(3, 2000, 'number row', gradeSentences[3], gradeWords[3])
  allItems.push(...g3Items)
  console.log(`  Generated: ${g3Items.length} items`)

  console.log('Generating Grade 4 (1,500 items)...')
  const g4Items = generateHigherGrade(4, 1500, 'speed building', gradeSentences[4], gradeWords[4])
  allItems.push(...g4Items)
  console.log(`  Generated: ${g4Items.length} items`)

  console.log('Generating Grade 5 (1,000 items)...')
  const g5Items = generateHigherGrade(5, 1000, 'fluency', gradeSentences[5], gradeWords[5])
  allItems.push(...g5Items)
  console.log(`  Generated: ${g5Items.length} items`)

  console.log('Generating Grade 6 (1,000 items)...')
  const g6Items = generateHigherGrade(6, 1000, 'professional typing', gradeSentences[6], gradeWords[6])
  allItems.push(...g6Items)
  console.log(`  Generated: ${g6Items.length} items`)

  console.log('Generating Grade 7 (500 items)...')
  const g7Items = generateHigherGrade(7, 500, 'advanced typing', gradeSentences[7], gradeWords[7])
  allItems.push(...g7Items)
  console.log(`  Generated: ${g7Items.length} items`)

  console.log(`\nTotal generated: ${allItems.length} items`)

  // Upload to database in batches
  console.log('\nUploading to database...')
  const batchSize = 500
  let uploaded = 0
  let errors = 0

  for (let i = 0; i < allItems.length; i += batchSize) {
    const batch = allItems.slice(i, i + batchSize)

    const { error } = await supabase
      .from('practice_problems')
      .upsert(batch, { onConflict: 'id' })

    if (error) {
      console.error(`  Batch ${Math.floor(i/batchSize) + 1} error:`, error.message)
      errors++
    } else {
      uploaded += batch.length
      console.log(`  Uploaded: ${uploaded}/${allItems.length}`)
    }
  }

  // Verify
  console.log('\nVerifying upload...')
  const { count } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'typing')

  console.log(`\n=== COMPLETE ===`)
  console.log(`  Generated: ${allItems.length}`)
  console.log(`  Uploaded: ${uploaded}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  In database: ${count}`)
}

main().catch(console.error)
