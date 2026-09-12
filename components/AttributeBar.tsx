"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AttributeBarProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  glow: string;
}

export default function AttributeBar({
  icon: Icon,
  label,
  value,
  color,
  glow,
}: AttributeBarProps) {
  const level = Math.max(1, Math.floor(value / 10));

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ backgroundColor: `${color}22`, color }}
          >
            <Icon size={13} strokeWidth={2.4} />
          </div>
          <span className="text-xs font-semibold text-white/70 font-body">
            {label}
          </span>
        </div>
        <span
          className="text-[11px] font-display font-bold px-1.5 py-0.5 rounded"
          style={{ color, backgroundColor: `${color}18` }}
        >
          Lv {level}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-black/40 border border-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${glow}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        />
      </div>
    </div>
  );
}
