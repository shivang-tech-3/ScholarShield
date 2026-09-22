'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Cpu, 
  ArrowRight, 
  Wallet, 
  Key, 
  DollarSign, 
  TrendingUp, 
  Copy 
} from 'lucide-react';
import ConnectWalletModal from '@/components/ConnectWalletModal';
import { MidnightClient, ACCREDITED_INSTITUTION_MERKLE_ROOT } from '@/lib/midnight/client';
import { ScholarshipConfig, VerificationRecord, LaceWalletState } from '@/lib/midnight/types';

export default function StudentDashboardPage() {
  const [walletState, setWalletState] = useState<LaceWalletState>({
    isConnected: false,
    address: null,
    networkId: 'preprod',
    balanceTDUST: 0,
    isConnecting: false,
    error: null,
    walletType: null
  });

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [scholarships, setScholarships] = useState<ScholarshipConfig[]>([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>('');

  // Private Student Witness Inputs (Shielded from public chain)
  const [privateIncomeUSD, setPrivateIncomeUSD] = useState<number>(32000);
  const [privateAcademicPercentage, setPrivateAcademicPercentage] = useState<number>(92.5);
  const [studentSecret, setStudentSecret] = useState<string>('0x7a89b1c2d3e4f5061728394a5b6c7d8e9f0123456789abcdef0123456789abcd');
  const [showSensitiveValues, setShowSensitiveValues] = useState<boolean>(false);

  // Prover & Transaction State
  const [isProving, setIsProving] = useState<boolean>(false);
  const [provingStep, setProvingStep] = useState<string>('');
  const [provingProgress, setProvingProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastClaimRecord, setLastClaimRecord] = useState<VerificationRecord | null>(null);
  const [copiedNullifier, setCopiedNullifier] = useState<boolean>(false);

  useEffect(() => {
    const client = MidnightClient.getInstance();
    const list = client.getAllScholarships();
    setScholarships(list);
    if (list.length > 0) {
      setSelectedScholarshipId(list[0].scholarshipId);
    }
  }, []);

  const activeScholarship = scholarships.find(s => s.scholarshipId === selectedScholarshipId) || scholarships[0];

  const handleGenerateProofAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletState.isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    setIsProving(true);
    setErrorMessage(null);
    setLastClaimRecord(null);

    try {
      const client = MidnightClient.getInstance();
      const record = await client.executeProofAndClaim(
        selectedScholarshipId,
        {
          studentSecret,
          privateIncomeUSD: Number(privateIncomeUSD),
          privateAcademicPercentageBps: Math.round(Number(privateAcademicPercentage) * 100),
          studentSalt: '0xsalt_client_generated_proof_9821'
        },
        (step, progress) => {
          setProvingStep(step);
          setProvingProgress(progress);
        }
      );

      setLastClaimRecord(record);
    } catch (err: any) {
      setErrorMessage(err.message || 'Zero-Knowledge circuit constraint failed.');
    } finally {
      setIsProving(false);
    }
  };

  const handleCopyNullifier = (nullifier: string) => {
    navigator.clipboard.writeText(nullifier);
    setCopiedNullifier(true);
    setTimeout(() => setCopiedNullifier(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Midnight Compact Zero-Knowledge Proof Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Student Shielded Scholarship Portal
          </h1>
          <p className="mt-1 text-xs text-gray-400 max-w-xl">
            Prove your eligibility using zero-knowledge cryptography. Your family income and exact scores remain completely hidden on the Midnight blockchain.
          </p>
        </div>

        {/* Wallet Status / Connect Button */}
        <div>
          {walletState.isConnected ? (
            <div className="p-3 rounded-2xl glass-panel-elevated border-emerald-500/40 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div className="text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">Connected ({walletState.networkId})</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-gray-700 text-gray-300 uppercase">
                    {walletState.walletType}
                  </span>
                </div>
                <p className="font-mono text-gray-300 text-[11px] truncate max-w-[180px]">
                  {walletState.address}
                </p>
              </div>
              <button
                onClick={() => setWalletState({ ...walletState, isConnected: false, address: null })}
                className="text-[11px] text-gray-400 hover:text-rose-400 ml-2 px-2 py-1 rounded bg-surface hover:bg-gray-800 transition"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-primary-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Lace / Midnight Wallet</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10">
            <form onSubmit={handleGenerateProofAndSubmit} className="space-y-6">
              {/* Scholarship Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  1. Select Target Scholarship Program
                </label>
                <select
                  value={selectedScholarshipId}
                  onChange={(e) => setSelectedScholarshipId(e.target.value)}
                  className="w-full px-4 py-3 bg-surface/90 border border-gray-700 rounded-2xl text-sm text-white focus:border-cyan-500 focus:outline-none transition"
                >
                  {scholarships.map((s) => (
                    <option key={s.scholarshipId} value={s.scholarshipId} className="bg-surface">
                      {s.title} — ${s.amountUSD.toLocaleString()} USD (Max Income: ${s.maxIncomeThresholdUSD.toLocaleString()} | Min Score: {(s.minAcademicPercentageBps/100).toFixed(0)}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Private Witness Section */}
              <div className="p-5 rounded-2xl bg-surface/80 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <span>2. Private Witness Data (Shielded Prover Inputs)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSensitiveValues(!showSensitiveValues)}
                    className="text-[11px] text-gray-400 hover:text-cyan-300 flex items-center space-x-1 transition"
                  >
                    {showSensitiveValues ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showSensitiveValues ? 'Hide Values' : 'Show Values'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-medium">
                      Private Family Income ($ USD/yr)
                    </label>
                    <input
                      type={showSensitiveValues ? 'number' : 'password'}
                      required
                      value={privateIncomeUSD}
                      onChange={(e) => setPrivateIncomeUSD(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-background/90 border border-gray-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:outline-none transition"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Program Ceiling: ≤ ${activeScholarship?.maxIncomeThresholdUSD.toLocaleString()} USD
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-medium">
                      Private Academic Percentage (%)
                    </label>
                    <input
                      type={showSensitiveValues ? 'number' : 'password'}
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={privateAcademicPercentage}
                      onChange={(e) => setPrivateAcademicPercentage(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-background/90 border border-gray-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:outline-none transition"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Program Prerequisite: ≥ {((activeScholarship?.minAcademicPercentageBps || 0)/100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-medium flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Student Shielded Secret (Private Key / Seed)</span>
                  </label>
                  <input
                    type={showSensitiveValues ? 'text' : 'password'}
                    required
                    value={studentSecret}
                    onChange={(e) => setStudentSecret(e.target.value)}
                    className="w-full px-4 py-2 bg-background/90 border border-gray-700 rounded-xl text-xs font-mono text-gray-300 focus:border-cyan-500 focus:outline-none transition"
                  />
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    ✓ Used strictly for local nullifier generation; NEVER broadcast to network
                  </span>
                </div>
              </div>

              {/* Prover Status Progress */}
              {isProving && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-300 font-bold flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>{provingStep}</span>
                    </span>
                    <span className="font-mono text-gray-300 font-bold">{provingProgress}%</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 transition-all duration-300 rounded-full"
                      style={{ width: `${provingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start space-x-3 text-xs text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Circuit Verification Failed</span>
                    <p className="mt-0.5 text-[11px] leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProving}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-primary-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isProving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Synthesizing Proof & Broadcasting to Midnight...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-cyan-300" />
                    <span>Synthesize Zero-Knowledge Proof & Claim Grant</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Success Claim Record */}
          {lastClaimRecord && (
            <div className="glass-panel-elevated rounded-3xl p-6 border border-emerald-500/40 space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-3 text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Scholarship Verified & Claimed On Midnight!
                  </h3>
                  <span className="text-xs text-emerald-300">
                    Status: <strong className="uppercase">ELIGIBLE</strong> • Zero Sensitive Data Disclosed
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface/90 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Application Nullifier (Unique On-Chain Key):</span>
                  <button
                    onClick={() => handleCopyNullifier(lastClaimRecord.nullifier)}
                    className="text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedNullifier ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-cyan-300 bg-background/90 p-2.5 rounded-xl break-all text-[11px] border border-white/5">
                  {lastClaimRecord.nullifier}
                </div>

                <div className="flex justify-between text-gray-400 pt-2 border-t border-white/5">
                  <span>Midnight Tx Hash:</span>
                  <span className="font-mono text-gray-300 text-[11px] truncate max-w-[220px]">
                    {lastClaimRecord.transactionHash}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Privacy Demonstration & Zero-Knowledge Architecture (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Privacy Demonstration Card */}
          <div className="glass-panel-elevated rounded-3xl p-6 border border-indigo-500/30 space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Midnight Privacy Demonstration</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Notice how Midnight's dual public/private state model protects you:
            </p>

            {/* Visual breakdown box */}
            <div className="space-y-3 pt-1">
              {/* Private Information Block */}
              <div className="p-3.5 rounded-2xl bg-surface/90 border border-indigo-500/20 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Private Information (Shielded Witness)
                </span>
                <div className="flex justify-between text-gray-300 font-mono text-[11px]">
                  <span>Family Income:</span>
                  <span className="text-gray-400">●●●●●● ({showSensitiveValues ? `$${privateIncomeUSD.toLocaleString()}` : 'Protected'})</span>
                </div>
                <div className="flex justify-between text-gray-300 font-mono text-[11px]">
                  <span>Academic Score:</span>
                  <span className="text-gray-400">●●●●●● ({showSensitiveValues ? `${privateAcademicPercentage}%` : 'Protected'})</span>
                </div>
              </div>

              {/* Zero-Knowledge Proof Block */}
              <div className="p-3.5 rounded-2xl bg-surface/90 border border-cyan-500/20 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Zero-Knowledge Proof (Circuit)
                </span>
                <div className="text-emerald-300 flex items-center space-x-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Income & Academic conditions satisfied</span>
                </div>
                <div className="text-emerald-300 flex items-center space-x-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Accredited university whitelist confirmed</span>
                </div>
              </div>

              {/* Public Ledger Result Block */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Public Ledger Result (On-Chain)
                </span>
                <div className="flex justify-between text-gray-200 text-[11px]">
                  <span>Verification Status:</span>
                  <strong className="text-emerald-400">ELIGIBLE</strong>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal">
                  The sponsor and verifier only see that you satisfy all criteria without ever knowing your actual bank balance or transcript scores.
                </p>
              </div>
            </div>
          </div>

          {/* Active Program Criteria Card */}
          {activeScholarship && (
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm">{activeScholarship.title}</h3>
              <p className="text-indigo-300 text-[11px]">{activeScholarship.provider}</p>

              <div className="space-y-2 pt-2 border-t border-white/5 text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Grant Value:</span>
                  <span className="font-bold text-emerald-400">${activeScholarship.amountUSD.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Income Ceiling:</span>
                  <span>≤ ${activeScholarship.maxIncomeThresholdUSD.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum Academic Score:</span>
                  <span>≥ {(activeScholarship.minAcademicPercentageBps / 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Slots:</span>
                  <span>{activeScholarship.totalSlots - activeScholarship.awardedCount} of {activeScholarship.totalSlots} left</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletConnected={(state) => setWalletState(state)}
      />
    </div>
  );
}
