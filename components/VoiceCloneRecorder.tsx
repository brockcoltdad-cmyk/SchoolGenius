'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Trash2, Upload, Check, AlertCircle } from 'lucide-react';

interface VoiceCloneRecorderProps {
  voiceType: 'mom' | 'dad' | 'custom';
  existingVoiceUrl?: string;
  onSave: (audioBlob: Blob) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const SAMPLE_SENTENCES = [
  "Hi sweetie! I'm so proud of how hard you're working on your lessons today.",
  "Great job! You're doing amazing and I believe in you!",
  "Keep up the great work! Learning is fun when you try your best.",
  "I love you and I'm so happy to help you learn new things today!",
];

// Convert audio blob to WAV format for Chatterbox voice cloning
async function convertToWav(blob: Blob): Promise<Blob> {
  const audioContext = new AudioContext();
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Get audio data
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;

  // Create WAV file
  const wavBuffer = new ArrayBuffer(44 + length * numChannels * 2);
  const view = new DataView(wavBuffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * numChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, length * numChannels * 2, true);

  // Write audio data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = audioBuffer.getChannelData(channel)[i];
      const intSample = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  await audioContext.close();
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

export default function VoiceCloneRecorder({
  voiceType,
  existingVoiceUrl,
  onSave,
  onDelete
}: VoiceCloneRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingVoiceUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sampleSentence] = useState(() =>
    SAMPLE_SENTENCES[Math.floor(Math.random() * SAMPLE_SENTENCES.length)]
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl && !existingVoiceUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, existingVoiceUrl]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording error:', err);
      setError('Could not access microphone. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const deleteRecording = async () => {
    if (audioUrl && !existingVoiceUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);

    if (onDelete && existingVoiceUrl) {
      await onDelete();
    }
  };

  const saveRecording = async () => {
    if (!audioBlob) return;

    setIsSaving(true);
    setError(null);

    try {
      // Convert to WAV format for Chatterbox voice cloning compatibility
      console.log('Converting to WAV format...');
      const wavBlob = await convertToWav(audioBlob);
      console.log('WAV conversion complete:', wavBlob.size, 'bytes');
      await onSave(wavBlob);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save voice. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const voiceLabel = voiceType === 'mom' ? "Mom's Voice" : voiceType === 'dad' ? "Dad's Voice" : "Custom Voice";
  const voiceEmoji = voiceType === 'mom' ? '👩' : voiceType === 'dad' ? '👨' : '🎤';

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{voiceEmoji}</span>
        <div>
          <h3 className="text-lg font-bold text-white">{voiceLabel}</h3>
          <p className="text-sm text-white/60">
            {existingVoiceUrl ? 'Voice sample saved' : 'Record a 10-15 second sample'}
          </p>
        </div>
      </div>

      {/* Sample sentence to read */}
      {!audioUrl && !isRecording && (
        <div className="bg-blue-500/20 border border-blue-500/40 rounded-xl p-4 mb-4">
          <p className="text-sm text-blue-300 font-medium mb-1">Read this aloud:</p>
          <p className="text-white italic">"{sampleSentence}"</p>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 bg-red-500 rounded-full"
              />
              <span className="text-red-400 font-bold">Recording...</span>
            </div>
            <span className="text-white font-mono text-lg">{formatTime(recordingTime)}</span>
          </div>
          <p className="text-white/70 text-sm mt-2">Speak naturally for 10-15 seconds</p>
        </motion.div>
      )}

      {/* Audio preview */}
      {audioUrl && !isRecording && (
        <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold">
                {existingVoiceUrl ? 'Saved voice sample' : 'Recording ready'}
              </span>
            </div>
            {recordingTime > 0 && (
              <span className="text-white/60 text-sm">{formatTime(recordingTime)}</span>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </button>
        )}

        {audioUrl && !isRecording && (
          <>
            <button
              onClick={isPlaying ? stopAudio : playAudio}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
            >
              <Play className="w-5 h-5" />
              {isPlaying ? 'Stop' : 'Preview'}
            </button>

            <button
              onClick={deleteRecording}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 text-white/70 font-bold rounded-xl hover:bg-white/20 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>

            {audioBlob && !existingVoiceUrl && (
              <button
                onClick={saveRecording}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Voice'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 text-xs text-white/50">
        <p>Tips: Speak clearly in a quiet room. Your voice will be used to read lessons to your child.</p>
      </div>
    </div>
  );
}
