'use client';

import { useTheme } from '@/lib/theme-context';
import { motion } from 'framer-motion';

export function ThemeDecorations() {
  const { currentTheme } = useTheme();

  if (currentTheme.id === 'dinosaur') {
    return (
      <>
        <motion.div
          className="fixed top-10 left-5 text-6xl opacity-30 pointer-events-none z-0"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, type: 'tween' }}
        >
          🦕
        </motion.div>
        <motion.div
          className="fixed top-40 right-10 text-5xl opacity-20 pointer-events-none z-0"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🦖
        </motion.div>
        <motion.div
          className="fixed bottom-32 left-12 text-4xl opacity-25 pointer-events-none z-0"
          animate={{ rotate: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🦴
        </motion.div>
        <motion.div
          className="fixed bottom-20 right-20 text-7xl opacity-15 pointer-events-none z-0"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌴
        </motion.div>
        <motion.div
          className="fixed top-1/2 right-5 text-5xl opacity-20 pointer-events-none z-0"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          🌿
        </motion.div>
        <motion.div
          className="fixed top-1/3 left-10 text-3xl opacity-30 pointer-events-none z-0"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          🥚
        </motion.div>
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-200/20 to-transparent pointer-events-none z-0" />
        <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-200/20 to-transparent pointer-events-none z-0" />

        <motion.div
          className="fixed bottom-10 left-1/4 text-3xl opacity-20 pointer-events-none z-0"
          animate={{ x: [-100, window.innerWidth + 100] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          🦕
        </motion.div>
      </>
    );
  }

  if (currentTheme.id === 'unicorn') {
    return (
      <>
        <motion.div
          className="fixed top-10 right-10 text-6xl opacity-30 pointer-events-none z-0"
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, type: 'tween' }}
        >
          🦄
        </motion.div>
        <motion.div
          className="fixed bottom-20 left-10 text-5xl opacity-25 pointer-events-none z-0"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          ✨
        </motion.div>
        <motion.div
          className="fixed top-1/3 right-20 text-4xl opacity-20 pointer-events-none z-0"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌟
        </motion.div>
        <motion.div
          className="fixed bottom-1/3 right-10 text-6xl opacity-15 pointer-events-none z-0"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌈
        </motion.div>
        <motion.div
          className="fixed top-1/2 left-5 text-5xl opacity-25 pointer-events-none z-0"
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          💖
        </motion.div>
        <div className="fixed inset-0 bg-gradient-to-br from-pink-100/10 via-purple-100/10 to-blue-100/10 pointer-events-none z-0" />
      </>
    );
  }

  if (currentTheme.id === 'space') {
    return (
      <>
        <motion.div
          className="fixed top-20 left-10 text-5xl opacity-30 pointer-events-none z-0"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          🪐
        </motion.div>
        <motion.div
          className="fixed top-1/4 right-20 text-6xl opacity-20 pointer-events-none z-0"
          animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🚀
        </motion.div>
        <motion.div
          className="fixed bottom-40 left-20 text-4xl opacity-25 pointer-events-none z-0"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="fixed top-1/2 right-10 text-5xl opacity-15 pointer-events-none z-0"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          🌙
        </motion.div>
        <motion.div
          className="fixed bottom-20 right-1/4 text-3xl opacity-30 pointer-events-none z-0"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          👾
        </motion.div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/5 via-purple-900/5 to-slate-900/5 pointer-events-none z-0" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="fixed w-1 h-1 bg-white rounded-full opacity-40 pointer-events-none z-0"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
          />
        ))}
      </>
    );
  }

  if (currentTheme.id === 'pirate') {
    return (
      <>
        <motion.div
          className="fixed top-10 left-10 text-6xl opacity-25 pointer-events-none z-0"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, type: 'tween' }}
        >
          🏴‍☠️
        </motion.div>
        <motion.div
          className="fixed bottom-20 right-10 text-5xl opacity-30 pointer-events-none z-0"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⚓
        </motion.div>
        <motion.div
          className="fixed top-1/3 right-20 text-4xl opacity-20 pointer-events-none z-0"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          💎
        </motion.div>
        <motion.div
          className="fixed bottom-1/3 left-10 text-6xl opacity-15 pointer-events-none z-0"
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          ⛵
        </motion.div>
      </>
    );
  }

  if (currentTheme.id === 'robot') {
    return (
      <>
        <motion.div
          className="fixed top-20 right-10 text-6xl opacity-25 pointer-events-none z-0"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🤖
        </motion.div>
        <motion.div
          className="fixed bottom-32 left-10 text-5xl opacity-20 pointer-events-none z-0"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, type: 'tween' }}
        >
          ⚙️
        </motion.div>
        <motion.div
          className="fixed top-1/2 right-20 text-4xl opacity-30 pointer-events-none z-0"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          🔧
        </motion.div>
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      </>
    );
  }

  if (currentTheme.id === 'builder') {
    return (
      <>
        <motion.div
          className="fixed top-10 left-10 text-7xl opacity-20 pointer-events-none z-0 font-mono"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🟩
        </motion.div>
        <motion.div
          className="fixed bottom-20 right-10 text-6xl opacity-25 pointer-events-none z-0 font-mono"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          🟫
        </motion.div>
        <motion.div
          className="fixed top-1/3 right-10 text-5xl opacity-20 pointer-events-none z-0 font-mono"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⛏️
        </motion.div>
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000008_2px,transparent_2px),linear-gradient(to_bottom,#00000008_2px,transparent_2px)] bg-[size:32px_32px] pointer-events-none z-0" />
      </>
    );
  }

  if (currentTheme.id === 'battle') {
    return (
      <>
        {/* Tactical Camo Background Pattern */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, transparent 0%, rgba(0,0,0,0.3) 100%),
              radial-gradient(circle at 80% 80%, transparent 0%, rgba(0,0,0,0.3) 100%),
              radial-gradient(circle at 40% 90%, transparent 0%, rgba(0,0,0,0.3) 100%)
            `,
          }} />
        </div>
        <div className="fixed inset-0 bg-gradient-to-br from-red-950/20 via-stone-950/10 to-amber-950/20 pointer-events-none z-0" />

        {/* Swords */}
        <motion.div
          className="fixed top-10 left-10 text-7xl opacity-25 pointer-events-none z-0"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, type: 'tween' }}
        >
          ⚔️
        </motion.div>
        <motion.div
          className="fixed top-1/4 right-5 text-6xl opacity-20 pointer-events-none z-0"
          animate={{ rotate: [45, 55, 35, 45] }}
          transition={{ duration: 5, repeat: Infinity, type: 'tween' }}
        >
          ⚔️
        </motion.div>

        {/* Shields */}
        <motion.div
          className="fixed bottom-20 right-20 text-7xl opacity-30 pointer-events-none z-0"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🛡️
        </motion.div>
        <motion.div
          className="fixed top-1/3 left-5 text-5xl opacity-20 pointer-events-none z-0"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🛡️
        </motion.div>

        {/* Military Medals & Helmets */}
        <motion.div
          className="fixed top-1/2 right-10 text-5xl opacity-25 pointer-events-none z-0"
          animate={{ y: [0, -10, 0], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, type: 'tween' }}
        >
          🎖️
        </motion.div>
        <motion.div
          className="fixed bottom-1/3 left-20 text-6xl opacity-20 pointer-events-none z-0"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, type: 'tween' }}
        >
          🪖
        </motion.div>

        {/* Explosions & Fire */}
        <motion.div
          className="fixed top-20 right-1/4 text-6xl opacity-30 pointer-events-none z-0"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💥
        </motion.div>
        <motion.div
          className="fixed bottom-40 left-1/4 text-5xl opacity-25 pointer-events-none z-0"
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -5, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🔥
        </motion.div>

        {/* Crosshairs & Targets */}
        <motion.div
          className="fixed top-1/2 left-1/3 text-7xl opacity-15 pointer-events-none z-0"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          🎯
        </motion.div>
        <motion.div
          className="fixed bottom-1/2 right-1/3 text-6xl opacity-20 pointer-events-none z-0"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎯
        </motion.div>

        {/* Lightning Bolts */}
        <motion.div
          className="fixed top-1/4 left-1/4 text-5xl opacity-20 pointer-events-none z-0"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡
        </motion.div>
        <motion.div
          className="fixed bottom-1/4 right-1/4 text-6xl opacity-25 pointer-events-none z-0"
          animate={{
            opacity: [0.25, 0.5, 0.25],
            y: [0, -10, 0]
          }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          ⚡
        </motion.div>

        {/* Bombs */}
        <motion.div
          className="fixed top-3/4 left-10 text-5xl opacity-20 pointer-events-none z-0"
          animate={{
            y: [0, 10, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, type: 'tween' }}
        >
          💣
        </motion.div>

        {/* Tactical Grid Overlay */}
        <div
          className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Military Stars */}
        <motion.div
          className="fixed top-10 right-1/3 text-4xl opacity-20 pointer-events-none z-0"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="fixed bottom-20 left-1/3 text-5xl opacity-15 pointer-events-none z-0"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          ⭐
        </motion.div>

        {/* Dog Tags */}
        <motion.div
          className="fixed top-1/4 left-10 text-3xl opacity-25 pointer-events-none z-0"
          animate={{ y: [0, 10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, type: 'tween' }}
          style={{ filter: 'grayscale(100%)' }}
        >
          🏷️
        </motion.div>
        <motion.div
          className="fixed bottom-1/4 right-10 text-3xl opacity-20 pointer-events-none z-0"
          animate={{ y: [0, 8, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, type: 'tween' }}
          style={{ filter: 'grayscale(100%)' }}
        >
          🏷️
        </motion.div>

        {/* Bullet Holes / Impact Marks */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`bullet-${i}`}
            className="fixed w-3 h-3 rounded-full bg-zinc-950 opacity-20 pointer-events-none z-0"
            style={{
              top: `${15 + i * 12}%`,
              left: i % 2 === 0 ? '8%' : '92%',
              boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8), 0 0 2px rgba(239,68,68,0.3)',
            }}
          />
        ))}

        {/* Tactical Badges */}
        <motion.div
          className="fixed top-2/3 left-5 text-4xl opacity-20 pointer-events-none z-0"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🛡️
        </motion.div>
        <motion.div
          className="fixed top-1/2 right-1/4 text-3xl opacity-15 pointer-events-none z-0"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, type: 'tween' }}
        >
          🎖️
        </motion.div>

        {/* Corner Warning Stripes */}
        <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-amber-500" />
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-500 to-amber-500" />
        </div>
        <div className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none z-0 opacity-20 rotate-180">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-amber-500" />
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-500 to-amber-500" />
        </div>

        {/* Crossed Swords Emblem */}
        <motion.div
          className="fixed bottom-10 right-1/4 opacity-10 pointer-events-none z-0"
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="relative text-8xl">
            <div className="absolute -rotate-45">⚔️</div>
            <div className="absolute rotate-45">⚔️</div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      {currentTheme.decorativeElements.floatingStickers.slice(0, 4).map((sticker, i) => (
        <motion.div
          key={i}
          className="fixed text-4xl opacity-20 pointer-events-none z-0"
          style={{
            top: `${20 + i * 20}%`,
            left: i % 2 === 0 ? '5%' : '90%',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            type: 'tween',
          }}
        >
          {sticker}
        </motion.div>
      ))}
    </>
  );
}
