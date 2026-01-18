'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Volume2, VolumeX, CheckCircle, XCircle, RotateCcw, Sparkles, Lightbulb, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { breakIntoPhonics, getSoundTypeColor, PhonicsChunk } from '@/lib/phonics';
import { useSpellingLesson } from '@/hooks/useSpellingLesson';

// Word lists by grade level (Arizona-aligned phonics progression)
const WORD_LISTS: Record<number, { words: string[]; rule: string; ruleExplanation: string }[]> = {
  // Kindergarten - CVC words, short vowels
  0: [
    {
      words: ['cat', 'bat', 'sat', 'hat', 'mat', 'rat'],
      rule: 'Short A (CVC)',
      ruleExplanation: 'Short A says "ah" like in "apple". These words follow the Consonant-Vowel-Consonant pattern.'
    },
    {
      words: ['bed', 'red', 'led', 'fed', 'wed', 'pet'],
      rule: 'Short E (CVC)',
      ruleExplanation: 'Short E says "eh" like in "elephant". Notice the pattern: consonant-vowel-consonant.'
    },
    {
      words: ['sit', 'hit', 'bit', 'fit', 'kit', 'pit'],
      rule: 'Short I (CVC)',
      ruleExplanation: 'Short I says "ih" like in "igloo". All these words have the same sound in the middle.'
    },
    {
      words: ['hot', 'pot', 'lot', 'got', 'not', 'dot'],
      rule: 'Short O (CVC)',
      ruleExplanation: 'Short O says "ah" like in "octopus". Listen for that sound in the middle.'
    },
    {
      words: ['cup', 'pup', 'sun', 'run', 'fun', 'bun'],
      rule: 'Short U (CVC)',
      ruleExplanation: 'Short U says "uh" like in "umbrella". Feel how your mouth makes this sound.'
    }
  ],
  // Grade 1 - Blends and digraphs
  1: [
    {
      words: ['ship', 'shop', 'shut', 'shed', 'fish', 'wish'],
      rule: 'SH Digraph',
      ruleExplanation: 'When S and H are together, they make the "sh" sound. Put your finger to your lips like you\'re saying "shhh!"'
    },
    {
      words: ['chip', 'chop', 'chat', 'chin', 'rich', 'such'],
      rule: 'CH Digraph',
      ruleExplanation: 'When C and H are together, they make the "ch" sound like a train: choo-choo!'
    },
    {
      words: ['this', 'that', 'them', 'then', 'with', 'bath'],
      rule: 'TH Digraph',
      ruleExplanation: 'When T and H are together, they make the "th" sound. Stick your tongue out a little!'
    },
    {
      words: ['black', 'block', 'blame', 'blank', 'blend', 'bless'],
      rule: 'BL Blend',
      ruleExplanation: 'When B and L are together, you hear both sounds: b-l. Say them fast together!'
    },
    {
      words: ['stop', 'step', 'star', 'stem', 'still', 'stick'],
      rule: 'ST Blend',
      ruleExplanation: 'When S and T are together, you hear both sounds: s-t. They blend together smoothly.'
    }
  ],
  // Grade 2 - Long vowels, silent E
  2: [
    {
      words: ['make', 'take', 'bake', 'lake', 'cake', 'wake'],
      rule: 'Magic E (Long A)',
      ruleExplanation: 'The silent E at the end is magic! It makes the A say its name: "ay". The E is silent but powerful!'
    },
    {
      words: ['time', 'mine', 'line', 'fine', 'dine', 'pine'],
      rule: 'Magic E (Long I)',
      ruleExplanation: 'The magic E makes the I say its name: "eye". The E doesn\'t make a sound, but it changes everything!'
    },
    {
      words: ['home', 'bone', 'cone', 'tone', 'zone', 'stone'],
      rule: 'Magic E (Long O)',
      ruleExplanation: 'The magic E makes the O say its name: "oh". See how the silent E changes the vowel sound?'
    },
    {
      words: ['rain', 'pain', 'main', 'gain', 'train', 'brain'],
      rule: 'AI Vowel Team',
      ruleExplanation: 'When A and I work together, the A says its name and the I stays quiet. "When two vowels go walking, the first one does the talking!"'
    },
    {
      words: ['boat', 'coat', 'goat', 'float', 'toast', 'roast'],
      rule: 'OA Vowel Team',
      ruleExplanation: 'When O and A work together, the O says its name and the A stays quiet. The first vowel talks!'
    }
  ],
  // Grade 3 - R-controlled vowels, complex patterns
  3: [
    {
      words: ['car', 'star', 'far', 'jar', 'barn', 'farm'],
      rule: 'AR (Bossy R)',
      ruleExplanation: 'When R comes after A, it\'s bossy! It changes the A sound to "ar" like a pirate says "arrr!"'
    },
    {
      words: ['her', 'fern', 'verb', 'term', 'clerk', 'nerve'],
      rule: 'ER (Bossy R)',
      ruleExplanation: 'The bossy R changes ER to make the "er" sound. You hear it in "her" and "term".'
    },
    {
      words: ['bird', 'girl', 'dirt', 'firm', 'first', 'shirt'],
      rule: 'IR (Bossy R)',
      ruleExplanation: 'IR makes the same "er" sound! The R is bossy and changes how I sounds.'
    },
    {
      words: ['corn', 'horn', 'born', 'storm', 'sport', 'short'],
      rule: 'OR (Bossy R)',
      ruleExplanation: 'When R comes after O, it makes the "or" sound. Think of "more" and "store".'
    },
    {
      words: ['turn', 'burn', 'hurt', 'nurse', 'curve', 'church'],
      rule: 'UR (Bossy R)',
      ruleExplanation: 'UR also makes the "er" sound! ER, IR, and UR all sound alike when the bossy R takes over.'
    }
  ],
  // Grade 4 - Double consonants, suffixes
  4: [
    {
      words: ['running', 'sitting', 'hopping', 'cutting', 'hitting', 'getting'],
      rule: 'Double Before -ING',
      ruleExplanation: 'When a short vowel word ends in one consonant, double it before adding -ing. Run becomes running!'
    },
    {
      words: ['happiness', 'sadness', 'kindness', 'darkness', 'weakness', 'madness'],
      rule: '-NESS Suffix',
      ruleExplanation: 'Add -ness to make a noun that means "the state of being." Happy becomes happiness!'
    },
    {
      words: ['careful', 'helpful', 'thankful', 'peaceful', 'hopeful', 'cheerful'],
      rule: '-FUL Suffix',
      ruleExplanation: 'Add -ful to mean "full of." Care becomes careful - full of care!'
    },
    {
      words: ['careless', 'helpless', 'thankless', 'fearless', 'hopeless', 'harmless'],
      rule: '-LESS Suffix',
      ruleExplanation: 'Add -less to mean "without." Care becomes careless - without care!'
    },
    {
      words: ['teacher', 'reader', 'player', 'singer', 'dancer', 'writer'],
      rule: '-ER Suffix (Person)',
      ruleExplanation: 'Add -er to make a word for someone who does something. Teach becomes teacher!'
    }
  ],
  // Grade 5 - Greek/Latin roots, complex words
  5: [
    {
      words: ['telephone', 'telegraph', 'telescope', 'television', 'teleport', 'telepathy'],
      rule: 'TELE- Prefix (Far)',
      ruleExplanation: 'TELE means "far" or "distant" in Greek. A telephone lets you hear sounds from far away!'
    },
    {
      words: ['bicycle', 'tricycle', 'unicycle', 'cycle', 'recycle', 'motorcycle'],
      rule: '-CYCLE Root (Circle)',
      ruleExplanation: 'CYCLE means "circle" or "wheel" in Greek. A bicycle has two wheels that go in circles!'
    },
    {
      words: ['autograph', 'automatic', 'automobile', 'autonomy', 'autobiography', 'autopilot'],
      rule: 'AUTO- Prefix (Self)',
      ruleExplanation: 'AUTO means "self" in Greek. An automobile moves by itself (with an engine, not horses)!'
    },
    {
      words: ['microscope', 'microphone', 'microwave', 'microbe', 'microchip', 'microbiology'],
      rule: 'MICRO- Prefix (Small)',
      ruleExplanation: 'MICRO means "small" in Greek. A microscope helps you see small things!'
    },
    {
      words: ['incredible', 'invisible', 'impossible', 'impatient', 'imperfect', 'immature'],
      rule: 'IN-/IM- Prefix (Not)',
      ruleExplanation: 'IN- and IM- mean "not" in Latin. Incredible means "not able to believe"!'
    }
  ]
};

