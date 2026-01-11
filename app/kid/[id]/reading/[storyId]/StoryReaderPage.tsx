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
    cover_emoji: determineGenreEmoji(story.genre || 'realistic'),
    lexile_level: parseLexileLevel(story.reading_level || ''),
    word_count: story.word_count || 0,
    estimated_minutes: Math.ceil((story.word_count || 0) / 200), // Estimate: ~200 words per minute
    content: story.content,
    paragraphs: splitIntoParagraphs(story.content),
  };

  const handleComplete = async (readTime: number) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      await supabase.from('student_stories_read').insert({
        student_id: childId,
        story_id: story.id,
        read_at: new Date().toISOString(),
        completed: false, // Will be marked true after quiz
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

  // Extract colors from theme's JSON colors field
  const themeColors = currentTheme?.colors as any || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <StoryReader
        story={storyData}
        childName={childName}
        onComplete={handleComplete}
        onRequestQuiz={handleRequestQuiz}
        theme={{
          primaryColor: themeColors.primaryColor || '#3B82F6',
          fontFamily: themeColors.fontFamily || 'system-ui',
        }}
      />
    </div>
  );
}
