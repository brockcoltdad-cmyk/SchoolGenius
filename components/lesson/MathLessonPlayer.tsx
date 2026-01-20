'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, CheckCircle, XCircle, RotateCcw, Sparkles, Lightbulb, ChevronRight, Play } from 'lucide-react';
import { Celebration } from '@/components/RiveAnimation';
import ThemeMascot from '@/components/ThemeMascot';
import { useTheme } from '@/lib/theme-context';
import { createClient } from '@/lib/supabase/client';
import { useMathLesson } from '@/hooks/useMathLesson';

// Import all math visuals
import {
  CountingObjectsVisual,
  NumberLineVisual,
  FractionVisual,
  ArrayVisual,
  PlaceValueVisual,
  BarModelVisual,
  BalanceScaleVisual,
  EquationStepsVisual
} from '@/components/lesson/visuals';

// Math problem types mapped to visual components
type MathVisualType = 'counting' | 'number_line' | 'fraction' | 'array' | 'place_value' | 'bar_model' | 'balance' | 'equation' | 'none';

// Tier explanation structure (max 25 words for tier1, 20 words for tier2)
interface TierExplanation {
  teach: string;        // Max 25 words (tier1) or 20 words (tier2)
  visual?: any;         // Visual data for explanation
  voice_text?: string;  // Max 20 words (tier1) or 15 words (tier2)
}

interface MathProblem {
  question: string;
  answer: number | string;
  options?: (number | string)[]; // For multiple choice (K-2)
  visualType: MathVisualType;
  visualData: any;
  explanation: string;
  // Tier1: First wrong answer - standard explanation (25 words max)
  tier1?: TierExplanation;
  // Tier2: Second wrong answer - simpler explanation (20 words max)
  tier2?: TierExplanation;
}

interface MathLesson {
  grade: number;
  topic: string;
  rule: string;
  ruleExplanation: string;
  visualType: MathVisualType;
  ruleVisualData: any;
  problems: MathProblem[];
}