interface SpellingLessonPlayerProps {
  kidId: string;
  skillId: string;
  grade?: number; // 0=K, 1-5
  lessonIndex?: number; // Which word list in the grade
  onComplete: (score: number, wordsCorrect: number, totalWords: number) => void;
  onBack: () => void;
}

export default function SpellingLessonPlayer({
  kidId,
  skillId,
  grade = 0,
  lessonIndex = 0,
  onComplete,
  onBack
}: SpellingLessonPlayerProps) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // NEW: Fetch word lists from database (with fallback to hardcoded)
  const { wordLists: dbWordLists, loading: dbLoading, error: dbError } = useSpellingLesson(grade);

  // State
  const [currentPhase, setCurrentPhase] = useState<'rules' | 'practice' | 'quiz' | 'complete'>('rules');
  const [wordList, setWordList] = useState<string[]>([]);
  const [currentRule, setCurrentRule] = useState('');
  const [ruleExplanation, setRuleExplanation] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState('');
  const [correctAttempts, setCorrectAttempts] = useState(0); // Need 3 to master
  const [showWord, setShowWord] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [wordsCorrect, setWordsCorrect] = useState(0);
  const [phonicsBreakdown, setPhonicsBreakdown] = useState<PhonicsChunk[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [streak, setStreak] = useState(0);

  // Initialize word list - prefer database, fallback to hardcoded
  useEffect(() => {
    // Wait for database fetch to complete
    if (dbLoading) return;

    // Try database word lists first
    if (dbWordLists && dbWordLists.length > 0) {
      const lesson = dbWordLists[lessonIndex % dbWordLists.length];
      console.log(`✅ Using DATABASE spelling: ${lesson.rule} (grade ${grade})`);
      setWordList(lesson.words);
      setCurrentRule(lesson.rule);
      setRuleExplanation(lesson.ruleExplanation);
      setPhonicsBreakdown(breakIntoPhonics(lesson.words[0] || ''));
    } else {
      // Fallback to hardcoded WORD_LISTS
      const gradeWords = WORD_LISTS[Math.min(grade, 5)] || WORD_LISTS[0];
      const lesson = gradeWords[lessonIndex % gradeWords.length];
      console.log(`⚠️ Using HARDCODED spelling: ${lesson.rule} (grade ${grade}) - DB had ${dbWordLists?.length || 0} lists`);
      if (dbError) console.log(`   DB Error: ${dbError}`);
      setWordList(lesson.words);
      setCurrentRule(lesson.rule);
      setRuleExplanation(lesson.ruleExplanation);
      setPhonicsBreakdown(breakIntoPhonics(lesson.words[0] || ''));
    }
  }, [grade, lessonIndex, dbWordLists, dbLoading, dbError]);

  // Focus input when in practice/quiz phase
  useEffect(() => {
    if (currentPhase === 'practice' || currentPhase === 'quiz') {
      inputRef.current?.focus();
    }
  }, [currentPhase, currentWordIndex]);

  // Play audio for current word
  const playWord = useCallback(async () => {
    const currentWord = wordList[currentWordIndex];
    if (!currentWord || isPlaying) return;

    setIsPlaying(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentWord, childId: kidId })
      });

      const data = await response.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
    }
  }, [wordList, currentWordIndex, isPlaying]);

  // Auto-play word when entering practice/quiz
  useEffect(() => {
    if ((currentPhase === 'practice' || currentPhase === 'quiz') && wordList.length > 0) {
      playWord();
    }
  }, [currentPhase, currentWordIndex]); // eslint-disable-line

  // Handle input change with real-time feedback
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim();
    setTypedWord(value);
    setFeedback(null); // Clear feedback while typing
  };

  // Check spelling when user submits
  const checkSpelling = () => {
    const currentWord = wordList[currentWordIndex];
    const isCorrect = typedWord.toLowerCase() === currentWord.toLowerCase();

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      const newAttempts = correctAttempts + 1;
      setCorrectAttempts(newAttempts);
      setStreak(prev => prev + 1);

      // Need 3 correct attempts to master the word
      if (newAttempts >= 3) {
        setWordsCorrect(prev => prev + 1);
        setWordsCompleted(prev => prev + 1);

        // Move to next word after a delay
        setTimeout(() => {
          moveToNextWord();
        }, 1500);
      } else {
        // Clear and try again
        setTimeout(() => {
          setTypedWord('');
          setFeedback(null);
          playWord();
        }, 1000);
      }
    } else {
      setStreak(0);
      setCorrectAttempts(0); // Reset attempts on wrong answer

      // Show the word briefly, then clear
      setShowWord(true);
      setTimeout(() => {
        setShowWord(false);
        setTypedWord('');
        setFeedback(null);
        playWord();
      }, 2000);
    }
  };

  // Move to next word
  const moveToNextWord = () => {
    const nextIndex = currentWordIndex + 1;

    if (nextIndex < wordList.length) {
      setCurrentWordIndex(nextIndex);
      setTypedWord('');
      setCorrectAttempts(0);
      setFeedback(null);
      setPhonicsBreakdown(breakIntoPhonics(wordList[nextIndex] || ''));
    } else {
      // All words done
      finishLesson();
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && typedWord.length > 0) {
      checkSpelling();
    }
  };

  // Finish lesson and calculate score
  const finishLesson = async () => {
    const totalWords = wordList.length;
    const score = Math.round((wordsCorrect / totalWords) * 100);
    const baseCoins = 10;
    const bonusCoins = wordsCorrect >= totalWords ? 15 : wordsCorrect >= totalWords * 0.8 ? 10 : 5;
    const total = baseCoins + bonusCoins;

    setCoinsEarned(total);
    setShowResult(true);
    setCurrentPhase('complete');

    try {
      // Award coins
      await supabase.rpc('add_coins', {
        p_child_id: kidId,
        p_amount: total,
        p_reason: `Spelling lesson - ${wordsCorrect}/${totalWords} words correct`
      });

      // Save progress
      await supabase.from('spelling_progress').upsert({
        child_id: kidId,
        current_grade: grade,
        current_lesson: lessonIndex,
        words_mastered: wordsCorrect,
        updated_at: new Date().toISOString()
      }, { onConflict: 'child_id' });

    } catch (err) {
      console.error('Failed to save spelling progress:', err);
    }
  };

  // Retry lesson
  const handleRetry = () => {
    setCurrentWordIndex(0);
    setTypedWord('');
    setCorrectAttempts(0);
    setWordsCompleted(0);
    setWordsCorrect(0);
    setFeedback(null);
    setShowResult(false);
    setStreak(0);
    setCurrentPhase('practice');
    setPhonicsBreakdown(breakIntoPhonics(wordList[0] || ''));
  };

  // Get letter feedback colors
  const getLetterColor = (index: number): string => {
    if (!typedWord[index]) return 'text-gray-400';
    const currentWord = wordList[currentWordIndex];
    if (typedWord[index] === currentWord[index]) {
      return 'text-green-500';
    }
    return 'text-red-500';
  };

  const currentWord = wordList[currentWordIndex] || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
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
              <span className="font-bold">{wordsCorrect}/{wordList.length}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">{streak}x</span>
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
            <div className="text-center mb-8">
              <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentRule}
              </h1>
              <p className="text-white/80 text-lg max-w-md mx-auto">
                {ruleExplanation}
              </p>
            </div>

            {/* Phonics breakdown of first word */}
            <div className="mb-8">
              <p className="text-center text-white/60 mb-4">Let's look at how to spell:</p>
              <div className="flex justify-center gap-3 mb-4">
                {phonicsBreakdown.map((chunk, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={`px-4 py-3 rounded-xl border-2 ${getSoundTypeColor(chunk.type)}`}
                  >
                    <span className="text-3xl font-bold uppercase">{chunk.letters}</span>
                    <p className="text-sm opacity-80">"{chunk.sound}"</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-white text-2xl font-bold">
                = {wordList[0]?.toUpperCase()}
              </p>
            </div>

            {/* Phonics type legend */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded" />
                <span className="text-white/80">Vowel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded" />
                <span className="text-white/80">Consonant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded" />
                <span className="text-white/80">Team</span>
              </div>
            </div>

            {/* Words to learn */}
            <div className="bg-white/5 rounded-2xl p-4 mb-8">
              <p className="text-center text-white/60 mb-3">Words you'll learn:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {wordList.map((word, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-white/10 rounded-lg text-white font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPhase('practice')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-2xl
                  shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105"
              >
                Start Spelling! 🎯
              </button>
            </div>
          </motion.div>
        )}

        {/* PRACTICE PHASE */}
        {(currentPhase === 'practice' || currentPhase === 'quiz') && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {wordList.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < currentWordIndex
                      ? 'bg-green-500'
                      : i === currentWordIndex
                      ? 'bg-blue-500'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Main spelling area */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">
              {/* Rule reminder */}
              <div className="text-center mb-4">
                <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                  {currentRule}
                </span>
              </div>

              {/* Audio play button */}
              <div className="text-center mb-6">
                <motion.button
                  onClick={playWord}
                  disabled={isPlaying}
                  whileTap={{ scale: 0.95 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all
                    ${isPlaying
                      ? 'bg-blue-500 animate-pulse'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50'
                    }`}
                >
                  {isPlaying ? (
                    <Volume2 className="w-12 h-12 text-white animate-bounce" />
                  ) : (
                    <Volume2 className="w-12 h-12 text-white" />
                  )}
                </motion.button>
                <p className="mt-3 text-white/60">
                  {isPlaying ? 'Listen...' : 'Click to hear the word'}
                </p>
              </div>

              {/* Attempts indicator */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3].map((attempt) => (
                  <div
                    key={attempt}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${correctAttempts >= attempt
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white/50'
                      }`}
                  >
                    {correctAttempts >= attempt ? '✓' : attempt}
                  </div>
                ))}
                <span className="text-white/60 ml-2 self-center text-sm">
                  Type it 3 times correctly!
                </span>
              </div>

              {/* Show word hint (after mistake) */}
              <AnimatePresence>
                {showWord && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center mb-4 bg-yellow-500/20 rounded-xl p-3"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Eye className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Look carefully:</span>
                    </div>
                    <p className="text-3xl font-bold text-white mt-2 tracking-widest">
                      {currentWord.toUpperCase()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Letter boxes for visual feedback */}
              <div className="flex justify-center gap-2 mb-6">
                {currentWord.split('').map((letter, i) => (
                  <div
                    key={i}
                    className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold uppercase
                      ${typedWord[i]
                        ? typedWord[i] === letter
                          ? 'border-green-400 bg-green-500/20 text-green-400'
                          : 'border-red-400 bg-red-500/20 text-red-400'
                        : 'border-white/30 bg-white/10 text-transparent'
                      }`}
                  >
                    {typedWord[i] || '_'}
                  </div>
                ))}
              </div>

              {/* Input field */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedWord}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type the word here..."
                  className="w-full px-6 py-4 text-2xl text-center font-bold rounded-2xl
                    bg-white/10 border-2 border-white/30 text-white placeholder-white/40
                    focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30
                    transition-all"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />

                {/* Feedback overlay */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 rounded-2xl flex items-center justify-center
                        ${feedback === 'correct' ? 'bg-green-500/90' : 'bg-red-500/90'}`}
                    >
                      {feedback === 'correct' ? (
                        <div className="text-center">
                          <CheckCircle className="w-12 h-12 text-white mx-auto mb-2" />
                          <p className="text-white font-bold text-xl">
                            {correctAttempts >= 3 ? 'Mastered! 🌟' : `${correctAttempts}/3 Correct!`}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <XCircle className="w-12 h-12 text-white mx-auto mb-2" />
                          <p className="text-white font-bold text-xl">Try again!</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit button */}
              <div className="text-center mt-6">
                <button
                  onClick={checkSpelling}
                  disabled={typedWord.length === 0 || feedback !== null}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl
                    disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30
                    transition-all"
                >
                  Check Spelling ✓
                </button>
              </div>

              {/* Phonics hint button */}
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowWord(true)}
                  className="text-white/50 hover:text-white/80 text-sm flex items-center gap-1 mx-auto"
                >
                  <Lightbulb className="w-4 h-4" />
                  Need a hint?
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULTS */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center"
          >
            <div className="mb-6">
              {wordsCorrect >= wordList.length * 0.8 ? (
                <>
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Amazing Speller!</h2>
                  <p className="text-white/80">You mastered the {currentRule} words!</p>
                </>
              ) : (
                <>
                  <Star className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Good Effort!</h2>
                  <p className="text-white/80">Keep practicing those spelling rules!</p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-2xl p-4">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{wordsCorrect}</p>
                <p className="text-white/60">Words Mastered</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <span className="text-3xl block mb-2">📚</span>
                <p className="text-3xl font-bold text-white">{wordList.length}</p>
                <p className="text-white/60">Total Words</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">+{coinsEarned}</p>
                <p className="text-white/60">Coins Earned</p>
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
                Practice Again
              </button>
              <button
                onClick={() => onComplete(coinsEarned, wordsCorrect, wordList.length)}
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
