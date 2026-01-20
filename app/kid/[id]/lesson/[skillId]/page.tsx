'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Play, CheckCircle, Star, ChevronRight, Trophy, HelpCircle, Lightbulb, AlertCircle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeAndUpdateLearningProfile, shouldUpdateProfile } from '@/lib/learning-profile-analyzer';
import TypingLessonPlayer from '@/components/lesson/TypingLessonPlayer';
import SpellingLessonPlayer from '@/components/lesson/SpellingLessonPlayer';
import MathLessonPlayer from '@/components/lesson/MathLessonPlayer';
import WritingLessonPlayer from '@/components/lesson/WritingLessonPlayer';
import CodingLessonPlayer from '@/components/lesson/CodingLessonPlayer';
import ReadingLessonPlayer from '@/components/lesson/ReadingLessonPlayer';
import { useTheme } from '@/lib/theme-context';

interface DemoProblem {
  problem: string;
  answer: string;
  explanation: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  // NEW: Specific feedback for each wrong answer (will be populated by Grok later)
  wrong_answer_feedback?: Record<string, string>;
}

interface LessonContent {
  id: string;
  skill_id: string;
  skill_name: string;
  subject_code: string;
  rules_text: string;
  demo_problems: DemoProblem[];
  quiz_questions: QuizQuestion[];
  explanation_level_2?: string;
  explanation_level_3?: string;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const kidId = params.id as string;
  const skillId = params.skillId as string;

