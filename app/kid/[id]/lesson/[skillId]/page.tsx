'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Play, CheckCircle, Star } from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;
  const skillId = params.skillId as string;
  
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'rules' | 'demo' | 'practice' | 'quiz'>('rules');

  const supabase = createClient();

  useEffect(() => {
    async function fetchLesson() {
      try {
        const { data, error } = await supabase
          .from('lesson_content')
          .select('*')
          .eq('skill_id', skillId)
          .single();

        if (error) throw error;
        setLesson(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [skillId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-bold text-xl">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <p className="text-white font-bold text-xl mb-4">😕 Lesson not found</p>
          <p className="text-white/70 mb-6">{error || 'This lesson is not available yet.'}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{lesson.skill_name}</h1>
            <p className="text-white/60 text-sm">{lesson.subject_code}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between mb-8">
          {['rules', 'demo', 'practice', 'quiz'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep === step
                    ? 'bg-yellow-400 text-black'
                    : index < ['rules', 'demo', 'practice', 'quiz'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white/60'
                }`}
              >
                {index < ['rules', 'demo', 'practice', 'quiz'].indexOf(currentStep) ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < ['rules', 'demo', 'practice', 'quiz'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {currentStep === 'rules' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                📚 Learn the Rules
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
                  {lesson.rules_text || 'No rules available for this lesson.'}
                </p>
              </div>
              <button
                onClick={() => setCurrentStep('demo')}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          )}

          {currentStep === 'demo' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🎬 Watch & Learn
              </h2>
              {lesson.demo_problems && lesson.demo_problems.length > 0 ? (
                <div className="space-y-6">
                  {lesson.demo_problems.map((demo: any, index: number) => (
                    <div key={index} className="bg-black/20 rounded-xl p-4">
                      <p className="text-white font-bold mb-2">Problem: {demo.problem}</p>
                      {demo.steps && (
                        <div className="space-y-2 mb-4">
                          {demo.steps.map((step: string, i: number) => (
                            <p key={i} className="text-white/80">Step {i + 1}: {step}</p>
                          ))}
                        </div>
                      )}
                      <p className="text-green-400 font-bold">Answer: {demo.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No demo problems available.</p>
              )}
              <button
                onClick={() => setCurrentStep('practice')}
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl"
              >
                Start Practice
              </button>
            </div>
          )}

          {currentStep === 'practice' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                ✏️ Practice Time
              </h2>
              <p className="text-white/70 mb-6">Practice problems coming soon!</p>
              <button
                onClick={() => setCurrentStep('quiz')}
                className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl"
              >
                Take Quiz
              </button>
            </div>
          )}

          {currentStep === 'quiz' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Quiz Time
              </h2>
              <p className="text-white/70 mb-6">Quiz coming soon!</p>
              <button
                onClick={() => router.back()}
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl"
              >
                Finish & Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
