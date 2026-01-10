'use client';

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Star, Lock, Sparkles } from 'lucide-react';
import { ThemeSkin, getRarityColor, getRarityGlow } from '@/lib/theme-skins';

interface CharacterSelectionProps {
  skins: ThemeSkin[];
  selectedSkin: string;
  currentLevel: number;
  currentCoins: number;
  onSelectSkin: (skinId: string) => void;
  onPurchaseSkin?: (skinId: string) => void;
}

export function CharacterSelection({
  skins,
  selectedSkin,
  currentLevel,
  currentCoins,
  onSelectSkin,
  onPurchaseSkin,
}: CharacterSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {skins.map((skin, index) => (
        <SkinCard
          key={skin.id}
          skin={skin}
          index={index}
          isSelected={selectedSkin === skin.id}
          currentLevel={currentLevel}
          currentCoins={currentCoins}
          onSelect={() => onSelectSkin(skin.id)}
          onPurchase={onPurchaseSkin ? () => onPurchaseSkin(skin.id) : undefined}
        />
      ))}
    </div>
  );
}

interface SkinCardProps {
  skin: ThemeSkin;
  index: number;
  isSelected: boolean;
  currentLevel: number;
  currentCoins: number;
  onSelect: () => void;
  onPurchase?: () => void;
}

function SkinCard({
  skin,
  index,
  isSelected,
  currentLevel,
  currentCoins,
  onSelect,
  onPurchase,
}: SkinCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const isLocked = currentLevel < skin.requiredLevel || (skin.unlocked === false && skin.coinCost > 0);
  const canAfford = currentCoins >= skin.coinCost;
  const needsToPurchase = skin.unlocked === false && skin.coinCost > 0;

  const handleClick = () => {
    if (isLocked) return;

    if (needsToPurchase && canAfford && onPurchase) {
      onPurchase();
    } else if (!needsToPurchase) {
      onSelect();
    }
  };

  const rarityColor = getRarityColor(skin.rarity);
  const rarityGlow = getRarityGlow(skin.rarity);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', damping: 12 }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`cursor-pointer relative group ${isLocked && !canAfford ? 'opacity-50' : ''}`}
    >
      <motion.div
        animate={isSelected ? {
          boxShadow: [
            rarityGlow,
            `0 0 40px ${rarityColor}`,
            rarityGlow,
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-3xl p-6 border-4 transition-all duration-300 ${
          isSelected ? `border-white shadow-2xl` : 'border-white/20'
        }`}
        style={{
          borderColor: isSelected ? rarityColor : undefined,
        }}
      >
        {/* Rarity Indicator */}
        <motion.div
          animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
          className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-black border-2 border-white/50 uppercase"
          style={{
            background: `linear-gradient(135deg, ${rarityColor}, ${rarityColor}dd)`,
            boxShadow: `0 0 20px ${rarityColor}88`,
          }}
        >
          {skin.rarity}
        </motion.div>

        {/* Level Requirement Badge */}
        {skin.requiredLevel > 1 && (
          <div className="absolute -top-3 -left-3 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white border-2 border-white/50">
            Lv. {skin.requiredLevel}
          </div>
        )}

        {/* Character Icon */}
        <motion.div
          animate={isHovered && !isLocked ? {
            scale: 1.1,
            rotateZ: [0, -5, 5, -5, 0],
          } : { scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-8xl mb-4 text-center relative"
          style={{ transform: 'translateZ(40px)' }}
        >
          {isLocked && currentLevel < skin.requiredLevel ? (
            <div className="text-6xl opacity-30">{skin.icon}</div>
          ) : (
            skin.icon
          )}

          {/* Lock Overlay */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          )}
        </motion.div>

        {/* Name */}
        <h3 className="text-xl font-black text-white text-center mb-2" style={{ transform: 'translateZ(30px)' }}>
          {skin.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/70 text-center mb-3">
          {skin.description}
        </p>

        {/* Purchase Info */}
        {needsToPurchase && (
          <div className="text-center">
            <motion.div
              whileHover={canAfford ? { scale: 1.05 } : {}}
              className={`px-4 py-2 rounded-lg font-bold text-sm ${
                canAfford
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gray-500/50 text-gray-300'
              }`}
            >
              {canAfford ? `Unlock: ${skin.coinCost} coins` : `Need ${skin.coinCost - currentCoins} more coins`}
            </motion.div>
          </div>
        )}

        {/* Holographic Effect */}
        <motion.div
          animate={isHovered && !isLocked ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, transparent 30%, ${rarityColor}33 50%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Selected Check */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute top-4 left-4"
              style={{ transform: 'translateZ(50px)' }}
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle Burst on Hover */}
        <AnimatePresence>
          {isHovered && !isLocked && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos(i * 45 * Math.PI / 180) * 60,
                    y: Math.sin(i * 45 * Math.PI / 180) * 60,
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                  style={{
                    background: rarityColor,
                    filter: 'blur(1px)',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Sparkle Effect for Legendary+ */}
        {(skin.rarity === 'legendary' || skin.rarity === 'mythic') && (
          <AnimatePresence>
            {isHovered && !isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 100 - 50],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    className="absolute top-1/2 left-1/2"
                  >
                    <Sparkles className="w-4 h-4" style={{ color: rarityColor }} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        animate={isSelected ? {
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-3xl blur-2xl -z-10"
        style={{ background: rarityColor }}
      />
    </motion.div>
  );
}
