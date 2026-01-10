"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { TiltCard } from '@/components/ui/tilt-card';
import { triggerXPGain } from '@/components/animations/FloatingXP';
import { triggerParticles } from '@/components/animations/ParticleSystem';
import { triggerGigiExpression } from '@/components/animations/GigiExpressions';
import { playSound } from '@/hooks/use-sound-effects';
import { ThemeLoader } from '@/components/animations/ThemeLoader';
import { AdvancedPageTransition } from '@/components/animations/AdvancedPageTransition';
import { Sparkles, Zap, Trophy, Star, Wand2, Rocket } from 'lucide-react';

export default function PremiumDemo() {
  const [progress, setProgress] = useState(65);
  const [showLoader, setShowLoader] = useState(false);

  const handleXPClick = (e: React.MouseEvent) => {
    const amount = Math.floor(Math.random() * 50) + 10;
    triggerXPGain(amount, e.clientX, e.clientY, 'xp');
    playSound('coin');
  };

  const handleCelebration = (e: React.MouseEvent) => {
    triggerParticles(e.clientX, e.clientY, 30);
    triggerGigiExpression('celebrating', 'Amazing work!', 3000);
    playSound('celebration');
  };

  const handleAchievement = (e: React.MouseEvent) => {
    triggerXPGain(100, e.clientX, e.clientY, 'achievement');
    triggerParticles(e.clientX, e.clientY, 40);
    triggerGigiExpression('proud', 'You earned an achievement!', 4000);
    playSound('achievement');
  };

  const handleCombo = (e: React.MouseEvent) => {
    triggerXPGain(5, e.clientX, e.clientY, 'combo');
    playSound('success');
  };

  const handleLoader = () => {
    setShowLoader(true);
    playSound('whoosh');
    setTimeout(() => {
      setShowLoader(false);
      playSound('success');
    }, 3000);
  };

  return (
    <AdvancedPageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4">
              <Sparkles className="w-12 h-12" />
              Premium Features Demo
              <Sparkles className="w-12 h-12" />
            </h1>
            <p className="text-xl text-white/80">
              Click around and experience the magic
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TiltCard className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-white/10">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Magnetic Buttons
                </h2>
                <p className="text-white/70 mb-4">
                  Hover and watch them follow your cursor
                </p>
                <div className="space-y-3">
                  <MagneticButton
                    shape="squircle"
                    variant="primary"
                    onClick={handleXPClick}
                    glow
                  >
                    <Zap className="w-5 h-5" />
                    Gain XP
                  </MagneticButton>
                  <MagneticButton
                    shape="hexagon"
                    variant="success"
                    onClick={handleCelebration}
                  >
                    <Trophy className="w-5 h-5" />
                    Celebrate
                  </MagneticButton>
                  <MagneticButton
                    shape="blob"
                    variant="secondary"
                    onClick={handleCombo}
                  >
                    <Star className="w-5 h-5" />
                    Combo
                  </MagneticButton>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl backdrop-blur-sm border border-white/10">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Progress Rings
                </h2>
                <p className="text-white/70 mb-4">
                  Animated circular progress indicators
                </p>
                <div className="flex justify-center">
                  <ProgressRing
                    progress={progress}
                    size={160}
                    strokeWidth={12}
                    color="#10b981"
                    glow
                    animate
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-white transition-colors"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                    className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-white transition-colors"
                  >
                    +10%
                  </button>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="p-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl backdrop-blur-sm border border-white/10">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-6 h-6" />
                  Particle Effects
                </h2>
                <p className="text-white/70 mb-4">
                  Theme-specific particle explosions
                </p>
                <div className="h-48 flex items-center justify-center">
                  <MagneticButton
                    shape="diamond"
                    variant="danger"
                    size="lg"
                    onClick={handleAchievement}
                    glow
                  >
                    <Trophy className="w-8 h-8" />
                    Achievement
                  </MagneticButton>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="p-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-white/10">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Rocket className="w-6 h-6" />
                  Theme Loaders
                </h2>
                <p className="text-white/70 mb-4">
                  Custom loading animations per theme
                </p>
                {showLoader ? (
                  <div className="h-48 flex items-center justify-center">
                    <ThemeLoader message="Loading magic..." size="lg" />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <MagneticButton
                      shape="pill"
                      variant="secondary"
                      onClick={handleLoader}
                    >
                      Show Loader
                    </MagneticButton>
                  </div>
                )}
              </div>
            </TiltCard>

            <TiltCard className="p-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm border border-white/10 md:col-span-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  All Features Combined
                </h2>
                <p className="text-white/70">
                  Every interaction you make triggers multiple premium effects:
                </p>
                <ul className="list-disc list-inside text-white/60 space-y-2">
                  <li>Magnetic cursor following buttons</li>
                  <li>Floating XP numbers with animations</li>
                  <li>Particle explosions on special actions</li>
                  <li>Gigi character expressions in corner</li>
                  <li>Sound effects for feedback</li>
                  <li>3D tilt effects on cards</li>
                  <li>Smooth page transitions</li>
                  <li>Theme-specific visual elements</li>
                  <li>GPU-accelerated animations</li>
                  <li>Reduce motion support for accessibility</li>
                </ul>
              </div>
            </TiltCard>
          </div>

          <motion.div
            className="mt-12 p-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Performance Optimized
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-white/80">
              <div>
                <p className="font-semibold text-white">GPU Accelerated</p>
                <p className="text-sm">All animations use CSS transforms for smooth 60fps</p>
              </div>
              <div>
                <p className="font-semibold text-white">Lazy Loaded</p>
                <p className="text-sm">Effects only load when needed, reducing bundle size</p>
              </div>
              <div>
                <p className="font-semibold text-white">Accessible</p>
                <p className="text-sm">Respects prefers-reduced-motion for accessibility</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdvancedPageTransition>
  );
}

function Target({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
