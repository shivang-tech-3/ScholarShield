'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Sparkles, 
  Cpu, 
  FileText, 
  Wallet, 
  ExternalLink,
  Award,
  AlertCircle
} from 'lucide-react';
import ConnectWalletModal from '@/components/ConnectWalletModal';
import { getNetworkId, type NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { InitialAPI, ConnectedAPI, WalletConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { MidnightClient } from '@/lib/midnight/client';
import { VerificationRecord, VerificationStatus, LaceWalletState } from '@/lib/midnight/types';

export default function VerifierDashboardPage() {
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
  const [queryNullifier, setQueryNullifier] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationRecord | null>(null);
  const [hasQueried, setHasQueried] = useState<boolean>(false);
  const [allClaims, setAllClaims] = useState<VerificationRecord[]>([]);

  useEffect(() => {
    const client = MidnightClient.getInstance();
    const claims = client.getAllVerifiedClaims();
    setAllClaims(claims);
    if (claims.length > 0) {
      setQueryNullifier(claims[0].nullifier);
    }
  }, []);

  const handleAuditLookup = (e?: React.FormEvent, customNullifier?: string) => {
    if (e) e.preventDefault();
    const target = (customNullifier || queryNullifier).trim();
    if (!target) return;

    const client = MidnightClient.getInstance();
    const result = client.getVerificationRecord(target);

    setVerificationResult(result);
    setHasQueried(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Midnight Rational Privacy & Verification Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Verifier & Sponsor Governance Center
          </h1>
          <p className="mt-1 text-xs text-gray-400 max-w-xl">
            Audit student scholarship claims on the Midnight public ledger. Verify compliance without accessing sensitive student records or bank data.
          </p>
        </div>

        {/* Verifier Wallet Card */}
        <div>
          {walletState.isConnected ? (
            <div className="p-3 rounded-2xl glass-panel-elevated border-cyan-500/40 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div className="text-xs">
                <span className="text-cyan-300 font-bold block">Auditor Node Active</span>
                <span className="font-mono text-gray-300 text-[11px] truncate max-w-[170px] block">
                  {walletState.address}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-surface-elevated border border-gray-700 hover:border-cyan-500/50 text-white font-medium text-xs transition"
            >
              <Wallet className="w-4 h-4 text-cyan-400" />
              <span>Connect Auditor Wallet (Optional)</span>
            </button>
          )}
        </div>
      </div>

      {/* Query Search Section */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 mb-8">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span>Audit Application by On-Chain Nullifier</span>
        </h2>

        <form onSubmit={(e) => handleAuditLookup(e)} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={queryNullifier}
            onChange={(e) => setQueryNullifier(e.target.value)}
            placeholder="Enter application nullifier (e.g. 0x application nullifier hash)..."
            className="flex-1 px-4 py-3 bg-surface/90 border border-gray-700 rounded-2xl text-xs font-mono text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Public Proof</span>
          </button>
        </form>

        {/* Quick select from recent claims */}
        {allClaims.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span>Recent On-Chain Claims:</span>
            {allClaims.slice(0, 3).map((c, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryNullifier(c.nullifier);
                  handleAuditLookup(undefined, c.nullifier);
                }}
                className="text-cyan-400 hover:underline font-mono text-[11px] truncate max-w-[140px]"
              >
                {c.nullifier.slice(0, 12)}...
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Verification Query Result */}
      {hasQueried && (
        <div className="glass-panel-elevated rounded-3xl overflow-hidden border border-white/15 mb-8 animate-in fade-in">
          {verificationResult ? (
            <div>
              {/* Top Banner */}
              <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-surface to-cyan-950/60 border-b border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                      Verified Authentic On-Chain
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      RESULT: <span className="text-emerald-400">ELIGIBLE</span>
                    </h3>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
                  <span className="text-xs text-gray-400 block">Verified On Midnight</span>
                  <span className="text-xs text-gray-300 font-mono">
                    {new Date(verificationResult.verifiedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Strict Public Fields Grid */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-surface/90 border border-white/5 space-y-1">
                    <span className="text-gray-400 block">Program Identifier</span>
                    <span className="font-mono text-cyan-300 font-bold text-sm block">
                      {verificationResult.scholarshipId}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface/90 border border-white/5 space-y-1">
                    <span className="text-gray-400 block">Accredited Institution Merkle Root</span>
                    <span className="font-mono text-gray-300 text-[11px] break-all block">
                      {verificationResult.institutionRoot}
                    </span>
                  </div>
                </div>

                {/* Nullifier & Privacy Guarantee */}
                <div className="p-5 rounded-2xl bg-surface border border-cyan-500/20 space-y-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Zero-Knowledge Privacy Guarantee
                  </span>
                  <div className="font-mono text-xs text-gray-300 bg-background/90 p-3 rounded-xl break-all border border-white/5">
                    Nullifier: {verificationResult.nullifier}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    ✓ The student's family income and academic percentage have been cryptographically verified against the scholarship contract constraints without being revealed to the verifier or logged in public storage.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">RESULT: NOT ELIGIBLE / NOT FOUND</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No verified eligibility claim was found on the Midnight ledger for this nullifier.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Public Verified Claims Ledger */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span>Active On-Chain Verification Ledger</span>
          <span className="text-xs text-cyan-400 font-mono">{allClaims.length} Recorded Claims</span>
        </h2>

        {allClaims.length > 0 ? (
          <div className="space-y-3">
            {allClaims.map((claim, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-surface/90 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                      {claim.status}
                    </span>
                    <span className="font-mono text-cyan-300 text-[11px] truncate max-w-[200px]">
                      {claim.scholarshipId}
                    </span>
                  </div>
                  <p className="font-mono text-gray-400 text-[11px] truncate max-w-[320px]">
                    Nullifier: {claim.nullifier}
                  </p>
                </div>

                <div className="text-right flex items-center space-x-3">
                  <span className="text-gray-400 text-[11px]">
                    {new Date(claim.verifiedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      setQueryNullifier(claim.nullifier);
                      handleAuditLookup(undefined, claim.nullifier);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs transition"
                  >
                    Inspect Proof
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-6 text-center">
            No claims recorded yet. Submit an application in the Student Portal to synthesize the first proof!
          </p>
        )}
      </div>

      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletConnected={(state) => setWalletState(state)}
      />
    </div>
  );
}
