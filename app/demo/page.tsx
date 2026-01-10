'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const DEMOS = [
  {
    id: 'fortnite',
    name: 'Battle Royale',
    emoji: '⚔️',
    description: 'Fortnite-style battle with eliminations & Victory Royale',
    gradient: 'from-purple-600 to-blue-600',
    path: '/demo/fortnite',
  },
  {
    id: 'minecraft',
    name: 'Block Builder',
    emoji: '⛏️',
    description: 'Mine blocks, craft tools, and build your world',
    gradient: 'from-green-600 to-emerald-600',
    path: '/demo/minecraft',
  },
  {
    id: 'anime',
    name: 'Ninja Training',
    emoji: '⚡',
    description: 'Power levels, jutsu attacks, and epic battles',
    gradient: 'from-orange-600 to-red-600',
    path: '/demo/anime',
  },
  {
    id: 'zombie',
    name: 'Zombie Survival',
    emoji: '🧟',
    description: 'Wave-based survival with weapons and zombies',
    gradient: 'from-green-700 to-gray-800',
    path: '/demo/zombie',
  },
  {
    id: 'pirate',
    name: 'Pirate Adventure',
    emoji: '🏴‍☠️',
    description: 'Treasure hunting, naval battles, and exploration',
    gradient: 'from-amber-700 to-orange-800',
    path: '/demo/pirate',
  },
  {
    id: 'wwe',
    name: 'Wrestling Champion',
    emoji: '🏆',
    description: 'Defend championship titles and become a WWE superstar',
    gradient: 'from-yellow-600 to-red-600',
    path: '/demo/wwe',
  },
];

export default function DemoPage() {
  const router = useRouter();

  const goToDemo = (path: string) => {
    localStorage.setItem('demo_mode', 'true');
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-black text-white mb-4"
            style={{
              textShadow: '0 0 40px rgba(147, 51, 234, 0.8), 4px 4px 0px #000',
            }}
          >
            IMMERSIVE THEME DEMOS
          </h1>
          <p className="text-2xl text-purple-300 font-bold">
            Each theme is a fully interactive world with unique mechanics!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {DEMOS.map((demo, index) => (
            <motion.button
              key={demo.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => goToDemo(demo.path)}
              className="group relative overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${demo.gradient} p-8 rounded-2xl border-4 border-white/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]`}>
                <motion.div
                  className="text-8xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {demo.emoji}
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-3">{demo.name}</h2>
                <p className="text-white/90 text-lg font-semibold">{demo.description}</p>

                <div className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white/40 font-black text-white group-hover:bg-white/30 transition-all">
                  PLAY NOW →
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-16 space-y-6">
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl p-12 max-w-3xl mx-auto border-4 border-white/20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              🎮
            </motion.div>
            <h3 className="text-4xl font-black text-white mb-4">Try Interactive Lessons!</h3>
            <p className="text-xl text-white/90 mb-6">Experience real math, reading, and coding lessons</p>
            <button
              onClick={() => router.push('/demo/lessons')}
              className="px-10 py-5 bg-white text-purple-900 text-2xl font-black rounded-full border-4 border-white shadow-2xl hover:scale-110 transition-transform"
            >
              Play Demo Lessons →
            </button>
          </div>

          <p className="text-xl text-purple-300 font-bold">
            More themes coming soon: Dinosaurs, Space, Racing, and more!
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-white text-purple-900 text-xl font-black rounded-xl border-4 border-purple-500 shadow-lg hover:scale-110 transition-transform"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
