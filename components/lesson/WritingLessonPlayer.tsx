'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Lightbulb, CheckCircle, XCircle,
  PenTool, BookOpen, Sparkles, Star, Trophy, Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/lib/theme-context';
import GigiCharacter from '@/components/animations/GigiCharacter';
import Confetti from '@/components/animations/Confetti';
import { useWritingLesson } from '@/hooks/useWritingLesson';

/**
 * WRITING LESSON PLAYER
 *
 * Follows MASTER-RULES-CHECKLIST:
 * 1. Rules First - Show the writing rule before practice
 * 2. Demo - Show example of good writing
 * 3. Guided Practice - Write with support
 * 4. Independent Practice - Write alone
 * 5. AI Review - Feedback on writing
 * 6. Report to Parent - Save progress
 *
 * Age Appropriate:
 * - K-2: 3 sentences, picture prompts
 * - 3-5: Paragraphs, story structure
 * - 6-8: 5-paragraph essays
 * - 9-12: Research papers, analysis
 */

// Writing rules by grade level
const WRITING_RULES: Record<number, WritingRule[]> = {
  // Kindergarten - Simple sentences
  0: [
    {
      id: 'k-sentence',
      title: 'Writing a Sentence',
      rule: 'A sentence tells a complete thought. It starts with a capital letter and ends with a period.',
      demo: 'The cat is big.',
      tip: 'Every sentence needs: WHO or WHAT + DOES WHAT',
      prompt: 'Look at the picture. Write one sentence about what you see.',
      minWords: 3,
      maxWords: 10,
      gradeLevel: 0
    },
    {
      id: 'k-naming',
      title: 'Naming Words (Nouns)',
      rule: 'A naming word tells us the name of a person, place, or thing.',
      demo: 'dog, mom, park, ball',
      tip: 'Ask yourself: Can I touch it or see it? Then it\'s a naming word!',
      prompt: 'Write 3 naming words you can see in your room.',
      minWords: 3,
      maxWords: 10,
      gradeLevel: 0
    }
  ],
  // Grade 1 - Simple stories
  1: [
    {
      id: 'g1-story',
      title: 'Writing a Story',
      rule: 'A story has three parts: Beginning (who and where), Middle (what happens), and End (how it finishes).',
      demo: 'Beginning: Sam had a dog named Max.\nMiddle: One day, Max ran away to the park.\nEnd: Sam found Max playing with other dogs. They went home happy.',
      tip: 'First, Then, Finally - use these words to organize your story!',
      prompt: 'Write a short story about a pet. Include a beginning, middle, and end.',
      minWords: 15,
      maxWords: 50,
      gradeLevel: 1
    },
    {
      id: 'g1-action',
      title: 'Action Words (Verbs)',
      rule: 'An action word tells what someone or something DOES.',
      demo: 'run, jump, eat, sleep, play',
      tip: 'Can you act it out? Then it\'s probably an action word!',
      prompt: 'Write 3 sentences using different action words.',
      minWords: 9,
      maxWords: 30,
      gradeLevel: 1
    }
  ],
  // Grade 2 - Paragraphs
  2: [
    {
      id: 'g2-paragraph',
      title: 'Writing a Paragraph',
      rule: 'A paragraph is a group of sentences about ONE main idea. It has a topic sentence, supporting sentences, and a closing sentence.',
      demo: 'Dogs make great pets. (Topic) They are loyal and friendly. They love to play fetch. They can learn tricks. (Support) That\'s why dogs are the best! (Closing)',
      tip: 'Topic sentence = main idea. Supporting sentences = reasons/details. Closing = wrap it up!',
      prompt: 'Write a paragraph about your favorite food. Include why you like it.',
      minWords: 25,
      maxWords: 75,
      gradeLevel: 2
    },
    {
      id: 'g2-describing',
      title: 'Describing Words (Adjectives)',
      rule: 'Describing words tell us MORE about a noun. They describe size, color, shape, or how something feels.',
      demo: 'The BIG, FLUFFY, BROWN dog ran across the GREEN grass.',
      tip: 'Ask: What kind? How many? Which one? What color?',
      prompt: 'Describe your bedroom using at least 5 describing words.',
      minWords: 20,
      maxWords: 60,
      gradeLevel: 2
    }
  ],
  // Grade 3 - Opinion writing
  3: [
    {
      id: 'g3-opinion',
      title: 'Opinion Writing',
      rule: 'Opinion writing shares what YOU think and gives REASONS why. Use facts and examples to support your opinion.',
      demo: 'I believe recess should be longer. First, kids need more time to exercise and play. Second, it helps us focus better in class. Finally, it makes school more fun. That\'s why I think we need more recess time.',
      tip: 'Opinion + Reason 1 + Reason 2 + Reason 3 + Conclusion',
      prompt: 'Write your opinion: Should kids have homework on weekends? Give at least 2 reasons.',
      minWords: 40,
      maxWords: 120,
      gradeLevel: 3
    }
  ],
  // Grade 4 - Informative writing
  4: [
    {
      id: 'g4-inform',
      title: 'Informative Writing',
      rule: 'Informative writing teaches the reader about a topic. It includes facts, definitions, and details organized into paragraphs.',
      demo: 'Introduction: Butterflies are amazing insects.\nBody 1: They start as caterpillars and go through metamorphosis.\nBody 2: They have colorful wings covered in tiny scales.\nConclusion: Butterflies are fascinating creatures that help pollinate flowers.',
      tip: 'Introduction → Body Paragraphs (facts) → Conclusion',
      prompt: 'Write an informative paragraph about an animal you know a lot about. Include at least 3 facts.',
      minWords: 60,
      maxWords: 150,
      gradeLevel: 4
    }
  ],
  // Grade 5 - Narrative writing
  5: [
    {
      id: 'g5-narrative',
      title: 'Narrative Writing',
      rule: 'A narrative tells a story with characters, setting, problem, and solution. Use dialogue and descriptive details to bring it to life.',
      demo: 'Setting: It was a dark and stormy night in the old house.\nCharacters: Maya and her brother Jake heard a strange noise.\nProblem: "What was that?" Maya whispered.\nSolution: They discovered it was just their cat stuck in a closet!',
      tip: 'Who? Where? What\'s the problem? How is it solved? Use dialogue!',
      prompt: 'Write a short story about finding something unexpected. Use dialogue between characters.',
      minWords: 80,
      maxWords: 200,
      gradeLevel: 5
    }
  ],
  // Grade 6-8 - Essay writing
  6: [
    {
      id: 'g6-essay',
      title: '5-Paragraph Essay',
      rule: 'An essay has: Introduction (hook + thesis), 3 Body Paragraphs (topic + evidence + analysis), and Conclusion (restate + final thought).',
      demo: 'Intro: [Hook] Did you know...? [Thesis] Social media has both positive and negative effects on teens.\nBody 1: First benefit - staying connected...\nBody 2: However, there are risks...\nBody 3: Another consideration...\nConclusion: In conclusion, while social media offers benefits, teens should use it wisely.',
      tip: 'Thesis = your main argument. Each body paragraph = one reason with evidence.',
      prompt: 'Write the introduction and one body paragraph for this topic: "Should students be allowed to use phones in class?"',
      minWords: 100,
      maxWords: 300,
      gradeLevel: 6
    }
  ],
  // Grade 9-12 - Argumentative/Research
  9: [
    {
      id: 'g9-argument',
      title: 'Argumentative Writing',
      rule: 'Argumentative essays make a claim, provide evidence, address counterarguments, and use formal language. Cite sources when using facts.',
      demo: 'Claim: Schools should start later to improve student performance.\nEvidence: Studies show teens need 8-10 hours of sleep, but early start times make this difficult (CDC, 2020).\nCounterargument: Some argue later starts create transportation issues.\nRebuttal: However, studies show academic benefits outweigh logistical challenges.',
      tip: 'Claim → Evidence → Counterargument → Rebuttal → Conclusion',
      prompt: 'Write a thesis statement and one body paragraph with evidence for this topic: "The impact of technology on education."',
      minWords: 150,
      maxWords: 400,
      gradeLevel: 9
    }
  ]
};

