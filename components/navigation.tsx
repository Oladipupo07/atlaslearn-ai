"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  BrainCircuit,
  ShieldAlert,
  PieChart,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  Flame,
  UserRound,
  Map,
  ClipboardList,
  Bot,
  Wifi,
  WifiOff,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useStreak } from "@/contexts/StreakContext";
import { useGamification, getLevelFromXP } from "@/contexts/GamificationContext";

const navSections = [
  {
    label: "Workspace",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard, badge: null },
      { name: "Budget Ledger", href: "/budget", icon: Wallet, badge: null },
      { name: "Financial Report", href: "/report", icon: ClipboardList, badge: null },
    ],
  },
  {
    label: "AI Intelligence",
    items: [
      { name: "Atlas Coach", href: "/chatbot", icon: Bot, badge: "AI" },
      { name: "30-Day Roadmap", href: "/roadmap", icon: Map, badge: null },
    ],
  },
  {
    label: "Literacy & Defense",
    items: [
      { name: "Finance Quiz", href: "/quiz", icon: BrainCircuit, badge: "+XP" },
      { name: "Scam Shield", href: "/scam-checker", icon: ShieldAlert, badge: null },
      { name: "Profile & Badges", href: "/profile", icon: UserRound, badge: null },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isGuest, guestName, isOnline, logout } = useAuth();
  const { streak } = useStreak();
  const { progress } = useGamification();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const hasSession = Boolean(user || isGuest);
  const displayName = user?.displayName || (isGuest ? guestName : "Atlas User");
  const displaySubtext = user?.email || (isGuest ? "Local Offline Vault" : "");

  const lvlInfo = getLevelFromXP(progress.xp);
  const range = lvlInfo.nextXP - lvlInfo.prevXP;
  const currentInLevel = progress.xp - lvlInfo.prevXP;
  const levelPct = range > 0 ? Math.min((currentInLevel / range) * 100, 100) : 100;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/85 backdrop-blur-xl h-screen fixed top-0 left-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <PieChart className="text-white w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-none text-foreground">
              AtlasLearn <span className="text-primary">AI</span>
            </span>
            <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
              Personal Finance OS
            </span>
          </div>
        </Link>

        <div
          title={isOnline ? "Cloud Synced" : "Offline Mode — Saved Locally"}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
            isOnline
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
          )}
        >
          {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
          <span>{isOnline ? "Live" : "Offline"}</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1.5">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group relative",
                    isActive
                      ? "text-foreground bg-primary/10 font-semibold border border-primary/20 shadow-2xs"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Compact Telemetry Card (Level + Streak) */}
        {hasSession && (
          <div className="pt-2 px-1">
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/15 text-primary flex items-center justify-center text-xs font-black">
                    {progress.level}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-none">
                      {lvlInfo.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5 tabular-nums">
                      {progress.xp} XP Total
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[11px] font-bold tabular-nums">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>{streak?.currentStreak ?? 0}d</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium tabular-nums">
                  <span>Next milestone</span>
                  <span>{levelPct.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${levelPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Account Footer */}
      <div className="p-3 border-t border-border bg-card/50 flex flex-col gap-1.5">
        {hasSession && (
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted transition-colors group"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-8 h-8 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {(displayName || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                {displaySubtext}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        )}

        {hasSession ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isGuest ? "Exit Offline Workspace" : "Sign Out"}</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isGuest, guestName, isOnline, logout } = useAuth();
  const { streak } = useStreak();

  const hasSession = Boolean(user || isGuest);
  const displayName = user?.displayName || (isGuest ? guestName : "Atlas User");
  const displaySubtext = user?.email || (isGuest ? "Local Offline Vault" : "");

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/90 backdrop-blur-xl z-40 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
            <PieChart className="text-white w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight">
            AtlasLearn <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
              isOnline
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            )}
          >
            {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
            {isOnline ? "Online" : "Offline"}
          </span>

          {hasSession && (
            <div className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold text-orange-500 tabular-nums">
              <Flame className="w-3 h-3 fill-current" />
              <span>{streak?.currentStreak ?? 0}</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-0 top-14 bg-background/98 backdrop-blur-xl z-30 flex flex-col"
          >
            <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
              {navSections.map((section) => (
                <div key={section.label} className="space-y-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {section.label}
                  </p>
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all",
                          isActive
                            ? "text-foreground bg-primary/10 font-semibold border border-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-border flex flex-col gap-2">
              {hasSession ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {(displayName || "U")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {displaySubtext}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isGuest ? "Exit Offline Workspace" : "Sign Out"}</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-all text-foreground"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
