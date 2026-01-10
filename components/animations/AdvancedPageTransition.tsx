"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface AdvancedPageTransitionProps {
  children: React.ReactNode;
}

export function AdvancedPageTransition({ children }: AdvancedPageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          scale: 0.95,
          rotateX: -10,
          y: 20
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: 0,
          y: 0
        }}
        exit={{
          opacity: 0,
          scale: 1.05,
          rotateX: 10,
          y: -20
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut'
        }}
        style={{
          transformPerspective: 1200,
          transformStyle: 'preserve-3d'
        }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.6 }}
          style={{
            background: `radial-gradient(circle at center, rgba(59, 130, 246, 0.25) 0%, transparent 70%)`
          }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function SlideTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function MorphTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          clipPath: 'circle(0% at 50% 50%)',
          opacity: 0
        }}
        animate={{
          clipPath: 'circle(150% at 50% 50%)',
          opacity: 1
        }}
        exit={{
          clipPath: 'circle(0% at 50% 50%)',
          opacity: 0
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