// Pre-built lessons for each grade level
const MATH_LESSONS: Record<number, MathLesson[]> = {
  // Kindergarten - Counting and basic addition
  0: [
    {
      grade: 0,
      topic: 'Counting to 10',
      rule: 'Counting Objects',
      ruleExplanation: 'When we count, we point to each thing and say a number. We count: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Each thing gets ONE number!',
      visualType: 'counting',
      ruleVisualData: { emoji: '🍎', groups: [5], operation: 'count', show_equation: true },
      problems: [
        {
          question: 'How many apples are there?',
          answer: 3,
          options: [2, 3, 4, 5],
          visualType: 'counting',
          visualData: { emoji: '🍎', groups: [3], operation: 'count', show_equation: false },
          explanation: 'Count each apple: 1, 2, 3. There are 3 apples!',
          // Tier1: First wrong answer - 25 words max
          tier1: {
            teach: 'Point to each apple and count out loud: one, two, three. The answer is 3!',
            visual: { emoji: '🍎', groups: [3], operation: 'count', show_equation: true, highlight: true },
            voice_text: 'Count with me: one, two, three apples!'
          },
          // Tier2: Second wrong answer - 20 words, simpler
          tier2: {
            teach: 'Touch each apple. Say the number. 1... 2... 3. Three apples!',
            visual: { emoji: '🍎', groups: [3], operation: 'count', show_equation: true, arrows: true },
            voice_text: 'One, two, three. Three!'
          }
        },
        {
          question: 'How many stars are there?',
          answer: 5,
          options: [4, 5, 6, 7],
          visualType: 'counting',
          visualData: { emoji: '⭐', groups: [5], operation: 'count', show_equation: false },
          explanation: 'Count each star: 1, 2, 3, 4, 5. There are 5 stars!'
        },
        {
          question: 'How many hearts are there?',
          answer: 7,
          options: [5, 6, 7, 8],
          visualType: 'counting',
          visualData: { emoji: '❤️', groups: [7], operation: 'count', show_equation: false },
          explanation: 'Count each heart: 1, 2, 3, 4, 5, 6, 7. There are 7 hearts!'
        }
      ]
    },
    {
      grade: 0,
      topic: 'Adding Numbers',
      rule: 'Addition with Objects',
      ruleExplanation: 'When we ADD, we put groups together and count ALL of them. If you have 2 apples and get 3 more, you have 2 + 3 = 5 apples!',
      visualType: 'counting',
      ruleVisualData: { emoji: '🍎', groups: [2, 3], operation: 'add', show_equation: true },
      problems: [
        {
          question: '2 + 1 = ?',
          answer: 3,
          options: [2, 3, 4, 5],
          visualType: 'counting',
          visualData: { emoji: '🐶', groups: [2, 1], operation: 'add', show_equation: false },
          explanation: 'Put 2 puppies with 1 puppy. Count them all: 1, 2, 3. The answer is 3!'
        },
        {
          question: '3 + 2 = ?',
          answer: 5,
          options: [4, 5, 6, 7],
          visualType: 'counting',
          visualData: { emoji: '🌸', groups: [3, 2], operation: 'add', show_equation: false },
          explanation: 'Put 3 flowers with 2 flowers. Count them all: 1, 2, 3, 4, 5. The answer is 5!'
        },
        {
          question: '4 + 3 = ?',
          answer: 7,
          options: [5, 6, 7, 8],
          visualType: 'counting',
          visualData: { emoji: '🌟', groups: [4, 3], operation: 'add', show_equation: false },
          explanation: 'Put 4 stars with 3 stars. Count them all: 1, 2, 3, 4, 5, 6, 7. The answer is 7!'
        }
      ]
    }
  ],
  // Grade 1 - Addition/Subtraction with number lines
  1: [
    {
      grade: 1,
      topic: 'Adding on a Number Line',
      rule: 'Hop Forward to Add',
      ruleExplanation: 'A number line helps us add! Start at the first number, then HOP forward. Each hop is +1. If you hop 3 times from 4, you land on 7!',
      visualType: 'number_line',
      ruleVisualData: { min: 0, max: 10, start: 4, hops: [{ direction: 'right', amount: 3 }], character: '🐸', show_result: true },
      problems: [
        {
          question: '3 + 4 = ?',
          answer: 7,
          options: [6, 7, 8, 9],
          visualType: 'number_line',
          visualData: { min: 0, max: 10, start: 3, hops: [{ direction: 'right', amount: 4 }], character: '🐸', show_result: false },
          explanation: 'Start at 3, hop 4 times forward. You land on 7!',
          // Tier1: First wrong - 25 words max
          tier1: {
            teach: 'Put your finger on 3. Now hop forward 4 times: 4, 5, 6, 7. You land on 7!',
            visual: { min: 0, max: 10, start: 3, hops: [{ direction: 'right', amount: 4 }], character: '🐸', show_result: true },
            voice_text: 'Start at three. Hop four times. Where do you land?'
          },
          // Tier2: Second wrong - 20 words, simpler
          tier2: {
            teach: 'Count on your fingers from 3: four, five, six, seven. Seven!',
            visual: { min: 0, max: 10, start: 3, hops: [{ direction: 'right', amount: 4 }], character: '🐸', show_result: true, labels: true },
            voice_text: 'Three plus four equals seven!'
          }
        },
        {
          question: '5 + 3 = ?',
          answer: 8,
          options: [7, 8, 9, 10],
          visualType: 'number_line',
          visualData: { min: 0, max: 10, start: 5, hops: [{ direction: 'right', amount: 3 }], character: '🐰', show_result: false },
          explanation: 'Start at 5, hop 3 times forward. You land on 8!'
        },
        {
          question: '2 + 6 = ?',
          answer: 8,
          options: [6, 7, 8, 9],
          visualType: 'number_line',
          visualData: { min: 0, max: 10, start: 2, hops: [{ direction: 'right', amount: 6 }], character: '🦋', show_result: false },
          explanation: 'Start at 2, hop 6 times forward. You land on 8!'
        }
      ]
    },
    {
      grade: 1,
      topic: 'Subtracting on a Number Line',
      rule: 'Hop Backward to Subtract',
      ruleExplanation: 'To subtract, we HOP BACKWARD on the number line! Start at the bigger number, hop back. 7 - 3 means start at 7, hop back 3 times!',
      visualType: 'number_line',
      ruleVisualData: { min: 0, max: 10, start: 7, hops: [{ direction: 'left', amount: 3 }], character: '🐸', show_result: true },
      problems: [
        {
          question: '8 - 3 = ?',
          answer: 5,
          options: [4, 5, 6, 7],
          visualType: 'number_line',
          visualData: { min: 0, max: 10, start: 8, hops: [{ direction: 'left', amount: 3 }], character: '🐸', show_result: false },
          explanation: 'Start at 8, hop 3 times backward. You land on 5!'
        },
        {
          question: '9 - 4 = ?',
          answer: 5,
          options: [4, 5, 6, 7],
          visualType: 'number_line',
          visualData: { min: 0, max: 10, start: 9, hops: [{ direction: 'left', amount: 4 }], character: '🐰', show_result: false },
          explanation: 'Start at 9, hop 4 times backward. You land on 5!'
        },
        {
          question: '7 - 2 = ?',
          answer: 5,
          options: [4, 5, 6, 7],
          visualType: 'number_line',
          visualData: { min: 0, max: 10, start: 7, hops: [{ direction: 'left', amount: 2 }], character: '🦋', show_result: false },
          explanation: 'Start at 7, hop 2 times backward. You land on 5!'
        }
      ]
    }
  ],
  // Grade 2 - Place value and two-digit addition
  2: [
    {
      grade: 2,
      topic: 'Understanding Place Value',
      rule: 'Tens and Ones',
      ruleExplanation: 'In a two-digit number, the LEFT digit shows TENS (groups of 10), and the RIGHT digit shows ONES. In 34, there are 3 tens and 4 ones!',
      visualType: 'place_value',
      ruleVisualData: { number: 34, show_base_ten: true, animate: true },
      problems: [
        {
          question: 'In 25, how many tens are there?',
          answer: 2,
          options: [2, 5, 25, 7],
          visualType: 'place_value',
          visualData: { number: 25, show_base_ten: true, animate: true },
          explanation: 'In 25, the 2 is in the tens place. There are 2 tens (20) and 5 ones!'
        },
        {
          question: 'In 47, how many ones are there?',
          answer: 7,
          options: [4, 7, 47, 11],
          visualType: 'place_value',
          visualData: { number: 47, show_base_ten: true, animate: true },
          explanation: 'In 47, the 7 is in the ones place. There are 4 tens and 7 ones!'
        },
        {
          question: 'What number has 3 tens and 6 ones?',
          answer: 36,
          options: [36, 63, 9, 33],
          visualType: 'place_value',
          visualData: { number: 36, show_base_ten: true, animate: true },
          explanation: '3 tens = 30, plus 6 ones = 36!'
        }
      ]
    }
  ],
  // Grade 3 - Multiplication with arrays
  3: [
    {
      grade: 3,
      topic: 'Understanding Multiplication',
      rule: 'Arrays Show Multiplication',
      ruleExplanation: 'Multiplication is a fast way to add equal groups! 3 × 4 means 3 rows with 4 in each row. We can see this as an ARRAY!',
      visualType: 'array',
      ruleVisualData: { rows: 3, columns: 4, emoji: '⚫', show_equation: true },
      problems: [
        {
          question: '2 × 5 = ?',
          answer: 10,
          options: [7, 10, 15, 25],
          visualType: 'array',
          visualData: { rows: 2, columns: 5, emoji: '🔵', show_equation: false },
          explanation: '2 rows of 5 = 5 + 5 = 10!'
        },
        {
          question: '4 × 3 = ?',
          answer: 12,
          options: [7, 12, 15, 21],
          visualType: 'array',
          visualData: { rows: 4, columns: 3, emoji: '🟢', show_equation: false },
          explanation: '4 rows of 3 = 3 + 3 + 3 + 3 = 12!'
        },
        {
          question: '3 × 6 = ?',
          answer: 18,
          options: [9, 12, 18, 36],
          visualType: 'array',
          visualData: { rows: 3, columns: 6, emoji: '🟣', show_equation: false },
          explanation: '3 rows of 6 = 6 + 6 + 6 = 18!'
        }
      ]
    }
  ],
  // Grade 4 - Fractions
  4: [
    {
      grade: 4,
      topic: 'Understanding Fractions',
      rule: 'Parts of a Whole',
      ruleExplanation: 'A fraction shows PARTS of a whole. The bottom number (denominator) tells how many equal parts. The top number (numerator) tells how many parts we have!',
      visualType: 'fraction',
      ruleVisualData: { type: 'pie', numerator: 3, denominator: 4, label: '3 out of 4 parts are shaded' },
      problems: [
        {
          question: 'What fraction is shaded?',
          answer: '1/2',
          options: ['1/4', '1/2', '2/4', '3/4'],
          visualType: 'fraction',
          visualData: { type: 'pie', numerator: 1, denominator: 2 },
          explanation: '1 out of 2 equal parts is shaded = 1/2!'
        },
        {
          question: 'What fraction is shaded?',
          answer: '2/3',
          options: ['1/3', '2/3', '3/3', '1/2'],
          visualType: 'fraction',
          visualData: { type: 'pie', numerator: 2, denominator: 3 },
          explanation: '2 out of 3 equal parts are shaded = 2/3!'
        },
        {
          question: 'What fraction is shaded?',
          answer: '3/4',
          options: ['1/4', '2/4', '3/4', '4/4'],
          visualType: 'fraction',
          visualData: { type: 'bar', numerator: 3, denominator: 4 },
          explanation: '3 out of 4 equal parts are shaded = 3/4!'
        }
      ]
    }
  ],
  // Grade 5 - Equations and balance
  5: [
    {
      grade: 5,
      topic: 'Solving Equations',
      rule: 'Keep the Balance',
      ruleExplanation: 'An equation is like a balance scale - both sides must be equal! To solve for x, do the SAME thing to BOTH sides to keep it balanced.',
      visualType: 'balance',
      ruleVisualData: { left: 'x + 3', right: '7', balanced: true },
      problems: [
        {
          question: 'x + 5 = 12. What is x?',
          answer: 7,
          options: [5, 7, 12, 17],
          visualType: 'equation',
          visualData: { equation: 'x + 5 = 12', steps: ['x + 5 = 12', 'x + 5 - 5 = 12 - 5', 'x = 7'] },
          explanation: 'Subtract 5 from both sides: x = 12 - 5 = 7'
        },
        {
          question: '3x = 15. What is x?',
          answer: 5,
          options: [3, 5, 12, 15],
          visualType: 'equation',
          visualData: { equation: '3x = 15', steps: ['3x = 15', '3x ÷ 3 = 15 ÷ 3', 'x = 5'] },
          explanation: 'Divide both sides by 3: x = 15 ÷ 3 = 5'
        },
        {
          question: 'x - 4 = 9. What is x?',
          answer: 13,
          options: [5, 9, 13, 36],
          visualType: 'equation',
          visualData: { equation: 'x - 4 = 9', steps: ['x - 4 = 9', 'x - 4 + 4 = 9 + 4', 'x = 13'] },
          explanation: 'Add 4 to both sides: x = 9 + 4 = 13'
        }
      ]
    }
  ]
};

