// ADAPTIVE LEARNING SYSTEM - NOW ENABLED!
// This analyzes student answer patterns to build a personalized learning profile.
// Tables used: answer_attempts, learning_profiles (both exist in Supabase)
// Auto-updates after every 20 questions answered.

import { createClient } from '@/lib/supabase/client';
import type { AnswerAttempt, LessonProgress as DBLessonProgress } from '@/types/database';

interface LearningProfile {
  child_id: string;
  primary_learning_style: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  secondary_learning_style?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  preferred_pace: 'slow' | 'medium' | 'fast';
  frustration_threshold: number;
  needs_more_examples: boolean;
  responds_to_encouragement: boolean;
  responds_to_challenges: boolean;
  strongest_subjects: string[];
  weakest_subjects: string[];
  favorite_subjects: string[];
  preferred_example_types: string[];
  best_time_of_day?: 'morning' | 'afternoon' | 'evening';
  average_session_length: number;
  confidence_level: 'low' | 'medium' | 'high';
  total_questions_answered: number;
  total_questions_correct: number;
  overall_accuracy: number;
  learning_style_confidence: number;
}

export async function analyzeAndUpdateLearningProfile(childId: string) {
  const supabase = createClient();

  const { data: attempts, error: attemptsError } = await supabase
    .from('answer_attempts')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
    .limit(100)
    .returns<AnswerAttempt[]>();

  if (attemptsError || !attempts || attempts.length === 0) {
    return null;
  }

  const totalQuestions = attempts.length;
  const correctQuestions = attempts.filter(a => a.is_correct).length;
  const accuracy = totalQuestions > 0 ? correctQuestions / totalQuestions : 0;

  const avgTimePerQuestion = attempts.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) / totalQuestions;

  let preferredPace: 'slow' | 'medium' | 'fast' = 'medium';
  if (avgTimePerQuestion > 120) preferredPace = 'slow';
  else if (avgTimePerQuestion < 45) preferredPace = 'fast';

  const helpRequestedCount = attempts.filter(a => a.help_requested).length;
  const needsMoreExamples = helpRequestedCount > totalQuestions * 0.3;

  const consecutiveWrong: number[] = [];
  let currentStreak = 0;
  for (const attempt of attempts) {
    if (!attempt.is_correct) {
      currentStreak++;
    } else {
      if (currentStreak > 0) consecutiveWrong.push(currentStreak);
      currentStreak = 0;
    }
  }
  const frustrationThreshold = consecutiveWrong.length > 0
    ? Math.ceil(consecutiveWrong.reduce((sum, val) => sum + val, 0) / consecutiveWrong.length)
    : 3;

  let confidenceLevel: 'low' | 'medium' | 'high' = 'medium';
  if (accuracy >= 0.85 && avgTimePerQuestion < 90) confidenceLevel = 'high';
  else if (accuracy < 0.6 || helpRequestedCount > totalQuestions * 0.4) confidenceLevel = 'low';

  const primaryLearningStyle = detectLearningStyle(attempts);
  const learningStyleConfidence = Math.min(totalQuestions / 100, 1.0);

  const { data: progressData } = await supabase
    .from('student_skill_progress')
    .select('subject_code, best_score')
    .eq('student_id', childId)
    .returns<Pick<DBLessonProgress, 'subject_code' | 'best_score'>[]>();

  const subjectScores: Record<string, { total: number; count: number }> = {};
  progressData?.forEach(progress => {
    if (!subjectScores[progress.subject_code]) {
      subjectScores[progress.subject_code] = { total: 0, count: 0 };
    }
    subjectScores[progress.subject_code].total += Number(progress.best_score) || 0;
    subjectScores[progress.subject_code].count += 1;
  });

  const subjectAverages = Object.entries(subjectScores).map(([subject, data]) => ({
    subject,
    avg: data.total / data.count
  })).sort((a, b) => b.avg - a.avg);

  const strongestSubjects = subjectAverages.slice(0, 2).map(s => s.subject);
  const weakestSubjects = subjectAverages.slice(-2).map(s => s.subject);

  const sessionTimes = analyzeSessionTimes(attempts);
  const bestTimeOfDay = sessionTimes.bestTime;
  const averageSessionLength = sessionTimes.avgLength;

  const updatedProfile = {
    primary_learning_style: primaryLearningStyle,
    preferred_pace: preferredPace,
    frustration_threshold: Math.max(2, Math.min(frustrationThreshold, 5)),
    needs_more_examples: needsMoreExamples,
    strongest_subjects: strongestSubjects,
    weakest_subjects: weakestSubjects,
    best_time_of_day: bestTimeOfDay,
    average_session_length: averageSessionLength,
    confidence_level: confidenceLevel,
    total_questions_answered: totalQuestions,
    total_questions_correct: correctQuestions,
    overall_accuracy: accuracy,
    learning_style_confidence: learningStyleConfidence,
  };

  const { error: updateError } = await supabase
    .from('learning_profiles')
    .update(updatedProfile)
    .eq('child_id', childId);

  if (updateError) {
    console.error('Error updating learning profile:', updateError);
    return null;
  }

  return updatedProfile;
}

