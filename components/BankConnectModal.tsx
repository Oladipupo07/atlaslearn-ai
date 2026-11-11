"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Lock,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { SUPPORTED_MFBS, BankingEngine } from "@/lib/banking-service";
import { MFBInstitution, LinkedBankAccount } from "@/types/banking";

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountLinked: (account: LinkedBankAccount) => void;
}

export function BankConnectModal({ isOpen, onClose, onAccountLinked }: BankConnectModalProps) {
  const [selectedMfb, setSelectedMfb] = useState<MFBInstitution | null>(null);
  const [step, setStep] = useState<"SELECT" | "AUTH" | "SUCCESS">("SELECT");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newlyLinked, setNewlyLinked] = useState<LinkedBankAccount | null>(null);

  if (!isOpen) return null;

  const handleSelect = (mfb: MFBInstitution) => {
    setSelectedMfb(mfb);
    setStep("AUTH");
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMfb) return;

    setIsSubmitting(true);
    // Simulate secure hand-shake / API call
    await new Promise((res) => setTimeout(res, 1200));

    const linked = BankingEngine.linkSandboxAccount(
      selectedMfb.id,
      "Oladipupo Akobe"
    );

    setNewlyLinked(linked);
    onAccountLinked(linked);
    setIsSubmitting(false);
    setStep("SUCCESS");
  };

  const handleReset = () => {
    setSelectedMfb(null);
    setAccountNumber("");
    setStep("SELECT");
    setNewlyLinked(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg tracking-tight">Connect Microfinance Bank</h3>
                <p className="text-xs text-muted-foreground">Open Banking & Direct MFB Telemetry</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step 1: Select Bank */}
          {step === "SELECT" && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select your MFB Partner
                </p>
                <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> NDPR / CBN Compliant
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {SUPPORTED_MFBS.map((mfb) => (
                  <button
                    key={mfb.id}
                    onClick={() => handleSelect(mfb)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/60 hover:border-primary/40 transition-all text-left group"
                  >
                    <span className="text-2xl">{mfb.logo}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                        {mfb.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{mfb.category}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 flex items-start gap-3 text-xs text-muted-foreground">
                <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>
                  AtlasLearn uses end-to-end encrypted Open Banking tokens. We never store your login password or PIN.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Authenticate */}
          {step === "AUTH" && selectedMfb && (
            <form onSubmit={handleLink} className="space-y-4 pt-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
                <span className="text-2xl">{selectedMfb.logo}</span>
                <div>
                  <h4 className="text-sm font-semibold">{selectedMfb.name}</h4>
                  <p className="text-xs text-muted-foreground">Institution Code: {selectedMfb.code}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Account Number / Phone</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-primary/90 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Simulation Sandbox Mode active: Instant verification with real-time balance telemetry.</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("SELECT")}
                  className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !accountNumber}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying with MFB...
                    </>
                  ) : (
                    <>
                      Authorize & Link <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === "SUCCESS" && newlyLinked && (
            <div className="space-y-5 pt-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-foreground">MFB Account Linked Successfully!</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {newlyLinked.institutionName} ({newlyLinked.accountNumberMasked}) is now syncing with your AtlasLearn ledger.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Verified Account Name:</span>
                  <span className="font-semibold text-foreground">{newlyLinked.accountName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Live Available Balance:</span>
                  <span className="font-semibold text-emerald-500 font-mono">
                    ₦{newlyLinked.availableBalance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Offline Vault Status:</span>
                  <span className="text-primary font-medium">Cached Locally</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Go to Budget & Financial Telemetry
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

