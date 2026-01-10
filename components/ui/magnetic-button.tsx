"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonShape = 'hexagon' | 'blob' | 'squircle' | 'pill' | 'diamond';

interface MagneticButtonProps {
  shape?: ButtonShape;
  magneticStrength?: number;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const shapeStyles: Record<ButtonShape, string> = {
  hexagon: 'clip-path-hexagon',
  blob: 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]',
  squircle: 'rounded-[24px]',
  pill: 'rounded-full',
  diamond: 'rotate-45'
};

export function MagneticButton({
  shape = 'squircle',
  magneticStrength = 0.3,
  children,
  className,
  variant = 'primary',
  size = 'md',
  glow = false,
  onClick,
  disabled = false,
  type = 'button'
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700',
    secondary: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700',
    success: 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
    ghost: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden font-semibold transition-all duration-200',
        'transform-gpu will-change-transform',
        shapeStyles[shape],
        variantStyles[variant],
        sizeStyles[size],
        glow && 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
        shape === 'diamond' && 'aspect-square',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full blur-xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />

      <span className={cn(
        'relative z-10 flex items-center justify-center gap-2',
        shape === 'diamond' && '-rotate-45'
      )}>
        {children}
      </span>

      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      />
    </motion.button>
  );
}
