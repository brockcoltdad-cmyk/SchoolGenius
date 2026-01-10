"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  tiltStrength?: number;
  glareEffect?: boolean;
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TiltCard({
  children,
  className,
  style,
  tiltStrength = 10,
  glareEffect = true,
  depth = 50
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * tiltStrength;
    const rotateY = (mouseX / (rect.width / 2)) * tiltStrength;

    setRotation({ x: -rotateX, y: rotateY });

    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        z: isHovered ? depth : 0
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style
      }}
    >
      <div className="relative" style={{ transform: `translateZ(${depth}px)` }}>
        {children}
      </div>

      {glareEffect && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          boxShadow: isHovered
            ? `0 ${depth}px ${depth * 2}px rgba(0,0,0,0.3)`
            : '0 2px 8px rgba(0,0,0,0.1)'
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

export function DepthCard({
  children,
  className,
  layers = 3,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  layers?: number;
}) {
  return (
    <div className={cn('relative', className)} {...props}>
      {Array.from({ length: layers }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent"
          style={{
            transform: `translateZ(${-i * 10}px)`,
            zIndex: -i
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 - i * 0.1 }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
