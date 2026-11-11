export type MFBInstitutionId =
  | "kuda"
  | "moniepoint"
  | "opay"
  | "fairmoney"
  | "sparkle"
  | "vfd"
  | "lapo"
  | "rubies";

export interface MFBInstitution {
  id: MFBInstitutionId;
  name: string;
  code: string;
  logo: string;
  category: "Microfinance Bank" | "Payment Service Bank" | "Digital MFB";
  popular?: boolean;
}

export interface LinkedBankAccount {
  id: string;
  institutionId: MFBInstitutionId;
  institutionName: string;
  accountName: string;
  accountNumberMasked: string; // e.g. "•••• 8912"
  accountType: "SAVINGS" | "CURRENT" | "TARGET_VAULT";
  currency: "NGN" | "USD" | "GBP" | "EUR";
  balance: number;
  availableBalance: number;
  bvnVerified: boolean;
  status: "ACTIVE" | "NEEDS_REAUTH" | "DISCONNECTED";
  lastSyncedAt: string;
  isSandbox?: boolean;
}

export interface BankTransactionFeed {
  id: string;
  accountId: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  category: "Food & Dining" | "Transportation" | "Bills & Utilities" | "Savings & Investment" | "Shopping" | "Income" | "Miscellaneous";
  narration: string;
  timestamp: string;
  reference: string;
}

export interface MFBCreditAssessment {
  eligibleForLoan: boolean;
  maxBorrowLimit: number;
  interestRateMonthlyPct: number;
  recommendedTenorDays: number;
  healthGradeFactor: string; // e.g. "A+", "B"
  reasoning: string;
}