  const supabase = createClient();

  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'rules' | 'demo' | 'practice' | 'quiz' | 'complete'>('rules');
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [showDemoAnswer, setShowDemoAnswer] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [practiceResult, setPracticeResult] = useState<'correct' | 'wrong' | null>(null);
  const [explanationLevel, setExplanationLevel] = useState(1);
  // Help button state
  const [showHelp, setShowHelp] = useState(false);
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpAnswer, setHelpAnswer] = useState<string | null>(null);
  const [helpSource, setHelpSource] = useState<"library" | "claude" | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  // Themed content state
  const [themedGreeting, setThemedGreeting] = useState<string>('');
  const [themedCelebration, setThemedCelebration] = useState<{ main: string; secondary?: string }>({ main: '' });

  // GIGI AUTO-READ STATE
  const [isGigiReading, setIsGigiReading] = useState(false);
  const [gigiHasRead, setGigiHasRead] = useState(false);
  const hasStartedReading = useRef(false); // Prevent double execution in React strict mode

  // ADAPTIVE LEARNING: Track answer attempts
  const questionStartTime = useRef<number>(Date.now());
  const [totalAnswersThisSession, setTotalAnswersThisSession] = useState(0);

  // Record an answer attempt to the database for adaptive learning
  const recordAnswerAttempt = async (
    questionText: string,
    answerGiven: string,
    isCorrect: boolean,
    helpRequested: boolean = false
  ) => {
    if (!lesson) return;

    const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000);

    try {
      await supabase.from('answer_attempts').insert({
        child_id: kidId,
        skill_id: skillId,
        question_text: questionText,
        answer_given: answerGiven,
        is_correct: isCorrect,
        time_spent_seconds: timeSpent,
        help_requested: helpRequested,
        tutor_intervened: showHelp
      });

      // Increment session counter
      const newTotal = totalAnswersThisSession + 1;
      setTotalAnswersThisSession(newTotal);

      // Check if we should update learning profile (every 20 questions)
      if (newTotal % 20 === 0) {
        const shouldUpdate = await shouldUpdateProfile(kidId);
        if (shouldUpdate) {
          console.log('Updating learning profile after 20 questions...');
          await analyzeAndUpdateLearningProfile(kidId);
        }
      }
    } catch (err) {
      console.error('Failed to record answer attempt:', err);
    }

    // Reset timer for next question
    questionStartTime.current = Date.now();
  };

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        console.log('Fetching lesson with skillId:', skillId);
        const { data, error } = await supabase
          .from('lesson_content')
          .select('*')
          .eq('skill_id', skillId)
          .single();
        console.log('Lesson data:', data, 'Error:', error);

        // If no content exists, try to generate it
        if (error && error.code === 'PGRST116') {
          console.log('No lesson content found, generating...');
          setIsGenerating(true);

          // Call the edge function to generate lesson content
          const genResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-lesson-v2`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ skill_id: skillId }),
            }
          );

          const genResult = await genResponse.json();
          console.log('Generation result:', genResult);

          if (genResult.error) {
            throw new Error(genResult.error);
          }

          // Fetch the newly generated content
          const { data: newData, error: newError } = await supabase
            .from('lesson_content')
            .select('*')
            .eq('skill_id', skillId)
            .single();

          if (newError) throw newError;
          setLesson(newData);
          setIsGenerating(false);
        } else if (error) {
          throw error;
        } else {
          setLesson(data);
        }
      } catch (err: any) {
        console.error('Lesson fetch error:', err);
        setError(err.message || 'Failed to load lesson');
        setIsGenerating(false);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [skillId]);

  // Fetch themed greeting on load
  useEffect(() => {
    async function fetchThemedGreeting() {
      try {
        const response = await fetch(`/api/themed-content?kidId=${kidId}&type=greeting`);
        const data = await response.json();
        console.log('Themed greeting response:', data);
        if (data.greeting) {
          setThemedGreeting(data.greeting);
        }
      } catch (err) {
        console.error('Failed to fetch themed greeting:', err);
      }
    }
    if (kidId) {
      fetchThemedGreeting();
    }
  }, [kidId]);

  // GIGI AUTO-READ: Start reading the lesson when it loads (using ElevenLabs)
  useEffect(() => {
    let audioElement: HTMLAudioElement | null = null;
    let isCancelled = false; // For cleanup

    async function startGigiReading() {
      // Prevent double execution (React strict mode runs effects twice)
      if (hasStartedReading.current) return;
      if (!lesson || gigiHasRead || currentPhase !== 'rules') return;

      hasStartedReading.current = true; // Mark as started

      // Get child's grade level to determine if we should auto-read
      const { data: child } = await supabase
        .from('children')
        .select('grade_level')
        .eq('id', kidId)
        .single();

      const gradeLevel = parseInt(child?.grade_level || '3');

      // Auto-read for grades K-5 (0-5), optional for 6+
      if (gradeLevel <= 5) {
        setIsGigiReading(true);

        // Use the actual TTS API (with parent's cloned voice if available)
        const textToRead = `Hey! Are you ready to learn? Let's go! ${lesson.rules_text}`;

        try {
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToRead, childId: kidId })
          });

          const data = await response.json();

          // Don't play if cleanup was called while fetching
          if (isCancelled) return;

          if (data.audio) {
            // Play the audio
            audioElement = new Audio(`data:audio/mpeg;base64,${data.audio}`);
            audioElement.onended = () => {
              setIsGigiReading(false);
              setGigiHasRead(true);
            };
            audioElement.onerror = () => {
              setIsGigiReading(false);
              setGigiHasRead(true);
            };
            setCurrentAudio(audioElement);
            audioElement.play();
          } else {
            console.error('No audio data returned');
            setIsGigiReading(false);
            setGigiHasRead(true);
          }
        } catch (err) {
          console.error('TTS error:', err);
          setIsGigiReading(false);
          setGigiHasRead(true);
        }
      } else {
        // Older kids can read themselves
        setGigiHasRead(true);
      }
    }

    startGigiReading();

    // Cleanup: stop audio if navigating away
    return () => {
      isCancelled = true;
      if (audioElement) {
        audioElement.pause();
        audioElement = null;
      }
      // Reset for new lessons
      hasStartedReading.current = false;
    };
  }, [lesson, currentPhase, kidId, gigiHasRead]);

  // Generate simpler explanations if not in database yet
  const getExplanationForLevel = (level: number): string => {
    if (!lesson) return '';
    
    if (level === 1) {
      return lesson.rules_text || 'No rules available.';
    }
    
    if (level === 2) {
      if (lesson.explanation_level_2) return lesson.explanation_level_2;
      return `Let me break this down more simply:\n\n${lesson.rules_text}\n\n💡 Key point: Focus on one step at a time. Don't worry about getting it perfect right away!`;
    }
    
    if (level === 3) {
      if (lesson.explanation_level_3) return lesson.explanation_level_3;
      return `Let me explain this like we're just starting out:\n\n${lesson.rules_text}\n\n🌟 Think of it this way: Imagine you're teaching this to a friend. What's the ONE most important thing to remember?\n\n✨ You've got this! Take your time and ask for help anytime.`;
    }
    
    return lesson.rules_text || '';
  };

  // NEW: Get specific feedback for wrong answer
  const getWrongAnswerFeedback = (question: QuizQuestion, wrongAnswer: string): string => {
    // Check if we have pre-generated feedback for this specific wrong answer
    if (question.wrong_answer_feedback && question.wrong_answer_feedback[wrongAnswer]) {
      return question.wrong_answer_feedback[wrongAnswer];
    }
    
    // Generate helpful feedback based on the answer chosen
    const correct = question.correct_answer;
    
    // Check if it's a number-based question (math)
    const wrongNum = parseFloat(wrongAnswer);
    const correctNum = parseFloat(correct);
    
    if (!isNaN(wrongNum) && !isNaN(correctNum)) {
      if (wrongNum < correctNum) {
        return `You got ${wrongAnswer}, but the answer is a bit bigger. The correct answer is ${correct}. ${question.explanation}`;
      } else if (wrongNum > correctNum) {
        return `You got ${wrongAnswer}, but the answer is a bit smaller. The correct answer is ${correct}. ${question.explanation}`;
      }
    }
    
    // Check if answers are similar (off by one character, common typo)
    if (wrongAnswer.toLowerCase().includes(correct.toLowerCase().substring(0, 3))) {
      return `Close! You picked "${wrongAnswer}" but the correct answer is "${correct}". ${question.explanation}`;
    }
    
    // Default feedback with encouragement
    return `You picked "${wrongAnswer}". The correct answer is "${correct}". ${question.explanation}\n\n💪 Don't worry - mistakes help us learn!`;
  };

  const handleIDontGetIt = async () => {
    // Show themed "stuck" response
    try {
      const subjectCode = lesson?.subject_code || 'Math';
      const response = await fetch(`/api/themed-content?kidId=${kidId}&type=stuck&subject=${subjectCode}&questionType=dont_get_it`);
      const data = await response.json();
      if (data.response) {
        // You could display this in a toast/alert
        console.log('Themed stuck response:', data.response);
      }
    } catch (err) {
      console.error('Failed to fetch themed stuck response:', err);
    }

    if (explanationLevel < 3) {
      setExplanationLevel(prev => prev + 1);
    }
  };

  // Text-to-speech using ElevenLabs Jessica voice (premium, natural sound)
  const speakText = async (text: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // Call the TTS API (with parent's cloned voice if available)
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, childId: kidId })
      });

      if (!response.ok) {
        console.error('TTS API failed:', response.status);
        return;
      }

      const data = await response.json();

      // Convert base64 audio to playable audio
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Store reference to current audio
      setCurrentAudio(audio);

      // Play the natural-sounding voice
      audio.play();

      // Cleanup when done
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
      };
    } catch (err) {
      console.error('Failed to speak text:', err);
    }
  };

  // Ask Gigi for help - checks library first, then Claude
  const handleAskForHelp = async () => {
    if (!lesson) return;

    // STOP any currently playing audio to prevent echo
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    window.speechSynthesis?.cancel();
    setIsGigiReading(false);

    setHelpLoading(true);
    setShowHelp(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `I need help understanding: ${lesson.skill_name}. ${lesson.rules_text}` }],
          childId: kidId,
          skillId: skillId,
          subjectCode: lesson.subject_code
        })
      });
      const data = await response.json();
      setHelpAnswer(data.message);
      setHelpSource(data.source || "claude");

      // Speak the response
      if (data.message) {
        speakText(data.message);
      }
    } catch (err) {
      setHelpAnswer("Sorry, I could not get help right now. Please try again!");
    } finally {
      setHelpLoading(false);
    }
  };

  const phases = ['rules', 'demo', 'practice', 'quiz', 'complete'];
  const currentPhaseIndex = phases.indexOf(currentPhase);

  const handleNextDemo = () => {
    if (!lesson) return;
    setShowDemoAnswer(false);
    if (currentDemoIndex < lesson.demo_problems.length - 1) {
      setCurrentDemoIndex(prev => prev + 1);
    } else {
      setCurrentPhase('practice');
    }
  };

  const practiceProblems = lesson?.quiz_questions?.slice(0, 3) || [];

  const handlePracticeSubmit = async () => {
    if (!practiceProblems[practiceIndex] || !selectedAnswer) return;
    const correct = selectedAnswer === practiceProblems[practiceIndex].correct_answer;
    setPracticeResult(correct ? 'correct' : 'wrong');

    // ADAPTIVE LEARNING: Record this answer attempt
    await recordAnswerAttempt(
      practiceProblems[practiceIndex].question,
      selectedAnswer,
      correct,
      showHelp
    );

    if (correct) {
      setPracticeScore(prev => prev + 1);
      setCoinsEarned(prev => prev + 5);
    }
    // No penalty for wrong answers - just encouragement!
  };

  const handleNextPractice = () => {
    setSelectedAnswer(null);
    setPracticeResult(null);
    if (practiceIndex < practiceProblems.length - 1) {
      setPracticeIndex(prev => prev + 1);
    } else {
      setCurrentPhase('quiz');
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
    }
  };

  const quizQuestions = lesson?.quiz_questions || [];

  const handleQuizSubmit = async () => {
    if (!quizQuestions[currentQuizIndex] || !selectedAnswer) return;
    const correct = selectedAnswer === quizQuestions[currentQuizIndex].correct_answer;
    setQuizResult(correct ? 'correct' : 'wrong');
    setShowExplanation(true);

    // ADAPTIVE LEARNING: Record this answer attempt
    await recordAnswerAttempt(
      quizQuestions[currentQuizIndex].question,
      selectedAnswer,
      correct,
      showHelp
    );

    if (correct) {
      setQuizScore(prev => prev + 1);
      setCoinsEarned(prev => prev + 10);
    }
    // No penalty for wrong answers - just encouragement!
  };

  const handleNextQuiz = async () => {
    setSelectedAnswer(null);
    setQuizResult(null);
    setShowExplanation(false);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      // Fetch celebration BEFORE switching to complete phase
      try {
        const celebrationResponse = await fetch(`/api/themed-content?kidId=${kidId}&type=achievement&achievementType=first_lesson`);
        const celebrationData = await celebrationResponse.json();
        console.log('Achievement celebration data:', celebrationData);
        if (celebrationData.main) {
          setThemedCelebration({
            main: celebrationData.main,
            secondary: celebrationData.secondary
          });
        }
      } catch (err) {
        console.error('Failed to fetch celebration:', err);
      }

      setCurrentPhase('complete');
      saveProgress();
    }
  };

  const saveProgress = async () => {
    try {
      const totalQuestions = quizQuestions.length;
      const percentage = totalQuestions > 0 ? Math.round((quizScore / totalQuestions) * 100) : 0;
      const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
      await supabase.from('lesson_progress').upsert({
        child_id: kidId,
        skill_id: skillId,
        subject_code: lesson?.subject_code,
        skill_name: lesson?.skill_name,
        completed: true,
        score: percentage,
        stars: stars,
        completed_at: new Date().toISOString()
      }, { onConflict: 'child_id,skill_id' });
      if (coinsEarned > 0) {
        const { data: child } = await supabase.from('children').select('coins').eq('id', kidId).single();
        if (child) {
          await supabase.from('children').update({ coins: (child.coins || 0) + coinsEarned }).eq('id', kidId);
        }
      }

      // Achievement celebration already fetched in handleNextQuiz
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  if (loading || isGenerating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-bold text-xl">
            {isGenerating ? 'Creating your lesson with AI...' : 'Loading lesson...'}
          </p>
          {isGenerating && (
            <p className="text-white/70 mt-2">This takes about 15-30 seconds</p>
          )}
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <p className="text-white font-bold text-xl mb-4">😕 Lesson not found</p>
          <p className="text-white/70 mb-6">{error || 'This lesson is not available yet.'}</p>
          <button onClick={() => router.back()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl">Go Back</button>
        </div>
      </div>
    );
  }

  // TYPING LESSONS: Use specialized typing interface
  if (lesson.subject_code === 'TYPING' || lesson.subject_code === 'Typing') {
    // Extract phase number from skill_id or default to 1
    const phaseMatch = skillId.match(/phase-(\d+)/i) || skillId.match(/(\d+)/);
    const typingPhase = phaseMatch ? parseInt(phaseMatch[1]) : 1;

    return (
      <TypingLessonPlayer
        kidId={kidId}
        skillId={skillId}
        phase={typingPhase}
        onComplete={async (score, wpm, accuracy) => {
          // Award coins based on performance
          const earnedCoins = Math.round(score * 2);
          setCoinsEarned(earnedCoins);

          // Save progress to database
          try {
            const stars = accuracy >= 95 ? 3 : accuracy >= 80 ? 2 : accuracy >= 60 ? 1 : 0;
            await supabase.from('lesson_progress').upsert({
              child_id: kidId,
              skill_id: skillId,
              subject_code: 'TYPING',
              skill_name: lesson.skill_name,
              completed: true,
              score: Math.round(accuracy),
              stars: stars,
              completed_at: new Date().toISOString()
            }, { onConflict: 'child_id,skill_id' });

            // Update child's coins
            if (earnedCoins > 0) {
              const { data: child } = await supabase.from('children').select('coins').eq('id', kidId).single();
              if (child) {
                await supabase.from('children').update({ coins: (child.coins || 0) + earnedCoins }).eq('id', kidId);
              }
            }

            // Save typing-specific progress
            await supabase.from('typing_progress').upsert({
              child_id: kidId,
              phase: typingPhase,
              highest_wpm: wpm,
              highest_accuracy: accuracy,
              total_practice_minutes: 5, // Estimate
              completed_at: new Date().toISOString()
            }, { onConflict: 'child_id,phase' });

          } catch (err) {
            console.error('Failed to save typing progress:', err);
          }
        }}
        onBack={() => router.back()}
      />
    );
  }

  // SPELLING LESSONS: Use specialized spelling interface with audio
  if (lesson.subject_code === 'SPELLING' || lesson.subject_code === 'Spelling') {
    // Extract grade level and lesson index from skill_id
    // Format: SPELLING_K_1 (Kindergarten lesson 1) or SPELLING_3_2 (Grade 3 lesson 2)
    const gradeMatch = skillId.match(/SPELLING[_-](\d+|K)[_-](\d+)/i);
    let grade = 0;
    let lessonIndex = 0;

    if (gradeMatch) {
      grade = gradeMatch[1].toUpperCase() === 'K' ? 0 : parseInt(gradeMatch[1]);
      lessonIndex = parseInt(gradeMatch[2]) - 1; // Convert to 0-indexed
    }

    return (
      <SpellingLessonPlayer
        kidId={kidId}
        skillId={skillId}
        grade={grade}
        lessonIndex={lessonIndex}
        onComplete={async (score, wordsCorrect, totalWords) => {
          // Award coins based on performance
          const earnedCoins = score;
          setCoinsEarned(earnedCoins);

          // Save progress to database
          try {
            const percentage = Math.round((wordsCorrect / totalWords) * 100);
            const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

            await supabase.from('lesson_progress').upsert({
              child_id: kidId,
              skill_id: skillId,
              subject_code: 'SPELLING',
              skill_name: lesson.skill_name,
              completed: true,
              score: percentage,
              stars: stars,
              completed_at: new Date().toISOString()
            }, { onConflict: 'child_id,skill_id' });

            // Update child's coins
            if (earnedCoins > 0) {
              const { data: child } = await supabase.from('children').select('coins').eq('id', kidId).single();
              if (child) {
                await supabase.from('children').update({ coins: (child.coins || 0) + earnedCoins }).eq('id', kidId);
              }
            }

          } catch (err) {
            console.error('Failed to save spelling progress:', err);
          }
        }}
        onBack={() => router.back()}
      />
    );
  }

  // MATH LESSONS: Use specialized math interface with visuals
  if (lesson.subject_code === 'MATH' || lesson.subject_code === 'Math') {
    // Extract grade level and lesson index from skill_id
    // Format: MATH_K_1 or MATH_3_MULTIPLICATION_1
    const gradeMatch = skillId.match(/MATH[_-](\d+|K)/i);
    const lessonMatch = skillId.match(/_(\d+)$/);
    let grade = 0;
    let lessonIndex = 0;

    if (gradeMatch) {
      grade = gradeMatch[1].toUpperCase() === 'K' ? 0 : parseInt(gradeMatch[1]);
    }
    if (lessonMatch) {
      lessonIndex = parseInt(lessonMatch[1]) - 1;
    }

    return (
      <MathLessonPlayer
        kidId={kidId}
        skillId={skillId}
        grade={grade}
        lessonIndex={lessonIndex}
        onComplete={async (score, correct, total) => {
          const earnedCoins = score;
          setCoinsEarned(earnedCoins);

          try {
            const percentage = Math.round((correct / total) * 100);
            const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

            await supabase.from('lesson_progress').upsert({
              child_id: kidId,
              skill_id: skillId,
              subject_code: 'MATH',
              skill_name: lesson.skill_name,
              completed: true,
              score: percentage,
              stars: stars,
              completed_at: new Date().toISOString()
            }, { onConflict: 'child_id,skill_id' });

            if (earnedCoins > 0) {
              const { data: child } = await supabase.from('children').select('coins').eq('id', kidId).single();
              if (child) {
                await supabase.from('children').update({ coins: (child.coins || 0) + earnedCoins }).eq('id', kidId);
              }
            }
          } catch (err) {
            console.error('Failed to save math progress:', err);
          }
        }}
        onBack={() => router.back()}
      />
    );
  }

  // WRITING LESSONS: Use specialized writing interface
  if (lesson.subject_code === 'WRITING' || lesson.subject_code === 'Writing') {
    const gradeMatch = skillId.match(/WRITING[_-](\d+|K)/i);
    let grade = 0;
    if (gradeMatch) {
      grade = gradeMatch[1].toUpperCase() === 'K' ? 0 : parseInt(gradeMatch[1]);
    }

    return (
      <WritingLessonPlayer
        gradeLevel={grade}
        childId={kidId}
        lessonId={skillId}
        onComplete={async (score) => {
          setCoinsEarned(score);
          try {
            const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
            await supabase.from('lesson_progress').upsert({
              child_id: kidId,
              skill_id: skillId,
              subject_code: 'WRITING',
              skill_name: lesson.skill_name,
              completed: true,
              score: score,
              stars: stars,
              completed_at: new Date().toISOString()
            }, { onConflict: 'child_id,skill_id' });

            if (score > 0) {
              const { data: child } = await supabase.from('children').select('coins').eq('id', kidId).single();
              if (child) {
                await supabase.from('children').update({ coins: (child.coins || 0) + score }).eq('id', kidId);
              }
            }
          } catch (err) {
            console.error('Failed to save writing progress:', err);
          }
        }}
        onBack={() => router.back()}
      />
    );
  }

  // CODING LESSONS: Use specialized coding interface
  if (lesson.subject_code === 'CODING' || lesson.subject_code === 'Coding') {
    const gradeMatch = skillId.match(/CODING[_-](\d+|K)/i);
    let grade = 0;
    if (gradeMatch) {
      grade = gradeMatch[1].toUpperCase() === 'K' ? 0 : parseInt(gradeMatch[1]);
    }

    return (
      <CodingLessonPlayer
        childId={kidId}
        grade={grade}
        lessonId={skillId}
        onComplete={async (score, total) => {
          const earnedCoins = score >= 80 ? 50 : 25;
          setCoinsEarned(earnedCoins);
          try {
            const percentage = Math.round((score / total) * 100);
            const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
            await supabase.from('lesson_progress').upsert({
              child_id: kidId,
              skill_id: skillId,
              subject_code: 'CODING',
              skill_name: lesson.skill_name,
              completed: true,
              score: percentage,
              stars: stars,
              completed_at: new Date().toISOString()
            }, { onConflict: 'child_id,skill_id' });

            if (earnedCoins > 0) {
              const { data: child } = await supabase.from('children').select('coins').eq('id', kidId).single();
              if (child) {
                await supabase.from('children').update({ coins: (child.coins || 0) + earnedCoins }).eq('id', kidId);
              }
            }
          } catch (err) {
            console.error('Failed to save coding progress:', err);
          }
        }}
        onBack={() => router.back()}
      />
    );
  }

  // READING LESSONS: Use specialized reading interface with Lexile levels
  if (lesson.subject_code === 'READING' || lesson.subject_code === 'Reading') {
    const gradeMatch = skillId.match(/READING[_-](\d+|K)/i);
    let grade = 0;
    if (gradeMatch) {
      grade = gradeMatch[1].toUpperCase() === 'K' ? 0 : parseInt(gradeMatch[1]);
    }

    return (
      <ReadingLessonPlayer
        childId={kidId}
        gradeLevel={grade}
        lessonId={skillId}
        onComplete={async (coinsEarned, correct, total) => {
          setCoinsEarned(coinsEarned);
          try {
            const percentage = Math.round((correct / total) * 100);
            const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
            await supabase.from('lesson_progress').upsert({
              child_id: kidId,
              skill_id: skillId,
              subject_code: 'READING',
              skill_name: lesson.skill_name,
              completed: true,
              score: percentage,
              stars: stars,
              completed_at: new Date().toISOString()
            }, { onConflict: 'child_id,skill_id' });

            // Save reading-specific progress
            await supabase.from('reading_progress').upsert({
              child_id: kidId,
              story_id: skillId,
              comprehension_score: percentage,
              completed_at: new Date().toISOString()
            }, { onConflict: 'child_id,story_id' });

            if (coinsEarned > 0) {
              const { data: child } = await supabase.from('children').select('coins').eq('id', kidId).single();
              if (child) {
                await supabase.from('children').update({ coins: (child.coins || 0) + coinsEarned }).eq('id', kidId);
              }
            }
          } catch (err) {
            console.error('Failed to save reading progress:', err);
          }
        }}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black"
    >
      <div
        className="backdrop-blur-lg border-b"
        style={{
          background: `${currentTheme.colors.primary}15`,
          borderColor: `${currentTheme.colors.primary}30`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg transition-colors"
              style={{ background: `${currentTheme.colors.primary}20` }}
            >
              <ArrowLeft className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
            </button>
            <div>
              <h1 className="text-xl font-bold" style={{ color: currentTheme.colors.primary }}>{lesson.skill_name}</h1>
              <p className="text-white/60 text-sm">{lesson.subject_code}</p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: `${currentTheme.colors.secondary}30` }}
          >
            <span className="text-2xl">{currentTheme.mascot}</span>
            <span className="font-bold" style={{ color: currentTheme.colors.secondary }}>+{coinsEarned}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between mb-8">
          {['rules', 'demo', 'practice', 'quiz'].map((phase, index) => (
            <div key={phase} className="flex items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all"
                style={{
                  background: currentPhase === phase
                    ? currentTheme.colors.primary
                    : index < currentPhaseIndex
                    ? currentTheme.colors.secondary
                    : 'rgba(255,255,255,0.2)',
                  color: currentPhase === phase ? 'white' : index < currentPhaseIndex ? 'white' : 'rgba(255,255,255,0.6)',
                  transform: currentPhase === phase ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: currentPhase === phase ? `0 10px 25px ${currentTheme.colors.primary}50` : 'none'
                }}
              >
                {index < currentPhaseIndex ? <CheckCircle className="w-6 h-6" /> : <span className="text-lg">{['📚', '🎬', '✏️', '⭐'][index]}</span>}
              </div>
              {index < 3 && (
                <div
                  className="w-12 sm:w-20 h-1 mx-1 sm:mx-2 rounded transition-all"
                  style={{
                    background: index < currentPhaseIndex ? currentTheme.colors.secondary : 'rgba(255,255,255,0.2)'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-lg rounded-2xl p-6 border"
            style={{
              background: `${currentTheme.colors.primary}15`,
              borderColor: `${currentTheme.colors.primary}30`
            }}
          >

            {currentPhase === 'rules' && (
              <div>
                {themedGreeting && (
                  <div className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                    <p className="text-white text-xl text-center font-bold">{themedGreeting}</p>
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-3xl">📚</span>Learn the Rules
                  </h2>
                  {explanationLevel > 1 && (
                    <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full">
                      <Lightbulb className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 text-sm font-bold">Level {explanationLevel} Explanation</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={explanationLevel}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap"
                    >
                      {getExplanationForLevel(explanationLevel)}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {explanationLevel < 3 && (
                  <button 
                    onClick={handleIDontGetIt}
                    className="w-full mb-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-400 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <HelpCircle className="w-5 h-5" />
                    I Don&apos;t Get It - Explain Simpler
                  </button>
                )}
                
                {explanationLevel === 3 && (
                  <div className="w-full mb-4 bg-green-500/20 border border-green-500/50 text-green-400 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    This is the simplest explanation - You&apos;ve got this!
                  </div>
                )}

                {/* Ask Gigi for Help Button */}
                <button
                  onClick={handleAskForHelp}
                  disabled={helpLoading}
                  className="w-full mb-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  {helpLoading ? "Asking Gigi..." : "Ask Gigi for Help"}
                </button>

                {/* Help Answer Display */}
                {showHelp && helpAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full mb-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <p className="text-blue-400 font-bold text-sm mb-1">
                          Gigi {helpSource === "library" ? "(from library)" : "(live help)"}
                        </p>
                        <p className="text-white/90 whitespace-pre-wrap">{helpAnswer}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowHelp(false);
                        setHelpAnswer(null);
                        // Stop audio when closing
                        if (currentAudio) {
                          currentAudio.pause();
                          currentAudio.currentTime = 0;
                          setCurrentAudio(null);
                        }
                      }}
                      className="mt-3 text-blue-400 text-sm hover:underline"
                    >
                      Close help
                    </button>
                  </motion.div>
                )}

                {/* GIGI READING INDICATOR */}
                {isGigiReading && (
                  <div className="w-full mb-4 bg-purple-500/20 border border-purple-500/50 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse">
                        <span className="text-lg">🎙️</span>
                      </div>
                      <span className="text-purple-300 font-bold text-lg">Gigi is teaching...</span>
                    </div>
                  </div>
                )}

                {/* READ AGAIN BUTTON - shows after Gigi finishes reading */}
                {gigiHasRead && !isGigiReading && (
                  <button
                    onClick={async () => {
                      if (lesson) {
                        // Stop any currently playing audio first
                        if (currentAudio) {
                          currentAudio.pause();
                          currentAudio.currentTime = 0;
                          setCurrentAudio(null);
                        }
                        window.speechSynthesis?.cancel();

                        setIsGigiReading(true);
                        try {
                          const response = await fetch('/api/tts', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: lesson.rules_text, childId: kidId })
                          });
                          const data = await response.json();
                          if (data.audio) {
                            const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
                            audio.onended = () => setIsGigiReading(false);
                            audio.onerror = () => setIsGigiReading(false);
                            setCurrentAudio(audio);
                            audio.play();
                          } else {
                            setIsGigiReading(false);
                          }
                        } catch (err) {
                          console.error('TTS error:', err);
                          setIsGigiReading(false);
                        }
                      }
                    }}
                    className="w-full mb-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="text-lg">🔊</span>
                    Read Again
                  </button>
                )}

                {/* Main Continue Button - Always enabled */}
                <button
                  onClick={() => {
                    // Stop Gigi reading if she's still going
                    window.speechSynthesis?.cancel();
                    setIsGigiReading(false);
                    setCurrentPhase('demo');
                  }}
                  className="w-full font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <Play className="w-5 h-5" />
                  Watch Examples
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Skip Rules Button - No penalty */}
                <button
                  onClick={() => {
                    // Stop Gigi reading
                    window.speechSynthesis?.cancel();
                    setIsGigiReading(false);
                    setCurrentPhase('practice');
                  }}
                  className="w-full mt-3 bg-transparent border border-white/20 hover:border-white/40 text-white/60 hover:text-white/80 font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <span className="text-lg">⚡</span>
                  I Already Know This - Skip to Practice
                </button>
              </div>
            )}

            {currentPhase === 'demo' && lesson.demo_problems.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-3xl">🎬</span>Watch & Learn</h2>
                <p className="text-white/60 mb-6">Example {currentDemoIndex + 1} of {lesson.demo_problems.length}</p>
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-white text-xl font-bold mb-4">{lesson.demo_problems[currentDemoIndex].problem}</p>
                  {showDemoAnswer ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-4">
                        <p className="text-green-400 font-bold text-2xl">Answer: {lesson.demo_problems[currentDemoIndex].answer}</p>
                      </div>
                      <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
                        <p className="text-blue-300">💡 {lesson.demo_problems[currentDemoIndex].explanation}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <button onClick={() => setShowDemoAnswer(true)} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl">Show Answer</button>
                  )}
                </div>
                {showDemoAnswer && (
                  <button onClick={handleNextDemo} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
                    {currentDemoIndex < lesson.demo_problems.length - 1 ? <>Next Example <ChevronRight className="w-5 h-5" /></> : <>Start Practice <ChevronRight className="w-5 h-5" /></>}
                  </button>
                )}
              </div>
            )}

            {currentPhase === 'practice' && practiceProblems.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-3xl">✏️</span>Practice Time</h2>
                <p className="text-white/60 mb-6">Question {practiceIndex + 1} of {practiceProblems.length}</p>
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-white text-xl font-bold mb-6">{practiceProblems[practiceIndex].question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {practiceProblems[practiceIndex].options.map((option, idx) => (
                      <button key={idx} onClick={() => !practiceResult && setSelectedAnswer(option)} disabled={!!practiceResult} className={`p-4 rounded-xl text-left font-bold transition-all ${practiceResult ? option === practiceProblems[practiceIndex].correct_answer ? 'bg-green-500 text-white' : option === selectedAnswer ? 'bg-red-500 text-white' : 'bg-white/10 text-white/50' : selectedAnswer === option ? 'bg-blue-500 text-white scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}>{option}</button>
                    ))}
                  </div>
                </div>
                {practiceResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mb-6 ${practiceResult === 'correct' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                    <div className="flex items-start gap-3">
                      {practiceResult === 'correct' ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-bold text-lg ${practiceResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                          {practiceResult === 'correct'
                            ? '🎉 Correct! +5 coins'
                            : '🤔 Not quite right... Let me help you!'}
                        </p>
                        <p className="text-white/80 mt-2 whitespace-pre-wrap">
                          {practiceResult === 'correct' 
                            ? practiceProblems[practiceIndex].explanation
                            : getWrongAnswerFeedback(practiceProblems[practiceIndex], selectedAnswer || '')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {!practiceResult ? (
                  <button onClick={handlePracticeSubmit} disabled={!selectedAnswer} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl">Check Answer</button>
                ) : (
                  <button onClick={handleNextPractice} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
                    {practiceIndex < practiceProblems.length - 1 ? <>Next Question <ChevronRight className="w-5 h-5" /></> : <>Start Quiz <Star className="w-5 h-5" /></>}
                  </button>
                )}
              </div>
            )}

            {currentPhase === 'quiz' && quizQuestions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-3xl">⭐</span>Quiz Time</h2>
                <p className="text-white/60 mb-6">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-white text-xl font-bold mb-6">{quizQuestions[currentQuizIndex].question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quizQuestions[currentQuizIndex].options.map((option, idx) => (
                      <button key={idx} onClick={() => !quizResult && setSelectedAnswer(option)} disabled={!!quizResult} className={`p-4 rounded-xl text-left font-bold transition-all ${quizResult ? option === quizQuestions[currentQuizIndex].correct_answer ? 'bg-green-500 text-white' : option === selectedAnswer ? 'bg-red-500 text-white' : 'bg-white/10 text-white/50' : selectedAnswer === option ? 'bg-yellow-500 text-black scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}>{option}</button>
                    ))}
                  </div>
                </div>
                {showExplanation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mb-6 ${quizResult === 'correct' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                    <div className="flex items-start gap-3">
                      {quizResult === 'correct' ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-bold text-lg ${quizResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                          {quizResult === 'correct'
                            ? '🎉 Correct! +10 coins'
                            : '🤔 Not quite right... Let me help you!'}
                        </p>
                        <p className="text-white/80 mt-2 whitespace-pre-wrap">
                          {quizResult === 'correct' 
                            ? quizQuestions[currentQuizIndex].explanation
                            : getWrongAnswerFeedback(quizQuestions[currentQuizIndex], selectedAnswer || '')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {!quizResult ? (
                  <button onClick={handleQuizSubmit} disabled={!selectedAnswer} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl">Submit Answer</button>
                ) : (
                  <button onClick={handleNextQuiz} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
                    {currentQuizIndex < quizQuestions.length - 1 ? <>Next Question <ChevronRight className="w-5 h-5" /></> : <>See Results <Trophy className="w-5 h-5" /></>}
                  </button>
                )}
              </div>
            )}

            {currentPhase === 'complete' && (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}><div className="text-8xl mb-6">🏆</div></motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">{themedCelebration.main || 'Lesson Complete!'}</h2>
                {themedCelebration.secondary && (
                  <p className="text-white/80 text-xl mb-4">{themedCelebration.secondary}</p>
                )}
                <div className="bg-white/10 rounded-xl p-6 mb-6 inline-block">
                  <p className="text-white/60 mb-2">Quiz Score</p>
                  <p className="text-4xl font-bold text-white">{quizScore} / {quizQuestions.length}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3].map((star) => (<Star key={star} className={`w-8 h-8 ${(quizScore / quizQuestions.length) >= (star * 0.33) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />))}
                  </div>
                </div>
                <div className="bg-yellow-500/20 rounded-xl p-4 mb-8"><p className="text-yellow-400 text-2xl font-bold">🪙 +{coinsEarned} Coins Earned!</p></div>
                <button onClick={() => router.back()} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-xl">Back to Lessons</button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
