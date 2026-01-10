"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeSkin } from '@/lib/use-theme-skin';
import { Loader2, Sparkles, Zap, Skull, Swords, Gamepad2 } from 'lucide-react';

interface ThemeLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'default' | 'pirate' | 'zombie' | 'minecraft' | 'fortnite' | 'anime';
}

export function ThemeLoader({ message = 'Loading...', size = 'md', theme = 'default' }: ThemeLoaderProps) {
  const sizeConfig = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    md: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-base' },
    lg: { container: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-lg' }
  };

  const config = sizeConfig[size];

  const getThemeLoader = () => {
    switch (theme) {
      case 'pirate':
        return <PirateLoader size={size} />;
      case 'zombie':
        return <ZombieLoader size={size} />;
      case 'minecraft':
        return <MinecraftLoader size={size} />;
      case 'fortnite':
        return <FortniteLoader size={size} />;
      case 'anime':
        return <AnimeLoader size={size} />;
      default:
        return <DefaultLoader size={size} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {getThemeLoader()}
      {message && (
        <motion.p
          className={`${config.text} font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

function DefaultLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const config = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <motion.div
      className={`${config[size]} relative`}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <Sparkles className="w-full h-full text-blue-500" />
    </motion.div>
  );
}

function PirateLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const config = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="relative">
      <motion.div
        animate={{ rotate: [0, 20, -20, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Swords className={`${config[size]} text-yellow-600`} />
      </motion.div>

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 45}deg) translateY(-24px)`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
}

function ZombieLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const config = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <Skull className={`${config[size]} text-green-500`} />
    </motion.div>
  );
}

function MinecraftLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const blockSize = size === 'sm' ? 2 : size === 'md' ? 4 : 6;

  return (
    <div className="grid grid-cols-3 gap-1">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-${blockSize} h-${blockSize} bg-green-600 border border-green-800`}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
}

function FortniteLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const config = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="relative">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Gamepad2 className={`${config[size]} text-purple-500`} />
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #a855f7)'
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

function AnimeLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const config = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="relative">
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Sparkles className={`${config[size]} text-pink-500`} />
      </motion.div>

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 72}deg) translateY(-30px)`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        >
          <div className="w-3 h-3 bg-pink-400 rounded-full" />
        </motion.div>
      ))}
    </div>
  );
}
