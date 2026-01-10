'use client';

import { useRouter } from 'next/navigation';
import StoryQuiz, { QuizResults, QuizQuestion } from '@/components/StoryQuiz';
import { createClient } from '@/lib/supabase-client';
import type { StoryQuestion, ReadingProgress, Child } from '@/types/database';

interface StoryQuizPageProps {
  childId: string;
  storyId: string;
  storyTitle: string;
  baseCoinsReward: number;
  bonusCoins: number;
  questions: StoryQuestion[];
}

export default function StoryQuizPage({
  childId,
  storyId,
  storyTitle,
  baseCoinsReward,
  bonusCoins,
  questions,
}: StoryQuizPageProps) {
  const router = useRouter();

  const transformQuestions = (dbQuestions: StoryQuestion[]): QuizQuestion[] => {
    return dbQuestions.map(q => ({
      id: q.id,
      question: q.question_text,
      options: [q.choice_a, q.choice_b, q.choice_c, q.choice_d],
      correct_answer: q.correct_answer,
    }));
  };

  const handleComplete = async (results: QuizResults) => {
    const supabase = createClient();

    try {
      const answersMap: Record<string, string> = {};
      results.answers.forEach(ans => {
        answersMap[ans.questionId] = ans.selected;
      });

      const score = results.correct;
      const resultText = results.passed ? 'passed' : 'failed';

      let finalCoins = 0;
      if (results.percentage >= 90) {
        finalCoins = baseCoinsReward + bonusCoins;
      } else if (results.percentage >= 70) {
        finalCoins = baseCoinsReward;
      }

      const attemptId = crypto.randomUUID();

      await supabase.from('story_attempts').insert({
        id: attemptId,
        child_id: childId,
        story_id: storyId,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        score,
        result: resultText,
        coins_earned: finalCoins,
        answers: answersMap,
      });

      if (results.passed) {
        await updateReadingProgress(
          supabase,
          childId,
          storyId,
          results.correct,
          results.total,
          finalCoins
        );
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const updateReadingProgress = async (
    supabase: ReturnType<typeof createClient>,
    childId: string,
    storyId: string,
    correct: number,
    total: number,
    coinsEarned: number
  ) => {
    const { data: existingProgress } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('child_id', childId)
      .maybeSingle<ReadingProgress>();

    if (existingProgress) {
      const newTotalCorrect = existingProgress.total_questions_correct + correct;
      const newTotalAnswered = existingProgress.total_questions_answered + total;
      const newAverageScore = (newTotalCorrect / newTotalAnswered) * 100;

      await supabase
        .from('reading_progress')
        .update({
          stories_completed: existingProgress.stories_completed + 1,
          total_questions_correct: newTotalCorrect,
          total_questions_answered: newTotalAnswered,
          average_score: newAverageScore,
          last_story_id: storyId,
          updated_at: new Date().toISOString(),
        })
        .eq('child_id', childId);
    } else {
      const averageScore = (correct / total) * 100;

      await supabase.from('reading_progress').insert({
        child_id: childId,
        current_lexile_band: 'BR-300L',
        stories_completed: 1,
        total_questions_correct: correct,
        total_questions_answered: total,
        average_score: averageScore,
        last_story_id: storyId,
      });
    }

    if (coinsEarned > 0) {
      const { data: child } = await supabase
        .from('children')
        .select('coins')
        .eq('id', childId)
        .maybeSingle<Pick<Child, 'coins'>>();

      if (child) {
        await supabase
          .from('children')
          .update({
            coins: child.coins + coinsEarned,
          })
          .eq('id', childId);
      }
    }
  };

  const handleRetry = () => {
    router.refresh();
  };

  const handleBackToReading = () => {
    router.push(`/kid/${childId}/reading/${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <StoryQuiz
        storyId={storyId}
        storyTitle={storyTitle}
        questions={transformQuestions(questions)}
        childId={childId}
        onComplete={handleComplete}
        onRetry={handleRetry}
        onBackToReading={handleBackToReading}
      />
    </div>
  );
}
