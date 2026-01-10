'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StoryReader from '@/components/StoryReader';
import { createClient } from '@/lib/supabase-client';
import { useTheme } from '@/lib/theme-context';
import type { Story } from '@/types/database';

interface StoryReaderPageProps {
  childId: string;
  childName: string;
  story: Story;
}

export default function StoryReaderPage({
  childId,
  childName,
  story,
}: StoryReaderPageProps) {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const parseLexileLevel = (lexileBand: string): number => {
    const match = lexileBand.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const splitIntoParagraphs = (content: string): string[] => {
    return content
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  };

  const determineGenreEmoji = (genre: string): string => {
    const emojiMap: Record<string, string> = {
      'adventure': '🗺️',
      'fantasy': '🐉',
      'science fiction': '🚀',
      'mystery': '🔍',
      'historical': '📜',
      'realistic': '🌟',
      'humor': '😄',
      'animal': '🐾',
      'sports': '⚽',
      'nature': '🌿',
    };
    return emojiMap[genre.toLowerCase()] || '📖';
  };

  const storyData = {
    id: story.id,
    title: story.title,
    cover_emoji: determineGenreEmoji(story.genre),
    lexile_level: parseLexileLevel(story.lexile_band),
    word_count: story.word_count,
    estimated_minutes: story.expected_time_minutes,
    content: story.content,
    paragraphs: splitIntoParagraphs(story.content),
  };

  const handleComplete = async (readTime: number) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      await supabase.from('story_attempts').insert({
        child_id: childId,
        story_id: story.id,
        started_at: new Date(Date.now() - readTime * 1000).toISOString(),
        reading_time_seconds: readTime,
      });
    } catch (error) {
      console.error('Error saving reading attempt:', error);
    }
  };

  const handleRequestQuiz = () => {
    router.push(`/kid/${childId}/reading/${story.id}/quiz`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <StoryReader
        story={storyData}
        childName={childName}
        onComplete={handleComplete}
        onRequestQuiz={handleRequestQuiz}
        theme={{
          primaryColor: currentTheme.primaryColor,
          fontFamily: currentTheme.fontFamily,
        }}
      />
    </div>
  );
}
