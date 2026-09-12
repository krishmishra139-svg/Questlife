"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function LevelUpModal() {
  const showLevelUp = useCharacterStore((s) => s.showLevelUp);
  const lastLevel = useCharacterStore((s) => s.lastLevel);
  const attributePoints = useCharacterStore((s) => s.attributePoints);
  const dismissLevelUp = useCharacterStore((s) => s.dismissLevelUp);

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        size: 6 + Math.random() * 10,
      })),
    [showLevelUp]
  );

  useEffect(() => {
    if (showLevelUp) {
      confetti({
        particleCount: 160,
        spread: 100,
        startVelocity: 45,
        origin: { y: 0.5 },
        colors: ["#FFB800", "#FFD65C", "#7B61FF", "#9B87FF"],
      });
    }
  }, [showLevelUp]);

  return (
    <AnimatePresence>
      {showLevelUp && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none">
            {/* ambient particles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-gold/60"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  scale: [0, 1, 0.4],
                  y: [0, -40],
                }}
                transition={{ duration: 2.2, delay: p.delay, repeat: Infinity }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 20 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="pointer-events-auto game-panel bg-ink-panel px-10 py-12 max-w-sm w-full text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-radial-fade pointer-events-none" />

              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright to-gold shadow-gold-lg"
              >
                <Sparkles size={36} className="text-ink-deep" />
              </motion.div>

              <p className="relative text-xs uppercase tracking-[0.3em] text-gold/80 font-semibold mb-2">
                Achievement Unlocked
              </p>
              <h2 className="relative font-display text-4xl font-black text-parchment text-glow-gold mb-2">
                LEVEL UP!
              </h2>
              <p className="relative text-white/60 text-sm mb-6">
                You reached{" "}
                <span className="text-gold font-bold">Level {lastLevel}</span>
              </p>

              <div className="relative flex items-center justify-center gap-2 mb-8">
                <Star size={16} className="text-arcane-bright" fill="currentColor" />
                <span className="font-display font-bold text-arcane-bright text-sm">
                  +3 Attribute Points
                </span>
                <Star size={16} className="text-arcane-bright" fill="currentColor" />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={dismissLevelUp}
                className="relative w-full rounded-lg bg-gradient-to-b from-gold-bright to-gold py-3 font-display font-bold text-ink-deep shadow-gold-lg border border-gold-bright/60"
              >
                Claim Reward
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
