"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, Sparkles, AlertTriangle, ShieldCheck, Check, 
  X, Loader2, Download, Printer, TrendingUp, History, HelpCircle, ChevronRight,
  Building2, BadgePercent, ArrowRight
} from "lucide-react";
import { BankingEngine } from "@/lib/banking-service";
import { MFBCreditAssessment, LinkedBankAccount } from "@/types/banking";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useStreak } from "@/contexts/StreakContext";
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { generateOfflineReportCard } from "@/lib/offline-engine";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from "recharts";

type ReportCard = {
  score: number;
  categories: {
    budgeting: number;
    savings: number;
    learning: number;
    scamAwareness: number;
    consistency: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  date: string;
};

type Expense = { id: string; name: string; amount: number; category: string };

export default function ReportPage() {
  const { user } = useAuth();
  const { streak } = useStreak();
  const { progress, badges } = useGamification();

  // Component states
  const [report, setReport] = useState<ReportCard | null>(null);
  const [history, setHistory] = useState<ReportCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Financial stats for aggregation
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoal, setSavingsGoal] = useState(100000);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedBankAccount[]>([]);
  const [creditOffer, setCreditOffer] = useState<MFBCreditAssessment | null>(null);

  useEffect(() => {
    setMounted(true);
    setLinkedAccounts(BankingEngine.getLinkedAccounts());
  }, []);

  // Fetch budget info
  useEffect(() => {
    if (!mounted) return;

    const loadLocalReportData = () => {
      const si = localStorage.getItem("atlaslearn_income");
      const sg = localStorage.getItem("atlaslearn_goal");
      const se = localStorage.getItem("atlaslearn_expenses");
      const rh = localStorage.getItem("atlaslearn_report_history");

      if (si) setIncome(Number(si));
      if (sg) setSavingsGoal(Number(sg));
      if (se) {
        try {
          setExpenses(JSON.parse(se));
        } catch {}
      }
      if (rh) {
        try {
          const parsedHistory = JSON.parse(rh) as ReportCard[];
          setHistory(parsedHistory);
          if (parsedHistory.length > 0) {
            setReport(parsedHistory[parsedHistory.length - 1]);
          }
        } catch {}
      }
    };

    loadLocalReportData();

    if (user && typeof navigator !== "undefined" && navigator.onLine) {
      // Firebase budgets
      const budgetRef = doc(firestore, "budgets", user.uid);
      const expensesRef = collection(firestore, "budgets", user.uid, "expenses");
      const q = query(expensesRef, orderBy("createdAt", "desc"));

      const unsubBudget = onSnapshot(
        budgetRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.income !== undefined) setIncome(data.income);
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

      // Load previous reports history
      const reportRef = doc(firestore, "reports", user.uid);
      const unsubReport = onSnapshot(
        reportRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const reports = data.history || [];
            setHistory(reports);
            localStorage.setItem("atlaslearn_report_history", JSON.stringify(reports));
            if (reports.length > 0 && !report) {
              setReport(reports[reports.length - 1]); // Load latest
            }
          }
        },
        () => {}
      );

      return () => {
        unsubBudget();
        unsubExpenses();
        unsubReport();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mounted]);

  // Compute MFB credit assessment based on financial metrics
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  useEffect(() => {
    if (!mounted) return;
    const letter = report ? getGrade(report.score).letter : "B";
    const assess = BankingEngine.calculateCreditAssessment(income, totalExpenses, letter);
    setCreditOffer(assess);
  }, [mounted, income, totalExpenses, report]);

  // Generate new report card
  const handleGenerateReport = async () => {
    setLoading(true);

    // Read local quizzes history
    let quizScores: any[] = [];
    const localQuiz = localStorage.getItem("atlaslearn_quiz_history");
    if (localQuiz) {
      try {
        quizScores = JSON.parse(localQuiz);
      } catch {}
    } else {
      // Default placeholder if none exists
      quizScores = [{ score: 4, total: 5, date: new Date().toISOString() }];
    }

    const payload = {
      budget: {
        income,
        totalExpenses,
        savingsGoal,
        remainingBalance: income - totalExpenses,
      },
      gamification: {
        xp: progress.xp,
        level: progress.level,
        aiQuestionsCount: progress.aiQuestionsCount,
        scamChecksCount: progress.scamChecksCount,
        budgetsCreatedCount: progress.budgetsCreatedCount,
      },
      streak: {
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
      },
      quizzes: quizScores,
    };

    try {
      let data: any = null;
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        data = generateOfflineReportCard(payload);
      } else {
        try {
          const res = await fetch("/api/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            data = await res.json();
          }
        } catch {
          data = null;
        }
        if (!data || typeof data.score !== "number") {
          data = generateOfflineReportCard(payload);
        }
      }

      const newReport: ReportCard = {
        score: data.score,
        categories: data.categories,
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        recommendations: data.recommendations || [],
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };

      setReport(newReport);

      // Save to history locally and sync to Firestore if online
      const updatedHistory = [...history, newReport];
      setHistory(updatedHistory);
      localStorage.setItem("atlaslearn_report_history", JSON.stringify(updatedHistory));

      if (user && typeof navigator !== "undefined" && navigator.onLine) {
        setDoc(doc(firestore, "reports", user.uid), { history: updatedHistory }).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download raw report card in Text format
  const handleDownloadText = () => {
    if (!report) return;

    const content = `ATLASLEARN AI FINANCIAL REPORT CARD
Generated on: ${report.date}
Overall Financial Score: ${report.score}/100

CATEGORY BREAKDOWN:
- Budgeting: ${report.categories.budgeting}/100
- Savings: ${report.categories.savings}/100
- Learning: ${report.categories.learning}/100
- Scam Awareness: ${report.categories.scamAwareness}/100
- Consistency: ${report.categories.consistency}/100

STRENGTHS:
${report.strengths.map(s => `* ${s}`).join("\n")}

AREAS TO IMPROVE:
${report.weaknesses.map(w => `* ${w}`).join("\n")}

RECOMMENDATIONS:
${report.recommendations.map(r => `* ${r}`).join("\n")}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial_report_${report.date.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Print optimized sheet
  const handlePrint = () => {
    window.print();
  };

  // Format Recharts data
  const chartData = report ? [
    { subject: "Budgeting", A: report.categories.budgeting, fullMark: 100 },
    { subject: "Savings", A: report.categories.savings, fullMark: 100 },
    { subject: "Learning", A: report.categories.learning, fullMark: 100 },
    { subject: "Scam Spotting", A: report.categories.scamAwareness, fullMark: 100 },
    { subject: "Consistency", A: report.categories.consistency, fullMark: 100 },
  ] : [];

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <div className="max-w-4xl mx-auto pb-16 print:p-0 print:max-w-none">
      
      {/* Header — hidden in print if we only want clean sheet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Financial Report Card</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Understand your spending behaviors and level up your habits.</p>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="bg-primary hover:bg-primary/95 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate My Report
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && !report ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border p-12 rounded-3xl text-center shadow-xl glass max-w-xl mx-auto flex flex-col items-center justify-center min-h-[350px] print:hidden"
          >
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Analyzing Financial Activity...</h2>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              We are scanning your quiz history, monthly budget categories, streaks, and scam checker activity to grade your financial fitness.
            </p>
          </motion.div>
        ) : !report ? (
          // Placeholder if no report is loaded/generated
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card/60 backdrop-blur-sm border border-border p-12 rounded-3xl text-center shadow-sm max-w-2xl mx-auto py-16 print:hidden"
          >
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ClipboardList className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold mb-3">No Financial Report Yet</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto mb-8 leading-relaxed">
              Generate a personalized financial report card to discover your strengths, identify spending weaknesses, and get specific AI recommendations.
            </p>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-primary text-white font-bold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Generate First Report
            </button>
          </motion.div>
        ) : (
          // Report Card Result layout
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 print:space-y-4"
          >
            
            {/* Visual Header / Export Actions */}
            <div className="flex justify-end gap-2 print:hidden">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 border border-border bg-card/60 hover:bg-muted text-foreground text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Report
              </button>
              <button 
                onClick={handleDownloadText}
                className="flex items-center gap-2 bg-muted hover:bg-border border border-border text-foreground text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Download (.txt)
              </button>
            </div>

            {/* Score and Chart Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score Circular gauge */}
              <div className="surface-card p-6 rounded-2xl text-center flex flex-col justify-center items-center min-h-[300px] relative overflow-hidden print:border-black">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-[60px] print:hidden" />
                <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-6">Overall Financial Index</h3>
                
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* Gauge Ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="var(--muted)" strokeWidth="8" fill="transparent" />
                    <motion.circle 
                      cx="50" cy="50" r="40" 
                      stroke="url(#grad)" strokeWidth="8" fill="transparent" 
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 40}
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - report.score / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-black text-foreground tabular-nums">
                      {report.score}
                    </span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1 px-2 py-0.5 rounded-md bg-primary/10">
                      {report.score >= 85 ? "Excellent" : report.score >= 70 ? "Strong" : report.score >= 50 ? "Fair" : "Needs Focus"}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-6 font-medium">Audited on {report.date}</p>
              </div>

              {/* Radar Performance Chart + Pillar Bars */}
              <div className="md:col-span-2 surface-card p-6 rounded-2xl min-h-[300px] flex flex-col justify-between print:border-black">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-widest">5-Pillar Telemetry</h3>
                  <span className="text-xs text-muted-foreground font-mono">Scale: 0 – 100</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center flex-1">
                  <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {chartData.map((pillar) => (
                      <div key={pillar.subject} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold tabular-nums">
                          <span className="text-foreground">{pillar.subject}</span>
                          <span className="text-muted-foreground font-mono">{pillar.A}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${pillar.A}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Microfinance Alternative Credit Offer Strip */}
            {creditOffer && creditOffer.eligibleForLoan && (
              <div className="surface-card p-6 rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-primary/20 text-primary">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <span className="text-xs uppercase font-bold text-primary tracking-widest">
                      Mono Open Banking • MFB Credit Line
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-foreground">
                    Pre-Approved for ₦{creditOffer.maxBorrowLimit.toLocaleString()} Micro-Facility
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                    {creditOffer.reasoning} Borrowing rate:{" "}
                    <strong className="text-foreground">{creditOffer.interestRateMonthlyPct}% monthly</strong> over {creditOffer.recommendedTenorDays} days tenor.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Underwritten via
                    </span>
                    <span className="text-xs font-semibold text-emerald-500">
                      Mono MFB Protocol
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Pre-qualification verified via Mono MFB Engine. Ready for disbursement upon account verification.`)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                  >
                    View Offer Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses checklists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strengths Card */}
              <div className="bg-card border border-border p-6 rounded-3xl shadow-sm print:border-black">
                <h3 className="text-sm text-green-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0" /> Key Strengths
                </h3>
                
                <div className="space-y-4">
                  {report.strengths.map((str, idx) => (
                    <div key={idx} className="flex gap-3 bg-green-500/5 border border-green-500/10 p-3.5 rounded-2xl text-sm leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-foreground/90 font-medium">{str}</p>
                    </div>
                  ))}
                  {report.strengths.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No specific strengths calculated yet.</p>
                  )}
                </div>
              </div>

              {/* Weaknesses Card */}
              <div className="bg-card border border-border p-6 rounded-3xl shadow-sm print:border-black">
                <h3 className="text-sm text-destructive font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" /> Areas to Improve
                </h3>
                
                <div className="space-y-4">
                  {report.weaknesses.map((weak, idx) => (
                    <div key={idx} className="flex gap-3 bg-destructive/5 border border-destructive/10 p-3.5 rounded-2xl text-sm leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-destructive/20 text-destructive flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3" />
                      </div>
                      <p className="text-foreground/90 font-medium">{weak}</p>
                    </div>
                  ))}
                  {report.weaknesses.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No critical warnings! Keep maintaining your good habits.</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Recommendations card */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/5 border border-border p-6 rounded-3xl shadow-sm print:border-black print:from-white print:to-white">
              <h3 className="text-sm text-primary font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" /> Actionable Recommendations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-3 bg-background/60 border border-border/80 p-4 rounded-2xl text-sm leading-relaxed items-start hover:shadow-sm transition-all">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                      {idx + 1}
                    </span>
                    <p className="text-foreground/90 font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* History timeline log */}
            {history.length > 1 && (
              <div className="bg-card border border-border p-6 rounded-3xl shadow-sm print:hidden">
                <h3 className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 shrink-0" /> Report Card History
                </h3>
                
                <div className="space-y-3">
                  {history.slice(0, -1).reverse().map((pastReport, index) => (
                    <div 
                      key={index}
                      onClick={() => setReport(pastReport)}
                      className="flex items-center justify-between p-3.5 bg-background hover:bg-muted border border-border rounded-2xl cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-bold font-mono text-sm">
                          {pastReport.score}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Score: {pastReport.score}%</p>
                          <p className="text-[10px] text-muted-foreground font-semibold">Generated on {pastReport.date}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
