'use client';

import { useRouter } from 'next/navigation';
import StoryQuiz, { QuizResults, QuizQuestion } from '@/components/StoryQuiz';
import { createClient } from '@/lib/supabase-client';
import type { Child } from '@/types/database';

// Questions are stored as JSON in stories.comprehension_questions
interface DBStoryQuestion {
  id: string;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

interface StoryQuizPageProps {
  childId: string;
  storyId: string;
  storyTitle: string;
  baseCoinsReward: number;
  bonusCoins: number;
  questions: DBStoryQuestion[];
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

  const transformQuestions = (dbQuestions: DBStoryQuestion[]): QuizQuestion[] => {
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

      // Mark story as completed in student_stories_read
      const { data: existingRead } = await supabase
        .from('student_stories_read')
        .select('id')
        .eq('student_id', childId)
        .eq('story_id', storyId)
        .maybeSingle();

      if (existingRead) {
        // Update existing record
        await supabase
          .from('student_stories_read')
          .update({
            completed: results.passed,
            rating: results.percentage >= 90 ? 5 : results.percentage >= 70 ? 4 : 3,
          })
          .eq('id', existingRead.id);
      } else {
        // Create new record
        await supabase.from('student_stories_read').insert({
          student_id: childId,
          story_id: storyId,
          completed: results.passed,
          rating: results.percentage >= 90 ? 5 : results.percentage >= 70 ? 4 : 3,
          read_at: new Date().toISOString(),
        });
      }

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
    // Award coins to the child
    if (coinsEarned > 0) {
      const { data: child } = await supabase
        .from('children')
        .select('coins')
        .eq('id', childId)
        .maybeSingle<Pick<Child, 'coins'>>();

      if (child && child.coins !== null) {
        await supabase
          .from('children')
          .update({
            coins: child.coins + coinsEarned,
          })
          .eq('id', childId);
      }
    }

    // Note: Reading progress is now tracked via student_stories_read table
    // You can query that table to calculate aggregate statistics
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
