"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeSkin } from '@/lib/use-theme-skin';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  color: string;
  shape: 'circle' | 'star' | 'square' | 'triangle';
}

interface ParticleSystemProps {
  x: number;
  y: number;
  count?: number;
  spread?: number;
  duration?: number;
  onComplete?: () => void;
}

export function ParticleSystem({
  x,
  y,
  count = 20,
  spread = 100,
  duration = 1500,
  onComplete
}: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 2 + Math.random() * 3;

      newParticles.push({
        id: `${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: 4 + Math.random() * 8,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: ['circle', 'star', 'square', 'triangle'][Math.floor(Math.random() * 4)] as any
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [x, y, count, spread, duration, onComplete]);

  const renderParticleShape = (particle: Particle) => {
    const baseClass = "absolute transform -translate-x-1/2 -translate-y-1/2";

    switch (particle.shape) {
      case 'star':
        return (
          <div
            className={baseClass}
            style={{
              width: particle.size,
              height: particle.size,
              background: particle.color,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }}
          />
        );
      case 'square':
        return (
          <div
            className={baseClass}
            style={{
              width: particle.size,
              height: particle.size,
              background: particle.color,
              borderRadius: '2px'
            }}
          />
        );
      case 'triangle':
        return (
          <div
            className={baseClass}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${particle.size / 2}px solid transparent`,
              borderRight: `${particle.size / 2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`
            }}
          />
        );
      default:
        return (
          <div
            className={baseClass}
            style={{
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: particle.color
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: particle.x + particle.vx * spread,
              y: particle.y + particle.vy * spread,
              opacity: 0,
              scale: 0
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut'
            }}
          >
            {renderParticleShape(particle)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ParticleManagerProps {
  children: React.ReactNode;
}

interface ParticleInstance {
  id: string;
  x: number;
  y: number;
  count: number;
}

export function ParticleManager({ children }: ParticleManagerProps) {
  const [instances, setInstances] = useState<ParticleInstance[]>([]);

  useEffect(() => {
    const handleTrigger = (event: CustomEvent) => {
      const { x, y, count = 20 } = event.detail;
      const id = Math.random().toString(36).substr(2, 9);
      setInstances(prev => [...prev, { id, x, y, count }]);
    };

    window.addEventListener('trigger-particles' as any, handleTrigger);
    return () => window.removeEventListener('trigger-particles' as any, handleTrigger);
  }, []);

  const removeInstance = (id: string) => {
    setInstances(prev => prev.filter(inst => inst.id !== id));
  };

  return (
    <>
      {children}
      {instances.map(instance => (
        <ParticleSystem
          key={instance.id}
          x={instance.x}
          y={instance.y}
          count={instance.count}
          onComplete={() => removeInstance(instance.id)}
        />
      ))}
    </>
  );
}

export function triggerParticles(x: number, y: number, count = 20) {
  window.dispatchEvent(
    new CustomEvent('trigger-particles', {
      detail: { x, y, count }
    })
  );
}
