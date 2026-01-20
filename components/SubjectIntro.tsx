'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, Sparkles } from 'lucide-react';

interface SubjectIntroData {
  subject_code: string;
  subject_name: string;
  subject_icon: string;
  grade_level: number;
  intro_type: 'full' | 'mini' | 'refresher';

  welcome_message: string;
  what_youll_learn: string[];
  fun_fact?: string;
  mascot_message?: string;

  visual_steps?: {
    step: number;
    visual: { type: string; data: any };
    voice_text: string;
    duration?: number;
  }[];
}

interface SubjectIntroProps {
  data: SubjectIntroData;
  childName: string;
  tutorName?: string;
  onComplete: () => void;
  onSkip?: () => void;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

const SUBJECT_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  MATH: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' },
  READ: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-400 to-green-600' },
  SPELL: { bg: 'bg-purple-500', text: 'text-purple-600', gradient: 'from-purple-400 to-purple-600' },
  TYPE: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-400 to-orange-600' },
  CODE: { bg: 'bg-pink-500', text: 'text-pink-600', gradient: 'from-pink-400 to-pink-600' },
  LANG: { bg: 'bg-teal-500', text: 'text-teal-600', gradient: 'from-teal-400 to-teal-600' },
};

export default function SubjectIntro({
  data,
  childName,
  tutorName = 'Gigi',
  onComplete,
  onSkip,
  theme,
}: SubjectIntroProps) {
  const [step, setStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const colors = SUBJECT_COLORS[data.subject_code] || SUBJECT_COLORS.MATH;
  const totalSteps = data.intro_type === 'full' ? 4 : data.intro_type === 'mini' ? 2 : 1;

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="subject-intro min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full"
      >
        <div className={`p-6 text-white bg-gradient-to-r ${colors.gradient}`}>
          <div className="flex items-center gap-4">
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-5xl"
            >
              {data.subject_icon}
            </motion.span>
            <div>
              <h1 className="text-2xl font-bold">{data.subject_name}</h1>
              <p className="opacity-90">
                {data.intro_type === 'full' ? 'Welcome to your first lesson!' :
                 data.intro_type === 'mini' ? 'New topic introduction' :
                 'Quick refresher'}
              </p>
            </div>
          </div>

          {totalSteps > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === step ? 'bg-white scale-125' : i < step ? 'bg-white/80' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  😊
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Hi {childName}! I&apos;m {tutorName}!
                </h2>

                <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                  {data.welcome_message}
                </p>

                {data.mascot_message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 max-w-md mx-auto"
                  >
                    <p className="text-blue-700 italic">&quot;{data.mascot_message}&quot;</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 1 && data.intro_type === 'full' && (
              <motion.div
                key="learn"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  What You&apos;ll Learn in {data.subject_name}
                </h2>

                <div className="space-y-3">
                  {data.what_youll_learn.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <span className="text-gray-700 text-lg">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && data.intro_type === 'full' && data.fun_fact && (
              <motion.div
                key="fact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-6xl mb-4"
                >
                  <Sparkles className={`w-16 h-16 mx-auto ${colors.text}`} />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Fun Fact!
                </h2>

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`bg-gradient-to-r ${colors.gradient} text-white p-6 rounded-2xl`}
                >
                  <p className="text-xl">{data.fun_fact}</p>
                </motion.div>
              </motion.div>
            )}

            {step === totalSteps - 1 && step !== 0 && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🚀
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to Start?
                </h2>

                <p className="text-lg text-gray-600 mb-6">
                  Let&apos;s learn some amazing things together!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          {onSkip && step === 0 && data.intro_type !== 'full' && (
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip intro
            </button>
          )}
          {(!onSkip || step !== 0 || data.intro_type === 'full') && <div />}

          <button
            onClick={nextStep}
            className={`px-8 py-3 bg-gradient-to-r ${colors.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg`}
          >
            {step === totalSteps - 1 ? (
              <>
                <Play size={20} />
                Start Learning!
              </>
            ) : (
              <>
                Next
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
