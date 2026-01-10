'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, UserPlus, AlertCircle, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const { signUp } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    pin: '',
    confirmPin: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
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

    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    const result = await signUp(formData.email, formData.password, formData.pin);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <span className="text-3xl">🐨</span>
            <span className="text-3xl font-bold text-slate-800">SchoolGenius</span>
          </Link>

          <Card className="relative overflow-hidden bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />

            <div className="relative z-10">
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="mb-4 inline-flex rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3"
                >
                  {step === 1 ? (
                    <UserPlus className="h-6 w-6 text-white" />
                  ) : (
                    <Shield className="h-6 w-6 text-white" />
                  )}
                </motion.div>
                <h1 className="mb-2 text-3xl font-bold text-slate-800">
                  {step === 1 ? 'Create Account' : 'Set Your PIN'}
                </h1>
                <p className="text-slate-600">
                  {step === 1
                    ? 'Start your free trial today'
                    : 'Create a 4-digit PIN to protect parent mode'}
                </p>
              </div>

              <div className="mb-6 flex items-center justify-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full transition-all ${
                    step === 1 ? 'w-8 bg-blue-600' : 'bg-slate-300'
                  }`}
                />
                <div
                  className={`h-2 w-2 rounded-full transition-all ${
                    step === 2 ? 'w-8 bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
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
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="pl-12 py-6 text-base transition-all focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="At least 6 characters"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          className="pl-12 py-6 text-base transition-all focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                          }
                          className="pl-12 py-6 text-base transition-all focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold shadow-xl transition-all hover:shadow-2xl"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
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
                    className="space-y-5"
                  >
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
                      <p className="font-semibold mb-1">Why do you need a PIN?</p>
                      <p>Your 4-digit PIN protects the parent dashboard. Kids won&apos;t be able to access settings, prizes, or data without it.</p>
                    </div>

                    <div>
                      <label
                        htmlFor="pin"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        4-Digit PIN
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="pin"
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="0000"
                          value={formData.pin}
                          onChange={(e) =>
                            setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })
                          }
                          className="pl-12 py-6 text-base text-center text-2xl font-bold tracking-widest transition-all focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPin"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Confirm PIN
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="confirmPin"
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="0000"
                          value={formData.confirmPin}
                          onChange={(e) =>
                            setFormData({ ...formData, confirmPin: e.target.value.replace(/\D/g, '') })
                          }
                          className="pl-12 py-6 text-base text-center text-2xl font-bold tracking-widest transition-all focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setStep(1);
                          setError('');
                        }}
                        className="w-1/3 py-6"
                        disabled={loading}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold shadow-xl transition-all hover:shadow-2xl disabled:opacity-50"
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 transition-colors hover:text-purple-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
