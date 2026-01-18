'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * STORY LIBRARY HOOK
 *
 * Provides stories for the Stories page with:
 * - Hardcoded stories (immediate availability)
 * - Database fallback ready (for future seeding)
 * - Completion tracking via lesson_progress table
 *
 * Stories have comprehension quizzes (reuses ReadingLessonPlayer)
 */

interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  lexileLevel: number;
  gradeLevel: number;
  questions: ComprehensionQuestion[];
  preview?: string;
  coverColor?: string;
}

interface StoryWithStatus extends Story {
  completed: boolean;
  score?: number;
  completedAt?: string;
}

interface UseStoryLibraryResult {
  stories: StoryWithStatus[];
  loading: boolean;
  error: string | null;
  markComplete: (storyId: string, score: number) => Promise<void>;
  refetch: () => void;
}

// Hardcoded stories - same as ReadingLessonPlayer
const STORIES_BY_GRADE: Record<number, Story[]> = {
  0: [
    {
      id: 'k-story-1',
      title: 'The Red Ball',
      content: `Sam has a red ball.

The ball is big.

Sam kicks the ball.

The ball goes far!

Sam runs to get the ball.

Sam is happy.`,
      lexileLevel: 100,
      gradeLevel: 0,
      coverColor: 'bg-red-400',
      questions: [
        { question: 'What color is the ball?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 'Red', explanation: 'The story says "Sam has a red ball."' },
        { question: 'What does Sam do with the ball?', options: ['Throws it', 'Kicks it', 'Catches it', 'Hides it'], correctAnswer: 'Kicks it', explanation: 'The story says "Sam kicks the ball."' },
        { question: 'How does Sam feel at the end?', options: ['Sad', 'Angry', 'Happy', 'Tired'], correctAnswer: 'Happy', explanation: 'The story says "Sam is happy."' },
        { question: 'Is the ball big or small?', options: ['Big', 'Small', 'Tiny', 'Huge'], correctAnswer: 'Big', explanation: 'The story says "The ball is big."' },
        { question: 'What happens after Sam kicks the ball?', options: ['It stops', 'It goes far', 'It pops', 'It rolls back'], correctAnswer: 'It goes far', explanation: 'The story says "The ball goes far!"' },
      ]
    }
  ],
  1: [
    {
      id: 'g1-story-1',
      title: 'The Lost Puppy',
      content: `Max was a small puppy. He lived with a family on Oak Street.

One sunny day, Max saw a butterfly. The butterfly was yellow and pretty. Max wanted to play with it!

Max ran after the butterfly. He ran and ran. Soon, Max was lost. He did not know where he was.

Max sat down and cried. He missed his family.

A kind girl named Emma found Max. She saw his collar. It had his address on it.

Emma walked Max home. His family was so happy! They gave Emma cookies to say thank you.

Max learned to stay in his yard.`,
      lexileLevel: 350,
      gradeLevel: 1,
      coverColor: 'bg-yellow-400',
      questions: [
        { question: 'What kind of animal is Max?', options: ['Cat', 'Puppy', 'Bird', 'Fish'], correctAnswer: 'Puppy', explanation: 'The story says "Max was a small puppy."' },
        { question: 'Why did Max run away?', options: ['He was scared', 'He chased a butterfly', 'He was hungry', 'He wanted to swim'], correctAnswer: 'He chased a butterfly', explanation: 'The story says Max ran after a butterfly.' },
        { question: 'Who found Max?', options: ['A boy named Tom', 'A girl named Emma', 'His mom', 'A policeman'], correctAnswer: 'A girl named Emma', explanation: 'The story says "A kind girl named Emma found Max."' },
        { question: 'What lesson did Max learn?', options: ['To bark louder', 'To stay in his yard', 'To chase cats', 'To run faster'], correctAnswer: 'To stay in his yard', explanation: 'The story says "Max learned to stay in his yard."' },
        { question: 'What did the family give Emma?', options: ['Money', 'A toy', 'Cookies', 'A puppy'], correctAnswer: 'Cookies', explanation: 'The story says "They gave Emma cookies to say thank you."' },
      ]
    }
  ],
  2: [
    {
      id: 'g2-story-1',
      title: 'The Magic Garden',
      content: `Lily loved to help her grandmother in the garden. Every Saturday, she would put on her gardening gloves and walk to Grandma's house.

"Today we're planting something special," Grandma said with a twinkle in her eye. She handed Lily a packet of rainbow flower seeds.

Lily dug small holes in the soil. She dropped one seed in each hole. Then she covered them with dirt and watered them gently.

"Now we wait," Grandma said. "But remember, gardens need three things: sun, water, and love."

Every day for two weeks, Lily visited the garden. She watered the seeds and talked to them. She told them about her day at school.

One morning, Lily saw tiny green sprouts! She jumped up and down with joy.

By summer, the garden was full of beautiful flowers. There were red ones, purple ones, orange ones, and pink ones. Butterflies and bees visited every day.

"You made something magical," Grandma said, hugging Lily.

Lily smiled. She learned that patience and care can create wonderful things.`,
      lexileLevel: 450,
      gradeLevel: 2,
      coverColor: 'bg-green-400',
      questions: [
        { question: 'What did Lily and her grandmother plant?', options: ['Vegetables', 'Trees', 'Rainbow flower seeds', 'Grass'], correctAnswer: 'Rainbow flower seeds', explanation: 'The story says Grandma gave Lily "a packet of rainbow flower seeds."' },
        { question: 'What three things does a garden need?', options: ['Food, water, shade', 'Sun, water, love', 'Dirt, seeds, pots', 'Rain, wind, sun'], correctAnswer: 'Sun, water, love', explanation: 'Grandma said "gardens need three things: sun, water, and love."' },
        { question: 'How long did Lily wait before seeing sprouts?', options: ['One day', 'One week', 'Two weeks', 'One month'], correctAnswer: 'Two weeks', explanation: 'The story says "Every day for two weeks" before she saw sprouts.' },
        { question: 'What visitors came to the garden?', options: ['Birds and squirrels', 'Butterflies and bees', 'Rabbits and deer', 'Cats and dogs'], correctAnswer: 'Butterflies and bees', explanation: 'The story says "Butterflies and bees visited every day."' },
        { question: 'What is the main lesson?', options: ['Gardens are hard work', 'Grandmas are nice', 'Patience and care create wonderful things', 'Flowers are pretty'], correctAnswer: 'Patience and care create wonderful things', explanation: 'The story ends with Lily learning that "patience and care can create wonderful things."' },
      ]
    }
  ],
  3: [
    {
      id: 'g3-story-1',
      title: 'The Secret Treehouse',
      content: `Jake and his sister Maria discovered something amazing in their backyard. Hidden behind the old oak tree was a wooden ladder leading up to a treehouse they had never noticed before.

"How is this possible?" Maria whispered. "We've lived here for five years!"

The treehouse was covered in vines and moss, which explained why it had been invisible. Jake climbed up first, his heart pounding with excitement.

Inside, they found an incredible surprise. The walls were covered with maps of distant lands, drawings of mythical creatures, and photographs of adventures. There was a journal on the dusty table.

Maria opened the journal carefully. "Property of Eleanor Wright, 1962," she read aloud. The pages were filled with stories about Eleanor's imaginary adventures to places like the Crystal Caves and the Floating Islands.

Over the following weeks, Jake and Maria cleaned up the treehouse. They painted the walls bright colors and added beanbag chairs. They even continued Eleanor's journal, writing their own adventure stories.

One afternoon, an elderly woman walked past their fence. She stopped and stared at the treehouse with tears in her eyes.

"Excuse me," Jake called out. "Are you Eleanor Wright?"

The woman smiled. "I haven't been up there in sixty years. I can't believe it's still standing."

Jake and Maria invited Eleanor to see her old treehouse. She climbed the ladder slowly, amazed at how they had transformed it. They spent the afternoon listening to her real adventures—traveling to Egypt, climbing mountains, and sailing across oceans.

"You know," Eleanor said, "those imaginary adventures I wrote as a child inspired me to have real ones when I grew up. Never stop dreaming."`,
      lexileLevel: 650,
      gradeLevel: 3,
      coverColor: 'bg-amber-400',
      questions: [
        { question: 'How long had Jake and Maria lived there?', options: ['One year', 'Three years', 'Five years', 'Ten years'], correctAnswer: 'Five years', explanation: 'Maria said "We\'ve lived here for five years!"' },
        { question: 'Why was the treehouse hidden?', options: ['It was painted to match the tree', 'It was covered in vines and moss', 'It was too small to see', 'It was behind a fence'], correctAnswer: 'It was covered in vines and moss', explanation: 'The story says "The treehouse was covered in vines and moss."' },
        { question: 'Who was Eleanor Wright?', options: ['Their neighbor', 'The original owner of the treehouse', 'Their teacher', 'A famous explorer'], correctAnswer: 'The original owner of the treehouse', explanation: 'Eleanor wrote in the journal in 1962 and confirmed it was her treehouse.' },
        { question: 'What real adventures did Eleanor have?', options: ['She stayed home', 'She traveled to Egypt, climbed mountains, and sailed oceans', 'She only read books', 'She worked in an office'], correctAnswer: 'She traveled to Egypt, climbed mountains, and sailed oceans', explanation: 'Eleanor talked about "traveling to Egypt, climbing mountains, and sailing across oceans."' },
        { question: 'What was Eleanor\'s advice?', options: ['Stop playing outside', 'Never stop dreaming', 'Don\'t climb trees', 'Study harder'], correctAnswer: 'Never stop dreaming', explanation: 'Eleanor said "Never stop dreaming."' },
      ]
    }
  ],
  4: [
    {
      id: 'g4-story-1',
      title: 'The Midnight Inventor',
      content: `Thomas couldn't sleep. His mind was racing with ideas, as it often did at midnight. While his family slumbered peacefully, he crept down to the basement workshop his father had helped him set up.

On his workbench lay the scattered parts of his latest project: a solar-powered flashlight. The concept seemed simple enough—use the sun's energy during the day to power a light at night—but Thomas had failed seventeen times already.

"Failure is just practice for success," his grandmother always said. Thomas picked up his soldering iron and got back to work.

By 2 AM, he had assembled version eighteen. His hands trembled slightly as he flipped the switch. Nothing happened. Thomas sighed and was about to disassemble it when he noticed something—he had connected the battery backward.

After fixing his mistake, Thomas tried again. This time, a bright beam of light shot across the workshop. He had done it! His heart pounded with excitement.

The next morning, Thomas showed his invention to his family at breakfast. His mother hugged him tightly, and his father's eyes glistened with pride.

"You know what made the difference?" his grandmother asked with a knowing smile.

Thomas thought for a moment. "I didn't give up. And I learned from each mistake."

"That's the secret to everything worthwhile," she replied. "Remember this feeling, Thomas. This is what perseverance tastes like."

That summer, Thomas entered his solar flashlight in the county science fair. He didn't win first place—a girl named Maria won with her water purification system—but he received an honorable mention and, more importantly, an invitation to join the Young Inventors Club.

Thomas learned that success isn't just about winning. It's about the journey, the failures, and the persistence to keep going when things get difficult.`,
      lexileLevel: 720,
      gradeLevel: 4,
      coverColor: 'bg-blue-400',
      questions: [
        { question: 'How many times had Thomas failed before success?', options: ['Five times', 'Ten times', 'Seventeen times', 'Twenty times'], correctAnswer: 'Seventeen times', explanation: 'The story states "Thomas had failed seventeen times already."' },
        { question: 'What was Thomas trying to invent?', options: ['A robot', 'A solar-powered flashlight', 'A computer', 'A telephone'], correctAnswer: 'A solar-powered flashlight', explanation: 'The story describes "a solar-powered flashlight" as his project.' },
        { question: 'What mistake did Thomas make?', options: ['Wrong bulb', 'Battery connected backward', 'Missing switch', 'Broken wire'], correctAnswer: 'Battery connected backward', explanation: 'The story says "he had connected the battery backward."' },
        { question: 'Did Thomas win first place at the science fair?', options: ['Yes', 'No, he got honorable mention', 'He didn\'t enter', 'He came in last'], correctAnswer: 'No, he got honorable mention', explanation: 'The story says "he received an honorable mention."' },
        { question: 'What is the main lesson?', options: ['Sleep is important', 'Success is about the journey and persistence', 'Science fairs are fun', 'Grandmothers are wise'], correctAnswer: 'Success is about the journey and persistence', explanation: 'Thomas learned "success isn\'t just about winning. It\'s about the journey, the failures, and the persistence."' },
      ]
    }
  ],
  5: [
    {
      id: 'g5-story-1',
      title: 'The Code Breakers',
      content: `Maya stared at the cryptic message on her computer screen. For three weeks, she and her teammates at the Math Olympiad had been trying to crack a code that their teacher, Mr. Harrison, had challenged them to solve.

"It's impossible," groaned Ethan, slumping in his chair. "We've tried every cipher we know."

Maya wasn't ready to give up. She had noticed something the others had missed—the message contained exactly 26 unique symbols, the same number as letters in the alphabet.

"What if it's not a traditional cipher?" she said slowly. "What if the symbols represent mathematical relationships instead of direct letter substitutions?"

The team gathered around as Maya explained her theory. Each symbol could represent a number, and the numbers could correspond to letters based on their position in the alphabet.

They worked through the night, mapping symbols to numbers and then to letters. By dawn, they had cracked it. The message read: "Congratulations! You've proven that mathematical thinking can unlock any mystery."

Mr. Harrison was impressed. "You did something remarkable," he told them. "You didn't just solve a puzzle—you demonstrated that persistence and creative thinking are more powerful than any obstacle."

The next month, their story made the local news. A mathematics professor at the university read about them and offered Maya a summer internship at his research lab.

Maya learned that the skills she developed—patience, collaboration, and thinking outside the box—were valuable far beyond the classroom. The code was just the beginning.`,
      lexileLevel: 850,
      gradeLevel: 5,
      coverColor: 'bg-purple-400',
      questions: [
        { question: 'How long had the team been working on the code?', options: ['One week', 'Two weeks', 'Three weeks', 'One month'], correctAnswer: 'Three weeks', explanation: 'The story says "For three weeks, she and her teammates... had been trying to crack a code."' },
        { question: 'What did Maya notice about the message?', options: ['It was too short', 'It contained exactly 26 unique symbols', 'It was in color', 'It had pictures'], correctAnswer: 'It contained exactly 26 unique symbols', explanation: 'Maya noticed "the message contained exactly 26 unique symbols."' },
        { question: 'What was Maya\'s key insight?', options: ['The symbols were random', 'The symbols represented mathematical relationships', 'The code was already solved', 'They needed a computer'], correctAnswer: 'The symbols represented mathematical relationships', explanation: 'Maya suggested "the symbols represent mathematical relationships instead of direct letter substitutions."' },
        { question: 'What opportunity did Maya receive?', options: ['A trophy', 'A summer internship', 'A new computer', 'A book'], correctAnswer: 'A summer internship', explanation: 'A professor "offered Maya a summer internship at his research lab."' },
        { question: 'What skills did Maya learn were valuable?', options: ['Only math skills', 'Patience, collaboration, and thinking outside the box', 'Computer programming', 'Public speaking'], correctAnswer: 'Patience, collaboration, and thinking outside the box', explanation: 'Maya learned "patience, collaboration, and thinking outside the box—were valuable far beyond the classroom."' },
      ]
    }
  ]
};

// Generate preview from content
function generatePreview(content: string): string {
  const words = content.split(/\s+/).slice(0, 20);
  return words.join(' ') + '...';
}

export function useStoryLibrary(childId: string, gradeFilter?: number): UseStoryLibraryResult {
  const [stories, setStories] = useState<StoryWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      setError(null);

      try {
        // Get all hardcoded stories
        let allStories: Story[] = [];

        if (gradeFilter !== undefined) {
          // Single grade
          allStories = STORIES_BY_GRADE[gradeFilter] || [];
        } else {
          // All grades
          for (const grade of Object.keys(STORIES_BY_GRADE)) {
            allStories.push(...STORIES_BY_GRADE[parseInt(grade)]);
          }
        }

        // Add previews
        allStories = allStories.map(s => ({
          ...s,
          preview: generatePreview(s.content)
        }));

        // Fetch completion status from lesson_progress
        const storyIds = allStories.map(s => `story-${s.id}`);

        const { data: progressData, error: progressError } = await supabase
          .from('lesson_progress')
          .select('skill_id, score, completed_at')
          .eq('child_id', childId)
          .eq('subject_code', 'READING')
          .in('skill_id', storyIds);

        if (progressError) {
          console.error('Error fetching story progress:', progressError);
        }

        // Map completion status to stories
        const progressMap = new Map<string, { score: number; completedAt: string }>();
        if (progressData) {
          for (const p of progressData) {
            const storyId = p.skill_id.replace('story-', '');
            progressMap.set(storyId, { score: p.score, completedAt: p.completed_at });
          }
        }

        const storiesWithStatus: StoryWithStatus[] = allStories.map(story => ({
          ...story,
          completed: progressMap.has(story.id),
          score: progressMap.get(story.id)?.score,
          completedAt: progressMap.get(story.id)?.completedAt
        }));

        console.log(`✅ Loaded ${storiesWithStatus.length} stories, ${progressMap.size} completed`);
        setStories(storiesWithStatus);

      } catch (err: any) {
        console.error('Error in useStoryLibrary:', err);
        setError(err.message || 'Failed to load stories');
        setStories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, [childId, gradeFilter, fetchTrigger]);

  const markComplete = useCallback(async (storyId: string, score: number) => {
    try {
      const story = stories.find(s => s.id === storyId);
      if (!story) return;

      await supabase.from('lesson_progress').upsert({
        child_id: childId,
        skill_id: `story-${storyId}`,
        subject_code: 'READING',
        skill_name: story.title,
        completed: true,
        score: score,
        stars: score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0,
        completed_at: new Date().toISOString()
      }, { onConflict: 'child_id,skill_id' });

      // Refetch to update status
      setFetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error marking story complete:', err);
    }
  }, [childId, stories, supabase]);

  const refetch = () => setFetchTrigger(prev => prev + 1);

  return { stories, loading, error, markComplete, refetch };
}

export default useStoryLibrary;
