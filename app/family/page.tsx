'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Plus, LogOut, Sparkles, Star, Flame, Crown, Zap, Trophy, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Child {
  id: string;
  name: string;
  grade_level: string;
  avatar_url: string | null;
  coins: number;
  level: number;
  current_streak: number;
  pin_required: boolean;
  pin_code: string | null;
  current_theme: string;
}

// Page themes (matches homepage)
const pageThemes = [
  {
    id: 'fortnite',
    name: 'Battle Royale',
    emoji: '🎮',
    gradient: 'from-purple-600 via-pink-600 to-purple-600',
    bgGlow: 'rgba(168,85,247,0.4)',
  },
  {
    id: 'minecraft',
    name: 'Block Builder',
    emoji: '⛏️',
    gradient: 'from-emerald-600 via-green-600 to-emerald-600',
    bgGlow: 'rgba(16,185,129,0.4)',
  },
  {
    id: 'zombie',
    name: 'Zombie Survival',
    emoji: '🧟',
    gradient: 'from-green-600 via-lime-600 to-green-600',
    bgGlow: 'rgba(132,204,22,0.4)',
  },
  {
    id: 'pirate',
    name: 'Pirate Adventure',
    emoji: '🏴‍☠️',
    gradient: 'from-blue-600 via-cyan-600 to-blue-600',
    bgGlow: 'rgba(59,130,246,0.4)',
  },
  {
    id: 'wwe',
    name: 'Wrestling Champ',
    emoji: '💪',
    gradient: 'from-yellow-600 via-red-600 to-yellow-600',
    bgGlow: 'rgba(234,179,8,0.4)',
  },
  {
    id: 'anime',
    name: 'Ninja Training',
    emoji: '⚡',
    gradient: 'from-pink-600 via-purple-600 to-pink-600',
    bgGlow: 'rgba(236,72,153,0.4)',
  },
];

// Child card theme colors
const themeColors: Record<string, { gradient: string, emoji: string }> = {
  'fortnite': { gradient: 'from-purple-600 via-pink-600 to-purple-600', emoji: '🎮' },
  'battle': { gradient: 'from-purple-600 via-pink-600 to-purple-600', emoji: '🎮' },
  'minecraft': { gradient: 'from-emerald-600 via-green-600 to-emerald-600', emoji: '⛏️' },
  'zombie': { gradient: 'from-lime-600 via-green-600 to-lime-600', emoji: '🧟' },
  'pirate': { gradient: 'from-blue-600 via-cyan-600 to-blue-600', emoji: '🏴‍☠️' },
  'wwe': { gradient: 'from-yellow-600 via-red-600 to-yellow-600', emoji: '💪' },
  'anime': { gradient: 'from-pink-600 via-purple-600 to-pink-600', emoji: '⚡' },
  'princess': { gradient: 'from-pink-500 via-purple-500 to-pink-500', emoji: '👸' },
  'space': { gradient: 'from-indigo-600 via-purple-600 to-indigo-600', emoji: '🚀' },
  'default': { gradient: 'from-blue-600 via-cyan-600 to-blue-600', emoji: '🌟' },
};

