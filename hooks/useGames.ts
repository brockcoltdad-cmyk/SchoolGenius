'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Game {
  id: string;
  title: string;
  description: string;
  subject: 'math' | 'spelling' | 'reading' | 'typing' | 'mixed';
  icon: string;
  color: string;
  minGrade: number;
  maxGrade: number;
  route: string;
}

export interface GameScore {
  gameId: string;
  score: number;
  highScore: number;
  timesPlayed: number;
  lastPlayedAt: string;
}

// Hardcoded games library
const GAMES: Game[] = [
  {
    id: 'math-facts',
    title: 'Math Facts Blitz',
    description: 'Race against the clock! Answer as many math facts as you can in 60 seconds.',
    subject: 'math',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-500',
    minGrade: 0,
    maxGrade: 5,
    route: 'math-facts'
  },
  {
    id: 'spelling-bee',
    title: 'Spelling Bee',
    description: 'Listen to the word and spell it correctly. How many can you get right?',
    subject: 'spelling',
    icon: '🐝',
    color: 'from-yellow-500 to-orange-500',
    minGrade: 0,
    maxGrade: 5,
    route: 'spelling-bee'
  },
  {
    id: 'typing-race',
    title: 'Typing Race',
    description: 'Type the words as fast as you can! Beat your personal best WPM.',
    subject: 'typing',
    icon: '🏎️',
    color: 'from-green-500 to-emerald-500',
    minGrade: 1,
    maxGrade: 5,
    route: 'typing-race'
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble the letters to find the hidden word. Think fast!',
    subject: 'spelling',
    icon: '🔀',
    color: 'from-purple-500 to-pink-500',
    minGrade: 1,
    maxGrade: 5,
    route: 'word-scramble'
  },
  {
    id: 'number-patterns',
    title: 'Number Patterns',
    description: 'Find the pattern and guess the next number in the sequence.',
    subject: 'math',
    icon: '🔢',
    color: 'from-indigo-500 to-purple-500',
    minGrade: 1,
    maxGrade: 5,
    route: 'number-patterns'
  },
  {
    id: 'sight-words',
    title: 'Sight Word Pop',
    description: 'Pop the bubbles with the correct sight words before they float away!',
    subject: 'reading',
    icon: '🫧',
    color: 'from-pink-500 to-rose-500',
    minGrade: 0,
    maxGrade: 2,
    route: 'sight-words'
  }
];

export function useGames(childId: string, gradeLevel?: number) {
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Map<string, GameScore>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load games and scores
  useEffect(() => {
    async function loadGamesAndScores() {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        // Get child's grade level if not provided
        let grade = gradeLevel;
        if (grade === undefined) {
          const { data: child } = await supabase
            .from('children')
            .select('grade_level')
            .eq('id', childId)
            .single();
          grade = child?.grade_level ?? 0;
        }

        // Filter games by grade level
        const availableGames = GAMES.filter(
          g => grade !== undefined && grade >= g.minGrade && grade <= g.maxGrade
        );
        setGames(availableGames);

        // Load scores from lesson_progress (using skill_id pattern: game-{gameId})
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('skill_id, score, completed_at')
          .eq('child_id', childId)
          .like('skill_id', 'game-%');

        // Build scores map with aggregated data
        const scoresMap = new Map<string, GameScore>();

        if (progressData) {
          // Group by game ID
          const grouped = new Map<string, Array<{ score: number; completed_at: string }>>();

          for (const record of progressData) {
            const gameId = record.skill_id.replace('game-', '');
            if (!grouped.has(gameId)) {
              grouped.set(gameId, []);
            }
            grouped.get(gameId)!.push({
              score: record.score || 0,
              completed_at: record.completed_at
            });
          }

          // Calculate stats for each game
          for (const [gameId, records] of Array.from(grouped)) {
            const scores = records.map(r => r.score);
            const highScore = Math.max(...scores);
            const lastPlayed = records.sort((a, b) =>
              new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
            )[0];

            scoresMap.set(gameId, {
              gameId,
              score: lastPlayed.score,
              highScore,
              timesPlayed: records.length,
              lastPlayedAt: lastPlayed.completed_at
            });
          }
        }

        setScores(scoresMap);
      } catch (err) {
        console.error('Error loading games:', err);
        setError('Failed to load games');
      } finally {
        setLoading(false);
      }
    }

    if (childId) {
      loadGamesAndScores();
    }
  }, [childId, gradeLevel]);

  // Save game score
  const saveScore = useCallback(async (gameId: string, score: number): Promise<{ coins: number; isHighScore: boolean }> => {
    const supabase = createClient();

    // Get current high score
    const currentScore = scores.get(gameId);
    const isHighScore = !currentScore || score > currentScore.highScore;

    // Save to lesson_progress
    await supabase.from('lesson_progress').insert({
      child_id: childId,
      skill_id: `game-${gameId}`,
      score,
      completed_at: new Date().toISOString()
    });

    // Calculate coins: base 10 + bonus for high scores
    const baseCoins = 10;
    const bonusCoins = isHighScore ? 15 : 5;
    const totalCoins = baseCoins + bonusCoins;

    // Add coins
    try {
      await supabase.rpc('add_coins', {
        p_child_id: childId,
        p_amount: totalCoins,
        p_reason: `Game: ${gameId} - Score: ${score}${isHighScore ? ' (NEW HIGH SCORE!)' : ''}`
      });
    } catch (err) {
      console.error('Error adding coins:', err);
    }

    // Update local scores map
    setScores(prev => {
      const newMap = new Map(prev);
      newMap.set(gameId, {
        gameId,
        score,
        highScore: isHighScore ? score : (currentScore?.highScore || score),
        timesPlayed: (currentScore?.timesPlayed || 0) + 1,
        lastPlayedAt: new Date().toISOString()
      });
      return newMap;
    });

    return { coins: totalCoins, isHighScore };
  }, [childId, scores]);

  return {
    games,
    scores,
    loading,
    error,
    saveScore,
    getScore: (gameId: string) => scores.get(gameId)
  };
}

