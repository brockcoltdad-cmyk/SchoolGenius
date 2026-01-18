'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Gamepad2, Trophy, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import { useGames } from '@/hooks/useGames';

const SUBJECT_FILTERS = [
  { value: undefined, label: 'All Games' },
  { value: 'math', label: 'Math' },
  { value: 'spelling', label: 'Spelling' },
  { value: 'reading', label: 'Reading' },
  { value: 'typing', label: 'Typing' },
];

export default function GamesPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const { games, scores, loading, error, getScore } = useGames(kidId);

  // Filter games by subject
  const filteredGames = selectedSubject
    ? games.filter(g => g.subject === selectedSubject)
    : games;

  // Calculate totals
  const totalGamesPlayed = Array.from(scores.values()).reduce((sum, s) => sum + s.timesPlayed, 0);
  const totalHighScores = Array.from(scores.values()).filter(s => s.highScore > 0).length;

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />

        <div className="min-h-screen relative z-10 pb-24">
          {/* Header */}
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl sticky top-0 z-20">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="flex items-center justify-between">
                <Link
                  href={`/kid/${kidId}`}
                  className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                  style={{ color: currentTheme.colors.primary }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </Link>

                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-purple-400" />
                    <span>{totalGamesPlayed} plays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span>{totalHighScores} records</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                Game Arcade
              </h1>
              <p className="text-white/70">
                Play games and earn coins while learning!
              </p>
            </motion.div>

            {/* Subject Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {SUBJECT_FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => setSelectedSubject(filter.value)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedSubject === filter.value
                      ? 'text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  style={
                    selectedSubject === filter.value
                      ? { background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }
                      : {}
                  }
                >
                  {filter.label}
                </button>
              ))}
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                <p className="text-white/70">Loading games...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredGames.length === 0 && (
              <div className="text-center py-12">
                <Gamepad2 className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No games available for your grade level yet.</p>
              </div>
            )}

            {/* Games Grid */}
            {!loading && !error && filteredGames.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGames.map((game, i) => {
                  const gameScore = getScore(game.id);

                  return (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/kid/${kidId}/games/${game.route}`}>
                        <Card className={`${currentTheme.cardClass} overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer relative`}>
                          {/* High Score Badge */}
                          {gameScore && gameScore.highScore > 0 && (
                            <div className="absolute top-3 right-3 z-10 bg-yellow-500 rounded-full px-2 py-1 flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-white" />
                              <span className="text-white text-sm font-bold">{gameScore.highScore}</span>
                            </div>
                          )}

                          {/* Game Icon/Color */}
                          <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                            <span className="text-6xl">{game.icon}</span>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            {/* Subject Badge */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                game.subject === 'math' ? 'bg-blue-100 text-blue-700' :
                                game.subject === 'spelling' ? 'bg-yellow-100 text-yellow-700' :
                                game.subject === 'reading' ? 'bg-pink-100 text-pink-700' :
                                game.subject === 'typing' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {game.subject.charAt(0).toUpperCase() + game.subject.slice(1)}
                              </span>

                              {gameScore && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70">
                                  <Clock className="h-3 w-3" />
                                  {gameScore.timesPlayed}x played
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                              {game.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                              {game.description}
                            </p>

                            {/* Play Button */}
                            <div
                              className="w-full py-2.5 rounded-xl text-white font-semibold text-center"
                              style={{
                                background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                              }}
                            >
                              {gameScore ? 'Play Again' : 'Play Now'}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
