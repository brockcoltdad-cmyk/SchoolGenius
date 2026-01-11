'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle, LogOut, Brain, Clock, BookOpen, Flame,
  Crown, Settings, ChevronRight, Star, ArrowUp, Sparkles,
  Trophy, Target, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase-client';

interface Child {
  id: string;
  name: string;
  grade_level: string;
  coins: number;
  current_streak: number;
  current_theme: string;
  theme_level: number;
  level: number;
}

const gradeEmojis: Record<string, string> = {
  'K': '🎨', '1': '📚', '2': '✏️', '3': '🎯', '4': '🚀', '5': '🏆',
  '6': '🌟', '7': '⚡', '8': '💎', '9': '🔥', '10': '👑', '11': '🎓', '12': '🌈'
};

const themeColors: Record<string, string> = {
  'minecraft': '#10B981',
  'wwe': '#FFD700',
  'pirate': '#0891B2',
  'zombie': '#10B981',
  'anime': '#EF4444',
  'fortnite': '#8B5CF6',
  'default': '#3B82F6'
};

export default function ParentDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchChildren();
  }, [user]);

  async function fetchChildren() {
    if (!user) {
      console.log('No user found in dashboard');
      setIsLoading(false);
      return;
    }

    console.log('Fetching children for user:', user.id);

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching children:', error);
    } else {
      console.log('Fetched children:', data);
      setChildren((data || []) as unknown as Child[]);
    }

    setIsLoading(false);
  }

  const weeklyStats = [
    { label: 'Learning Time', value: '12.5', unit: 'hrs', icon: Clock, color: '#3B82F6', emoji: '⏰' },
    { label: 'Lessons Done', value: '47', unit: 'done', icon: BookOpen, color: '#10B981', emoji: '📚' },
    { label: 'Accuracy', value: '94', unit: '%', icon: Target, color: '#F59E0B', emoji: '🎯' },
    { label: 'Best Streak', value: '12', unit: 'days', icon: Flame, color: '#EF4444', emoji: '🔥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-cyan-50">
      <nav className="sticky top-0 z-50 border-b-4 border-orange-200 bg-white/90 backdrop-blur-xl shadow-xl">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 shadow-xl"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              >
                <Brain className="h-7 w-7 text-white" />
              </motion.div>
              <span className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">School Genius</span>
            </Link>
            <Button
              variant="outline"
              onClick={signOut}
              className="flex items-center gap-2 border-2 border-orange-300 hover:bg-orange-50 font-bold"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mb-4 inline-block text-6xl"
          >
            ✨
          </motion.div>
          <h1 className="mb-3 text-5xl font-black tracking-tight text-gray-900 lg:text-6xl">
            Family Dashboard
          </h1>
          <p className="text-2xl font-bold text-gray-600">
            See your kids' awesome learning adventures!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="mb-8 flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-black text-gray-900">This Week's Wins</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {weeklyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <Card className="relative border-4 border-orange-200 bg-white p-6 shadow-xl overflow-hidden group">
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-5xl">{stat.emoji}</div>
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-sm font-black text-green-700 shadow-md">
                        <ArrowUp className="h-4 w-4" />
                        Great!
                      </span>
                    </div>
                    <p className="mb-2 text-sm font-bold text-gray-600">{stat.label}</p>
                    <p className="text-4xl font-black text-gray-900">
                      {stat.value}
                      <span className="text-xl text-gray-500 font-bold"> {stat.unit}</span>
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="mb-8 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-orange-500" />
            <h2 className="text-3xl font-black text-gray-900">Smart Insights</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                emoji: '🌟',
                title: 'Morning Rockstars!',
                description: 'Your kids learn best between 9-11 AM',
              },
              {
                emoji: '🧮',
                title: 'Math Wizard Alert!',
                description: 'Math skills improving rapidly!',
              },
              {
                emoji: '🚀',
                title: 'Family on Fire!',
                description: 'Learning time is up - amazing!',
              },
            ].map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <Card className="h-full border-4 border-orange-200 bg-white p-6 shadow-xl group hover:shadow-2xl transition-all">
                  <div className="mb-4 text-6xl group-hover:scale-110 transition-transform">{insight.emoji}</div>
                  <h3 className="mb-3 text-xl font-black text-gray-900">{insight.title}</h3>
                  <p className="text-base font-semibold text-gray-600">{insight.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-black text-gray-900">Your Amazing Kids</h2>
            </div>
            <Link href="/dashboard/add-child">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 font-black border-4 border-orange-200 shadow-xl">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Child
                </Button>
              </motion.div>
            </Link>
          </div>

          {isLoading ? (
            <Card className="p-12 text-center border-4 border-orange-200 bg-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-4 h-16 w-16 rounded-full border-8 border-orange-200 border-t-orange-600"
              />
              <p className="text-xl font-bold text-gray-600">Loading your dashboard...</p>
            </Card>
          ) : children.length === 0 ? (
            <Card className="border-4 border-dashed border-orange-300 bg-white p-12 text-center shadow-xl">
              <div className="mb-6 text-8xl">👶</div>
              <h3 className="mb-3 text-3xl font-black text-gray-900">
                Add Your First Superstar!
              </h3>
              <p className="mb-8 text-xl font-semibold text-gray-600">
                Let's start their awesome learning adventure
              </p>
              <Link href="/dashboard/add-child">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 font-black text-lg px-8 py-6 rounded-2xl shadow-2xl">
                    <PlusCircle className="mr-2 h-6 w-6" />
                    Get Started
                  </Button>
                </motion.div>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {children.map((child, index) => {
                const initial = child.name.charAt(0).toUpperCase();
                const gradeDisplay = child.grade_level === 'K' ? 'Kindergarten' : `Grade ${child.grade_level}`;
                const gradeEmoji = gradeEmojis[child.grade_level] || '📖';
                const themeColor = themeColors[child.current_theme] || themeColors.default;

                return (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden border-4 border-orange-200 bg-white shadow-2xl hover:shadow-3xl transition-all">
                      <div
                        className="absolute top-4 right-4 z-20 rounded-full px-4 py-2 font-black text-white shadow-xl border-3 border-white"
                        style={{ backgroundColor: themeColor }}
                      >
                        Level {child.theme_level}
                      </div>

                      <Link href={`/kid/${child.id}`}>
                        <div className="p-8">
                          <div className="mb-8 flex items-center gap-5">
                            <motion.div
                              className="relative flex h-20 w-20 items-center justify-center rounded-3xl text-3xl font-black text-white shadow-2xl"
                              style={{ backgroundColor: themeColor }}
                              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            >
                              {initial}
                              <div className="absolute -top-2 -right-2 text-3xl">{gradeEmoji}</div>
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="text-3xl font-black text-gray-900">{child.name}</h3>
                              <p className="text-lg font-bold text-gray-600">{gradeDisplay}</p>
                            </div>
                            <motion.div
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="h-8 w-8 text-gray-400" />
                            </motion.div>
                          </div>

                          <div className="mb-8 grid grid-cols-3 gap-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              className="rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 p-5 text-center shadow-lg border-3 border-yellow-300"
                            >
                              <Crown className="mx-auto mb-2 h-6 w-6 text-yellow-600" />
                              <p className="text-3xl font-black text-yellow-900">{child.coins}</p>
                              <p className="text-xs font-bold text-yellow-700">Coins</p>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 p-5 text-center shadow-lg border-3 border-orange-300"
                            >
                              <Flame className="mx-auto mb-2 h-6 w-6 text-orange-600" />
                              <p className="text-3xl font-black text-orange-900">{child.current_streak}</p>
                              <p className="text-xs font-bold text-orange-700">Day Streak</p>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              className="rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-200 p-5 text-center shadow-lg border-3 border-cyan-300"
                            >
                              <Star className="mx-auto mb-2 h-6 w-6 text-cyan-600" />
                              <p className="text-3xl font-black text-cyan-900">{child.level}</p>
                              <p className="text-xs font-bold text-cyan-700">Level</p>
                            </motion.div>
                          </div>

                          <motion.div
                            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-base font-black text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-xl"
                            whileHover={{ scale: 1.02 }}
                          >
                            <span>View Their Dashboard</span>
                            <ChevronRight className="h-5 w-5" />
                          </motion.div>
                        </div>
                      </Link>

                      <div className="border-t-4 border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-4">
                        <Link href={`/dashboard/children/${child.id}/settings`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start font-bold text-gray-700 hover:text-orange-600 hover:bg-white"
                          >
                            <Settings className="mr-2 h-5 w-5" />
                            Change Theme & Settings
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="mb-8 text-3xl font-black text-center text-gray-900">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { href: '/dashboard/prizes', title: 'Manage Rewards', subtitle: 'Set up custom prizes', emoji: '🎁' },
              { href: '/dashboard/data', title: 'View Analytics', subtitle: 'Detailed reports', emoji: '📊' },
              { href: '/family', title: 'Switch Child', subtitle: 'View another child', emoji: '👨‍👩‍👧‍👦' },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="group border-4 border-orange-200 bg-white p-8 shadow-xl hover:shadow-2xl transition-all">
                    <div className="mb-4 text-6xl group-hover:scale-110 transition-transform">{action.emoji}</div>
                    <h3 className="mb-2 text-xl font-black text-gray-900">{action.title}</h3>
                    <p className="text-base font-semibold text-gray-600">{action.subtitle}</p>
                    <motion.div
                      className="mt-4 flex items-center gap-2 font-bold text-orange-600"
                      whileHover={{ x: 5 }}
                    >
                      <span>Go</span>
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
