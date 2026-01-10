"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

export function MagneticCursor() {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click'>('default');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant(isHovering ? 'hover' : 'default');

    const handleMouseEnterInteractive = () => {
      setIsHovering(true);
      setCursorVariant('hover');
    };

    const handleMouseLeaveInteractive = () => {
      setIsHovering(false);
      setCursorVariant('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnterInteractive);
      el.addEventListener('mouseleave', handleMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };
  }, [isHovering]);

  const variants = {
    default: {
      x: cursorPosition.x - 16,
      y: cursorPosition.y - 16,
      scale: 1,
      opacity: 0.6
    },
    hover: {
      x: cursorPosition.x - 24,
      y: cursorPosition.y - 24,
      scale: 1.5,
      opacity: 0.8
    },
    click: {
      x: cursorPosition.x - 12,
      y: cursorPosition.y - 12,
      scale: 0.8,
      opacity: 1
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99999] hidden md:block"
        animate={variants[cursorVariant]}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-600 blur-sm" />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99999] hidden md:block"
        animate={{
          x: cursorPosition.x - 16,
          y: cursorPosition.y - 16
        }}
        transition={{
          type: 'spring',
          stiffness: 800,
          damping: 35,
          mass: 0.3
        }}
      >
        <div className="w-full h-full rounded-full border-2 border-white/50 backdrop-blur-sm" />
      </motion.div>
    </>
  );
}