// Export game data for individual game components
export function getGameById(gameId: string): Game | undefined {
  return GAMES.find(g => g.id === gameId);
}

// Math facts data by grade
export const MATH_FACTS_BY_GRADE: Record<number, { operations: string[]; maxNumber: number }> = {
  0: { operations: ['+'], maxNumber: 5 },
  1: { operations: ['+', '-'], maxNumber: 10 },
  2: { operations: ['+', '-'], maxNumber: 20 },
  3: { operations: ['+', '-', '×'], maxNumber: 12 },
  4: { operations: ['+', '-', '×', '÷'], maxNumber: 12 },
  5: { operations: ['+', '-', '×', '÷'], maxNumber: 15 }
};

// Spelling words by grade
export const SPELLING_WORDS_BY_GRADE: Record<number, string[]> = {
  0: ['cat', 'dog', 'sun', 'run', 'big', 'red', 'the', 'and', 'see', 'can', 'mom', 'dad', 'hat', 'bat', 'sat'],
  1: ['play', 'said', 'have', 'from', 'come', 'some', 'were', 'there', 'when', 'what', 'your', 'about', 'many', 'then', 'them'],
  2: ['friend', 'school', 'people', 'could', 'would', 'should', 'because', 'different', 'another', 'through', 'before', 'between', 'being', 'children', 'important'],
  3: ['beautiful', 'favorite', 'special', 'together', 'everything', 'usually', 'probably', 'especially', 'different', 'important', 'interesting', 'remember', 'complete', 'direction', 'position'],
  4: ['accommodate', 'necessary', 'separate', 'definitely', 'occurrence', 'recommend', 'embarrass', 'occasionally', 'millennium', 'maintenance', 'independent', 'possession', 'conscience', 'lieutenant', 'pronunciation'],
  5: ['entrepreneur', 'conscientious', 'mischievous', 'susceptible', 'acquaintance', 'convenience', 'perseverance', 'questionnaire', 'surveillance', 'temperament', 'accommodate', 'bureaucracy', 'catastrophe', 'controversial', 'immediately']
};

// Typing words by grade
export const TYPING_WORDS_BY_GRADE: Record<number, string[]> = {
  0: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'the', 'and', 'cat'],
  1: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day'],
  2: ['about', 'after', 'again', 'air', 'also', 'back', 'because', 'before', 'boy', 'came', 'come', 'could', 'day', 'did', 'different'],
  3: ['almost', 'along', 'always', 'animals', 'another', 'asked', 'began', 'being', 'below', 'between', 'both', 'car', 'carry', 'children', 'city'],
  4: ['ability', 'above', 'according', 'across', 'actually', 'addition', 'against', 'already', 'although', 'always', 'american', 'amount', 'analysis', 'anything', 'appeared'],
  5: ['absolutely', 'acceptance', 'accessible', 'accomplish', 'according', 'achievement', 'acknowledge', 'additional', 'administration', 'advertisement', 'agriculture', 'alternative', 'anniversary', 'application', 'appropriate']
};

// Sight words for bubble pop game
export const SIGHT_WORDS_BY_GRADE: Record<number, string[]> = {
  0: ['I', 'a', 'the', 'to', 'and', 'is', 'it', 'in', 'my', 'we', 'go', 'so', 'no', 'he', 'me'],
  1: ['of', 'you', 'that', 'was', 'for', 'on', 'are', 'with', 'they', 'be', 'at', 'one', 'have', 'this', 'from'],
  2: ['or', 'had', 'by', 'not', 'but', 'what', 'all', 'were', 'when', 'your', 'can', 'said', 'there', 'use', 'an']
};
