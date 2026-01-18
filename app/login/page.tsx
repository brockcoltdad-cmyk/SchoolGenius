'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, LogIn, AlertCircle, Brain, Sparkles, ArrowRight, CheckCircle2, Zap, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';

const themes = [
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

export default function LoginPage() {
  const { signIn } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('schoolgenius-theme');
    if (saved !== null) {
      const index = parseInt(saved, 10);
      if (index >= 0 && index < themes.length) {
        setSelectedTheme(index);
      }
    }
  }, []);

  // Save theme when changed
  const handleThemeChange = (index: number) => {
    setSelectedTheme(index);
    localStorage.setItem('schoolgenius-theme', index.toString());
  };

  const currentTheme = themes[selectedTheme];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(formData.email, formData.password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        key={selectedTheme}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.2,
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentTheme.bgGlow}, transparent)`,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${currentTheme.gradient} shadow-lg`}
              >
                <Brain className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <div className="text-xl font-black text-white">School Genius</div>
                <div className="text-[10px] text-gray-400 font-semibold">AI-Powered Learning</div>
              </div>
            </Link>

            {/* Theme Selector */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold mr-2 hidden sm:block">Pick Theme:</span>
              {themes.map((theme, index) => (
                <motion.button
                  key={theme.id}
                  onClick={() => handleThemeChange(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative h-10 w-10 rounded-lg font-black text-xl transition-all ${
                    selectedTheme === index
                      ? `bg-gradient-to-r ${theme.gradient} shadow-lg border-2 border-white/50`
                      : 'bg-gray-800/50 hover:bg-gray-700/50 border-2 border-gray-700'
                  }`}
                >
                  {theme.emoji}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/signup">
                <Button size="sm" className={`bg-gradient-to-r ${currentTheme.gradient} font-bold shadow-lg`}>
                  Start Free
                  <Sparkles className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="pt-[72px] min-h-screen flex items-center relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT COLUMN - Value Prop */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Badge */}
              <motion.div
                key={`badge-${selectedTheme}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 mb-6 bg-black/60 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-white/10"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  {currentTheme.emoji}
                </motion.div>
                <div>
                  <div className={`text-xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                    {currentTheme.name}
                  </div>
                  <div className="text-gray-400 text-xs font-semibold">Welcome Back!</div>
                </div>
              </motion.div>

              {/* HUGE Headline */}
              <motion.h1
                key={`headline-${selectedTheme}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl lg:text-7xl font-black text-white leading-[0.9] mb-6"
              >
                Sign In to
                <br />
                <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                  School Genius
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 leading-relaxed mb-8 font-medium"
              >
                <Zap className="inline h-6 w-6 text-yellow-400 mr-2" />
                Access your child's <span className="text-white font-bold">personalized learning dashboard</span> and track their amazing progress.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <div className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme.gradient} bg-opacity-20 border-2 border-white/30 rounded-full px-5 py-3 backdrop-blur-xl`}>
                  <Trophy className="h-5 w-5 text-white" />
                  <span className="text-white font-bold">Track Progress</span>
                </div>
                <div className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme.gradient} bg-opacity-20 border-2 border-white/30 rounded-full px-5 py-3 backdrop-blur-xl`}>
                  <Brain className="h-5 w-5 text-white" />
                  <span className="text-white font-bold">AI Tutor</span>
                </div>
                <div className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme.gradient} bg-opacity-20 border-2 border-white/30 rounded-full px-5 py-3 backdrop-blur-xl`}>
                  <Star className="h-5 w-5 text-white" />
                  <span className="text-white font-bold">Fun Themes</span>
                </div>
              </motion.div>

              {/* Testimonial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💜</span>
                  <span className="text-lg font-bold text-white">Parents Love Us!</span>
                </div>
                <p className="text-gray-300 italic">
                  "My kids BEG to do their homework now. The Fortnite theme got my son doing math for 2 hours straight!"
                </p>
                <p className="text-gray-500 text-sm mt-2 font-semibold">- Sarah M., Mom of 3</p>
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-black/80 backdrop-blur-xl rounded-3xl p-10 border-4 border-white/10 shadow-2xl"
              >
                {/* Themed top bar */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${currentTheme.gradient} rounded-t-3xl`} />

                <div className="text-center mb-8">
                  <motion.div
                    key={`icon-${selectedTheme}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className={`mb-4 inline-flex rounded-full bg-gradient-to-r ${currentTheme.gradient} p-4 shadow-xl`}
                  >
                    <LogIn className="h-8 w-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Welcome Back!
                  </h2>
                  <p className="text-gray-400 font-medium">
                    Sign in to continue the adventure
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/20 border-2 border-red-500/50 p-4 text-sm text-red-400"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-gray-300"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2`} style={{ color: currentTheme.bgGlow.replace('0.4', '1') }} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-12 py-6 text-base bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:border-white/40"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-bold text-gray-300"
                      >
                        Password
                      </label>
                      <a
                        href="#"
                        className={`text-sm font-bold bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2`} style={{ color: currentTheme.bgGlow.replace('0.4', '1') }} />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="pl-12 py-6 text-base bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:border-white/40"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`w-full bg-gradient-to-r ${currentTheme.gradient} py-7 text-xl font-black shadow-xl transition-all disabled:opacity-50 rounded-xl border-2 border-white/20`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            ⏳
                          </motion.span>
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Let's Go! <ArrowRight className="w-6 h-6" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Student Login Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {/* Kid Login Button */}
                  <Link href="/login/kid">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className={`w-full py-6 text-base font-black border-2 border-white/20 bg-black/40 text-white hover:bg-white/10 rounded-xl`}
                      >
                        <span className="mr-2 text-xl">{currentTheme.emoji}</span>
                        Kid Login
                      </Button>
                    </motion.div>
                  </Link>

                  {/* Teen Sign Up Button */}
                  <Link href="/signup/teen">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className={`w-full py-6 text-base font-black border-2 border-white/20 bg-black/40 text-white hover:bg-white/10 rounded-xl`}
                      >
                        <span className="mr-2 text-xl">🎓</span>
                        Teen Sign Up
                      </Button>
                    </motion.div>
                  </Link>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 font-medium">
                    New to School Genius?{' '}
                    <Link
                      href="/signup"
                      className={`font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}
                    >
                      Start Free Trial
                    </Link>
                  </p>
                </div>

                {/* Quick stats */}
                <div className="mt-6 pt-6 border-t-2 border-white/10">
                  <div className="flex justify-center gap-6 text-center">
                    <div>
                      <p className={`text-2xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>50K+</p>
                      <p className="text-xs font-bold text-gray-500">Happy Kids</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>4.9</p>
                      <p className="text-xs font-bold text-gray-500">Star Rating</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>6</p>
                      <p className="text-xs font-bold text-gray-500">Cool Themes</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
