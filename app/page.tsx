"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ShieldAlert,
  Trophy,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  WifiOff,
  Bot,
  Map,
  ClipboardList,
  Lock,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, isGuest, continueAsGuest } = useAuth();
  const hasSession = Boolean(user || isGuest);

  const handleInstantDemo = () => {
    if (!hasSession) {
      continueAsGuest("Atlas Scholar");
    }
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 bg-grid-pattern">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <PieChart className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              AtlasLearn <span className="text-primary">AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Offline-First OS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
            <Link href="#architecture" className="hover:text-foreground transition-colors">
              Platform Architecture
            </Link>
            <Link href="#capabilities" className="hover:text-foreground transition-colors">
              Core Capabilities
            </Link>
            <Link href="#security" className="hover:text-foreground transition-colors">
              Offline & Security
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            {hasSession ? (
              <Link
                href="/dashboard"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors hidden sm:inline-block"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleInstantDemo}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors"
                >
                  <WifiOff className="w-3.5 h-3.5 text-primary" />
                  <span>Try Offline Demo</span>
                </button>
                <Link
                  href="/signup"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity shadow-xs"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[560px] h-[320px] bg-primary/12 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/80 text-xs font-medium text-muted-foreground mb-6 shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Engineered for Students & Young Professionals • Works 100% Offline</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.06] text-foreground"
          >
            Institutional-grade <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500">
              personal finance intelligence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Master cash-flow budgeting, intercept financial fraud in real time, execute 30-day wealth roadmaps, and consult your context-aware AI advisor—online or completely offline.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href={hasSession ? "/dashboard" : "/signup"}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-bold hover:opacity-95 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
            >
              <span>{hasSession ? "Open Command Center" : "Create Free Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleInstantDemo}
              className="flex items-center justify-center gap-2 surface-card hover:bg-muted px-7 py-3.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto"
            >
              <WifiOff className="w-4 h-4 text-primary" />
              <span>Launch Instant Offline Workspace</span>
            </button>
          </motion.div>
        </div>

        {/* Realistic Interactive-Style Workspace Preview */}
        <motion.div
          id="architecture"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card/90 shadow-2xl overflow-hidden">
            {/* Window Chrome */}
            <div className="h-11 border-b border-border px-4 flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-[11px] font-mono text-muted-foreground">
                  atlaslearn.ai / command-center
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Local + Cloud Synced
                </span>
              </div>
            </div>

            {/* Preview Content Grid */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-background/60">
              {/* Left 2 Columns: KPIs + 50/30/20 Allocation */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="surface-card p-4 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Monthly Inflow
                    </span>
                    <p className="text-xl font-bold mt-1 tabular-nums">₦250,000</p>
                    <span className="text-[11px] text-emerald-500 font-medium mt-1 block">
                      +100% allocated
                    </span>
                  </div>
                  <div className="surface-card p-4 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Logged Outflow
                    </span>
                    <p className="text-xl font-bold mt-1 tabular-nums">₦142,500</p>
                    <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
                      57% utilization
                    </span>
                  </div>
                  <div className="surface-card p-4 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Net Liquidity
                    </span>
                    <p className="text-xl font-bold mt-1 text-primary tabular-nums">₦107,500</p>
                    <span className="text-[11px] text-primary font-semibold mt-1 block">
                      Grade A+ Health
                    </span>
                  </div>
                </div>

                {/* 50/30/20 Capital Allocation Bar */}
                <div className="surface-card p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      50 / 30 / 20 Capital Allocation Rule
                    </span>
                    <span className="text-xs font-mono text-primary font-semibold">
                      Optimal Balance
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex gap-0.5 p-0.5">
                    <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: "50%" }} />
                    <div className="h-full bg-blue-500" style={{ width: "28%" }} />
                    <div className="h-full bg-amber-500 rounded-r-full" style={{ width: "22%" }} />
                  </div>
                  <div className="grid grid-cols-3 text-[11px] text-muted-foreground pt-1 tabular-nums">
                    <div>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                      Needs: <strong className="text-foreground">50%</strong>
                    </div>
                    <div>
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
                      Wants: <strong className="text-foreground">28%</strong>
                    </div>
                    <div>
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
                      Savings: <strong className="text-foreground">22%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Coach & Scam Shield Telemetry */}
              <div className="space-y-4">
                <div className="surface-card p-4 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Bot className="w-4 h-4 text-primary" />
                      Atlas AI Advisor
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">Context-Aware</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    &ldquo;Your food &amp; transport outflow dropped 12% this week. Moving{" "}
                    <strong className="text-foreground">₦15,000</strong> to your emergency fund hits 100% of your monthly target.&rdquo;
                  </p>
                </div>

                <div className="surface-card p-4 rounded-xl space-y-2 border-l-2 border-l-rose-500">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      Scam Shield Intercept
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
                      98% Risk
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Flagged triggers: <code className="text-rose-400">BVN</code>,{" "}
                    <code className="text-rose-400">URGENT</code>,{" "}
                    <code className="text-rose-400">DOUBLE YOUR MONEY</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Capabilities Bento Grid */}
      <section id="capabilities" className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
              Six integrated engines for complete financial mastery
            </h2>
            <p className="text-muted-foreground text-base mt-3 leading-relaxed">
              Every module shares real-time context with your ledger and works seamlessly whether you are connected to the cloud or operating completely offline.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Wallet className="w-5 h-5" />}
              badge="Daily & Historical"
              title="Precision Budget Ledger"
              description="Track daily income, categorize expenses, carry forward daily balances automatically, and monitor savings velocity in real time."
            />
            <FeatureCard
              icon={<Bot className="w-5 h-5" />}
              badge="Context-Aware AI"
              title="Atlas Personal Coach"
              description="An AI advisor that reads your live income, expense ratio, streak, and report score to deliver tailored 50/30/20 coaching."
            />
            <FeatureCard
              icon={<ShieldAlert className="w-5 h-5" />}
              badge="Fraud Defense"
              title="Phishing & Scam Shield"
              description="Instant linguistic and heuristic analysis for suspicious SMS, WhatsApp Ponzi schemes, BVN/OTP phishing, and fake investment links."
            />
            <FeatureCard
              icon={<Map className="w-5 h-5" />}
              badge="Structured Growth"
              title="30-Day Execution Roadmaps"
              description="Generate custom 4-week action plans for budgeting, emergency funds, school savings, or investing—with interactive task tracking."
            />
            <FeatureCard
              icon={<ClipboardList className="w-5 h-5" />}
              badge="5-Pillar Diagnostics"
              title="Financial Health Report Card"
              description="Quantify your financial fitness across Budgeting, Savings, Literacy, Scam Spotting, and Consistency with downloadable reports."
            />
            <FeatureCard
              icon={<Trophy className="w-5 h-5" />}
              badge="Gamified Mastery"
              title="Timed IQ Quizzes & Badges"
              description="Test your knowledge under timed conditions, earn XP, level up from Money Starter to Atlas Master, and unlock 7 scholar badges."
            />
          </div>
        </div>
      </section>

      {/* Offline-First & Security Architecture Section */}
      <section id="security" className="py-24 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <WifiOff className="w-3.5 h-3.5" />
              Resilient Offline-First Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Uninterrupted financial tools—even with zero connectivity.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Unreliable network connections shouldn&apos;t stop you from logging expenses or checking a suspicious message. AtlasLearn AI combines IndexedDB persistence, local heuristic engines, and automatic cloud synchronization.
            </p>

            <div className="space-y-4 pt-2">
              {[
                {
                  title: "Local Vault & Instant Guest Mode",
                  desc: "Use the entire platform without an internet connection. Your ledger, streaks, and roadmaps persist safely on your device.",
                },
                {
                  title: "Hybrid Cloud + Local AI Engine",
                  desc: "Uses Google Gemini 2.5 Flash when online and automatically switches to our deterministic local coaching & diagnostic engine when offline.",
                },
                {
                  title: "Zero-Config Background Sync",
                  desc: "Signed-in accounts automatically reconcile local progress, badges, and reports with Firebase Firestore the moment connectivity returns.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-8 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Offline Capability Matrix
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verified feature availability without internet access
                </p>
              </div>
              <Lock className="w-5 h-5 text-primary" />
            </div>

            <div className="space-y-3">
              {[
                { feature: "Daily Budget & Expense Ledger", status: "100% Offline Ready" },
                { feature: "Financial Health Report Card & Radar", status: "100% Offline Ready" },
                { feature: "30-Day Roadmap Generation & Tasks", status: "100% Offline Ready" },
                { feature: "Phishing & Scam Shield Analyzer", status: "100% Offline Ready" },
                { feature: "Timed Financial IQ Quizzes", status: "100% Offline Ready" },
                { feature: "Atlas AI Coach & 50/30/20 Advisor", status: "Hybrid Local + Cloud" },
              ].map((row) => (
                <div
                  key={row.feature}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border text-xs"
                >
                  <span className="font-semibold text-foreground">{row.feature}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center surface-card rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Take command of your financial trajectory today.
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
            Start with a cloud-synced account or launch the offline workspace immediately in your browser.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={hasSession ? "/dashboard" : "/signup"}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-bold hover:opacity-95 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
            >
              <span>{hasSession ? "Go to Dashboard" : "Create Free Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleInstantDemo}
              className="inline-flex items-center justify-center gap-2 bg-muted hover:bg-border text-foreground px-8 py-3.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto"
            >
              <WifiOff className="w-4 h-4 text-primary" />
              <span>Enter Offline Guest Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="text-primary-foreground w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              AtlasLearn <span className="text-primary">AI</span>
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} AtlasLearn AI. Offline-First Financial Literacy OS.
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground font-medium">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Workspace
            </Link>
            <Link href="/quiz" className="hover:text-foreground transition-colors">
              IQ Quiz
            </Link>
            <Link href="/scam-checker" className="hover:text-foreground transition-colors">
              Scam Shield
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  badge,
  title,
  description,
}: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="surface-card p-6 rounded-2xl hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
            {badge}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
