'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Crown, Medal, Flame, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import type { LeaderboardPlayer, LeaderboardLabels } from '@/lib/leaderboard-config';
import type { LucideIcon } from 'lucide-react';

interface LeaderboardColors {
  background: string;
  backgroundGradient: string;
  radialGradient: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  border: string;
  shadow: string;
  buttonBg: string;
  buttonText: string;
  buttonShadow: string;
  buttonHover: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  headerText: string;
  top3Bg: string;
  top3Border: string;
  currentUserBg: string;
  currentUserBorder: string;
  currentUserShadow: string;
  rowBg: string;
  rowBorder: string;
  rowHover: string;
  rankText: string;
  statCard1Bg: string;
  statCard1Border: string;
  statCard1Icon: string;
  statCard1Text: string;
  statCard2Bg: string;
  statCard2Border: string;
  statCard2Icon: string;
  statCard2Text: string;
  statCard3Bg: string;
  statCard3Border: string;
  statCard3Icon: string;
  statCard3Text: string;
  currencyText: string;
  powerText: string;
}

interface LeaderboardTemplateProps {
  theme: string;
  config: LeaderboardLabels;
  mockPlayers: LeaderboardPlayer[];
  currentUserRank: number;
  colors: LeaderboardColors;
  backLink: string;
  PowerIcon: LucideIcon;
}

export default function LeaderboardTemplate({
  theme,
  config,
  mockPlayers,
  currentUserRank,
  colors,
  backLink,
  PowerIcon,
}: LeaderboardTemplateProps) {
  const [filter, setFilter] = useState<'global' | 'friends' | 'nearby'>('global');

  return (
    <div className={`min-h-screen ${colors.background} relative overflow-hidden`}>
      <div className={`absolute inset-0 ${colors.backgroundGradient}`} />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: colors.radialGradient,
        }} />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className={`text-7xl font-black text-transparent bg-clip-text ${colors.headerText} mb-4`}>
            {config.title}
          </h1>
          <p className="text-2xl text-gray-400 font-bold">{config.subtitle}</p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          {['global', 'friends', 'nearby'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-3 font-black uppercase tracking-wider border-4 border-black transition-all ${
                filter === f
                  ? `${colors.buttonBg} ${colors.buttonText} ${colors.buttonShadow}`
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${colors.cardBg} border-4 ${colors.cardBorder} rounded-3xl p-8 ${colors.cardShadow} mb-8`}
        >
          <div className={`flex items-center justify-between mb-6 pb-4 border-b-4 ${colors.border}`}>
            <div className="flex items-center gap-4">
              <Trophy className={`h-10 w-10 ${colors.primary}`} />
              <h2 className={`text-3xl font-black ${colors.primary}`}>{config.topLabel}</h2>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Your Rank</div>
              <div className={`text-3xl font-black ${colors.primary}`}>#{currentUserRank}</div>
            </div>
          </div>

          <div className={`grid grid-cols-12 gap-4 mb-4 ${colors.primary} font-bold text-sm uppercase px-4`}>
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">{config.playerLabel}</div>
            <div className="col-span-1">Level</div>
            <div className="col-span-2">{config.currencyLabel}</div>
            <div className="col-span-2">{config.powerLevelLabel}</div>
            <div className="col-span-2">{config.achievementsLabel}</div>
            <div className="col-span-1 text-center">Change</div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {mockPlayers.map((player, index) => {
              const isCurrentUser = player.rank === currentUserRank;
              const isTop3 = player.rank <= 3;

              return (
                <motion.div
                  key={player.rank}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`grid grid-cols-12 gap-4 p-4 rounded-xl border-4 transition-all items-center ${
                    isCurrentUser
                      ? `${colors.currentUserBg} ${colors.currentUserBorder} ${colors.currentUserShadow}`
                      : isTop3
                      ? `${colors.top3Bg} ${colors.top3Border}`
                      : `${colors.rowBg} ${colors.rowBorder} ${colors.rowHover}`
                  }`}
                >
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      {player.rank === 1 && <Crown className="h-6 w-6 text-yellow-400" />}
                      {player.rank === 2 && <Medal className="h-6 w-6 text-gray-400" />}
                      {player.rank === 3 && <Medal className="h-6 w-6 text-amber-600" />}
                      <span className={`text-2xl font-black ${
                        isTop3 ? colors.rankText : isCurrentUser ? colors.primary : 'text-white'
                      }`}>
                        {player.rank}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center gap-3">
                    <div className="text-4xl">{player.avatar}</div>
                    <div>
                      <div className={`font-black ${isCurrentUser ? colors.primary : 'text-white'}`}>
                        {player.name}
                        {isCurrentUser && <span className={`ml-2 ${colors.primaryLight}`}>(You)</span>}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="text-xl font-black text-white">{player.level}</div>
                  </div>

                  <div className="col-span-2">
                    <div className={`text-lg font-bold ${colors.currencyText}`}>
                      {player.currency.toLocaleString()}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <PowerIcon className={`h-5 w-5 ${colors.powerText}`} />
                      <span className={`text-lg font-bold ${colors.powerText}`}>
                        {player.powerLevel.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="text-lg font-bold text-white">{player.achievements}</span>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    {player.change > 0 ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <ArrowUp className="h-5 w-5" />
                        <span className="font-bold">{player.change}</span>
                      </div>
                    ) : player.change < 0 ? (
                      <div className="flex items-center gap-1 text-red-400">
                        <ArrowDown className="h-5 w-5" />
                        <span className="font-bold">{Math.abs(player.change)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-bold">-</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${colors.statCard1Bg} border-4 ${colors.statCard1Border} rounded-xl p-6 text-center`}
          >
            <PowerIcon className={`h-12 w-12 ${colors.statCard1Icon} mx-auto mb-3`} />
            <div className="text-4xl font-black text-white mb-2">1,247</div>
            <div className={`${colors.statCard1Text} font-bold`}>Your {config.statCard1Label}</div>
            <div className="text-sm text-gray-400 mt-2">850 behind next rank</div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${colors.statCard2Bg} border-4 ${colors.statCard2Border} rounded-xl p-6 text-center`}
          >
            <Flame className={`h-12 w-12 ${colors.statCard2Icon} mx-auto mb-3`} />
            <div className="text-4xl font-black text-white mb-2">12</div>
            <div className={`${colors.statCard2Text} font-bold`}>Your {config.statCard2Label}</div>
            <div className="text-sm text-gray-400 mt-2">Keep going!</div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`${colors.statCard3Bg} border-4 ${colors.statCard3Border} rounded-xl p-6 text-center`}
          >
            <TrendingUp className={`h-12 w-12 ${colors.statCard3Icon} mx-auto mb-3`} />
            <div className="text-4xl font-black text-green-400 mb-2">+3</div>
            <div className={`${colors.statCard3Text} font-bold`}>{config.statCard3Label}</div>
            <div className="text-sm text-gray-400 mt-2">Climbing the ranks!</div>
          </motion.div>
        </div>
      </div>

      <Link href={backLink}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`fixed bottom-8 left-8 px-6 py-3 ${colors.buttonBg} ${colors.buttonText} text-xl font-black border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[0_0_20px_${colors.buttonHover}] transition-all z-50`}
        >
          ← BACK
        </motion.button>
      </Link>
    </div>
  );
}
