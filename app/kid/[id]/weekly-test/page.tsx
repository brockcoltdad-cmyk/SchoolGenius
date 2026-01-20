'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, XCircle, Star, Trophy, BookOpen,
  Play, RefreshCw, Lightbulb, Target, Clock, Award
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

/**
 * WEEKLY RULES TEST
 *
 * Following MASTER-RULES-CHECKLIST:
 * - Tests rules the child learned this week
 * - 20-30 questions covering all subjects
 * - 80% passing threshold
 * - 50 coins for passing
 *
 * Options before test:
 * 1. "I'm Ready!" - Jump straight in
 * 2. "Review Rules First" - Go through teaching
 * 3. "Practice Mode" - Examples with hints first
 */

interface TestQuestion {
  id: string;
  subject: string;
  skillName: string;
  rule: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface LearnedSkill {
  skill_id: string;
  skill_name: string;
  subject_code: string;
  score: number;
  completed_at: string;
}

type TestPhase = 'intro' | 'review' | 'practice' | 'test' | 'results';

// Question bank organized by subject and skill
const QUESTION_TEMPLATES: Record<string, Record<string, TestQuestion[]>> = {
  MATH: {
    addition: [
      {
        id: 'math-add-1',
        subject: 'MATH',
        skillName: 'Addition',
        rule: 'When we add numbers, we combine them to get a bigger number.',
        question: 'What is 7 + 5?',
        options: ['10', '11', '12', '13'],
        correctAnswer: '12',
        explanation: 'Count 7, then add 5 more: 8, 9, 10, 11, 12'
      },
      {
        id: 'math-add-2',
        subject: 'MATH',
        skillName: 'Addition',
        rule: 'When we add numbers, we combine them to get a bigger number.',
        question: 'What is 8 + 6?',
        options: ['12', '13', '14', '15'],
        correctAnswer: '14',
        explanation: '8 + 6 = 14. You can also think: 8 + 2 = 10, then 10 + 4 = 14'
      },
      {
        id: 'math-add-3',
        subject: 'MATH',
        skillName: 'Addition',
        rule: 'When we add numbers, we combine them to get a bigger number.',
        question: 'Sam has 9 apples. He gets 4 more. How many apples does Sam have?',
        options: ['11', '12', '13', '14'],
        correctAnswer: '13',
        explanation: '9 + 4 = 13 apples'
      }
    ],
    subtraction: [
      {
        id: 'math-sub-1',
        subject: 'MATH',
        skillName: 'Subtraction',
        rule: 'When we subtract, we take away to get a smaller number.',
        question: 'What is 15 - 7?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
        explanation: 'Start at 15 and count back 7: 14, 13, 12, 11, 10, 9, 8'
      },
      {
        id: 'math-sub-2',
        subject: 'MATH',
        skillName: 'Subtraction',
        rule: 'When we subtract, we take away to get a smaller number.',
        question: 'Emma has 12 cookies. She eats 5. How many are left?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '7',
        explanation: '12 - 5 = 7 cookies left'
      }
    ],
    multiplication: [
      {
        id: 'math-mult-1',
        subject: 'MATH',
        skillName: 'Multiplication',
        rule: 'Multiplication is repeated addition. 3 x 4 means 3 groups of 4.',
        question: 'What is 4 x 6?',
        options: ['20', '22', '24', '26'],
        correctAnswer: '24',
        explanation: '4 x 6 = 24. Think: 4 groups of 6, or 6 + 6 + 6 + 6 = 24'
      },
      {
        id: 'math-mult-2',
        subject: 'MATH',
        skillName: 'Multiplication',
        rule: 'Multiplication is repeated addition. 3 x 4 means 3 groups of 4.',
        question: 'There are 5 bags with 7 marbles each. How many marbles total?',
        options: ['30', '32', '35', '37'],
        correctAnswer: '35',
        explanation: '5 x 7 = 35 marbles'
      }
    ],
    division: [
      {
        id: 'math-div-1',
        subject: 'MATH',
        skillName: 'Division',
        rule: 'Division is splitting into equal groups. 12 ÷ 3 means split 12 into 3 equal groups.',
        question: 'What is 24 ÷ 6?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: '24 ÷ 6 = 4. If you split 24 into 6 equal groups, each group has 4.'
      },
      {
        id: 'math-div-2',
        subject: 'MATH',
        skillName: 'Division',
        rule: 'Division is splitting into equal groups.',
        question: '18 stickers are shared equally among 3 friends. How many does each get?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '6',
        explanation: '18 ÷ 3 = 6 stickers each'
      }
    ],
    fractions: [
      {
        id: 'math-frac-1',
        subject: 'MATH',
        skillName: 'Fractions',
        rule: 'A fraction shows parts of a whole. The top number (numerator) is how many parts you have. The bottom number (denominator) is total equal parts.',
        question: 'If a pizza is cut into 8 equal slices and you eat 3, what fraction did you eat?',
        options: ['3/5', '3/8', '5/8', '8/3'],
        correctAnswer: '3/8',
        explanation: '3 slices out of 8 total = 3/8'
      },
      {
        id: 'math-frac-2',
        subject: 'MATH',
        skillName: 'Fractions',
        rule: 'A fraction shows parts of a whole.',
        question: 'Which fraction is larger: 1/2 or 1/4?',
        options: ['1/2', '1/4', 'They are equal', 'Cannot tell'],
        correctAnswer: '1/2',
        explanation: '1/2 is larger because you have more of the whole (half vs quarter)'
      }
    ]
  },
  SPELLING: {
    phonics: [
      {
        id: 'spell-phon-1',
        subject: 'SPELLING',
        skillName: 'Phonics',
        rule: 'The "sh" sound is spelled with S-H together.',
        question: 'Which word has the "sh" sound?',
        options: ['sun', 'ship', 'sip', 'sat'],
        correctAnswer: 'ship',
        explanation: 'Ship starts with the "sh" sound: sh-ip'
      },
      {
        id: 'spell-phon-2',
        subject: 'SPELLING',
        skillName: 'Phonics',
        rule: 'The "ch" sound is spelled with C-H together.',
        question: 'Which word has the "ch" sound?',
        options: ['cat', 'chair', 'car', 'can'],
        correctAnswer: 'chair',
        explanation: 'Chair starts with the "ch" sound: ch-air'
      },
      {
        id: 'spell-phon-3',
        subject: 'SPELLING',
        skillName: 'Phonics',
        rule: 'Silent E makes the vowel say its name.',
        question: 'What happens when you add E to "cap"?',
        options: ['It says "cap-e"', 'The A says its name (cape)', 'Nothing changes', 'It becomes "cup"'],
        correctAnswer: 'The A says its name (cape)',
        explanation: 'Silent E at the end makes the vowel say its name: cap → cape'
      }
    ],
    patterns: [
      {
        id: 'spell-pat-1',
        subject: 'SPELLING',
        skillName: 'Spelling Patterns',
        rule: 'Words ending in a consonant + Y change Y to I before adding -ES.',
        question: 'How do you make "baby" plural?',
        options: ['babys', 'babies', 'babyes', 'babyies'],
        correctAnswer: 'babies',
        explanation: 'Change Y to I and add ES: baby → babies'
      },
      {
        id: 'spell-pat-2',
        subject: 'SPELLING',
        skillName: 'Spelling Patterns',
        rule: 'I before E except after C.',
        question: 'Which spelling is correct?',
        options: ['beleive', 'believe', 'beleeve', 'belive'],
        correctAnswer: 'believe',
        explanation: 'I before E: believe'
      }
    ]
  },
  READING: {
    comprehension: [
      {
        id: 'read-comp-1',
        subject: 'READING',
        skillName: 'Comprehension',
        rule: 'The main idea is what the story is mostly about.',
        question: 'To find the main idea, you should ask:',
        options: ['What color are the pictures?', 'What is this story mostly about?', 'How many pages is it?', 'Who wrote it?'],
        correctAnswer: 'What is this story mostly about?',
        explanation: 'The main idea tells us what the whole story is about.'
      },
      {
        id: 'read-comp-2',
        subject: 'READING',
        skillName: 'Comprehension',
        rule: 'Details support the main idea with specific information.',
        question: 'Details in a story help us:',
        options: ['Skip to the end', 'Understand more about the main idea', 'Count the words', 'Find spelling mistakes'],
        correctAnswer: 'Understand more about the main idea',
        explanation: 'Details give us more information about the main idea.'
      }
    ],
    vocabulary: [
      {
        id: 'read-vocab-1',
        subject: 'READING',
        skillName: 'Vocabulary',
        rule: 'Context clues are hints in the sentence that help us understand new words.',
        question: 'The dog was famished after not eating all day. He gobbled up his food. What does "famished" mean?',
        options: ['Tired', 'Very hungry', 'Happy', 'Scared'],
        correctAnswer: 'Very hungry',
        explanation: 'The clues "not eating all day" and "gobbled up his food" tell us famished means very hungry.'
      }
    ]
  },
  WRITING: {
    sentences: [
      {
        id: 'write-sent-1',
        subject: 'WRITING',
        skillName: 'Sentences',
        rule: 'A complete sentence has a subject (who or what) and a predicate (what they do).',
        question: 'Which is a complete sentence?',
        options: ['Running fast.', 'The big dog.', 'The cat sleeps.', 'Under the tree.'],
        correctAnswer: 'The cat sleeps.',
        explanation: '"The cat" is the subject (who), "sleeps" is the predicate (what it does).'
      },
      {
        id: 'write-sent-2',
        subject: 'WRITING',
        skillName: 'Sentences',
        rule: 'Every sentence starts with a capital letter and ends with punctuation.',
        question: 'What is wrong with: "the bird flew away"',
        options: ['Missing period', 'Missing capital letter', 'Both A and B', 'Nothing is wrong'],
        correctAnswer: 'Both A and B',
        explanation: 'It needs a capital T at the start and a period at the end.'
      }
    ],
    paragraphs: [
      {
        id: 'write-para-1',
        subject: 'WRITING',
        skillName: 'Paragraphs',
        rule: 'A paragraph has a topic sentence, supporting details, and a concluding sentence.',
        question: 'Which sentence would come FIRST in a paragraph about dogs?',
        options: ['They love to play fetch.', 'Dogs make great pets.', 'That is why I love dogs.', 'They are loyal.'],
        correctAnswer: 'Dogs make great pets.',
        explanation: 'The topic sentence states the main idea and comes first.'
      }
    ]
  },
  TYPING: {
    homerow: [
      {
        id: 'type-home-1',
        subject: 'TYPING',
        skillName: 'Home Row',
        rule: 'The home row keys are A-S-D-F for left hand and J-K-L-; for right hand. Your fingers should always return here.',
        question: 'Which finger types the letter "F"?',
        options: ['Left pinky', 'Left index finger', 'Right index finger', 'Right pinky'],
        correctAnswer: 'Left index finger',
        explanation: 'F is typed with the left index finger on the home row.'
      },
      {
        id: 'type-home-2',
        subject: 'TYPING',
        skillName: 'Home Row',
        rule: 'The home row keys are A-S-D-F for left hand and J-K-L-; for right hand.',
        question: 'Which finger types the letter "J"?',
        options: ['Left pinky', 'Left index finger', 'Right index finger', 'Right pinky'],
        correctAnswer: 'Right index finger',
        explanation: 'J is typed with the right index finger. It has a bump to help you find it!'
      }
    ]
  },
  CODING: {
    sequences: [
      {
        id: 'code-seq-1',
        subject: 'CODING',
        skillName: 'Sequences',
        rule: 'A program runs commands in order, from top to bottom.',
        question: 'In coding, what does "sequence" mean?',
        options: ['Random order', 'Commands run in order', 'Skip some steps', 'Go backwards'],
        correctAnswer: 'Commands run in order',
        explanation: 'A sequence means the computer follows instructions in order, one after another.'
      },
      {
        id: 'code-seq-2',
        subject: 'CODING',
        skillName: 'Sequences',
        rule: 'A program runs commands in order, from top to bottom.',
        question: 'If these steps are: 1) Walk forward, 2) Turn left, 3) Walk forward - what happens first?',
        options: ['Turn left', 'Walk forward', 'Stop', 'Turn right'],
        correctAnswer: 'Walk forward',
        explanation: 'Step 1 (Walk forward) happens first because programs run in order.'
      }
    ],
    loops: [
      {
        id: 'code-loop-1',
        subject: 'CODING',
        skillName: 'Loops',
        rule: 'A loop repeats commands. Instead of writing the same thing many times, we use a loop.',
        question: 'Why do we use loops in coding?',
        options: ['To make code longer', 'To repeat commands without writing them many times', 'To skip commands', 'To delete code'],
        correctAnswer: 'To repeat commands without writing them many times',
        explanation: 'Loops save time by repeating commands automatically.'
      }
    ]
  }
};

export default function WeeklyTestPage() {
  const params = useParams();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const kidId = params.id as string;
  const supabase = createClient();

  const [phase, setPhase] = useState<TestPhase>('intro');
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState('');
  const [learnedSkills, setLearnedSkills] = useState<LearnedSkill[]>([]);
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);