interface WritingRule {
  id: string;
  title: string;
  rule: string;
  demo: string;
  tip: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  gradeLevel: number;
}

interface WritingFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  corrected?: string;
}

interface WritingLessonPlayerProps {
  gradeLevel: number;
  childId: string;
  lessonId?: string;
  onComplete?: (score: number) => void;
  onBack?: () => void;
}

export default function WritingLessonPlayer({
  gradeLevel,
  childId,
  lessonId,
  onComplete,
  onBack
}: WritingLessonPlayerProps) {
  const { currentTheme } = useTheme();

  // NEW: Fetch writing rules from database (with fallback to hardcoded)
  const { writingRules: dbRules, loading: dbLoading, error: dbError } = useWritingLesson(gradeLevel);

  // Phase management: rules -> demo -> guided -> independent -> review -> complete
  const [phase, setPhase] = useState<'rules' | 'demo' | 'guided' | 'independent' | 'review' | 'complete'>('rules');
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [writing, setWriting] = useState('');
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [rulesSkipped, setRulesSkipped] = useState(false);

  // Get rules - prefer database, fallback to hardcoded
  const getRules = () => {
    if (dbRules && dbRules.length > 0) {
      console.log(`✅ Using DATABASE writing: ${dbRules.length} rules (grade ${gradeLevel})`);
      return dbRules;
    }
    const rules = WRITING_RULES[gradeLevel] || WRITING_RULES[Math.min(gradeLevel, 6)] || WRITING_RULES[6];
    console.log(`⚠️ Using HARDCODED writing: ${rules.length} rules (grade ${gradeLevel})`);
    if (dbError) console.log(`   DB Error: ${dbError}`);
    return rules;
  };

  const rules = dbLoading ? [] : getRules();
  const currentRule = rules[currentRuleIndex] || rules[0];

  // Count words in writing
  const wordCount = writing.trim().split(/\s+/).filter(w => w.length > 0).length;

  // Text-to-speech for Gigi
  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // AI feedback on writing (simplified - would call API in production)
  const getWritingFeedback = async (text: string, rule: WritingRule): Promise<WritingFeedback> => {
    // In production, this would call /api/writing-feedback
    // For now, provide basic feedback based on word count and structure

    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const hasCapital = /^[A-Z]/.test(text.trim());
    const hasPunctuation = /[.!?]$/.test(text.trim());

    let score = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Check word count
    if (wordCount >= rule.minWords) {
      score += 30;
      strengths.push(`Great job writing ${wordCount} words!`);
    } else {
      improvements.push(`Try to write at least ${rule.minWords} words. You wrote ${wordCount}.`);
    }

    // Check capitalization
    if (hasCapital) {
      score += 20;
      strengths.push('You started with a capital letter!');
    } else {
      improvements.push('Remember to start sentences with a capital letter.');
    }

    // Check punctuation
    if (hasPunctuation) {
      score += 20;
      strengths.push('Good use of punctuation!');
    } else {
      improvements.push('Don\'t forget punctuation at the end of sentences.');
    }

    // Check sentence count
    if (sentences.length >= 2) {
      score += 15;
      strengths.push(`You wrote ${sentences.length} sentences!`);
    } else if (rule.minWords > 10) {
      improvements.push('Try to write more than one sentence.');
    }

    // Bonus for meeting max word range
    if (wordCount <= rule.maxWords) {
      score += 15;
    }

    return {
      score: Math.min(100, score),
      strengths,
      improvements
    };
  };

  const handleSubmitWriting = async () => {
    if (wordCount < currentRule.minWords) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await getWritingFeedback(writing, currentRule);
      setFeedback(result);
      setTotalScore(prev => prev + result.score);
      setPhase('review');

      if (result.score >= 70) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextRule = () => {
    if (currentRuleIndex < rules.length - 1) {
      setCurrentRuleIndex(prev => prev + 1);
      setPhase('rules');
      setWriting('');
      setFeedback(null);
    } else {
      setPhase('complete');
      onComplete?.(Math.round(totalScore / rules.length));
    }
  };

  const handleSkipRules = () => {
    setRulesSkipped(true);
    setPhase('independent');
  };

  // Render different phases
  const renderPhase = () => {
    switch (phase) {
      case 'rules':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Gigi introduces the rule */}
            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <GigiCharacter size="md" showName={false} />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                      {currentRule.title}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-blue-600">The Rule:</span>
                    </div>
                    <p className="text-lg mb-4" style={{ color: currentTheme.colors.text }}>
                      {currentRule.rule}
                    </p>
                    <button
                      onClick={() => speakText(currentRule.rule)}
                      className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
                    >
                      <Volume2 className="h-4 w-4" />
                      Listen to Gigi explain
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tip box */}
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="p-4 flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-yellow-700">Tip: </span>
                  <span className="text-yellow-800">{currentRule.tip}</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setPhase('demo')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                See an Example
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={handleSkipRules}
                className="text-sm"
              >
                Skip to Writing
              </Button>
            </div>
          </motion.div>
        );

      case 'demo':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-6 w-6 text-green-500" />
                  <h3 className="text-xl font-bold text-green-700">Example:</h3>
                </div>
                <div className="bg-white/80 rounded-lg p-4 border border-green-200">
                  <pre className="whitespace-pre-wrap text-lg" style={{ color: currentTheme.colors.text }}>
                    {currentRule.demo}
                  </pre>
                </div>
              </div>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setPhase('rules')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Rule
              </Button>
              <Button
                onClick={() => setPhase('independent')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              >
                Now You Try!
                <PenTool className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 'guided':
      case 'independent':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Writing prompt */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PenTool className="h-5 w-5 text-purple-500" />
                  <span className="font-bold text-purple-700">Your Writing Task:</span>
                </div>
                <p className="text-lg" style={{ color: currentTheme.colors.text }}>
                  {currentRule.prompt}
                </p>
              </div>
            </Card>

            {/* Writing area */}
            <Card className={currentTheme.cardClass}>
              <div className="p-4">
                <Textarea
                  value={writing}
                  onChange={(e) => setWriting(e.target.value)}
                  placeholder="Start writing here..."
                  className="min-h-[200px] text-lg resize-none"
                  style={{ color: currentTheme.colors.text }}
                />

                {/* Word count */}
                <div className="mt-3 flex justify-between items-center text-sm">
                  <span style={{ color: currentTheme.colors.text }}>
                    Words: <span className={wordCount >= currentRule.minWords ? 'text-green-500 font-bold' : 'text-orange-500'}>
                      {wordCount}
                    </span>
                    {' / '}{currentRule.minWords} minimum
                  </span>
                  {wordCount > currentRule.maxWords && (
                    <span className="text-orange-500">
                      (Try to keep it under {currentRule.maxWords} words)
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Tip reminder */}
            {!rulesSkipped && (
              <div className="text-center text-sm opacity-70" style={{ color: currentTheme.colors.text }}>
                Remember: {currentRule.tip}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setPhase('demo')}
              >
                See Example Again
              </Button>
              <Button
                onClick={handleSubmitWriting}
                disabled={wordCount < currentRule.minWords || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                {isLoading ? 'Checking...' : 'Submit Writing'}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {showConfetti && <Confetti active={true} />}

            {/* Score display */}
            <Card className={`text-center p-6 ${feedback!.score >= 70 ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400' : 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-400'}`}>
              <div className="text-6xl mb-2">
                {feedback!.score >= 90 ? '🌟' : feedback!.score >= 70 ? '⭐' : '💪'}
              </div>
              <h3 className="text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>
                {feedback!.score}%
              </h3>
              <p className="text-lg" style={{ color: currentTheme.colors.text }}>
                {feedback!.score >= 90 ? 'Excellent!' : feedback!.score >= 70 ? 'Great job!' : 'Good effort!'}
              </p>
            </Card>

            {/* Strengths */}
            {feedback!.strengths.length > 0 && (
              <Card className="bg-green-50 border-green-200">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-green-700">What you did well:</span>
                  </div>
                  <ul className="space-y-2">
                    {feedback!.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-green-800">
                        <Star className="h-4 w-4 text-green-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* Improvements */}
            {feedback!.improvements.length > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-yellow-700">Tips for next time:</span>
                  </div>
                  <ul className="space-y-2">
                    {feedback!.improvements.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-yellow-800">
                        <ArrowRight className="h-4 w-4 text-yellow-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            <div className="flex justify-center">
              <Button
                onClick={handleNextRule}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                {currentRuleIndex < rules.length - 1 ? 'Next Lesson' : 'Finish!'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <Confetti active={true} />

            <Trophy className="h-24 w-24 mx-auto text-yellow-500" />

            <h2 className="text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>
              Writing Lesson Complete!
            </h2>

            <div className="flex justify-center gap-2">
              {[1, 2, 3].map(i => (
                <Star
                  key={i}
                  className={`h-12 w-12 ${Math.round(totalScore / rules.length) >= i * 30 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>

            <p className="text-xl" style={{ color: currentTheme.colors.text }}>
              Average Score: {Math.round(totalScore / rules.length)}%
            </p>

            <Button
              onClick={() => onBack?.()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            >
              Back to Lessons
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm hover:opacity-80"
          style={{ color: currentTheme.colors.primary }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: currentTheme.colors.text }}>
            Lesson {currentRuleIndex + 1} of {rules.length}
          </span>
          <div className="flex gap-1">
            {rules.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${i <= currentRuleIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Phase content */}
      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>
    </div>
  );
}
