'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

import {
  LetterVisual,
  PhonicsVisual,
  WordBuildingVisual,
  SightWordVisual,
  SyllableVisual,
  CountingObjectsVisual,
  NumberLineVisual,
  PlaceValueVisual,
  ArrayVisual,
  FractionVisual,
  BarModelVisual,
  BalanceScaleVisual,
  EquationStepsVisual,
  GraphVisual,
  SpellingRuleVisual,
  SentenceBuilderVisual,
  KeyboardVisual,
  CodeBlockVisual,
  VariableBoxVisual,
  LoopAnimationVisual,
  ConditionalVisual,
  OutputVisual,
} from './visuals';

const VISUAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  letter: LetterVisual,
  phonics: PhonicsVisual,
  word_building: WordBuildingVisual,
  sight_word: SightWordVisual,
  syllable: SyllableVisual,

  counting_objects: CountingObjectsVisual,
  number_line: NumberLineVisual,
  place_value: PlaceValueVisual,
  array: ArrayVisual,
  fraction: FractionVisual,
  bar_model: BarModelVisual,
  balance_scale: BalanceScaleVisual,
  equation_steps: EquationStepsVisual,
  graph: GraphVisual,

  spelling_rule: SpellingRuleVisual,
  sentence_builder: SentenceBuilderVisual,

  keyboard: KeyboardVisual,

  code_block: CodeBlockVisual,
  variable_box: VariableBoxVisual,
  loop_animation: LoopAnimationVisual,
  conditional: ConditionalVisual,
  output: OutputVisual,
};

interface VisualStep {
  step: number;
  visual: {
    type: string;
    data: any;
  };
  voice_text: string;
  audio_url?: string;
  duration?: number;
}

interface VisualLessonPlayerProps {
  lessonTitle: string;
  lessonSubtitle?: string;
  steps: VisualStep[];
  onComplete?: () => void;
  autoPlay?: boolean;
  showSubtitles?: boolean;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export default function VisualLessonPlayer({
  lessonTitle,
  lessonSubtitle,
  steps,
  onComplete,
  autoPlay = true,
  showSubtitles = true,
  theme = { primaryColor: 'blue', secondaryColor: 'purple' }
}: VisualLessonPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const step = steps[currentStep];
  const VisualComponent = step ? VISUAL_COMPONENTS[step.visual?.type] : null;
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (!step || !isPlaying) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (step.audio_url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(step.audio_url);
      audioRef.current.onended = handleStepComplete;
      audioRef.current.onerror = () => {
        handleFallbackTimer();
      };
      audioRef.current.play().catch(() => {
        handleFallbackTimer();
      });
    } else {
      handleFallbackTimer();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, isPlaying]);

  const handleFallbackTimer = () => {
    const duration = step?.duration || 3000;
    timerRef.current = setTimeout(handleStepComplete, duration);
  };

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 500);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      if (audioRef.current) audioRef.current.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      setCurrentStep(stepIndex);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (audioRef.current) audioRef.current.pause();
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="visual-lesson-player bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      <div
        className="p-6 text-white bg-gradient-to-r from-blue-500 to-purple-500"
      >
        <h2 className="text-2xl font-bold">{lessonTitle}</h2>
        {lessonSubtitle && (
          <p className="text-lg opacity-90 mt-1">{lessonSubtitle}</p>
        )}

        <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm mt-2 opacity-75">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="p-8 min-h-[350px] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {VisualComponent ? (
              <VisualComponent
                data={step.visual.data}
                isPlaying={isPlaying}
              />
            ) : (
              <div className="text-center text-gray-400 py-12">
                <div className="text-6xl mb-4">🎨</div>
                <p>Visual type "{step?.visual?.type}" coming soon!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {showSubtitles && step?.voice_text && (
        <div className="px-8 py-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start gap-3">
            <Volume2 className="text-blue-400 mt-1 flex-shrink-0" size={20} />
            <p className="text-lg text-gray-700 leading-relaxed">
              {step.voice_text}
            </p>
          </div>
        </div>
      )}

      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="p-3 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous step"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={restart}
              className="p-3 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Restart lesson"
            >
              <RotateCcw size={24} />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
          </div>

          <button
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === steps.length - 1}
            className="p-3 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next step"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-blue-500 scale-125'
                  : index < currentStep
                  ? 'bg-green-400'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