  // Fetch child info and learned skills
  useEffect(() => {
    async function fetchData() {
      try {
        // Get child info
        const { data: child } = await supabase
          .from('children')
          .select('name, grade_level')
          .eq('id', kidId)
          .single();

        if (child) {
          setChildName(child.name);
        }

        // Get lessons completed this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data: lessons } = await supabase
          .from('lesson_progress')
          .select('skill_id, skill_name, subject_code, score, completed_at')
          .eq('child_id', kidId)
          .eq('completed', true)
          .gte('completed_at', oneWeekAgo.toISOString())
          .order('completed_at', { ascending: false });

        if (lessons && lessons.length > 0) {
          setLearnedSkills(lessons);
          generateTestQuestions(lessons);
        } else {
          // If no lessons this week, get recent lessons
          const { data: recentLessons } = await supabase
            .from('lesson_progress')
            .select('skill_id, skill_name, subject_code, score, completed_at')
            .eq('child_id', kidId)
            .eq('completed', true)
            .order('completed_at', { ascending: false })
            .limit(10);

          if (recentLessons) {
            setLearnedSkills(recentLessons);
            generateTestQuestions(recentLessons);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [kidId]);

  // Generate test questions based on learned skills
  const generateTestQuestions = (skills: LearnedSkill[]) => {
    const questions: TestQuestion[] = [];
    const usedIds = new Set<string>();

    // Group skills by subject
    const subjects = Array.from(new Set(skills.map(s => s.subject_code)));

    // Get questions for each subject
    for (const subject of subjects) {
      const subjectQuestions = QUESTION_TEMPLATES[subject];
      if (!subjectQuestions) continue;

      // Get questions from each skill category
      for (const category of Object.keys(subjectQuestions)) {
        const categoryQuestions = subjectQuestions[category];
        for (const q of categoryQuestions) {
          if (!usedIds.has(q.id) && questions.length < 25) {
            questions.push(q);
            usedIds.add(q.id);
          }
        }
      }
    }

    // If we don't have enough questions, add general ones
    if (questions.length < 20) {
      for (const subject of Object.keys(QUESTION_TEMPLATES)) {
        const subjectQuestions = QUESTION_TEMPLATES[subject];
        for (const category of Object.keys(subjectQuestions)) {
          const categoryQuestions = subjectQuestions[category];
          for (const q of categoryQuestions) {
            if (!usedIds.has(q.id) && questions.length < 25) {
              questions.push(q);
              usedIds.add(q.id);
            }
          }
        }
      }
    }

    // Shuffle questions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    setTestQuestions(shuffled.slice(0, 25)); // Max 25 questions
  };

  const handleStartTest = () => {
    setPhase('test');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const handleStartReview = () => {
    setPhase('review');
    setReviewIndex(0);
  };

  const handleStartPractice = () => {
    setPhase('practice');
    setPracticeIndex(0);
    setPracticeScore(0);
  };

  const handleAnswerSelect = (answer: string) => {
    if (isCorrect !== null) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !testQuestions[currentQuestionIndex]) return;

    const correct = selectedAnswer === testQuestions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    setPhase('results');

    const finalScore = score + (isCorrect ? 1 : 0);
    const percentage = Math.round((finalScore / testQuestions.length) * 100);
    const passed = percentage >= 80;
    const coinsEarned = passed ? 50 : 10;

    try {
      // Save test results
      await supabase.from('weekly_test_results').insert({
        child_id: kidId,
        score: percentage,
        questions_correct: finalScore,
        questions_total: testQuestions.length,
        passed: passed,
        coins_earned: coinsEarned,
        completed_at: new Date().toISOString()
      });

      // Update coins
      const { data: child } = await supabase
        .from('children')
        .select('coins')
        .eq('id', kidId)
        .single();

      if (child) {
        await supabase
          .from('children')
          .update({ coins: (child.coins || 0) + coinsEarned })
          .eq('id', kidId);
      }
    } catch (err) {
      console.error('Error saving test results:', err);
    }
  };

  // Get unique rules for review
  const uniqueRules = testQuestions.reduce((acc, q) => {
    const key = `${q.subject}-${q.skillName}`;
    if (!acc.find(r => `${r.subject}-${r.skillName}` === key)) {
      acc.push(q);
    }
    return acc;
  }, [] as TestQuestion[]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: currentTheme.colors.primary }}></div>
          <p className="text-white font-bold text-xl">Preparing your test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-black">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {phase === 'test' && (
            <div className="flex items-center gap-4">
              <div className="bg-white/10 px-4 py-2 rounded-full">
                <span className="text-white font-bold">
                  Question {currentQuestionIndex + 1} / {testQuestions.length}
                </span>
              </div>
              <div className="bg-green-500/20 px-4 py-2 rounded-full">
                <span className="text-green-400 font-bold">
                  {score} correct
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📝</div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Weekly Rules Test
                </h1>
                <p className="text-white/70 text-lg">
                  Hey {childName}! Let&apos;s see how well you remember the rules you learned!
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  What You&apos;ll Be Tested On
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from(new Set(testQuestions.map(q => q.subject))).map(subject => (
                    <div
                      key={subject}
                      className="bg-white/10 rounded-lg p-3 flex items-center gap-2"
                    >
                      <span className="text-2xl">
                        {subject === 'MATH' ? '🔢' :
                         subject === 'SPELLING' ? '📝' :
                         subject === 'READING' ? '📖' :
                         subject === 'WRITING' ? '✏️' :
                         subject === 'TYPING' ? '⌨️' :
                         subject === 'CODING' ? '💻' : '📚'}
                      </span>
                      <span className="text-white font-medium">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/20 rounded-xl p-4 mb-8 flex items-center gap-4">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-bold">Pass with 80% to earn 50 coins!</p>
                  <p className="text-white/70 text-sm">
                    {testQuestions.length} questions • Need {Math.ceil(testQuestions.length * 0.8)} correct
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleStartTest}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-6 h-6" />
                  I&apos;m Ready! Start the Test
                </button>

                <button
                  onClick={handleStartReview}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <BookOpen className="w-6 h-6" />
                  Review Rules First
                </button>

                <button
                  onClick={handleStartPractice}
                  className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Lightbulb className="w-6 h-6" />
                  Practice Mode (With Hints)
                </button>
              </div>
            </motion.div>
          )}

          {/* Review Phase */}
          {phase === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                  Review: {uniqueRules[reviewIndex]?.skillName}
                </h2>
                <p className="text-white/60">
                  Rule {reviewIndex + 1} of {uniqueRules.length}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
                    {uniqueRules[reviewIndex]?.subject}
                  </span>
                </div>
                <p className="text-white text-lg leading-relaxed">
                  {uniqueRules[reviewIndex]?.rule}
                </p>
              </div>

              <div className="flex gap-4">
                {reviewIndex > 0 && (
                  <button
                    onClick={() => setReviewIndex(prev => prev - 1)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    Previous Rule
                  </button>
                )}
                {reviewIndex < uniqueRules.length - 1 ? (
                  <button
                    onClick={() => setReviewIndex(prev => prev + 1)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    Next Rule
                  </button>
                ) : (
                  <button
                    onClick={handleStartTest}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    Start Test
                  </button>
                )}
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((reviewIndex + 1) / uniqueRules.length) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Practice Phase */}
          {phase === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                  Practice Question {practiceIndex + 1}
                </h2>
                <p className="text-white/60">
                  {testQuestions[practiceIndex]?.subject} - {testQuestions[practiceIndex]?.skillName}
                </p>
              </div>

              {/* Show the rule as a hint */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 font-bold text-sm mb-1">💡 Remember the rule:</p>
                <p className="text-white/80">{testQuestions[practiceIndex]?.rule}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <p className="text-white text-lg font-medium mb-4">
                  {testQuestions[practiceIndex]?.question}
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {testQuestions[practiceIndex]?.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isCorrect !== null}
                      className={`p-4 rounded-xl text-left font-medium transition-all ${
                        isCorrect !== null
                          ? option === testQuestions[practiceIndex].correctAnswer
                            ? 'bg-green-500 text-white'
                            : option === selectedAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-white/10 text-white/50'
                          : selectedAnswer === option
                            ? 'bg-blue-500 text-white scale-[1.02]'
                            : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-6 ${
                    isCorrect
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Correct!' : 'Not quite right'}
                      </p>
                      <p className="text-white/80 mt-1">
                        {testQuestions[practiceIndex]?.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {isCorrect === null ? (
                <button
                  onClick={() => {
                    if (!selectedAnswer) return;
                    const correct = selectedAnswer === testQuestions[practiceIndex].correctAnswer;
                    setIsCorrect(correct);
                    setShowExplanation(true);
                    if (correct) setPracticeScore(prev => prev + 1);
                  }}
                  disabled={!selectedAnswer}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (practiceIndex < Math.min(testQuestions.length - 1, 9)) {
                      setPracticeIndex(prev => prev + 1);
                      setSelectedAnswer(null);
                      setIsCorrect(null);
                      setShowExplanation(false);
                    } else {
                      setPhase('intro');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl"
                >
                  {practiceIndex < Math.min(testQuestions.length - 1, 9) ? 'Next Practice Question' : 'Back to Menu'}
                </button>
              )}
            </motion.div>
          )}

          {/* Test Phase */}
          {phase === 'test' && testQuestions[currentQuestionIndex] && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
                    {testQuestions[currentQuestionIndex].subject}
                  </span>
                  <span className="text-white/60 text-sm">
                    {testQuestions[currentQuestionIndex].skillName}
                  </span>
                </div>
                <p className="text-white text-xl font-medium">
                  {testQuestions[currentQuestionIndex].question}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {testQuestions[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isCorrect !== null}
                    className={`p-4 rounded-xl text-left font-medium transition-all ${
                      isCorrect !== null
                        ? option === testQuestions[currentQuestionIndex].correctAnswer
                          ? 'bg-green-500 text-white'
                          : option === selectedAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-white/10 text-white/50'
                        : selectedAnswer === option
                          ? 'bg-yellow-500 text-black scale-[1.02]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-6 ${
                    isCorrect
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Correct!' : 'Not quite right'}
                      </p>
                      <p className="text-white/80 mt-1">
                        {testQuestions[currentQuestionIndex].explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {isCorrect === null ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  {currentQuestionIndex < testQuestions.length - 1 ? (
                    'Next Question'
                  ) : (
                    <>
                      See Results
                      <Trophy className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Phase */}
          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <div className="text-8xl mb-6">
                  {Math.round((score / testQuestions.length) * 100) >= 80 ? '🏆' : '📚'}
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-4">
                {Math.round((score / testQuestions.length) * 100) >= 80
                  ? 'You Passed!'
                  : 'Keep Practicing!'}
              </h2>

              <div className="bg-white/10 rounded-xl p-6 mb-6 inline-block">
                <p className="text-white/60 mb-2">Your Score</p>
                <p className="text-4xl font-bold text-white">
                  {score} / {testQuestions.length}
                </p>
                <p className="text-2xl font-bold text-white mt-2">
                  {Math.round((score / testQuestions.length) * 100)}%
                </p>
                <div className="flex justify-center gap-1 mt-3">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 ${
                        (score / testQuestions.length) >= star * 0.27
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className={`rounded-xl p-4 mb-6 ${
                Math.round((score / testQuestions.length) * 100) >= 80
                  ? 'bg-yellow-500/20'
                  : 'bg-blue-500/20'
              }`}>
                <p className={`text-2xl font-bold ${
                  Math.round((score / testQuestions.length) * 100) >= 80
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`}>
                  {Math.round((score / testQuestions.length) * 100) >= 80
                    ? '🪙 +50 Coins! (Passed!)'
                    : '🪙 +10 Coins (Keep trying!)'}
                </p>
              </div>

              {Math.round((score / testQuestions.length) * 100) < 80 && (
                <div className="bg-purple-500/20 rounded-xl p-4 mb-6">
                  <p className="text-purple-400 font-bold mb-2">💡 Tip</p>
                  <p className="text-white/80">
                    You need 80% ({Math.ceil(testQuestions.length * 0.8)} correct) to pass.
                    Try reviewing the rules and practice more!
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setPhase('intro');
                    setScore(0);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswer(null);
                    setIsCorrect(null);
                    setShowExplanation(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl"
                >
                  <RefreshCw className="w-5 h-5 inline mr-2" />
                  Try Again
                </button>
                <button
                  onClick={() => router.back()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
