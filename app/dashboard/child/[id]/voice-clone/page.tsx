'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mic, Volume2, CheckCircle, Sparkles } from 'lucide-react';
import VoiceCloneRecorder from '@/components/VoiceCloneRecorder';
import { Card } from '@/components/ui/card';
import DashboardShell, { useDashboardTheme } from '@/components/parent/DashboardShell';

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
  const { theme, isDark } = useDashboardTheme();
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
      <DashboardShell showBackButton backHref="/dashboard">
        <Card className={`p-12 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${isDark ? 'border-purple-400' : 'border-purple-600'} mx-auto mb-4`}></div>
          <p className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>Loading...</p>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      showBackButton
      backHref="/dashboard"
      title="Voice Cloning"
      subtitle={`Record your voice so Gigi can speak to ${child?.name || 'your child'}!`}
    >
      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <Card className={`border-4 ${theme.border} p-6 ${isDark ? 'bg-yellow-900/20' : 'bg-gradient-to-r from-yellow-50 to-orange-50'}`}>
          <div className="flex items-start gap-4">
            <Sparkles className={`w-8 h-8 flex-shrink-0 mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>How It Works</h3>
              <ul className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                <li>• Record a <strong>10-15 second</strong> voice sample</li>
                <li>• AI clones your voice instantly - no training needed!</li>
                <li>• When Gigi reads lessons, she&apos;ll use <strong>your voice</strong></li>
                <li>• Kids love hearing their parents&apos; voices while learning!</li>
              </ul>
            </div>
          </div>
        </Card>
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
          >
            <Card className={`p-6 border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Choose Default Voice</h3>
              </div>

              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Select which voice Gigi should use when speaking to {child?.name}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Default Gigi Voice */}
                <button
                  onClick={() => handleSetPreferred('default')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    preferredVoice === 'default'
                      ? `border-blue-500 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`
                      : `${isDark ? 'border-slate-600 bg-slate-700 hover:border-slate-500' : 'border-gray-200 bg-white hover:border-gray-300'}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🤖</span>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Gigi&apos;s Voice</span>
                    </div>
                    {preferredVoice === 'default' && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </button>

                {/* Mom's Voice */}
                {getExistingVoice('mom') && (
                  <button
                    onClick={() => handleSetPreferred('mom')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferredVoice === 'mom'
                        ? `border-pink-500 ${isDark ? 'bg-pink-900/30' : 'bg-pink-50'}`
                        : `${isDark ? 'border-slate-600 bg-slate-700 hover:border-slate-500' : 'border-gray-200 bg-white hover:border-gray-300'}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👩</span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Mom&apos;s Voice</span>
                      </div>
                      {preferredVoice === 'mom' && (
                        <CheckCircle className="w-5 h-5 text-pink-500" />
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
                        ? `border-blue-500 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`
                        : `${isDark ? 'border-slate-600 bg-slate-700 hover:border-slate-500' : 'border-gray-200 bg-white hover:border-gray-300'}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👨</span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Dad&apos;s Voice</span>
                      </div>
                      {preferredVoice === 'dad' && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Chatterbox Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-4"
        >
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
            Powered by Chatterbox TTS - Free, Open Source Voice Cloning
          </p>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
