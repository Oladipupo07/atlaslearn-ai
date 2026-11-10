export type QuizQuestion = {
  id: number;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const OFFLINE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    difficulty: "Easy",
    question: "What is a budget?",
    options: [
      "A wish list of things to buy",
      "A plan for managing income and expenses",
      "A type of savings account",
      "A government tax document",
    ],
    correctIndex: 1,
    explanation:
      "A budget is a financial plan that tracks your income and expenses so you can make informed spending decisions.",
  },
  {
    id: 2,
    difficulty: "Medium",
    question: "What is compound interest?",
    options: [
      "Interest calculated solely on the principal",
      "Interest calculated on the initial principal and accumulated interest",
      "A penalty fee for late payments",
      "A flat rate bank fee",
    ],
    correctIndex: 1,
    explanation:
      "Compound interest is 'interest on interest' — your earnings are reinvested to generate even more earnings over time.",
  },
  {
    id: 3,
    difficulty: "Hard",
    question: "What is an ETF?",
    options: [
      "Emergency Trust Fund",
      "Exchange Traded Fund",
      "Electronic Transfer Fee",
      "Early Tax Filing",
    ],
    correctIndex: 1,
    explanation:
      "An Exchange Traded Fund (ETF) is a basket of securities that trades on a stock exchange, offering built-in diversification.",
  },
  {
    id: 4,
    difficulty: "Easy",
    question: "What should you do before investing in the stock market?",
    options: [
      "Borrow money to invest",
      "Build an emergency fund first",
      "Quit your job",
      "Buy a new car",
    ],
    correctIndex: 1,
    explanation:
      "Always build an emergency fund covering 3–6 months of expenses before exposing capital to market risk.",
  },
  {
    id: 5,
    difficulty: "Medium",
    question: "What does the 50/30/20 budgeting rule suggest?",
    options: [
      "50% savings, 30% wants, 20% needs",
      "50% needs, 30% wants, 20% savings/debt",
      "50% investments, 30% needs, 20% fun",
      "50% income tax, 30% rent, 20% food",
    ],
    correctIndex: 1,
    explanation:
      "The 50/30/20 rule: 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment.",
  },
  {
    id: 6,
    difficulty: "Hard",
    question: "What does 'diversification' mean in investing?",
    options: [
      "Putting all money into one stock",
      "Spreading investments across different assets to reduce risk",
      "Changing jobs frequently",
      "Buying only government bonds",
    ],
    correctIndex: 1,
    explanation:
      "Diversification spreads your investments so a loss in one area doesn't wipe out your entire portfolio.",
  },
  {
    id: 7,
    difficulty: "Easy",
    question: "What is a credit score used for?",
    options: [
      "Determining how smart you are",
      "Measuring your ability to repay loans",
      "Tracking your savings balance",
      "Calculating your annual income",
    ],
    correctIndex: 1,
    explanation:
      "A credit score reflects your creditworthiness — lenders use it to decide whether to approve loans and at what interest rate.",
  },
  {
    id: 8,
    difficulty: "Medium",
    question: "What is the difference between a debit card and a credit card?",
    options: [
      "There is no difference",
      "A debit card uses your own money; a credit card borrows money",
      "A credit card is only for businesses",
      "A debit card charges interest",
    ],
    correctIndex: 1,
    explanation:
      "A debit card draws directly from your bank balance, while a credit card lets you borrow money you must repay — often with interest.",
  },
  {
    id: 9,
    difficulty: "Hard",
    question: "What is inflation's main effect on purchasing power?",
    options: [
      "It increases purchasing power",
      "It decreases purchasing power over time",
      "It has no effect on purchasing power",
      "It only affects luxury goods",
    ],
    correctIndex: 1,
    explanation:
      "Inflation erodes purchasing power — the same amount of money buys fewer goods and services as prices rise over time.",
  },
  {
    id: 10,
    difficulty: "Easy",
    question: "What is an emergency fund?",
    options: [
      "Money set aside for vacations",
      "Money saved for unexpected expenses like job loss or medical bills",
      "A retirement account",
      "A loan from the bank",
    ],
    correctIndex: 1,
    explanation:
      "An emergency fund is a readily accessible cash reserve to cover unexpected expenses without going into debt.",
  },
  {
    id: 11,
    difficulty: "Medium",
    question: "What does APR stand for in finance?",
    options: [
      "Annual Profit Rate",
      "Annual Percentage Rate",
      "Adjusted Payment Ratio",
      "Asset Purchase Requirement",
    ],
    correctIndex: 1,
    explanation:
      "APR (Annual Percentage Rate) represents the yearly cost of borrowing money, including fees and interest.",
  },
  {
    id: 12,
    difficulty: "Hard",
    question: "Which type of account typically offers the highest interest rate?",
    options: [
      "Current account",
      "Regular savings account",
      "Fixed deposit / term deposit",
      "Salary account",
    ],
    correctIndex: 2,
    explanation:
      "Fixed deposit accounts lock your money for a set period, which is why banks reward you with a higher interest rate.",
  },
  {
    id: 13,
    difficulty: "Easy",
    question: "What is a liability?",
    options: [
      "Something you own that has value",
      "Money owed to someone else",
      "A type of investment",
      "A bank account with high interest",
    ],
    correctIndex: 1,
    explanation:
      "A liability is a financial obligation — money you owe to others, such as a loan, mortgage, or credit card debt.",
  },
  {
    id: 14,
    difficulty: "Medium",
    question:
      "What is the purpose of a tax-advantaged retirement account (like a pension)?",
    options: [
      "To pay current taxes immediately",
      "To grow retirement savings with tax benefits",
      "To avoid paying any taxes ever",
      "To store physical gold",
    ],
    correctIndex: 1,
    explanation:
      "Tax-advantaged accounts let your retirement savings grow with reduced tax liability, helping you build wealth faster.",
  },
  {
    id: 15,
    difficulty: "Hard",
    question: "What is dollar-cost averaging?",
    options: [
      "Buying a currency at the lowest possible price",
      "Investing a fixed amount at regular intervals regardless of price",
      "Converting all savings to USD",
      "Averaging the cost of daily expenses",
    ],
    correctIndex: 1,
    explanation:
      "Dollar-cost averaging means investing a consistent amount regularly, buying more shares when prices are low and fewer when high.",
  },
  {
    id: 16,
    difficulty: "Easy",
    question: "Which of the following is an example of a fixed expense?",
    options: ["Groceries", "Monthly rent", "Entertainment outings", "Clothing"],
    correctIndex: 1,
    explanation:
      "Fixed expenses remain constant each month — rent, mortgage payments, and insurance premiums are common examples.",
  },
  {
    id: 17,
    difficulty: "Medium",
    question: "What is net worth?",
    options: [
      "Total income earned per year",
      "Assets minus liabilities",
      "The balance in your savings account",
      "Your monthly take-home pay",
    ],
    correctIndex: 1,
    explanation:
      "Net worth = Total Assets − Total Liabilities. It is the most accurate snapshot of your overall financial health.",
  },
  {
    id: 18,
    difficulty: "Hard",
    question: "What is a bull market?",
    options: [
      "A market where prices are falling",
      "A market characterised by rising prices and investor optimism",
      "A market for agricultural goods",
      "A market with no trading activity",
    ],
    correctIndex: 1,
    explanation:
      "A bull market is a period of rising stock prices (typically 20%+ from recent lows), driven by strong economic conditions and investor confidence.",
  },
  {
    id: 19,
    difficulty: "Medium",
    question: "Why is it important to pay yourself first?",
    options: [
      "To avoid paying bills",
      "To ensure savings happen before discretionary spending",
      "To get a higher salary",
      "To reduce income tax immediately",
    ],
    correctIndex: 1,
    explanation:
      "'Pay yourself first' means automatically moving money into savings before spending on anything else, building wealth consistently.",
  },
  {
    id: 20,
    difficulty: "Hard",
    question: "What is liquidity in personal finance?",
    options: [
      "The interest rate on a loan",
      "How easily an asset can be converted to cash without losing value",
      "The total amount of debt owed",
      "Monthly cashflow from investments",
    ],
    correctIndex: 1,
    explanation:
      "Liquidity describes how quickly and easily an asset can be turned into cash. Cash is the most liquid asset; real estate is relatively illiquid.",
  },
];