// Component to render the appropriate visual
function MathVisual({ type, data, isPlaying = true }: { type: MathVisualType; data: any; isPlaying?: boolean }) {
  switch (type) {
    case 'counting':
      return <CountingObjectsVisual data={data} isPlaying={isPlaying} />;
    case 'number_line':
      return <NumberLineVisual data={data} isPlaying={isPlaying} />;
    case 'fraction':
      return <FractionVisual data={data} isPlaying={isPlaying} />;
    case 'array':
      return <ArrayVisual data={data} isPlaying={isPlaying} />;
    case 'place_value':
      // PlaceValueVisual might have different interface, use a placeholder
      return (
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block bg-blue-50 rounded-2xl p-8"
          >
            <div className="text-6xl font-bold text-blue-600 mb-4">{data.number}</div>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{Math.floor(data.number / 10)}</div>
                <div className="text-sm text-purple-500">tens</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{data.number % 10}</div>
                <div className="text-sm text-green-500">ones</div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    case 'equation':
      return (
        <div className="text-center py-6">
          <div className="space-y-4">
            {data.steps?.map((step: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.5 }}
                className={`text-2xl font-mono ${i === data.steps.length - 1 ? 'text-green-600 font-bold' : 'text-gray-700'}`}
              >
                {step}
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'balance':
    case 'bar_model':
    default:
      return (
        <div className="text-center py-6 text-white/60">
          <p>Visual aid loading...</p>
        </div>
      );
  }
}

interface MathLessonPlayerProps {
  kidId: string;
  skillId: string;
  grade?: number;
  lessonIndex?: number;
  onComplete: (score: number, correct: number, total: number) => void;
  onBack: () => void;
}

export default function MathLessonPlayer({
  kidId,
  skillId,
  grade = 0,
  lessonIndex = 0,
  onComplete,
  onBack
}: MathLessonPlayerProps) {
  const supabase = createClient();
  const { currentTheme } = useTheme();
  const themeId = currentTheme?.id || 'default';

  // NEW: Fetch lessons from database (with fallback to hardcoded)
  const { lessons: dbLessons, loading: dbLoading, error: dbError } = useMathLesson(grade);

  // Lesson phases following 6-phase teaching methodology
  // Phase 1: rules (I DO - Teacher teaches rule)
  // Phase 2: demo (I DO - Teacher shows examples)
  // Phase 3: guided_practice (WE DO - Work together with hints)
  // Phase 4: independent_practice (YOU DO - Solo with tier1/tier2 on wrong)
  // Phase 5: quiz (Assessment)
  // Phase 6: complete (Mastery unlocked)
  type LessonPhase = 'rules' | 'demo' | 'guided_practice' | 'independent_practice' | 'quiz' | 'complete';

  // State
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('rules');
  const [lesson, setLesson] = useState<MathLesson | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [visualPlaying, setVisualPlaying] = useState(true);
  const [usingDatabase, setUsingDatabase] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // NEW: Wrong answer tracking for tier1/tier2 system
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0); // Per problem
  const [showTierExplanation, setShowTierExplanation] = useState<'tier1' | 'tier2' | null>(null);
  const [returnToRulesMessage, setReturnToRulesMessage] = useState(false);

  // Initialize lesson - prefer database, fallback to hardcoded
  useEffect(() => {
    // Wait for database fetch to complete
    if (dbLoading) return;

    // Try database lessons first
    if (dbLessons && dbLessons.length > 0) {
      const selectedLesson = dbLessons[lessonIndex % dbLessons.length];
      console.log(`✅ Using DATABASE lesson: ${selectedLesson.topic} (grade ${grade})`);
      setLesson(selectedLesson);
      setUsingDatabase(true);
    } else {
      // Fallback to hardcoded MATH_LESSONS
      const gradeLessons = MATH_LESSONS[Math.min(grade, 5)] || MATH_LESSONS[0];
      const selectedLesson = gradeLessons[lessonIndex % gradeLessons.length];
      console.log(`⚠️ Using HARDCODED lesson: ${selectedLesson.topic} (grade ${grade}) - DB had ${dbLessons?.length || 0} lessons`);
      if (dbError) console.log(`   DB Error: ${dbError}`);
      setLesson(selectedLesson);
      setUsingDatabase(false);
    }
  }, [grade, lessonIndex, dbLessons, dbLoading, dbError]);

  // Check answer with tier1/tier2 system
  // First wrong → tier1 explanation (25 words max)
  // Second wrong → tier2 explanation (20 words, simpler)
  // Third wrong → return to rules phase (Phase 1)
  const checkAnswer = (answer: number | string) => {
    if (feedback !== null || !lesson) return; // Prevent double-clicking

    setSelectedAnswer(answer);
    const currentProblem = lesson.problems[currentProblemIndex];
    const isCorrect = String(answer) === String(currentProblem.answer);

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      setWrongAnswerCount(0); // Reset for next problem
      setShowTierExplanation(null);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);

      // Move to next problem after delay
      setTimeout(() => {
        if (currentProblemIndex < lesson.problems.length - 1) {
          setCurrentProblemIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setFeedback(null);
          setVisualPlaying(true);
        } else {
          finishLesson();
        }
      }, 2000);
    } else {
      // WRONG ANSWER - implement tier1/tier2 system
      setStreak(0);
      const newWrongCount = wrongAnswerCount + 1;
      setWrongAnswerCount(newWrongCount);

      if (newWrongCount === 1) {
        // FIRST WRONG → Show tier1 explanation (25 words max)
        setShowTierExplanation('tier1');
        setTimeout(() => {
          setSelectedAnswer(null);
          setFeedback(null);
          setShowTierExplanation(null);
        }, 4000); // Give time to read tier1
      } else if (newWrongCount === 2) {
        // SECOND WRONG → Show tier2 explanation (simpler, 20 words)
        setShowTierExplanation('tier2');
        setTimeout(() => {
          setSelectedAnswer(null);
          setFeedback(null);
          setShowTierExplanation(null);
        }, 4000); // Give time to read tier2
      } else if (newWrongCount >= 3) {
        // THIRD WRONG → Return to Phase 1 (rule teaching)
        setReturnToRulesMessage(true);
        setTimeout(() => {
          setReturnToRulesMessage(false);
          setCurrentPhase('rules'); // Back to Phase 1
          setWrongAnswerCount(0);
          setSelectedAnswer(null);
          setFeedback(null);
          setShowTierExplanation(null);
          // Don't reset problem index - they'll retry after re-learning the rule
        }, 3000);
      }
    }
  };

  // Finish lesson
  const finishLesson = async () => {
    if (!lesson) return;

    const total = lesson.problems.length;
    const score = Math.round((correctCount / total) * 100);
    const baseCoins = 10;
    const bonusCoins = correctCount >= total ? 20 : correctCount >= total * 0.8 ? 10 : 5;
    const total_coins = baseCoins + bonusCoins;

    setCoinsEarned(total_coins);
    setShowResult(true);
    setCurrentPhase('complete');

    try {
      await supabase.rpc('add_coins', {
        p_child_id: kidId,
        p_amount: total_coins,
        p_reason: `Math lesson: ${lesson.topic} - ${correctCount}/${total} correct`
      });

      await supabase.from('lesson_progress').upsert({
        child_id: kidId,
        skill_id: skillId,
        subject_code: 'MATH',
        skill_name: lesson.topic,
        completed: true,
        score: score,
        stars: score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0,
        completed_at: new Date().toISOString()
      }, { onConflict: 'child_id,skill_id' });

    } catch (err) {
      console.error('Failed to save math progress:', err);
    }
  };

  // Retry
  const handleRetry = () => {
    setCurrentProblemIndex(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setCorrectCount(0);
    setShowResult(false);
    setStreak(0);
    setWrongAnswerCount(0);
    setCurrentPhase('guided_practice'); // Start from WE DO phase
    setVisualPlaying(true);
  };

  if (!lesson || dbLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">
            {dbLoading ? 'Loading from database...' : 'Preparing lesson...'}
          </div>
        </div>
      </div>
    );
  }

  const currentProblem = lesson.problems[currentProblemIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{correctCount}/{lesson.problems.length}</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1 text-orange-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">{streak}x streak!</span>
              </div>
            )}
          </div>
        </div>

        {/* RULES PHASE */}
        {currentPhase === 'rules' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8"
          >
            {/* Theme Mascot */}
            <div className="flex justify-center mb-4">
              <ThemeMascot theme={themeId} size={150} animate />
            </div>
            <div className="text-center mb-6">
              <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                {lesson.rule}
              </h1>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white/80 text-sm">
                Grade {grade === 0 ? 'K' : grade} • {lesson.topic}
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <p className="text-white/90 text-lg leading-relaxed text-center">
                {lesson.ruleExplanation}
              </p>
            </div>

            {/* Rule Visual */}
            <div className="bg-white rounded-2xl p-4 mb-8">
              <MathVisual
                type={lesson.visualType}
                data={lesson.ruleVisualData}
                isPlaying={true}
              />
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPhase('guided_practice')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-2xl
                  shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Play className="w-6 h-6" />
                Let&apos;s Practice Together!
              </button>
            </div>
          </motion.div>
        )}

        {/* GUIDED PRACTICE PHASE (WE DO - Work together with hints) */}
        {currentPhase === 'guided_practice' && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Phase indicator */}
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-blue-500/30 rounded-full text-blue-300 text-sm font-semibold">
                WE DO - Let&apos;s Practice Together!
              </span>
            </div>

            {/* Progress */}
            <div className="flex justify-center gap-2">
              {lesson.problems.slice(0, Math.ceil(lesson.problems.length / 2)).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < currentProblemIndex
                      ? 'bg-green-500'
                      : i === currentProblemIndex
                      ? 'bg-blue-500'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Problem Card with Hints */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                {currentProblem.question}
              </h2>

              {/* Visual */}
              <div className="bg-white rounded-2xl p-4 mb-6">
                <MathVisual
                  type={currentProblem.visualType}
                  data={currentProblem.visualData}
                  isPlaying={visualPlaying}
                />
              </div>

              {/* Hint button for guided practice */}
              <div className="text-center mb-4">
                <button
                  onClick={() => setShowTierExplanation('tier1')}
                  className="px-4 py-2 bg-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/40 transition-colors"
                >
                  <Lightbulb className="w-4 h-4 inline mr-2" />
                  Need a hint?
                </button>
              </div>

              {/* Show hint if requested */}
              {showTierExplanation === 'tier1' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-500/20 rounded-lg p-4 mb-4 text-center"
                >
                  <p className="text-white/90 text-sm">
                    {currentProblem.tier1?.teach || currentProblem.explanation}
                  </p>
                </motion.div>
              )}

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentProblem.options?.map((option, i) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = String(option) === String(currentProblem.answer);
                  const showCorrect = feedback !== null && isCorrect;
                  const showWrong = feedback !== null && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={i}
                      onClick={() => {
                        checkAnswer(option);
                        // After guided practice problems, move to independent
                        if (currentProblemIndex >= Math.ceil(lesson.problems.length / 2) - 1) {
                          setTimeout(() => {
                            setCurrentPhase('independent_practice');
                            setCurrentProblemIndex(Math.ceil(lesson.problems.length / 2));
                          }, 2500);
                        }
                      }}
                      disabled={feedback !== null}
                      whileTap={{ scale: 0.95 }}
                      className={`py-6 px-4 rounded-2xl text-2xl font-bold transition-all
                        ${showCorrect
                          ? 'bg-green-500 text-white ring-4 ring-green-300'
                          : showWrong
                          ? 'bg-red-500 text-white ring-4 ring-red-300'
                          : 'bg-white/20 text-white hover:bg-white/30'
                        }
                        ${feedback !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback for guided practice - always encouraging */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-xl text-center ${
                      feedback === 'correct' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                    }`}
                  >
                    {feedback === 'correct' ? (
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold text-lg">Great job! You got it!</span>
                      </div>
                    ) : (
                      <div className="text-yellow-300">
                        <p className="font-semibold mb-2">Almost! Here&apos;s how:</p>
                        <p className="text-white/80 text-sm">{currentProblem.explanation}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* INDEPENDENT PRACTICE PHASE (YOU DO - Solo with tier1/tier2) */}
        {(currentPhase === 'independent_practice' || currentPhase === 'quiz') && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Phase indicator */}
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-green-500/30 rounded-full text-green-300 text-sm font-semibold">
                YOU DO - Now Try On Your Own!
              </span>
              {wrongAnswerCount > 0 && (
                <span className="ml-2 text-yellow-400 text-sm">
                  (Attempt {wrongAnswerCount + 1}/3)
                </span>
              )}
            </div>

            {/* Progress */}
            <div className="flex justify-center gap-2">
              {lesson.problems.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < currentProblemIndex
                      ? 'bg-green-500'
                      : i === currentProblemIndex
                      ? 'bg-blue-500'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Problem Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">
              {/* Question */}
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                {currentProblem.question}
              </h2>

              {/* Visual */}
              <div className="bg-white rounded-2xl p-4 mb-8">
                <MathVisual
                  type={currentProblem.visualType}
                  data={currentProblem.visualData}
                  isPlaying={visualPlaying}
                />
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentProblem.options?.map((option, i) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = String(option) === String(currentProblem.answer);
                  const showCorrect = feedback !== null && isCorrect;
                  const showWrong = feedback !== null && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={i}
                      onClick={() => checkAnswer(option)}
                      disabled={feedback !== null}
                      whileTap={{ scale: 0.95 }}
                      className={`py-6 px-4 rounded-2xl text-2xl font-bold transition-all
                        ${showCorrect
                          ? 'bg-green-500 text-white ring-4 ring-green-300'
                          : showWrong
                          ? 'bg-red-500 text-white ring-4 ring-red-300'
                          : 'bg-white/20 text-white hover:bg-white/30'
                        }
                        ${feedback !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback with tier1/tier2 explanations */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-xl text-center ${
                      feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    {feedback === 'correct' ? (
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold text-lg">Correct!</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
                          <XCircle className="w-6 h-6" />
                          <span className="font-bold text-lg">
                            {wrongAnswerCount === 1 ? 'Not quite! Let me help...' :
                             wrongAnswerCount === 2 ? 'Try again! Here\'s a simpler way...' :
                             'Let\'s go back and review the rule!'}
                          </span>
                        </div>

                        {/* Tier1 Explanation (first wrong - 25 words max) */}
                        {showTierExplanation === 'tier1' && (
                          <div className="bg-blue-500/20 rounded-lg p-4 mt-3">
                            <div className="flex items-center justify-center gap-2 text-blue-300 mb-2">
                              <Lightbulb className="w-5 h-5" />
                              <span className="font-semibold">Hint:</span>
                            </div>
                            <p className="text-white/90 text-sm">
                              {currentProblem.tier1?.teach || currentProblem.explanation}
                            </p>
                            {currentProblem.tier1?.visual && (
                              <div className="mt-3 bg-white rounded-lg p-2">
                                <MathVisual
                                  type={currentProblem.visualType}
                                  data={currentProblem.tier1.visual}
                                  isPlaying={true}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tier2 Explanation (second wrong - 20 words, simpler) */}
                        {showTierExplanation === 'tier2' && (
                          <div className="bg-yellow-500/20 rounded-lg p-4 mt-3">
                            <div className="flex items-center justify-center gap-2 text-yellow-300 mb-2">
                              <Sparkles className="w-5 h-5" />
                              <span className="font-semibold">Simpler way:</span>
                            </div>
                            <p className="text-white/90 text-sm">
                              {currentProblem.tier2?.teach ||
                               currentProblem.tier1?.teach ||
                               currentProblem.explanation}
                            </p>
                            {currentProblem.tier2?.visual && (
                              <div className="mt-3 bg-white rounded-lg p-2">
                                <MathVisual
                                  type={currentProblem.visualType}
                                  data={currentProblem.tier2.visual}
                                  isPlaying={true}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Return to Rules message (third wrong) */}
                        {returnToRulesMessage && (
                          <div className="bg-purple-500/30 rounded-lg p-4 mt-3">
                            <div className="flex items-center justify-center gap-2 text-purple-300 mb-2">
                              <RotateCcw className="w-5 h-5" />
                              <span className="font-semibold">Let&apos;s review the rule together!</span>
                            </div>
                            <p className="text-white/80 text-sm">
                              Going back to learn the rule again...
                            </p>
                          </div>
                        )}

                        {/* Default explanation if no tier shown */}
                        {!showTierExplanation && !returnToRulesMessage && (
                          <p className="text-white/80 text-sm">{currentProblem.explanation}</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* CELEBRATION ANIMATION */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
            >
              <Celebration type="confetti" size={400} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTS */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center"
          >
            <div className="mb-6">
              {correctCount >= lesson.problems.length * 0.8 ? (
                <>
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Math Master!</h2>
                  <p className="text-white/80">You understood {lesson.rule}!</p>
                </>
              ) : (
                <>
                  <Star className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Good Try!</h2>
                  <p className="text-white/80">Practice makes perfect!</p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-2xl p-4">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{correctCount}</p>
                <p className="text-white/60">Correct</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <span className="text-3xl block mb-2">📊</span>
                <p className="text-3xl font-bold text-white">{Math.round((correctCount / lesson.problems.length) * 100)}%</p>
                <p className="text-white/60">Score</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">+{coinsEarned}</p>
                <p className="text-white/60">Coins</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl
                  hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={() => onComplete(coinsEarned, correctCount, lesson.problems.length)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl
                  shadow-lg hover:shadow-green-500/30 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
