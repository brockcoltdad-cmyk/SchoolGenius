'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ChevronRight, BookOpen, Clock } from 'lucide-react';

interface StoryData {
  id: string;
  title: string;
  author?: string;
  cover_emoji: string;
  lexile_level: number;
  word_count: number;
  estimated_minutes: number;
  content: string;
  paragraphs: string[];
  audio_url?: string;
}

interface StoryReaderProps {
  story: StoryData;
  childName: string;
  onComplete: (readTime: number) => void;
  onRequestQuiz: () => void;
  theme?: {
    primaryColor: string;
    fontFamily?: string;
  };
}

export default function StoryReader({
  story,
  childName,
  onComplete,
  onRequestQuiz,
  theme,
}: StoryReaderProps) {
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showFullStory, setShowFullStory] = useState(false);
  const [startTime] = useState(Date.now());
  const [fontSize, setFontSize] = useState(1.25);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const progress = ((currentParagraph + 1) / story.paragraphs.length) * 100;
  const isLastParagraph = currentParagraph === story.paragraphs.length - 1;

  useEffect(() => {
    setIsReading(true);
    return () => {
      const readTime = Math.round((Date.now() - startTime) / 1000);
      onComplete(readTime);
    };
  }, [startTime, onComplete]);

  const toggleAudio = () => {
    if (!story.audio_url) return;

    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    } else {
      audioRef.current = new Audio(story.audio_url);
      audioRef.current.onended = () => setIsAudioPlaying(false);
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  const nextParagraph = () => {
    if (currentParagraph < story.paragraphs.length - 1) {
      setCurrentParagraph(prev => prev + 1);
    }
  };

  const prevParagraph = () => {
    if (currentParagraph > 0) {
      setCurrentParagraph(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    const readTime = Math.round((Date.now() - startTime) / 1000);
    onComplete(readTime);
    onRequestQuiz();
  };

  return (
    <div className="story-reader max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{story.cover_emoji}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{story.title}</h1>
            {story.author && (
              <p className="text-gray-500">by {story.author}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <BookOpen size={16} />
                {story.word_count} words
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                ~{story.estimated_minutes} min
              </span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {story.lexile_level}L
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">
          {currentParagraph + 1} of {story.paragraphs.length} paragraphs
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {story.audio_url && (
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg transition-colors ${
                isAudioPlaying ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isAudioPlaying ? 'Pause reading' : 'Read aloud'}
            >
              {isAudioPlaying ? <Pause size={20} /> : <Volume2 size={20} />}
            </button>
          )}

          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setFontSize(prev => Math.max(1, prev - 0.125))}
              className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize(prev => Math.min(2, prev + 0.125))}
              className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-lg"
            >
              A+
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowFullStory(!showFullStory)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showFullStory ? 'Paragraph view' : 'Full story'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-4 min-h-[300px]">
        {showFullStory ? (
          <div
            className="prose max-w-none"
            style={{ fontSize: `${fontSize}rem`, lineHeight: 1.8 }}
          >
            {story.paragraphs.map((para, idx) => (
              <p key={idx} className="mb-4 text-gray-800">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <motion.div
            key={currentParagraph}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <p
              className="text-gray-800 leading-relaxed"
              style={{ fontSize: `${fontSize}rem`, lineHeight: 2 }}
            >
              {story.paragraphs[currentParagraph]}
            </p>
          </motion.div>
        )}
      </div>

      {!showFullStory && (
        <div className="flex items-center justify-between">
          <button
            onClick={prevParagraph}
            disabled={currentParagraph === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>

          {isLastParagraph ? (
            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg"
            >
              Take Quiz
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={nextParagraph}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}

      {showFullStory && (
        <div className="text-center">
          <button
            onClick={handleFinish}
            className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            I&apos;m Done Reading - Take Quiz →
          </button>
        </div>
      )}
    </div>
  );
}
