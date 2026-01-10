import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StoryReaderPage from './StoryReaderPage';

interface Props {
  params: Promise<{ id: string; storyId: string }>;
}

export default async function ReadingPage({ params }: Props) {
  const { id: childId, storyId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: child } = await supabase
    .from('children')
    .select('id, name, age')
    .eq('id', childId)
    .maybeSingle();

  if (!child) {
    redirect('/');
  }

  const { data: story } = await supabase
    .from('stories')
    .select('*')
    .eq('id', storyId)
    .eq('is_active', true)
    .maybeSingle();

  if (!story) {
    redirect(`/kid/${childId}`);
  }

  return (
    <StoryReaderPage
      childId={childId}
      childName={child.name}
      story={story}
    />
  );
}
