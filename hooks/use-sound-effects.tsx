"use client";

import { useEffect, useRef, useState } from 'react';

type SoundEffect =
  | 'click'
  | 'success'
  | 'error'
  | 'levelup'
  | 'coin'
  | 'achievement'
  | 'notification'
  | 'whoosh'
  | 'pop'
  | 'celebration';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  envelope?: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
}

const soundConfigs: Record<SoundEffect, SoundConfig> = {
  click: {
    frequency: 800,
    duration: 50,
    type: 'sine',
    volume: 0.3,
  },
  success: {
    frequency: 523.25,
    duration: 200,
    type: 'sine',
    volume: 0.4,
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 }
  },
  error: {
    frequency: 200,
    duration: 150,
    type: 'sawtooth',
    volume: 0.3,
  },
  levelup: {
    frequency: 659.25,
    duration: 400,
    type: 'sine',
    volume: 0.5,
    envelope: { attack: 0.02, decay: 0.2, sustain: 0.5, release: 0.2 }
  },
  coin: {
    frequency: 1046.5,
    duration: 100,
    type: 'triangle',
    volume: 0.4,
  },
  achievement: {
    frequency: 880,
    duration: 300,
    type: 'sine',
    volume: 0.5,
    envelope: { attack: 0.05, decay: 0.1, sustain: 0.6, release: 0.15 }
  },
  notification: {
    frequency: 700,
    duration: 120,
    type: 'sine',
    volume: 0.35,
  },
  whoosh: {
    frequency: 400,
    duration: 180,
    type: 'sawtooth',
    volume: 0.25,
  },
  pop: {
    frequency: 600,
    duration: 80,
    type: 'sine',
    volume: 0.3,
  },
  celebration: {
    frequency: 784,
    duration: 500,
    type: 'sine',
    volume: 0.5,
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3 }
  }
};

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('sound-effects-enabled');
      const savedVolume = localStorage.getItem('sound-effects-volume');

      if (savedEnabled !== null) {
        setIsEnabled(savedEnabled === 'true');
      }
      if (savedVolume !== null) {
        setVolume(parseFloat(savedVolume));
      }
    }
  }, []);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const play = (effect: SoundEffect) => {
    if (!isEnabled) return;

    const config = soundConfigs[effect];
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.value = config.frequency;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const finalVolume = config.volume * volume;

    if (config.envelope) {
      const { attack, decay, sustain, release } = config.envelope;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(finalVolume, now + attack);
      gainNode.gain.linearRampToValueAtTime(finalVolume * sustain, now + attack + decay);
      gainNode.gain.setValueAtTime(finalVolume * sustain, now + config.duration / 1000 - release);
      gainNode.gain.linearRampToValueAtTime(0, now + config.duration / 1000);
    } else {
      gainNode.gain.setValueAtTime(finalVolume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + config.duration / 1000);
    }

    oscillator.start(now);
    oscillator.stop(now + config.duration / 1000);
  };

  const playSequence = async (effects: SoundEffect[], delay: number = 100) => {
    for (const effect of effects) {
      play(effect);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const toggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound-effects-enabled', String(newValue));
    }
  };

  const setVolumeLevel = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound-effects-volume', String(clampedVolume));
    }
  };

  return {
    play,
    playSequence,
    isEnabled,
    toggle,
    volume,
    setVolume: setVolumeLevel
  };
}

export function playSound(effect: SoundEffect) {
  if (typeof window !== 'undefined') {
    const enabled = localStorage.getItem('sound-effects-enabled');
    if (enabled === 'false') return;

    window.dispatchEvent(
      new CustomEvent('play-sound', { detail: { effect } })
    );
  }
}

export function SoundEffectsProvider({ children }: { children: React.ReactNode }) {
  const { play } = useSoundEffects();

  useEffect(() => {
    const handlePlaySound = (event: CustomEvent) => {
      play(event.detail.effect);
    };

    window.addEventListener('play-sound' as any, handlePlaySound);
    return () => window.removeEventListener('play-sound' as any, handlePlaySound);
  }, [play]);

  return <>{children}</>;
}
