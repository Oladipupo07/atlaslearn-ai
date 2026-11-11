"use client";

import { useState, useEffect } from "react";
import { motion as motionImport, AnimatePresence as AnimatePresenceImport } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Flame,
  Activity,
  Map,
  ClipboardList,
  Bot,
  AlertCircle,
  X,
  Check,
  ArrowRight,
  BookOpen,
  Star,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import { BankingEngine } from "@/lib/banking-service";
import { LinkedBankAccount } from "@/types/banking";
import { useGamification, getLevelFromXP } from "@/contexts/GamificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useStreak } from "@/contexts/StreakContext";
import { doc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Expense = { id: string; name: string; amount: number; category: string };
type Roadmap = {
  title: string;
  weeks: { title: string; tasks: { id: string; text: string; completed: boolean }[] }[];
};
type ReportCard = { score: number; date: string; recommendations: string[] };

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 26 },
  },
};

const DAILY_TIPS = [
  "Track one expense today. Small recurring purchases compound faster than you think.",
  "Always run unfamiliar investment links through Scam Shield before transferring funds.",
  "Pay yourself first: move 10%–20% of every inflow to savings immediately.",
  "Inflation erodes idle cash. Compare Money Market Funds and FGN Savings Bonds.",
  "Review your weekly category totals against the 50/30/20 allocation benchmark.",
  "Complete one Finance Quiz daily to compound your financial literacy and XP.",
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isGuest, guestName } = useAuth();
  const { streak } = useStreak();
  const { progress, challenge, completeChallenge } = useGamification();

  // Firestore & LocalStorage sync states
  const [income, setIncome] = useState(0);
  const [incomePeriod, setIncomePeriod] = useState("Monthly");
  const [savingsGoal, setSavingsGoal] = useState(100000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [latestReport, setLatestReport] = useState<ReportCard | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedBankAccount[]>([]);

  // Dashboard UI states
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [coachInput, setCoachInput] = useState("");
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    setMounted(true);
    const day = new Date().getDate();
    setDailyTip(DAILY_TIPS[day % DAILY_TIPS.length]);
    setLinkedAccounts(BankingEngine.getLinkedAccounts());
  }, []);

  // Fetch all user statistics & assets from LocalStorage first, then Firestore if online
  useEffect(() => {
    if (!mounted) return;

    const si = localStorage.getItem("atlaslearn_income");
    const sp = localStorage.getItem("atlaslearn_income_period");
    const sg = localStorage.getItem("atlaslearn_goal");
    const se = localStorage.getItem("atlaslearn_expenses");
    const rm = localStorage.getItem("atlaslearn_roadmap");
    const rh = localStorage.getItem("atlaslearn_report_history");

    if (si) setIncome(Number(si));
    if (sp) setIncomePeriod(sp);
    if (sg) setSavingsGoal(Number(sg));
    if (se) {
      try {
        setExpenses(JSON.parse(se));
      } catch {}
    }
    if (rm) {
      try {
        setRoadmap(JSON.parse(rm));
      } catch {}
    }
    if (rh) {
      try {
        const history = JSON.parse(rh);
        if (history.length > 0) setLatestReport(history[history.length - 1]);
      } catch {}
    }

    if (user && typeof navigator !== "undefined" && navigator.onLine) {
      const budgetRef = doc(firestore, "budgets", user.uid);
      const expensesRef = collection(firestore, "budgets", user.uid, "expenses");
      const q = query(expensesRef, orderBy("createdAt", "desc"));

      const unsubBudget = onSnapshot(
        budgetRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.income !== undefined) setIncome(data.income);
            if (data.incomePeriod !== undefined) setIncomePeriod(data.incomePeriod);
            if (data.savingsGoal !== undefined) setSavingsGoal(data.savingsGoal);
          }
        },
        () => {}
      );

      const unsubExpenses = onSnapshot(
        q,
        (snap) => {
          if (!snap.empty) {
            setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense)));
          }
        },
        () => {}
      );

      const roadmapRef = doc(firestore, "roadmaps", user.uid);
      const unsubRoadmap = onSnapshot(
        roadmapRef,
        (snap) => {
          if (snap.exists()) {
            setRoadmap(snap.data() as Roadmap);
          }
        },
        () => {}
      );

      const reportRef = doc(firestore, "reports", user.uid);
      const unsubReport = onSnapshot(
        reportRef,
        (snap) => {
          if (snap.exists()) {
            const history = snap.data().history || [];
            if (history.length > 0) {
              setLatestReport(history[history.length - 1]);
            }
          }
        },
        () => {}
      );

      return () => {
        unsubBudget();
        unsubExpenses();
        unsubRoadmap();
        unsubReport();
      };
    }
  }, [user, mounted]);

  // Setup contextual alerts/notifications
  useEffect(() => {
    if (!mounted) return;

    const list: string[] = [];
    if (!challenge.completed) {
      list.push("Daily Challenge pending: Complete today's task to earn +20 XP and extend your streak.");
    }
    if (income === 0) {
      list.push("Budget Ledger unconfigured: Set your baseline income and savings target in Budget Ledger.");
    }
    if (roadmap) {
      let hasIncomplete = false;
      roadmap.weeks.forEach((w) => {
        w.tasks.forEach((t) => {
          if (!t.completed) hasIncomplete = true;
        });
      });
      if (hasIncomplete) {
        list.push("Active Roadmap milestone: Complete your next scheduled weekly task.");
      }
    }

    setNotifications(list.slice(0, 2));
  }, [mounted, challenge.completed, income, roadmap]);

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBalance = income - totalExpenses;
  const savingsProgress =
    savingsGoal > 0 ? Math.min(Math.max((remainingBalance / savingsGoal) * 100, 0), 100) : 0;
  const budgetUsedPct = income > 0 ? Math.min((totalExpenses / income) * 100, 100) : 0;

  // Category totals
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] ?? 0) + e.amount;
  });
  const sortedCategories = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const healthScore =
    savingsProgress >= 100
      ? "A+"
      : savingsProgress >= 75
      ? "A"
      : savingsProgress >= 50
      ? "B+"
      : savingsProgress >= 25
      ? "B"
      : "C";

  const cashFlowData = [
    { name: "Inflow", income: income, expenses: 0 },
    { name: "Outflow", income: 0, expenses: totalExpenses },
    { name: "Net Surplus", income: remainingBalance > 0 ? remainingBalance : 0, expenses: 0 },
  ];

  // Roadmap progress calculation
  const getRoadmapStats = () => {
    if (!roadmap) return { tot: 0, done: 0, pct: 0, nextTask: "" };
    let tot = 0,
      done = 0,
      nextTask = "";
    roadmap.weeks.forEach((w) => {
      w.tasks.forEach((t) => {
        tot += 1;
        if (t.completed) {
          done += 1;
        } else if (!nextTask) {
          nextTask = t.text;
        }
      });
    });
    const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
    return { tot, done, pct, nextTask };
  };
  const roadmapStats = getRoadmapStats();

  const handleDismissNotification = (index: number) => {
    setNotifications(notifications.filter((_, idx) => idx !== index));
  };

  const handleCoachInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;
    router.push(`/chatbot?q=${encodeURIComponent(coachInput)}`);
  };

  if (!mounted) return <div className="min-h-screen" />;

  const firstName = (user?.displayName || (isGuest ? guestName : "Scholar")).split(" ")[0];

  return (
    <motionImport.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* Executive Header Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Executive Summary
            </span>
            <span className="text-border">•</span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {new Date().toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
            Welcome back, {firstName}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 surface-card px-3.5 py-2 rounded-xl text-xs font-semibold tabular-nums">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{streak?.currentStreak ?? 0} Day Streak</span>
          </div>
          <Link
            href="/report"
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-95 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Run Audit</span>
          </Link>
        </div>
      </div>

      {/* Contextual Action Banner */}
      <AnimatePresenceImport>
        {notifications.length > 0 && (
          <motionImport.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 print:hidden"
          >
            {notifications.map((msg, idx) => (
              <motionImport.div
                key={idx}
                layout
                className="flex items-center justify-between gap-3 surface-card px-4 py-3 rounded-xl border-l-2 border-l-primary"
              >
                <div className="flex items-center gap-2.5 text-xs text-foreground font-medium min-w-0">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                  <p className="truncate">{msg}</p>
                </div>
                <button
                  onClick={() => handleDismissNotification(idx)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motionImport.div>
            ))}
          </motionImport.div>
        )}
      </AnimatePresenceImport>

      {/* Connected MFB Live Telemetry Strip */}
      {linkedAccounts.length > 0 && (
        <motionImport.div
          variants={itemVariants}
          className="surface-card p-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Linked Microfinance Liquidity
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {linkedAccounts.length} {linkedAccounts.length === 1 ? "MFB Active" : "MFBs Active"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {linkedAccounts.map((a) => a.institutionName).join(" • ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Total Available Vault
              </span>
              <span className="text-lg font-black text-emerald-500 font-mono">
                ₦{linkedAccounts.reduce((sum, a) => sum + (a.availableBalance || 0), 0).toLocaleString()}
              </span>
            </div>
            <Link
              href="/budget"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motionImport.div>
      )}

      {/* Primary Telemetry KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Income */}
        <motionImport.div
          variants={itemVariants}
          className="surface-card p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {incomePeriod} Inflow
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold tracking-tight tabular-nums">
              ₦{income.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Active baseline</span>
              <Link
                href="/budget"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
              >
                Adjust <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motionImport.div>

        {/* Card 2: Total Outflow */}
        <motionImport.div
          variants={itemVariants}
          className="surface-card p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Logged Outflow
            </span>
            <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold tracking-tight tabular-nums">
              ₦{totalExpenses.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs tabular-nums">
              <span className="text-muted-foreground">
                {expenses.length} {expenses.length === 1 ? "transaction" : "transactions"}
              </span>
              <span
                className={
                  budgetUsedPct > 85
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground font-medium"
                }
              >
                {budgetUsedPct.toFixed(0)}% utilized
              </span>
            </div>
          </div>
        </motionImport.div>

        {/* Card 3: Net Surplus / Remaining */}
        <motionImport.div
          variants={itemVariants}
          className="surface-card p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Net Liquidity
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p
              className={`text-2xl md:text-3xl font-bold tracking-tight tabular-nums ${
                remainingBalance < 0 ? "text-destructive" : "text-foreground"
              }`}
            >
              ₦{remainingBalance.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs tabular-nums">
              <span className="text-muted-foreground">
                Target: ₦{savingsGoal.toLocaleString()}
              </span>
              <span className="text-primary font-semibold">
                {savingsProgress.toFixed(0)}% of goal
              </span>
            </div>
          </div>
        </motionImport.div>

        {/* Card 4: Health Index */}
        <motionImport.div
          variants={itemVariants}
          className="surface-card p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Health Index
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-primary/15 border border-primary/25 text-primary text-sm font-black tabular-nums">
              Grade {healthScore}
            </span>
          </div>
          <div className="space-y-2.5 mt-2">
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium tabular-nums">
                <span className="text-muted-foreground">Savings Velocity</span>
                <span className="font-semibold">{savingsProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${savingsProgress}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium tabular-nums">
                <span className="text-muted-foreground">Buffer Remaining</span>
                <span className="font-semibold">{Math.max(100 - budgetUsedPct, 0).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetUsedPct > 90 ? "bg-destructive" : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.max(100 - budgetUsedPct, 0)}%` }}
                />
              </div>
            </div>
          </div>
        </motionImport.div>
      </div>

      {/* Main Two-Column Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2/3 width): Cash Flow Telemetry, Roadmap, Report Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cash Flow & Category Breakdown Card */}
          <motionImport.div variants={itemVariants} className="surface-card p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Cash Flow & Allocation Telemetry
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Comparison of total inflow, logged expenses, and net liquidity
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  Inflow / Surplus
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                  Outflow
                </span>
              </div>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                    }}
                    formatter={(v) => [`₦${Number(v).toLocaleString()}`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution Strip */}
            {sortedCategories.length > 0 && (
              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Top Expense Categories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {sortedCategories.slice(0, 3).map((cat) => {
                    const pct =
                      totalExpenses > 0 ? Math.round((cat.value / totalExpenses) * 100) : 0;
                    return (
                      <div
                        key={cat.name}
                        className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs tabular-nums"
                      >
                        <span className="font-semibold text-foreground truncate">
                          {cat.name}
                        </span>
                        <span className="text-muted-foreground font-mono">
                          ₦{cat.value.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motionImport.div>

          {/* Active Roadmap & Report Card Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Roadmap Progress Widget */}
            <motionImport.div
              variants={itemVariants}
              className="surface-card p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Map className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">30-Day Roadmap</h3>
                      <p className="text-[11px] text-muted-foreground">Execution tracker</p>
                    </div>
                  </div>
                  {roadmap && (
                    <span className="text-xs text-primary font-bold bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md tabular-nums">
                      {roadmapStats.pct}%
                    </span>
                  )}
                </div>

                {roadmap ? (
                  <div className="space-y-3.5">
                    <h4 className="text-sm font-semibold text-foreground">{roadmap.title}</h4>

                    {roadmapStats.nextTask ? (
                      <div className="bg-muted/40 border border-border p-3 rounded-xl text-xs flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/90 leading-relaxed line-clamp-2">
                          <strong className="font-semibold text-foreground">Next Task:</strong>{" "}
                          {roadmapStats.nextTask}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs flex items-center gap-2 text-emerald-500 font-semibold">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>All 4 weeks completed! Ready for a new milestone.</span>
                      </div>
                    )}

                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${roadmapStats.pct}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Generate a structured 4-week execution plan tailored to your income and savings goal.
                    </p>
                    <Link
                      href="/roadmap"
                      className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-95 transition-opacity"
                    >
                      <span>Build Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {roadmap && (
                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground tabular-nums">
                    {roadmapStats.done}/{roadmapStats.tot} tasks completed
                  </span>
                  <Link
                    href="/roadmap"
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Open Timeline <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </motionImport.div>

            {/* Financial Report Card Summary */}
            <motionImport.div
              variants={itemVariants}
              className="surface-card p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Audit Report Card</h3>
                      <p className="text-[11px] text-muted-foreground">5-pillar assessment</p>
                    </div>
                  </div>
                  {latestReport && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-500 tabular-nums">
                      {latestReport.score}/100
                    </span>
                  )}
                </div>

                {latestReport ? (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Last audited on <span className="text-foreground font-semibold">{latestReport.date}</span>
                    </p>
                    <div className="bg-muted/40 border border-border p-3 rounded-xl text-xs leading-relaxed text-foreground/90 line-clamp-3">
                      <strong className="font-semibold text-primary">Key Recommendation:</strong>{" "}
                      {latestReport.recommendations?.[0] ||
                        "Maintain your current savings rate and complete weekly quizzes to raise your score."}
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Run a comprehensive diagnostic across Budgeting, Savings, Literacy, Scam Defense, and Consistency.
                    </p>
                    <Link
                      href="/report"
                      className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-95 transition-opacity"
                    >
                      <span>Run Diagnostic</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {latestReport && (
                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Offline & Cloud Ready</span>
                  <Link
                    href="/report"
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Full Breakdown <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </motionImport.div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width): Daily Challenge, AI Coach Command Box, Quick Tools */}
        <div className="space-y-6">
          {/* Daily Challenge Card */}
          <motionImport.div
            variants={itemVariants}
            className="surface-card p-5 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md">
                  Daily Objective
                </span>
                {challenge.completed ? (
                  <span className="text-[11px] text-emerald-500 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" /> Completed
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-500 tabular-nums">+20 XP</span>
                )}
              </div>

              <h4 className="text-sm font-bold text-foreground mt-1">
                {challenge.challengeId === "save_500"
                  ? "Save ₦500 today"
                  : challenge.challengeId === "track_expenses"
                  ? "Track all expenses today"
                  : challenge.challengeId === "complete_quiz"
                  ? "Complete one finance quiz"
                  : challenge.challengeId === "ask_ai"
                  ? "Ask Atlas AI one finance question"
                  : challenge.challengeId === "detect_scam"
                  ? "Analyze one suspicious message"
                  : "Review monthly spending"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Complete today&apos;s objective to earn <strong className="text-foreground">+20 XP</strong> and protect your daily streak.
              </p>
            </div>

            {!challenge.completed ? (
              <button
                onClick={completeChallenge}
                className="mt-4 w-full bg-primary hover:opacity-95 text-primary-foreground font-semibold text-xs py-2.5 px-4 rounded-xl transition-opacity shadow-xs"
              >
                Complete Objective (+20 XP)
              </button>
            ) : (
              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 py-2 px-3 rounded-xl text-xs font-semibold text-center">
                Objective complete — Streak secured 🔥
              </div>
            )}
          </motionImport.div>

          {/* Atlas Coach Command Widget */}
          <motionImport.div
            variants={itemVariants}
            className="surface-card p-5 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Atlas AI Advisor</h3>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Offline-Ready
              </span>
            </div>

            <div className="bg-muted/40 border border-border p-3 rounded-xl text-xs">
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">
                Daily Briefing
              </span>
              <p className="text-muted-foreground leading-relaxed">{dailyTip}</p>
            </div>

            <form onSubmit={handleCoachInputSubmit} className="flex gap-2">
              <input
                type="text"
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
                placeholder="Ask about your budget or savings…"
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                className="bg-primary hover:opacity-95 text-primary-foreground font-semibold text-xs px-3.5 rounded-xl transition-opacity"
              >
                Ask
              </button>
            </form>
          </motionImport.div>

          {/* Quick Workspace Actions */}
          <motionImport.div variants={itemVariants} className="surface-card p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Quick Launch
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/chatbot?q=Help%20me%20budget%20based%20on%20my%20income"
                className="p-3 bg-background hover:bg-muted border border-border rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <Wallet className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">
                  50/30/20 Plan
                </span>
              </Link>

              <Link
                href="/quiz"
                className="p-3 bg-background hover:bg-muted border border-border rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">
                  Take IQ Quiz
                </span>
              </Link>

              <Link
                href="/scam-checker"
                className="p-3 bg-background hover:bg-muted border border-border rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">
                  Scam Shield
                </span>
              </Link>

              <Link
                href="/report"
                className="p-3 bg-background hover:bg-muted border border-border rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <ClipboardList className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">
                  Report Card
                </span>
              </Link>
            </div>
          </motionImport.div>
        </div>
      </div>
    </motionImport.div>
  );
}
