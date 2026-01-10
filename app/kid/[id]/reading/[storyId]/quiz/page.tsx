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
    .select('id, title, coins_reward, bonus_coins')
    .eq('id', storyId)
    .eq('is_active', true)
    .maybeSingle();

  if (!story) {
    redirect(`/kid/${childId}`);
  }

  const { data: questions } = await supabase
    .from('story_questions')
    .select('*')
    .eq('story_id', storyId)
    .order('question_number', { ascending: true });

  if (!questions || questions.length === 0) {
    redirect(`/kid/${childId}/reading/${storyId}`);
  }

  return (
    <StoryQuizPage
      childId={childId}
      storyId={storyId}
      storyTitle={story.title}
      baseCoinsReward={story.coins_reward}
      bonusCoins={story.bonus_coins}
      questions={questions}
    />
  );
}
