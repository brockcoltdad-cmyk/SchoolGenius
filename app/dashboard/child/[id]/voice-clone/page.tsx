'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, Volume2, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import VoiceCloneRecorder from '@/components/VoiceCloneRecorder';

interface VoiceClone {
  id: string;
  voice_type: string;
  voice_name: string;
  audio_url: string;
  created_at: string;
}

interface Child {
  id: string;
  name: string;
  preferred_voice_type: string;
}

export default function VoiceClonePage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.id as string;

  const [child, setChild] = useState<Child | null>(null);
  const [voices, setVoices] = useState<VoiceClone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferredVoice, setPreferredVoice] = useState('default');

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      // Fetch voices
      const voicesRes = await fetch(`/api/voice-clone?childId=${childId}`);
      if (voicesRes.ok) {
        const data = await voicesRes.json();
        setVoices(data.voices || []);
      }

      // Fetch child info for name and preferred voice
      const childRes = await fetch(`/api/children/${childId}`);
      if (childRes.ok) {
        const childData = await childRes.json();
        setChild({
          id: childData.id,
          name: childData.name,
          preferred_voice_type: childData.preferred_voice_type || 'default'
        });
        setPreferredVoice(childData.preferred_voice_type || 'default');
      } else {
        // Fallback
        setChild({
          id: childId,
          name: 'Your Child',
          preferred_voice_type: 'default'
        });
        setPreferredVoice('default');
      }

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVoice = async (voiceType: string, audioBlob: Blob) => {
    setSaving(true);
    try {
      const formData = new FormData();
      // Save as .wav for Chatterbox voice cloning compatibility
      formData.append('audio', audioBlob, 'voice.wav');
      formData.append('childId', childId);
      formData.append('voiceType', voiceType);
      formData.append('voiceName', voiceType === 'mom' ? "Mom's Voice" : voiceType === 'dad' ? "Dad's Voice" : 'Custom Voice');

      const response = await fetch('/api/voice-clone', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save voice');
      }

      // Refresh voices
      await fetchData();

    } catch (error: any) {
      console.error('Save error:', error);
      alert(error.message || 'Failed to save voice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVoice = async (voiceId: string) => {
    try {
      const response = await fetch(`/api/voice-clone?voiceId=${voiceId}&childId=${childId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete voice');
      }

      // Refresh voices
      await fetchData();

    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete voice. Please try again.');
    }
  };

  const handleSetPreferred = async (voiceType: string) => {
    setPreferredVoice(voiceType);
    try {
      // Save to database
      const response = await fetch(`/api/children/${childId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferred_voice_type: voiceType })
      });
      if (!response.ok) {
        throw new Error('Failed to save preference');
      }
      console.log(`Voice preference saved: ${voiceType}`);
    } catch (error) {
      console.error('Error saving voice preference:', error);
      alert('Failed to save voice preference');
    }
  };

  const getExistingVoice = (type: string) => {
    return voices.find(v => v.voice_type === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-bold text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href={`/dashboard/child/${childId}`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎙️</div>
          <h1 className="text-4xl font-black text-white mb-2">Voice Cloning</h1>
          <p className="text-white/70 text-lg">
            Record your voice so Gigi can speak in your voice to {child?.name || 'your child'}!
          </p>
        </motion.div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">How It Works</h3>
              <ul className="text-white/80 space-y-2">
                <li>• Record a <strong>10-15 second</strong> voice sample</li>
                <li>• AI clones your voice instantly - no training needed!</li>
                <li>• When Gigi reads lessons, she'll use <strong>your voice</strong></li>
                <li>• Kids love hearing their parents' voices while learning!</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Voice Recorders */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mom's Voice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VoiceCloneRecorder
            voiceType="mom"
            existingVoiceUrl={getExistingVoice('mom')?.audio_url}
            onSave={(blob) => handleSaveVoice('mom', blob)}
            onDelete={getExistingVoice('mom') ? () => handleDeleteVoice(getExistingVoice('mom')!.id) : undefined}
          />
        </motion.div>

        {/* Dad's Voice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VoiceCloneRecorder
            voiceType="dad"
            existingVoiceUrl={getExistingVoice('dad')?.audio_url}
            onSave={(blob) => handleSaveVoice('dad', blob)}
            onDelete={getExistingVoice('dad') ? () => handleDeleteVoice(getExistingVoice('dad')!.id) : undefined}
          />
        </motion.div>

        {/* Voice Selection */}
        {voices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Choose Default Voice</h3>
            </div>

            <p className="text-white/60 text-sm mb-4">
              Select which voice Gigi should use when speaking to {child?.name}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Default Gigi Voice */}
              <button
                onClick={() => handleSetPreferred('default')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  preferredVoice === 'default'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <span className="text-white font-medium">Gigi's Voice</span>
                  </div>
                  {preferredVoice === 'default' && (
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  )}
                </div>
              </button>

              {/* Mom's Voice */}
              {getExistingVoice('mom') && (
                <button
                  onClick={() => handleSetPreferred('mom')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    preferredVoice === 'mom'
                      ? 'border-pink-500 bg-pink-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👩</span>
                      <span className="text-white font-medium">Mom's Voice</span>
                    </div>
                    {preferredVoice === 'mom' && (
                      <CheckCircle className="w-5 h-5 text-pink-400" />
                    )}
                  </div>
                </button>
              )}

              {/* Dad's Voice */}
              {getExistingVoice('dad') && (
                <button
                  onClick={() => handleSetPreferred('dad')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    preferredVoice === 'dad'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👨</span>
                      <span className="text-white font-medium">Dad's Voice</span>
                    </div>
                    {preferredVoice === 'dad' && (
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Chatterbox Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/40 text-sm py-4"
        >
          <p>Powered by Chatterbox TTS - Free, Open Source Voice Cloning</p>
        </motion.div>
      </div>
    </div>
  );
}