export default function FamilySelectPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, verifyParentPIN } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinDialog, setPinDialog] = useState(false);
  const [pinType, setPinType] = useState<'parent' | 'child'>('parent');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [selectedPageTheme, setSelectedPageTheme] = useState(0);

  const supabase = createClient();
  const currentPageTheme = pageThemes[selectedPageTheme];

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('schoolgenius-theme');
    if (saved !== null) {
      const index = parseInt(saved, 10);
      if (index >= 0 && index < pageThemes.length) {
        setSelectedPageTheme(index);
      }
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadChildren();
  }, [user, authLoading]);

  const loadChildren = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true });

    if (!error) {
      setChildren((data || []) as unknown as Child[]);
    }
    setLoading(false);
  };

  const handleChildClick = (child: Child) => {
    if (child.pin_required && child.pin_code) {
      setSelectedChildId(child.id);
      setPinType('child');
      setPinDialog(true);
      setPin('');
      setPinError('');
    } else {
      router.push(`/kid/${child.id}`);
    }
  };

  const handleParentModeClick = () => {
    setPinType('parent');
    setPinDialog(true);
    setPin('');
    setPinError('');
  };

  const handlePinSubmit = async () => {
    if (pinType === 'parent') {
      const valid = await verifyParentPIN(pin);
      if (valid) {
        setPinDialog(false);
        router.push('/dashboard');
      } else {
        setPinError('Incorrect PIN');
        setPin('');
      }
    } else {
      const child = children.find(c => c.id === selectedChildId);
      if (child && child.pin_code === pin) {
        setPinDialog(false);
        router.push(`/kid/${selectedChildId}`);
      } else {
        setPinError('Incorrect PIN');
        setPin('');
      }
    }
  };

  const getTheme = (themeName: string) => themeColors[themeName] || themeColors.default;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentPageTheme.bgGlow}, transparent)`,
            backgroundSize: '200% 200%',
          }}
        />
        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className={`inline-flex rounded-full bg-gradient-to-r ${currentPageTheme.gradient} p-6 shadow-xl mb-6`}
          >
            <Brain className="h-12 w-12 text-white" />
          </motion.div>
          <p className="text-2xl font-black text-white">Loading your superstars...</p>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentPageTheme.bgGlow}, transparent)`,
            backgroundSize: '200% 200%',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 backdrop-blur-xl rounded-3xl p-10 border-4 border-white/10 shadow-2xl max-w-md w-full text-center relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            {currentPageTheme.emoji}
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2">Welcome to</h1>
          <h2 className={`text-4xl font-black bg-gradient-to-r ${currentPageTheme.gradient} bg-clip-text text-transparent mb-4`}>
            School Genius!
          </h2>
          <p className="text-gray-400 font-medium mb-8">Let&apos;s add your first superstar learner!</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push('/dashboard/add-child')}
              className={`w-full bg-gradient-to-r ${currentPageTheme.gradient} py-7 text-xl font-black rounded-xl shadow-xl border-2 border-white/20`}
            >
              <Plus className="mr-2 h-6 w-6" />
              Add Your First Child
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentPageTheme.bgGlow}, transparent)`,
          backgroundSize: '200% 200%',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${currentPageTheme.gradient} shadow-lg`}
            >
              <Brain className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-black text-white">Who&apos;s Learning Today?</h1>
              <p className="text-gray-400 font-semibold mt-1">Pick a superstar to start their adventure!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="text-gray-400 hover:text-white hover:bg-white/10 font-bold"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* Children Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {children.map((child, index) => {
            const theme = getTheme(child.current_theme);
            return (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="p-6 cursor-pointer bg-black/80 backdrop-blur-xl border-4 border-white/10 rounded-3xl shadow-2xl hover:border-white/30 transition-all overflow-hidden relative group"
                  onClick={() => handleChildClick(child)}
                >
                  {/* Theme gradient bar */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${theme.gradient}`} />

                  <div className="text-center pt-2">
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      className={`mb-4 mx-auto w-28 h-28 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-5xl font-black shadow-xl border-4 border-white/20`}
                    >
                      {child.avatar_url || child.name.charAt(0).toUpperCase()}
                    </motion.div>

                    {/* Theme emoji badge */}
                    <div className="absolute top-8 right-4 text-3xl">
                      {theme.emoji}
                    </div>

                    <h3 className="text-2xl font-black text-white mb-1">{child.name}</h3>
                    <p className="text-sm font-bold text-gray-500 mb-4">
                      {child.grade_level === 'K' ? 'Kindergarten' : `Grade ${child.grade_level}`}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1 bg-yellow-500/20 border-2 border-yellow-500/50 px-3 py-1.5 rounded-full">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="font-black text-yellow-400">{child.coins}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-500/20 border-2 border-orange-500/50 px-3 py-1.5 rounded-full">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="font-black text-orange-400">{child.current_streak}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-500/20 border-2 border-blue-500/50 px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-blue-400" />
                        <span className="font-black text-blue-400">Lv.{child.level}</span>
                      </div>
                    </div>

                    {child.pin_required && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-bold">
                        <Lock className="h-3 w-3" />
                        <span>PIN Protected</span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-4 justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: children.length * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleParentModeClick}
              className="px-8 py-6 text-lg font-black bg-white/10 hover:bg-white/20 text-white border-4 border-white/20 rounded-xl shadow-xl backdrop-blur-xl"
            >
              <Lock className="mr-2 h-5 w-5" />
              Parent Dashboard
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: children.length * 0.1 + 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => router.push('/dashboard/add-child')}
              className={`px-8 py-6 text-lg font-black bg-gradient-to-r ${currentPageTheme.gradient} text-white border-4 border-white/20 rounded-xl shadow-xl`}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Child
            </Button>
          </motion.div>
        </div>

        {/* Fun footer message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-gray-500 font-bold"
        >
          <p>🎮 Learning disguised as fun - your kids won&apos;t even know they&apos;re studying! 🚀</p>
        </motion.div>
      </div>

      {/* PIN Dialog */}
      <Dialog open={pinDialog} onOpenChange={setPinDialog}>
        <DialogContent className="sm:max-w-md bg-black/95 backdrop-blur-xl border-4 border-white/20 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-white">
              {pinType === 'parent' ? '🔐 Parent PIN' : '🔒 Child PIN'}
            </DialogTitle>
            <DialogDescription className="text-center font-medium text-gray-400">
              {pinType === 'parent'
                ? 'Enter your 4-digit PIN to access the dashboard'
                : 'Enter the 2-digit PIN to continue'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={pinType === 'parent' ? 4 : 2}
              placeholder={pinType === 'parent' ? '••••' : '••'}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setPinError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePinSubmit();
              }}
              className="text-center text-4xl font-black tracking-widest bg-black/60 border-2 border-white/20 rounded-xl py-6 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />

            {pinError && (
              <p className="text-sm text-red-400 text-center font-bold">{pinError}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPinDialog(false);
                  setPin('');
                  setPinError('');
                }}
                className="flex-1 py-6 font-bold border-2 border-white/20 rounded-xl bg-transparent text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handlePinSubmit}
                  disabled={pin.length !== (pinType === 'parent' ? 4 : 2)}
                  className={`w-full bg-gradient-to-r ${currentPageTheme.gradient} py-6 font-black rounded-xl shadow-lg border-2 border-white/20`}
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Continue
                </Button>
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
