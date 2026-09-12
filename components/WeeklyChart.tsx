"use client";

import { motion } from "framer-motion";

const DATA = [
  { day: "M", count: 3 },
  { day: "T", count: 5 },
  { day: "W", count: 2 },
  { day: "T", count: 6 },
  { day: "F", count: 4 },
  { day: "S", count: 1 },
  { day: "S", count: 4 },
];

const MAX = Math.max(...DATA.map((d) => d.count), 1);

export default function WeeklyChart() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-white/30 mb-3">
        Weekly Progress
      </p>
      <div className="flex items-end justify-between gap-2 h-24">
        {DATA.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-16 w-full items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.count / MAX) * 100}%` }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 100 }}
                className="w-2.5 rounded-full bg-gradient-to-t from-arcane to-arcane-bright shadow-arcane"
              />
            </div>
            <span className="text-[10px] text-white/35 font-semibold">
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
