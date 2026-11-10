"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useStreak } from "@/contexts/StreakContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Sidebar, MobileNav } from "@/components/navigation";
import {
  Loader2,
  WifiOff,
  Flame,
  Sparkles,
  Wallet,
  Bot,
  ShieldCheck,
} from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Financial Command Center",
    subtitle: "Real-time cash flow telemetry, growth milestones, and AI insights",
  },
  "/budget": {
    title: "Budget & Expense Ledger",
    subtitle: "Daily income allocation, category tracking, and savings velocity",
  },
  "/roadmap": {
    title: "30-Day Financial Roadmap",
    subtitle: "Structured weekly execution plan tailored to your financial goals",
  },
  "/report": {
    title: "Financial Health Report Card",
    subtitle: "Multi-dimensional credit & habit grading across 5 core pillars",
  },
  "/chatbot": {
    title: "Atlas AI Coach",
    subtitle: "Context-aware personal finance advisor powered by your live ledger",
  },
  "/quiz": {
    title: "Financial IQ Assessment",
    subtitle: "Timed scenario challenges to benchmark and grow your financial literacy",
  },
  "/scam-checker": {
    title: "Scam & Phishing Shield",
    subtitle: "Heuristic and AI threat analysis for SMS, WhatsApp, and investment offers",
  },
  "/profile": {
    title: "Scholar Profile & Achievements",
    subtitle: "Your XP progression, unlocked credentials, and consistency records",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isGuest, isOnline, loading, continueAsGuest } = useAuth();
  const { streak } = useStreak();
  const { progress } = useGamification();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        continueAsGuest();
      } else {
        router.push("/login");
      }
    }
  }, [user, isGuest, loading, router, continueAsGuest]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Initializing Workspace…
          </p>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) return null;

  const currentMeta = PAGE_TITLES[pathname] || {
    title: "AtlasLearn Workspace",
    subtitle: "Personal Finance OS",
  };

  return (
    <div className="flex min-h-screen bg-background bg-grid-pattern">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 md:pl-64 flex flex-col pt-14 md:pt-0 min-w-0">
        {/* Desktop Top Utility Header */}
        <header className="hidden md:flex h-16 border-b border-border bg-background/80 backdrop-blur-xl px-8 items-center justify-between sticky top-0 z-20 print:hidden">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground tracking-tight truncate">
              {currentMeta.title}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {currentMeta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isGuest && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Local Vault Active
              </span>
            )}

            <Link
              href="/budget"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors"
            >
              <Wallet className="w-3.5 h-3.5 text-primary" />
              <span>Ledger</span>
            </Link>

            <Link
              href="/chatbot"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-95 transition-opacity shadow-xs"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Coach</span>
            </Link>

            <div className="h-4 w-px bg-border mx-0.5" />

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-xs font-semibold tabular-nums"
              title="XP & Active Streak"
            >
              <span className="inline-flex items-center gap-1 text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                {progress.xp} XP
              </span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1 text-orange-500">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {streak?.currentStreak ?? 0}d
              </span>
            </Link>
          </div>
        </header>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs font-medium text-amber-500 flex items-center justify-center gap-2 print:hidden">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>
              Offline Mode — All ledgers, quizzes, roadmaps, report cards, and AI coaching are running locally on your device.
            </span>
          </div>
        )}

        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
