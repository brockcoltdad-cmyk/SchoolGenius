export const FOUNDATION_TOPICS = {
  math: {
    name: 'Math Foundations',
    icon: '🔢',
    grades: {
      'K-2': [
        { id: 'counting', name: 'Counting 1-100', description: 'Count forward and backward', rules: ['Count from 1 to 20', 'Count from 1 to 50', 'Count from 1 to 100', 'Skip count by 2s, 5s, 10s'] },
        { id: 'addition-facts', name: 'Addition Facts', description: 'Adding numbers 0-10', rules: ['Adding 0', 'Adding 1', 'Doubles', 'Making 10'] },
        { id: 'subtraction-facts', name: 'Subtraction Facts', description: 'Subtracting numbers 0-10', rules: ['Subtracting 0', 'Subtracting 1', 'Fact families'] }
      ],
      '3-5': [
        { id: 'multiplication-facts', name: 'Multiplication Facts', description: 'Times tables 1-12', rules: ['x1 facts', 'x2 facts', 'x5 facts', 'x10 facts'] },
        { id: 'division-facts', name: 'Division Facts', description: 'Division with times tables', rules: ['Division as reverse multiplication', 'Dividing by 1', 'Fact families'] }
      ]
    }
  },
  reading: {
    name: 'Reading Foundations',
    icon: '📚',
    grades: {
      'K-2': [
        { id: 'phonics-consonants', name: 'Consonant Sounds', description: 'Letter sounds for consonants', rules: ['B, C, D, F, G sounds', 'Hard and soft C', 'Hard and soft G'] },
        { id: 'phonics-vowels', name: 'Vowel Sounds', description: 'Short and long vowels', rules: ['Short A, E, I, O, U', 'Long vowels with silent E', 'Vowel teams'] },
        { id: 'sight-words', name: 'Sight Words', description: 'Common words to memorize', rules: ['the, a, is, it, in', 'you, he, she, we, they'] }
      ]
    }
  }
}

export function getTopicsForGrade(subject: string, grade: number): any[] {
  const subjectData = FOUNDATION_TOPICS[subject as keyof typeof FOUNDATION_TOPICS]
  if (!subjectData) return []
  if (grade <= 2) return subjectData.grades['K-2'] || []
  if (grade <= 5) return subjectData.grades['3-5'] || []
  return []
}

export function getGradeBand(grade: number): string {
  if (grade <= 2) return 'K-2'
  if (grade <= 5) return '3-5'
  if (grade <= 8) return '6-8'
  return '9-12'
}
