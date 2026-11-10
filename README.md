# AtlasLearn AI — Offline-First Personal Finance OS

AtlasLearn AI is an institutional-grade, offline-first financial literacy and cash-flow management platform built for students and young professionals. It combines **Google Gemini 2.5 Flash** cloud intelligence with a deterministic **Client-Side Offline Engine** so every core workflow—budgeting, 30-day roadmaps, 5-pillar financial audits, scam detection, timed IQ quizzes, and context-aware AI coaching—works seamlessly both online and with zero internet connectivity.

---

## Core Architecture & Capabilities

* **Financial Command Center (`/dashboard`)**
  Real-time telemetry across Inflow, Logged Outflow, Net Liquidity, and Health Index grading (`A+` to `C`), complete with cash-flow area charts, top expense category distributions, and daily XP objectives.
* **Precision Budget & Expense Ledger (`/budget`)**
  Daily and historical budget tracking with automatic balance carry-forward, savings velocity progress bars, and instant dual-persistence (`localStorage` + Cloud Firestore).
* **Context-Aware Atlas AI Advisor (`/chatbot` & Floating Coach)**
  Reads your live income, expense utilization, active streak, level, roadmap completion, and latest report card score to provide personalized 50/30/20 allocation advice—powered by Gemini 2.5 Flash online and the local coaching engine offline.
* **30-Day Execution Roadmaps (`/roadmap`)**
  Generates tailored 4-week action plans across 7 financial goals (*Budgeting*, *Emergency Savings*, *Investing*, *Scam Defense*, etc.) with interactive weekly task checklists.
* **5-Pillar Financial Health Report Card (`/report`)**
  Grades financial fitness from `0–100` across *Budgeting*, *Savings*, *Learning*, *Scam Spotting*, and *Consistency* with an interactive radar chart, strengths/weaknesses diagnostics, and printable/downloadable `.txt` exports.
* **Phishing & Scam Shield (`/scam-checker`)**
  Detects urgency triggers, BVN/NIN/OTP phishing, WhatsApp/Telegram Ponzi schemes, and advance-fee fraud with confidence scoring and persistent local scan history.
* **Timed Financial IQ Quizzes & Gamification (`/quiz` & `/profile`)**
  25-second timed questions, 6 scholar levels (*Money Starter* to *Atlas Master*), daily streak tracking, and 7 unlockable achievement badges.

---

## Offline-First Engineering

| Module | Offline Mechanism | Reconnection Behavior |
| :--- | :--- | :--- |
| **Authentication & Access** | Instant **Local Vault / Guest Mode** + automatic offline entry | Preserves local ledger & upgrades cleanly on sign-in |
| **Firestore Database** | `persistentLocalCache` + `persistentMultipleTabManager` (IndexedDB) | Automatic background reconciliation on `online` event |
| **Budget & Expense Ledger** | Immediate write-through to date-keyed & summary `localStorage` | Syncs daily documents and expense subcollections |
| **AI Coach, Roadmaps & Reports** | Client-side heuristic & template engine (`lib/offline-engine.ts`) | Automatically switches to live Gemini 2.5 Flash when online |
| **PWA Shell** | `@ducanh2912/next-pwa` with front-end navigation caching | Caches visited routes and static assets |

---

## Technology Stack

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom surface tokens (`.surface-card`, `.bg-grid-pattern`, `.tabular-nums`)
* **Persistence & Auth**: [Firebase v12](https://firebase.google.com/) (Authentication & Offline-Persistent Cloud Firestore) + LocalStorage Vault
* **AI Engine**: [Google Gemini API (`@google/genai`)](https://ai.google.dev/) + Local Offline Fallback Engine (`lib/offline-engine.ts`)
* **Data Visualization & Motion**: [Recharts](https://recharts.org/), [Framer Motion](https://www.framer.com/motion/), and `canvas-confetti`

---

## Project Structure

```text
├── app/
│   ├── (auth)/             # Authentication & Offline Guest Mode entry (login, signup)
│   ├── (dashboard)/        # Protected & Local-Vault workspace routes
│   │   ├── budget/         # Daily & historical Budget Ledger
│   │   ├── chatbot/        # Context-aware Atlas AI Coach
│   │   ├── dashboard/      # Executive Financial Command Center
│   │   ├── profile/        # Scholar level progression, streaks & 7 badges
│   │   ├── quiz/           # Timed Financial IQ Quiz engine
│   │   ├── report/         # 5-Pillar Financial Health Report Card & Radar chart
│   │   ├── roadmap/        # 30-Day personalized execution roadmaps
│   │   └── scam-checker/   # Phishing & Fraud Shield with offline scan history
│   ├── api/                # Next.js Route Handlers (coach, chat, quiz, report, roadmap, scam-check)
│   ├── globals.css         # Design tokens, surface utilities & grid patterns
│   └── layout.tsx          # Root layout, PWA metadata & global providers
├── components/             # Categorized Sidebar, MobileNav, GlobalChatbot & UI primitives
├── contexts/               # AuthContext, GamificationContext & StreakContext
├── lib/
│   ├── firebase.ts         # Firebase initialization with IndexedDB persistentLocalCache
│   ├── offline-engine.ts   # Client-side quiz bank, roadmap generator, report grader & AI coach
│   └── utils.ts            # Class merging utilities
└── public/                 # PWA manifest.json and scalable vector icons
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional for Offline Mode)
Create a `.env.local` file in the root directory. *(Note: The app works out-of-the-box in Offline / Guest Mode even without API keys configured.)*

```env
GEMINI_API_KEY=your_gemini_api_key_here

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
