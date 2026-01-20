'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, AlertCircle, Sparkles, Brain, ArrowRight } from 'lucide-react';
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

export default function KidLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [name, setName] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleThemeChange = (index: number) => {
    setSelectedTheme(index);
    localStorage.setItem('schoolgenius-theme', index.toString());
  };

  const currentTheme = themes[selectedTheme];

  const handlePinChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);

    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    // Auto-focus next input
    if (digit && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullPin = pin.join('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (fullPin.length < 2) {
      setError('Please enter your PIN');
      return;
    }

    setLoading(true);

    try {
      // Look up child by name and PIN
      // PIN can be 2-4 digits depending on what parent set
      const { data: children, error: queryError } = await supabase
        .from('children')
        .select('id, name, pin_code, pin_required, current_theme')
        .ilike('name', name.trim())
        .eq('pin_required', true);

      if (queryError) {
        console.error('Query error:', queryError);
        setError('Something went wrong. Try again!');
        setLoading(false);
        return;
      }

      if (!children || children.length === 0) {
        setError('Hmm, I don\'t recognize that name. Ask your parent for help!');
        setLoading(false);
        return;
      }

      // Find matching child with correct PIN
      const matchedChild = children.find(child => {
        // Compare PINs - handle both 2 and 4 digit PINs
        const childPin = child.pin_code?.toString() || '';
        return childPin === fullPin || childPin === fullPin.slice(0, 2);
      });

      if (!matchedChild) {
        setError('Oops! That PIN doesn\'t match. Try again!');
        setPin(['', '', '', '']);
        pinRefs.current[0]?.focus();
        setLoading(false);
        return;
      }

      // Success! Show celebration then redirect
      setShowSuccess(true);

      // Store in session that PIN was verified
      sessionStorage.setItem(`pin_verified_${matchedChild.id}`, 'true');

      // Redirect after celebration animation
      setTimeout(() => {
        router.push(`/kid/${matchedChild.id}`);
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Try again!');
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentTheme.bgGlow}, transparent)`,
          }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, times: [0, 0.7, 1] }}
          className="text-center z-10"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-9xl mb-6"
          >
            🎉
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-5xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-white mt-4 font-bold"
          >
            Let&apos;s learn something awesome!
          </motion.p>
        </motion.div>
      </div>
    );
  }

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
                <div className="text-[10px] text-gray-400 font-semibold">Kid Login</div>
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

            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white hover:text-white/80 font-semibold">
                Parent Login
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="pt-[72px] min-h-screen flex items-center justify-center relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-black/80 backdrop-blur-xl rounded-3xl p-10 border-4 border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Themed top bar */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${currentTheme.gradient}`} />

            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                {currentTheme.emoji}
              </motion.div>
              <h1 className={`text-4xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent mb-2`}>
                Hey There!
              </h1>
              <p className="text-gray-400 font-medium text-lg">
                Enter your name and secret PIN
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="mb-2 block text-lg font-bold text-gray-300">
                  What&apos;s your name?
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2" style={{ color: currentTheme.bgGlow.replace('0.4', '1') }} />
                  <Input
                    type="text"
                    placeholder="Type your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-14 py-7 text-xl bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:border-white/40"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* PIN Input */}
              <div>
                <label className="mb-2 block text-lg font-bold text-gray-300">
                  Your Secret PIN
                </label>
                <div className="flex justify-center gap-3">
                  {pin.map((digit, index) => (
                    <motion.div
                      key={index}
                      whileFocus={{ scale: 1.1 }}
                      className="relative"
                    >
                      <input
                        ref={(el) => { pinRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        onKeyDown={(e) => handlePinKeyDown(index, e)}
                        className={`
                          w-16 h-20 text-center text-4xl font-black rounded-xl
                          bg-black/60 border-3 text-white
                          focus:outline-none focus:ring-4 transition-all
                          ${digit ? `border-white/50 bg-gradient-to-br ${currentTheme.gradient} bg-opacity-20` : 'border-white/20'}
                        `}
                        style={{
                          boxShadow: digit ? `0 0 20px ${currentTheme.bgGlow}` : 'none'
                        }}
                        disabled={loading}
                      />
                      {!digit && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-4 h-4 rounded-full bg-white/20" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-gray-500 text-sm mt-2 font-medium">
                  (2-4 digit PIN your parent gave you)
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r ${currentTheme.gradient} py-8 text-2xl font-black shadow-xl transition-all disabled:opacity-50 rounded-xl border-2 border-white/20`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.span>
                      Checking...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Let&apos;s Go! <Sparkles className="w-7 h-7" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-500 font-medium">
                Don&apos;t have a PIN?{' '}
                <span className="text-white">Ask your parent!</span>
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <Link href="/login" className={`font-bold bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                  Parent Login
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/signup/teen" className={`font-bold bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                  Teen Sign Up
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Fun floating elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {['⭐', '🌟', '✨', '💫'].map((star, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: 0.3,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                }}
              >
                {star}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