function detectLearningStyle(attempts: AnswerAttempt[]): 'visual' | 'auditory' | 'reading' | 'kinesthetic' {
  const totalAttempts = attempts.length;
  if (totalAttempts < 10) return 'visual';

  const avgTime = attempts.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) / totalAttempts;
  const helpRequestRate = attempts.filter(a => a.help_requested).length / totalAttempts;

  if (avgTime < 60 && helpRequestRate < 0.2) {
    return 'reading';
  } else if (helpRequestRate > 0.4) {
    return 'auditory';
  } else if (avgTime > 120) {
    return 'kinesthetic';
  } else {
    return 'visual';
  }
}

function analyzeSessionTimes(attempts: AnswerAttempt[]) {
  const morningAttempts = attempts.filter(a => {
    const hour = new Date(a.created_at).getHours();
    return hour >= 6 && hour < 12;
  });
  const afternoonAttempts = attempts.filter(a => {
    const hour = new Date(a.created_at).getHours();
    return hour >= 12 && hour < 18;
  });
  const eveningAttempts = attempts.filter(a => {
    const hour = new Date(a.created_at).getHours();
    return hour >= 18 || hour < 6;
  });

  const morningAccuracy = morningAttempts.length > 0
    ? morningAttempts.filter(a => a.is_correct).length / morningAttempts.length
    : 0;
  const afternoonAccuracy = afternoonAttempts.length > 0
    ? afternoonAttempts.filter(a => a.is_correct).length / afternoonAttempts.length
    : 0;
  const eveningAccuracy = eveningAttempts.length > 0
    ? eveningAttempts.filter(a => a.is_correct).length / eveningAttempts.length
    : 0;

  let bestTime: 'morning' | 'afternoon' | 'evening' | undefined = undefined;
  if (morningAttempts.length > 5 || afternoonAttempts.length > 5 || eveningAttempts.length > 5) {
    if (morningAccuracy >= afternoonAccuracy && morningAccuracy >= eveningAccuracy) {
      bestTime = 'morning';
    } else if (afternoonAccuracy >= eveningAccuracy) {
      bestTime = 'afternoon';
    } else {
      bestTime = 'evening';
    }
  }

  const sessions: Record<string, AnswerAttempt[]> = {};
  attempts.forEach(attempt => {
    const sessionDate = new Date(attempt.created_at).toISOString().split('T')[0];
    if (!sessions[sessionDate]) sessions[sessionDate] = [];
    sessions[sessionDate].push(attempt);
  });

  const sessionLengths = Object.values(sessions).map(session => {
    if (session.length === 0) return 0;
    const first = new Date(session[session.length - 1].created_at).getTime();
    const last = new Date(session[0].created_at).getTime();
    return Math.round((last - first) / 1000 / 60);
  });

  const avgLength = sessionLengths.length > 0
    ? Math.round(sessionLengths.reduce((sum, len) => sum + len, 0) / sessionLengths.length)
    : 15;

  return { bestTime, avgLength: Math.max(5, Math.min(avgLength, 60)) };
}

export async function shouldUpdateProfile(childId: string): Promise<boolean> {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from('learning_profiles')
    .select('total_questions_answered, updated_at')
    .eq('child_id', childId)
    .maybeSingle();

  if (!profile) return false;

  const { data: recentAttempts } = await supabase
    .from('answer_attempts')
    .select('id')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
    .limit(20);

  const attemptsSinceUpdate = recentAttempts?.length || 0;

  return attemptsSinceUpdate >= 20;
}