export function getOfflineQuizQuestions(count = 10): QuizQuestion[] {
  const copy = [...OFFLINE_QUIZ_QUESTIONS];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export function generateOfflineRoadmap(inputs: {
  age: number;
  isStudent: boolean;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  financialGoal: string;
}) {
  const { monthlyIncome, monthlyExpenses, savingsGoal, financialGoal, isStudent } = inputs;
  const goalLower = financialGoal.toLowerCase();

  if (goalLower.includes("budget")) {
    return {
      title: "Your 30-Day Budgeting Mastery Plan",
      weeks: [
        {
          weekNumber: 1,
          title: "Week 1: Tracking & Cash Flow Awareness",
          goal: "Understand your current cash flow and list all fixed vs variable expenses.",
          learningRecommendation: "Master the 50/30/20 budgeting rule for Nigerian students.",
          tasks: [
            {
              id: "w1_t1",
              text: `Log your current income of ₦${monthlyIncome.toLocaleString()} and expenses of ₦${monthlyExpenses.toLocaleString()} in the Budget Planner`,
              completed: false,
            },
            {
              id: "w1_t2",
              text: "Identify 3 non-essential spending habits or subscriptions to cut back",
              completed: false,
            },
            {
              id: "w1_t3",
              text: "Categorize every purchase you make for the next 7 days",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 2,
          title: "Week 2: Designing Your Budget Structure",
          goal: "Set realistic limits for food, transport, data, and utilities.",
          learningRecommendation: "Learn how to build a zero-based monthly budget.",
          tasks: [
            {
              id: "w2_t1",
              text: `Set a weekly spending cap of ₦${Math.max(1000, Math.round(monthlyExpenses / 4)).toLocaleString()} to stay within budget`,
              completed: false,
            },
            {
              id: "w2_t2",
              text: "Allocate at least 20% of your income directly toward your savings target",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 3,
          title: "Week 3: Implementation & Discipline",
          goal: "Stick to your category limits and use low-cost alternatives.",
          learningRecommendation: isStudent
            ? "Smart campus saving tips for students in Nigeria."
            : "Reducing lifestyle creep on a monthly income.",
          tasks: [
            {
              id: "w3_t1",
              text: "Prepare meals at home instead of buying food out at least 4 times this week",
              completed: false,
            },
            {
              id: "w3_t2",
              text: "Check your remaining budget balance before making any impulse purchase",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 4,
          title: "Week 4: Review & Optimization",
          goal: "Compare actual spending against your budget limits and refine for next month.",
          learningRecommendation: "How to review and adjust your monthly financial plan.",
          tasks: [
            {
              id: "w4_t1",
              text: "Generate a Financial Report Card to check your Budgeting score",
              completed: false,
            },
            {
              id: "w4_t2",
              text: "Adjust next month's category limits based on this month's real numbers",
              completed: false,
            },
          ],
        },
      ],
    };
  }

  if (goalLower.includes("invest")) {
    return {
      title: "Your 30-Day Smart Investing Blueprint",
      weeks: [
        {
          weekNumber: 1,
          title: "Week 1: Investment Foundations",
          goal: "Understand stocks, bonds, mutual funds, and compound interest.",
          learningRecommendation: "The Power of Compound Interest & Time Horizon.",
          tasks: [
            {
              id: "w1_t1",
              text: "Define your risk tolerance (Conservative, Moderate, or Growth)",
              completed: false,
            },
            {
              id: "w1_t2",
              text: "Complete a Finance Quiz on AtlasLearn to test your investing basics",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 2,
          title: "Week 2: Safe Investment Options in Nigeria",
          goal: "Identify SEC-regulated investment options and money market funds.",
          learningRecommendation: "Understanding FGN Savings Bonds, Treasury Bills & Mutual Funds.",
          tasks: [
            {
              id: "w2_t1",
              text: "Compare high-yield money market funds vs standard bank savings accounts",
              completed: false,
            },
            {
              id: "w2_t2",
              text: "Run any investment offer through the Scam Checker before committing money",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 3,
          title: "Week 3: Diversification & ETFs",
          goal: "Learn how to spread risk across multiple asset classes.",
          learningRecommendation: "Mutual Funds vs Exchange Traded Funds (ETFs).",
          tasks: [
            {
              id: "w3_t1",
              text: "Draft a sample portfolio allocation (e.g., 60% Money Market, 40% Equities/Index)",
              completed: false,
            },
            {
              id: "w3_t2",
              text: "Ask Atlas Coach to explain Dollar-Cost Averaging and inflation hedging",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 4,
          title: "Week 4: Consistent Wealth Building",
          goal: "Start investing a small, consistent amount every month.",
          learningRecommendation: "Consistency beats timing the market.",
          tasks: [
            {
              id: "w4_t1",
              text: `Carve out ₦${Math.max(2000, Math.round(savingsGoal * 0.25)).toLocaleString()} from your monthly savings for long-term investing`,
              completed: false,
            },
            {
              id: "w4_t2",
              text: "Generate your Financial Report Card to review your progress",
              completed: false,
            },
          ],
        },
      ],
    };
  }

  if (goalLower.includes("scam")) {
    return {
      title: "Your 30-Day Scam & Fraud Defense Plan",
      weeks: [
        {
          weekNumber: 1,
          title: "Week 1: Spotting Red Flags",
          goal: "Recognize urgency, fake giveaways, and guaranteed-return Ponzi schemes.",
          learningRecommendation: "How Ponzi schemes and phishing links target students.",
          tasks: [
            {
              id: "w1_t1",
              text: "Test 3 example messages in the AtlasLearn Scam Checker",
              completed: false,
            },
            {
              id: "w1_t2",
              text: "Learn the top 5 red flags of WhatsApp and Telegram investment scams",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 2,
          title: "Week 2: Securing Your Accounts",
          goal: "Lock down your bank apps, BVN, NIN, and email accounts.",
          learningRecommendation: "Two-Factor Authentication (2FA) and SIM-swap protection.",
          tasks: [
            {
              id: "w2_t1",
              text: "Enable Two-Factor Authentication (2FA) and SIM PIN on your phone",
              completed: false,
            },
            {
              id: "w2_t2",
              text: "Audit your banking passwords and ensure you never share OTPs",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 3,
          title: "Week 3: Verifying Financial Platforms",
          goal: "Know how to verify CBN and SEC registration before investing.",
          learningRecommendation: "How to distinguish legitimate fintechs from clone apps.",
          tasks: [
            {
              id: "w3_t1",
              text: "Check that your savings/investment apps are licensed by CBN or SEC Nigeria",
              completed: false,
            },
            {
              id: "w3_t2",
              text: "Unlock the 'Scam Spotter' badge by analyzing 5 messages",
              completed: false,
            },
          ],
        },
        {
          weekNumber: 4,
          title: "Week 4: Building Safe Financial Habits",
          goal: "Grow your money safely while maintaining 100% fraud awareness.",
          learningRecommendation: "Safe emergency funds vs high-risk traps.",
          tasks: [
            {
              id: "w4_t1",
              text: "Generate your Financial Report Card and aim for 80%+ in Scam Awareness",
              completed: false,
            },
            {
              id: "w4_t2",
              text: "Share 2 scam prevention tips with a friend or classmate",
              completed: false,
            },
          ],
        },
      ],
    };
  }

  return {
    title: `Your 30-Day Growth Plan: ${financialGoal}`,
    weeks: [
      {
        weekNumber: 1,
        title: "Week 1: Assessment & Target Setup",
        goal: "Analyze your current cash flow and establish clear weekly targets.",
        learningRecommendation: "Core Personal Finance Principles & Pay Yourself First.",
        tasks: [
          {
            id: "w1_t1",
            text: `Set your savings target of ₦${savingsGoal.toLocaleString()} and income of ₦${monthlyIncome.toLocaleString()} in the Budget Planner`,
            completed: false,
          },
          {
            id: "w1_t2",
            text: "Track every daily expense in your budget log for 7 days",
            completed: false,
          },
          {
            id: "w1_t3",
            text: "Complete 1 Finance Quiz to benchmark your financial IQ",
            completed: false,
          },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Building Your Savings Cushion",
        goal: `Save at least ₦${Math.round(savingsGoal / 4).toLocaleString()} per week toward your goal.`,
        learningRecommendation: `Strategies to achieve: ${financialGoal}`,
        tasks: [
          {
            id: "w2_t1",
            text: "Ask Atlas Coach for 3 personalized ways to reduce your weekly expenses",
            completed: false,
          },
          {
            id: "w2_t2",
            text: "Apply the 24-hour waiting rule before any non-essential purchase",
            completed: false,
          },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: Smart Habits & Fraud Protection",
        goal: "Protect your savings and stay consistent with daily challenges.",
        learningRecommendation: "How to stay consistent and avoid impulse spending.",
        tasks: [
          {
            id: "w3_t1",
            text: `Save an extra ₦${Math.max(1000, Math.round(savingsGoal * 0.1)).toLocaleString()} this week by cutting one impulse expense`,
            completed: false,
          },
          {
            id: "w3_t2",
            text: "Complete today's Daily Challenge on the Dashboard to build your streak",
            completed: false,
          },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: Review & Next Milestone",
        goal: "Measure your 30-day progress and set next month's financial target.",
        learningRecommendation: "Setting long-term financial milestones.",
        tasks: [
          {
            id: "w4_t1",
            text: "Generate your Financial Report Card to review your overall grade",
            completed: false,
          },
          {
            id: "w4_t2",
            text: "Establish 3 money habits to carry forward into next month",
            completed: false,
          },
        ],
      },
    ],
  };
}

export function generateOfflineReportCard(stats: {
  budget?: {
    income?: number;
    totalExpenses?: number;
    savingsGoal?: number;
    remainingBalance?: number;
  };
  gamification?: {
    xp?: number;
    level?: number;
    aiQuestionsCount?: number;
    scamChecksCount?: number;
    budgetsCreatedCount?: number;
  };
  streak?: {
    currentStreak?: number;
    longestStreak?: number;
  };
  quizzes?: { score: number; total?: number }[];
}) {
  const { budget, gamification, streak, quizzes } = stats;

  const income = Number(budget?.income || 0);
  const totalExpenses = Number(budget?.totalExpenses || 0);
  const savingsGoal = Number(budget?.savingsGoal || 100000);
  const remaining = income - totalExpenses;

  const budgetScore =
    income > 0 ? Math.round(Math.max(0, 100 - (totalExpenses / income) * 100)) : 55;
  const savingsScore =
    savingsGoal > 0
      ? Math.round(Math.min(100, (Math.max(0, remaining) / savingsGoal) * 100))
      : 50;

  let quizAvg = 70;
  if (quizzes && quizzes.length > 0) {
    const totalScore = quizzes.reduce(
      (sum, q) => sum + (q.score / (q.total || 5)) * 100,
      0
    );
    quizAvg = Math.round(totalScore / quizzes.length);
  }
  const aiCount = Number(gamification?.aiQuestionsCount || 0);
  const learningScore = Math.round(Math.min(100, quizAvg * 0.7 + aiCount * 6));

  const scamChecks = Number(gamification?.scamChecksCount || 0);
  const scamScore = Math.round(Math.min(100, 40 + scamChecks * 15));

  const curStreak = Number(streak?.currentStreak || 0);
  const maxStreak = Number(streak?.longestStreak || 0);
  const consistencyScore = Math.round(
    Math.min(100, 35 + curStreak * 10 + maxStreak * 2)
  );

  const overallScore = Math.round(
    budgetScore * 0.3 +
      savingsScore * 0.25 +
      learningScore * 0.15 +
      scamScore * 0.15 +
      consistencyScore * 0.15
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (budgetScore >= 70) {
    strengths.push(
      `Strong budget discipline: Your expenses (₦${totalExpenses.toLocaleString()}) are well within your ₦${income.toLocaleString()} income.`
    );
  } else {
    weaknesses.push(
      `High expense ratio: Your expenses (₦${totalExpenses.toLocaleString()}) consume a large share of your income.`
    );
    recommendations.push(
      "Use the 50/30/20 rule: limit Needs to 50%, Wants to 30%, and save at least 20% of your income."
    );
  }

  if (savingsScore >= 55) {
    strengths.push(
      `Healthy savings buffer: You have ₦${Math.max(0, remaining).toLocaleString()} remaining toward your ₦${savingsGoal.toLocaleString()} goal.`
    );
  } else {
    weaknesses.push(
      `Savings gap: Your remaining balance falls short of your ₦${savingsGoal.toLocaleString()} target.`
    );
    recommendations.push(
      "Pay yourself first by setting aside 10%–20% of income before spending on non-essentials."
    );
  }

  if (learningScore >= 70) {
    strengths.push(
      "Active financial learner: You regularly use quizzes and Atlas Coach to sharpen your money skills."
    );
  } else {
    weaknesses.push(
      "Room to grow in financial literacy quizzes and AI coaching sessions."
    );
    recommendations.push(
      "Complete 1 Finance Quiz and ask Atlas Coach a question today to boost your Learning score and earn XP."
    );
  }

  if (scamScore >= 70) {
    strengths.push(
      "High fraud vigilance: You actively verify suspicious messages with the Scam Checker."
    );
  } else {
    weaknesses.push(
      "Low Scam Checker usage leaves room for improveable fraud defense habits."
    );
    recommendations.push(
      "Run suspicious SMS, WhatsApp, or investment messages through the Scam Checker to unlock the Scam Spotter badge."
    );
  }

  if (consistencyScore >= 65) {
    strengths.push(
      `Consistent habit builder: You've maintained a ${curStreak}-day active streak!`
    );
  } else {
    weaknesses.push("Daily learning streak can be more consistent.");
    recommendations.push(
      "Complete the daily challenge on your Dashboard every day to build a 7-day streak."
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "Great start! You have initialized your AtlasLearn financial profile."
    );
  }
  if (weaknesses.length === 0) {
    weaknesses.push(
      "No major weaknesses detected — keep maintaining your disciplined money habits!"
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Keep completing weekly roadmap tasks and unlock all 7 badges to become an Atlas Scholar."
    );
  }

  return {
    score: overallScore,
    categories: {
      budgeting: budgetScore,
      savings: savingsScore,
      learning: learningScore,
      scamAwareness: scamScore,
      consistency: consistencyScore,
    },
    strengths,
    weaknesses,
    recommendations,
  };
}

export function generateOfflineCoachReply(
  messages: { role: string; content: string }[],
  userData?: {
    income?: number;
    totalExpenses?: number;
    savingsGoal?: number;
    streak?: number;
    level?: number;
    xp?: number;
    roadmapProgress?: number;
    latestReportScore?: number | string | null;
  }
): string {
  const income = Number(userData?.income || 0);
  const totalExpenses = Number(userData?.totalExpenses || 0);
  const savingsGoal = Number(userData?.savingsGoal || 100000);
  const remainingBalance = income - totalExpenses;
  const expensePct = income > 0 ? Math.round((totalExpenses / income) * 100) : 0;
  const streak = Number(userData?.streak || 0);
  const level = Number(userData?.level || 1);
  const xp = Number(userData?.xp || 0);
  const roadmapProgress = Number(userData?.roadmapProgress || 0);
  const latestReportScore = userData?.latestReportScore ?? "Not generated yet";

  const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();

  if (lastMsg.includes("budget") || lastMsg.includes("expense") || lastMsg.includes("50/30/20")) {
    return `## Personalized Budgeting Plan (Offline Coach)

Based on your current numbers:
- **Income**: **₦${income.toLocaleString()}**
- **Expenses Logged**: **₦${totalExpenses.toLocaleString()}** (**${expensePct}%** of income)
- **Remaining Balance**: **₦${remainingBalance.toLocaleString()}**
- **Savings Goal**: **₦${savingsGoal.toLocaleString()}**

### Recommended 50/30/20 Breakdown for You
1. **Needs (50% — ₦${Math.round(income * 0.5).toLocaleString()})**: Rent/hostel, groceries, transport, utilities, and essential school costs.
2. **Wants (30% — ₦${Math.round(income * 0.3).toLocaleString()})**: Eating out, subscriptions, entertainment, and shopping.
3. **Savings & Goals (20% — ₦${Math.round(income * 0.2).toLocaleString()})**: Emergency fund and your **₦${savingsGoal.toLocaleString()}** target.

> **Coach's Tip**: ${
      remainingBalance >= savingsGoal
        ? `You're already hitting your ₦${savingsGoal.toLocaleString()} savings goal! Consider moving surplus funds into a safe high-yield savings or money market fund.`
        : `Try trimming non-essential Wants by **10%–15%** this week to close the gap toward your **₦${savingsGoal.toLocaleString()}** savings target.`
    }`;
  }

  if (lastMsg.includes("score") || lastMsg.includes("report") || lastMsg.includes("grade")) {
    return `## How to Boost Your Financial Score

Your latest Financial Report Card score is **${latestReportScore}${typeof latestReportScore === "number" ? "/100" : ""}**.

### 4 Quick Wins to Raise Your Grade
1. **Budget Control (30% weight)**: Keep total expenses under **70%** of your income (currently **${expensePct}%**).
2. **Savings Progress (25% weight)**: Grow your remaining balance (**₦${remainingBalance.toLocaleString()}**) toward your **₦${savingsGoal.toLocaleString()}** goal.
3. **Quiz & Scam Practice (30% weight)**: Take a **Finance Quiz** and analyze suspicious messages in the **Scam Checker**.
4. **Daily Consistency (15% weight)**: Keep your **${streak}-day streak** alive by completing today's daily challenge!

> **Action Step**: Visit the **Report Card** tab anytime to generate an updated breakdown — it works 100% offline too!`;
  }

  if (lastMsg.includes("scam") || lastMsg.includes("fraud") || lastMsg.includes("phish") || lastMsg.includes("bvn")) {
    return `## Scam & Fraud Protection Guide

Protect your money from online fraud with these golden rules:

### Top Red Flags to Watch Out For
- **"Guaranteed" High Returns**: Any platform promising to double your money in 24–48 hours or offering 30%+ monthly returns is a Ponzi scheme.
- **Fake Urgency**: Messages claiming *"Your account/BVN will be blocked in 2 hours unless you click this link."*
- **OTP / PIN Requests**: No bank or legitimate fintech in Nigeria will **ever** ask for your OTP, PIN, or full card CVV over phone, SMS, or WhatsApp.
- **Task / Giveaways Scams**: Paying an "activation fee" or "upgrading VIP tier" to withdraw earnings.

> **Tip**: Paste any suspicious SMS, WhatsApp message, or email into our **Scam Checker** tool for an instant offline risk scan!`;
  }

  if (lastMsg.includes("next step") || lastMsg.includes("recommend") || lastMsg.includes("roadmap")) {
    return `## Your Recommended Next Steps

Here is where you stand right now:
- **Current Level**: **Level ${level}** (**${xp} XP**)
- **Active Streak**: **${streak} days** 🔥
- **Roadmap Progress**: **${roadmapProgress}% completed**

### What to Do Next
1. **Complete Today's Challenge**: Head to the **Dashboard** and finish today's daily challenge for **+20 XP**.
2. **Advance Your Roadmap**: You are at **${roadmapProgress}%** on your 4-week roadmap — check off your next weekly task in the **AI Roadmap** tab.
3. **Test Your Knowledge**: Complete a quick round in the **Finance Quiz** (+10 XP and progress toward the *Quiz Master* badge).`;
  }

  if (lastMsg.includes("study plan") || lastMsg.includes("7-day") || lastMsg.includes("learn")) {
    return `## Your 7-Day Financial Mastery Study Plan

Follow this 10-minute-a-day schedule (works completely offline!):

1. **Day 1 — Cash Flow Audit**: Log your income (**₦${income.toLocaleString()}**) and all daily expenses in the **Budget Planner**.
2. **Day 2 — The 50/30/20 Rule**: Categorize your spending into Needs, Wants, and Savings.
3. **Day 3 — Emergency Fund Basics**: Set a realistic emergency buffer goal (3–6 months of core expenses).
4. **Day 4 — Scam Defense**: Test 3 suspicious messages in the **Scam Checker** to sharpen your fraud awareness.
5. **Day 5 — Compound Interest & Investing**: Learn how Money Market Funds, FGN Bonds, and ETFs beat inflation.
6. **Day 6 — Financial IQ Quiz**: Score **80%+** in the **Finance Quiz** to unlock the *Quiz Master* badge.
7. **Day 7 — Weekly Report Card**: Generate your **Financial Report Card** and review your radar chart!`;
  }

  if (
    lastMsg.includes("invest") ||
    lastMsg.includes("compound") ||
    lastMsg.includes("inflation") ||
    lastMsg.includes("explain") ||
    lastMsg.includes("save") ||
    lastMsg.includes("emergency")
  ) {
    return `## Key Personal Finance Concepts (Simplified)

Here are the core building blocks of wealth:

### 1. Pay Yourself First & Emergency Funds
Before spending on wants, move **10%–20%** of every inflow into savings. Aim for an **Emergency Fund** covering **3–6 months** of essential expenses in a safe, liquid account.

### 2. Compound Interest
Compound interest means earning returns on both your original money *and* the interest it has already earned. Even **₦5,000–₦10,000/month** invested consistently grows dramatically over time.

### 3. Beating Inflation & Diversification
- **Inflation** reduces what your cash can buy over time.
- **Diversification** means spreading your money across safe instruments (like SEC-regulated Money Market Mutual Funds, FGN Savings Bonds, and diversified ETFs) rather than risking everything in one place.

> **Your Snapshot**: With **₦${remainingBalance.toLocaleString()}** remaining from your **₦${income.toLocaleString()}** budget, setting aside even **₦${Math.max(1000, Math.round(Math.max(0, remainingBalance) * 0.2)).toLocaleString()}** consistently is a great way to start!`;
  }

  return `## Atlas Coach Summary (Offline Mode Ready)

Here is a real-time snapshot of your financial profile:
- **Income**: **₦${income.toLocaleString()}**
- **Total Expenses**: **₦${totalExpenses.toLocaleString()}** (**${expensePct}%** used)
- **Remaining Balance**: **₦${remainingBalance.toLocaleString()}** (Goal: **₦${savingsGoal.toLocaleString()}**)
- **Level & XP**: **Level ${level}** (**${xp} XP**) | **Streak**: **${streak} days** 🔥
- **Roadmap Progress**: **${roadmapProgress}%** | **Report Score**: **${latestReportScore}**

### How I Can Help You Right Now (Even Offline!)
- Ask **"Help me budget"** for a custom 50/30/20 breakdown of your ₦${income.toLocaleString()} income.
- Ask **"How do I improve my score?"** for steps to raise your Report Card grade.
- Ask **"Explain investing & compound interest"** or **"Create a 7-day study plan"**.
- Ask **"How to detect scams"** for a fraud-prevention checklist.`;
}

