import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StoryQuizPage from './StoryQuizPage';

interface Props {
  params: Promise<{ id: string; storyId: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { id: childId, storyId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: child } = await supabase
    .from('children')
    .select('id, name')
    .eq('id', childId)
    .maybeSingle();

  if (!child) {
    redirect('/');
  }

  const { data: story } = await supabase
    .from('stories')
    .select('id, title, comprehension_questions')
    .eq('id', storyId)
    .maybeSingle();

  if (!story) {
    redirect(`/kid/${childId}`);
  }

  // Questions are stored as JSON in comprehension_questions field
  const questions = (story.comprehension_questions as any) || [];

  if (!questions || questions.length === 0) {
    redirect(`/kid/${childId}/reading/${storyId}`);
  }

  // Calculate rewards based on reading level/difficulty
  const baseCoinsReward = 10;
  const bonusCoins = 5;

  return (
    <StoryQuizPage
      childId={childId}
      storyId={storyId}
      storyTitle={story.title}
      baseCoinsReward={baseCoinsReward}
      bonusCoins={bonusCoins}
      questions={questions}
    />
  );
}
