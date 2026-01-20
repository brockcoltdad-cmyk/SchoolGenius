'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, Sparkles,
  Rocket, User, GraduationCap, Brain, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase-client';

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

const grades = ['9', '10', '11', '12'];

const benefits = [
  { icon: '🎯', text: 'Learn at your own pace, no pressure' },
  { icon: '🎮', text: 'Pick themes that match YOUR style' },
  { icon: '📈', text: 'Track your progress & level up' },
  { icon: '🤖', text: 'AI tutor available 24/7' },
  { icon: '🏆', text: 'Earn rewards & achievements' },
];

export default function TeenSignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    grade: '9',
    email: '',
    password: '',
    confirmPassword: '',
    parentEmail: '', // Optional - for parent oversight
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

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            account_type: 'teen',
            name: formData.name,
            grade: formData.grade,
          }
        }
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Create profile as teen type
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            account_type: 'teen',
          });

        if (profileError) {
          console.error('Profile error:', profileError);
        }

        // Create a "child" record for the teen (they are their own child)
        const { data: childData, error: childError } = await supabase
          .from('children')
          .insert({
            parent_id: authData.user.id, // Teen is their own "parent"
            name: formData.name,
            grade_level: formData.grade,
            current_theme: currentTheme.id,
            is_independent_teen: true,
            linked_parent_email: formData.parentEmail || null,
          })
          .select()
          .single();

        if (childError) {
          console.error('Child record error:', childError);
          setError('Account created but profile setup failed. Please contact support.');
          setLoading(false);
          return;
        }

        // Redirect directly to their kid dashboard
        router.push(`/kid/${childData.id}`);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
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
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white hover:text-white/80 font-semibold">
                  Sign In
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
              className="hidden lg:block"
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
                  🎓
                </motion.div>
                <div>
                  <div className={`text-xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                    High School Mode
                  </div>
                  <div className="text-gray-400 text-xs font-semibold">Independent Learning</div>
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
                Learn on
                <br />
                <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                  Your Terms
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 leading-relaxed mb-8 font-medium"
              >
                <GraduationCap className="inline h-6 w-6 text-yellow-400 mr-2" />
                No parent account needed. <span className="text-white font-bold">You&apos;re in control</span> of your own learning journey.
              </motion.p>

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 mb-8"
              >
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 bg-black/60 backdrop-blur-xl rounded-xl p-4 border-2 border-white/10"
                  >
                    <span className="text-2xl">{benefit.icon}</span>
                    <span className="text-base font-bold text-white flex-1">{benefit.text}</span>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Parent Link Info */}
              <motion.div
                key={`offer-${selectedTheme}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">👨‍👩‍👧</span>
                  <span className="text-lg font-black text-white">Optional Parent Link</span>
                </div>
                <p className="text-white/90 font-medium">
                  Want to share your progress with a parent? You can add their email - totally optional!
                </p>
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN - Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Mobile header */}
              <div className="lg:hidden text-center mb-6">
                <h1 className="text-4xl font-black text-white mb-2">
                  <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>Teen Sign Up</span>
                </h1>
                <p className="text-gray-400 font-medium">Independent learner? Let&apos;s go!</p>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-black/80 backdrop-blur-xl rounded-3xl p-10 border-4 border-white/10 shadow-2xl relative overflow-hidden"
              >
                {/* Themed top bar */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${currentTheme.gradient}`} />

                <div className="text-center mb-6">
                  <motion.div
                    key={`icon-${selectedTheme}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className={`mb-4 inline-flex rounded-full bg-gradient-to-r ${currentTheme.gradient} p-4 shadow-xl`}
                  >
                    {step === 1 ? (
                      <User className="h-8 w-8 text-white" />
                    ) : (
                      <Rocket className="h-8 w-8 text-white" />
                    )}
                  </motion.div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    {step === 1 ? 'About You' : 'Create Account'}
                  </h2>
                  <p className="text-gray-400 font-medium">
                    {step === 1
                      ? "Let's get to know you"
                      : 'Almost there!'}
                  </p>
                </div>

                {/* Step indicator */}
                <div className="mb-6 flex items-center justify-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-lg transition-all ${
                    step === 1 ? `bg-gradient-to-r ${currentTheme.gradient} text-white shadow-lg` : 'bg-green-500 text-white'
                  }`}>
                    {step === 1 ? '1' : '✓'}
                  </div>
                  <div className={`w-16 h-1 rounded-full transition-all ${step === 2 ? `bg-gradient-to-r ${currentTheme.gradient}` : 'bg-white/20'}`} />
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-lg transition-all ${
                    step === 2 ? `bg-gradient-to-r ${currentTheme.gradient} text-white shadow-lg` : 'bg-white/20 text-gray-500'
                  }`}>
                    2
                  </div>
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

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleStep1Submit}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-bold text-gray-300">
                          Your Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: currentTheme.bgGlow.replace('0.4', '1') }} />
                          <Input
                            id="name"
                            type="text"
                            placeholder="What should we call you?"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pl-12 py-6 text-base bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:border-white/40"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="grade" className="mb-2 block text-sm font-bold text-gray-300">
                          Your Grade
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {grades.map((grade) => (
                            <motion.button
                              key={grade}
                              type="button"
                              onClick={() => setFormData({ ...formData, grade })}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`py-4 rounded-xl font-black text-lg transition-all ${
                                formData.grade === grade
                                  ? `bg-gradient-to-r ${currentTheme.gradient} text-white shadow-lg border-2 border-white/30`
                                  : 'bg-black/60 text-gray-400 border-2 border-white/10 hover:border-white/30'
                              }`}
                            >
                              {grade}th
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className={`w-full bg-gradient-to-r ${currentTheme.gradient} py-7 text-xl font-black shadow-xl transition-all rounded-xl border-2 border-white/20`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            Continue <ArrowRight className="w-6 h-6" />
                          </span>
                        </Button>
                      </motion.div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleStep2Submit}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-300">
                          Your Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: currentTheme.bgGlow.replace('0.4', '1') }} />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@school.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-12 py-6 text-base bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:border-white/40"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-300">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: currentTheme.bgGlow.replace('0.4', '1') }} />
                          <Input
                            id="password"
                            type="password"
                            placeholder="At least 6 characters"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pl-12 py-6 text-base bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:border-white/40"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold text-gray-300">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: currentTheme.bgGlow.replace('0.4', '1') }} />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="pl-12 py-6 text-base bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:border-white/40"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="parentEmail" className="mb-2 block text-sm font-bold text-gray-300">
                          Parent Email <span className="text-gray-500">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="parentEmail"
                            type="email"
                            placeholder="If you want to share progress"
                            value={formData.parentEmail}
                            onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                            className="pl-12 py-6 text-base bg-black/60 border-2 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:border-white/40"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => { setStep(1); setError(''); }}
                          className="w-1/4 py-6 border-2 border-white/20 rounded-xl bg-transparent text-white hover:bg-white/10"
                          disabled={loading}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                          <Button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-7 text-xl font-black shadow-xl transition-all disabled:opacity-50 rounded-xl border-2 border-white/20`}
                          >
                            {loading ? (
                              <span className="flex items-center gap-2">
                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                                Creating...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                Let&apos;s Learn! <Sparkles className="w-6 h-6" />
                              </span>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-center gap-2">
                  <span className="text-gray-400 font-medium">Are you a parent?</span>
                  <Link href="/signup" className={`font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                    Parent Sign Up
                  </Link>
                </div>

                <p className="mt-4 text-center text-gray-400 font-medium">
                  Already have an account?{' '}
                  <Link href="/login" className={`font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                    Sign in
                  </Link>
                </p>

                {/* Quick stats */}
                <div className="mt-6 pt-6 border-t-2 border-white/10">
                  <div className="flex justify-center gap-6 text-center">
                    <div>
                      <p className={`text-2xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>10K+</p>
                      <p className="text-xs font-bold text-gray-500">Teen Users</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>4.8</p>
                      <p className="text-xs font-bold text-gray-500">Star Rating</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>24/7</p>
                      <p className="text-xs font-bold text-gray-500">AI Help</p>
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
