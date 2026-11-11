import {
  MFBInstitution,
  LinkedBankAccount,
  BankTransactionFeed,
  MFBInstitutionId,
  MFBCreditAssessment,
} from "@/types/banking";

export const SUPPORTED_MFBS: MFBInstitution[] = [
  {
    id: "kuda",
    name: "Kuda Microfinance Bank",
    code: "090267",
    logo: "🟣",
    category: "Digital MFB",
    popular: true,
  },
  {
    id: "moniepoint",
    name: "Moniepoint MFB",
    code: "090405",
    logo: "🔵",
    category: "Microfinance Bank",
    popular: true,
  },
  {
    id: "opay",
    name: "OPay Digital Services",
    code: "090004",
    logo: "🟢",
    category: "Payment Service Bank",
    popular: true,
  },
  {
    id: "fairmoney",
    name: "FairMoney Microfinance Bank",
    code: "090551",
    logo: "🟡",
    category: "Digital MFB",
    popular: true,
  },
  {
    id: "sparkle",
    name: "Sparkle Microfinance Bank",
    code: "090325",
    logo: "✨",
    category: "Digital MFB",
  },
  {
    id: "vfd",
    name: "VFD Microfinance Bank",
    code: "090110",
    logo: "🔴",
    category: "Microfinance Bank",
  },
  {
    id: "lapo",
    name: "LAPO Microfinance Bank",
    code: "090177",
    logo: "🏛️",
    category: "Microfinance Bank",
  },
  {
    id: "rubies",
    name: "Rubies MFB",
    code: "090175",
    logo: "💎",
    category: "Digital MFB",
  },
];

const LOCAL_STORAGE_ACCOUNTS_KEY = "atlaslearn_linked_mfb_accounts";
const LOCAL_STORAGE_TRANSACTIONS_KEY = "atlaslearn_mfb_transactions";

export class BankingEngine {
  /**
   * Retrieves all linked accounts from local storage vault (Offline capable)
   */
  static getLinkedAccounts(): LinkedBankAccount[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Saves or updates linked accounts in the offline vault
   */
  static saveLinkedAccounts(accounts: LinkedBankAccount[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (err) {
      console.error("Failed to persist linked bank accounts", err);
    }
  }

  /**
   * Connects a new MFB account in Sandbox / Direct mode
   */
  static linkSandboxAccount(
    institutionId: MFBInstitutionId,
    accountHolderName: string = "Oladipupo Akobe"
  ): LinkedBankAccount {
    const institution = SUPPORTED_MFBS.find((m) => m.id === institutionId) || SUPPORTED_MFBS[0];
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const mockBalance = Math.floor(250000 + Math.random() * 450000);

    const newAccount: LinkedBankAccount = {
      id: `mfb_acc_${Date.now()}_${randSuffix}`,
      institutionId: institution.id,
      institutionName: institution.name,
      accountName: accountHolderName,
      accountNumberMasked: `•••• ${randSuffix}`,
      accountType: "SAVINGS",
      currency: "NGN",
      balance: mockBalance,
      availableBalance: mockBalance - 5000,
      bvnVerified: true,
      status: "ACTIVE",
      lastSyncedAt: new Date().toISOString(),
      isSandbox: true,
    };

    const currentAccounts = this.getLinkedAccounts();
    const updated = [newAccount, ...currentAccounts.filter((a) => a.institutionId !== institutionId)];
    this.saveLinkedAccounts(updated);

    // Generate initial simulated transactions for this account
    this.seedAccountTransactions(newAccount.id);

    return newAccount;
  }

  /**
   * Seeds realistic sample transaction telemetry
   */
  private static seedAccountTransactions(accountId: string): void {
    const sampleTxns: BankTransactionFeed[] = [
      {
        id: `tx_${Date.now()}_1`,
        accountId,
        amount: 85000,
        type: "CREDIT",
        category: "Income",
        narration: "TRF FROM CLIENT FREELANCE STIPEND",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        reference: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      },
      {
        id: `tx_${Date.now()}_2`,
        accountId,
        amount: 4200,
        type: "DEBIT",
        category: "Food & Dining",
        narration: "POS DEBIT - CHICKEN REPUBLIC IKEJA",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        reference: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      },
      {
        id: `tx_${Date.now()}_3`,
        accountId,
        amount: 15000,
        type: "DEBIT",
        category: "Bills & Utilities",
        narration: "DISCO ELECTRICITY TOKEN PURCHASE",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        reference: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      },
      {
        id: `tx_${Date.now()}_4`,
        accountId,
        amount: 25000,
        type: "DEBIT",
        category: "Savings & Investment",
        narration: "AUTO-LOCK TARGET SAVINGS DEPOSIT",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        reference: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      },
    ];

    const currentTxns = this.getTransactions();
    const updated = [...sampleTxns, ...currentTxns];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_TRANSACTIONS_KEY, JSON.stringify(updated.slice(0, 50)));
      } catch (e) {
        console.error("Failed to seed transactions", e);
      }
    }
  }

  /**
   * Retrieves transaction feeds
   */
  static getTransactions(): BankTransactionFeed[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_TRANSACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Removes a linked account
   */
  static disconnectAccount(accountId: string): void {
    const current = this.getLinkedAccounts();
    const updated = current.filter((a) => a.id !== accountId);
    this.saveLinkedAccounts(updated);
  }

  /**
   * Evaluates Microfinance Credit / Loan Eligibility based on Financial Health & Quiz telemetry
   */
  static calculateCreditAssessment(
    monthlyIncome: number,
    monthlyExpense: number,
    reportGrade: string = "A"
  ): MFBCreditAssessment {
    const netCashFlow = Math.max(0, monthlyIncome - monthlyExpense);
    const baseBorrowLimit = Math.round(netCashFlow * 0.45);

    let multiplier = 1.0;
    let rate = 3.5;

    if (reportGrade.startsWith("A")) {
      multiplier = 1.5;
      rate = 2.8;
    } else if (reportGrade.startsWith("B")) {
      multiplier = 1.2;
      rate = 3.2;
    } else if (reportGrade.startsWith("C")) {
      multiplier = 0.8;
      rate = 4.5;
    } else {
      multiplier = 0.4;
      rate = 5.5;
    }

    const calculatedLimit = Math.max(25000, Math.round(baseBorrowLimit * multiplier));

    return {
      eligibleForLoan: monthlyIncome > 30000 && netCashFlow > 5000,
      maxBorrowLimit: calculatedLimit,
      interestRateMonthlyPct: rate,
      recommendedTenorDays: 30,
      healthGradeFactor: reportGrade,
      reasoning: `Approved based on ${reportGrade} financial health rating and positive cash-flow buffer.`,
    };
  }
}
