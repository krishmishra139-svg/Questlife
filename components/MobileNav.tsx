"use client";

import { motion } from "framer-motion";
import { Swords, User, Store } from "lucide-react";

export type MobileTab = "quests" | "character" | "shop";

const TABS: { id: MobileTab; label: string; icon: typeof Swords }[] = [
  { id: "quests", label: "Quests", icon: Swords },
  { id: "character", label: "Character", icon: User },
  { id: "shop", label: "Shop", icon: Store },
];

export default function MobileNav({
  active,
  onChange,
}: {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/10 bg-ink-panel/95 backdrop-blur-xl px-4 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center gap-1 px-4 py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-glow"
                  className="absolute -top-1 h-1 w-8 rounded-full bg-gold shadow-gold"
                />
              )}
              <Icon
                size={20}
                className={isActive ? "text-gold" : "text-white/40"}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? "text-gold" : "text-white/40"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
