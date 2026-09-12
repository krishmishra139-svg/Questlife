"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Sword, Shield, Flame, ScrollText } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const clearError = useAuthStore((s) => s.clearError);

  // Already signed in? skip straight to the dashboard.
  useEffect(() => {
    if (initialized && user) router.replace("/dashboard");
  }, [initialized, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    clearError();

    if (mode === "login") {
      const { error: signInError } = await signIn(email, password);
      if (!signInError) router.push("/dashboard");
    } else {
      const { error: signUpError } = await signUp(email, password);
      if (!signUpError) {
        // If email confirmation is required, there's no session yet.
        setNotice("Account created! Check your email to confirm, then sign in.");
        setMode("login");
      }
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-ink overflow-hidden">
      {/* LEFT: Hero art panel */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-arcane/20 via-ink to-gold/10" />
        <div className="absolute inset-0 bg-grain opacity-40" />

        {/* Floating ambient glows */}
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-arcane/30 blur-[100px]"
          style={{ top: "10%", left: "15%" }}
          animate={{ y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gold/20 blur-[110px]"
          style={{ bottom: "5%", right: "10%" }}
          animate={{ y: [0, -25, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Floating icon runes */}
        {[
          { Icon: Sword, top: "20%", left: "20%", delay: 0 },
          { Icon: Shield, top: "65%", left: "18%", delay: 0.6 },
          { Icon: Flame, top: "30%", left: "75%", delay: 1.2 },
          { Icon: ScrollText, top: "72%", left: "70%", delay: 1.8 },
        ].map(({ Icon, top, left, delay }, i) => (
          <motion.div
            key={i}
            className="absolute text-gold/30"
            style={{ top, left }}
            animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
          >
            <Icon size={38} strokeWidth={1.2} />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-md px-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright to-gold shadow-gold-lg"
          >
            <Sparkles size={44} className="text-ink-deep" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl md:text-5xl font-bold text-parchment leading-tight text-glow-gold"
          >
            Level Up Your
            <br />
            Real Life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-white/50 font-body text-sm leading-relaxed"
          >
            Turn your habits into quests. Earn XP, collect gold, and grow
            attributes that reflect who you're becoming — one completed
            quest at a time.
          </motion.p>

          <div className="mt-10 divider-gold" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex justify-center gap-8 text-xs text-white/40 font-body tracking-wide"
          >
            <div className="text-center">
              <div className="font-display text-lg text-gold">12K+</div>
              Adventurers
            </div>
            <div className="text-center">
              <div className="font-display text-lg text-arcane-bright">340K</div>
              Quests Done
            </div>
            <div className="text-center">
              <div className="font-display text-lg text-verdant">98%</div>
              Stay Motivated
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT: Auth form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-16 relative">
        <div className="absolute inset-0 bg-grain opacity-30 lg:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="game-panel w-full max-w-sm p-8 relative z-10"
        >
          <div className="mb-8 text-center">
            <p className="font-display tracking-[0.2em] text-xs text-gold/80 uppercase mb-2">
              QuestLife
            </p>
            <h2 className="font-display text-2xl font-semibold text-parchment">
              {mode === "login" ? "Enter the Realm" : "Create Your Hero"}
            </h2>
            <p className="text-white/40 text-sm mt-2">
              {mode === "login"
                ? "Continue your adventure."
                : "Begin a new legend today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block font-body">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@questlife.gg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block font-body">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {notice && (
              <p className="text-xs text-verdant bg-verdant/10 border border-verdant/20 rounded-lg px-3 py-2">
                {notice}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "One moment…" : mode === "login" ? "Begin Quest" : "Forge My Legend"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            {mode === "login" ? (
              <>
                New to the realm?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    clearError();
                    setNotice(null);
                  }}
                  className="text-gold hover:text-gold-bright transition-colors font-semibold"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already a hero?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    clearError();
                    setNotice(null);
                  }}
                  className="text-gold hover:text-gold-bright transition-colors font-semibold"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
