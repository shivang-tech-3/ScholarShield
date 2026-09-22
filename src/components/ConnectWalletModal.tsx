'use client';

import { useState } from 'react';
import { ShieldCheck, X, AlertCircle, Loader2, Sparkles, ExternalLink, Wallet, Globe } from 'lucide-react';
import { MidnightClient } from '@/lib/midnight/client';
import { LaceWalletState } from '@/lib/midnight/types';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (walletState: LaceWalletState) => void;
}

export default function ConnectWalletModal({
  isOpen,
  onClose,
  onWalletConnected
}: ConnectWalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedType, setSelectedType] = useState<'lace' | 'freighter' | 'demo' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (type: 'lace' | 'freighter' | 'demo') => {
    setSelectedType(type);
    setIsConnecting(true);
    setErrorMessage(null);

    const client = MidnightClient.getInstance();
    let state: LaceWalletState;

    if (type === 'lace') {
      state = await client.connectLaceWallet();
    } else if (type === 'freighter') {
      state = await client.connectFreighterWallet();
    } else {
      state = await client.connectDemoWallet();
    }

    setIsConnecting(false);

    if (state.isConnected) {
      onWalletConnected(state);
      onClose();
    } else {
      setErrorMessage(state.error || 'Failed to connect wallet.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 to-surface">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Connect Wallet</h3>
              <p className="text-xs text-gray-400">Access Zero-Knowledge shielded proofs, Stellar & Midnight</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-surface hover:bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3.5">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start space-x-3 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Connection Error</span>
                <p className="leading-relaxed text-[11px]">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Option 1: Official Midnight Lace Wallet */}
          <button
            onClick={() => handleConnect('lace')}
            disabled={isConnecting}
            className="w-full p-4 rounded-2xl glass-panel hover:glass-panel-elevated border border-white/10 hover:border-indigo-500/50 flex items-center justify-between group transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                🌘
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Midnight Lace Wallet
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Official Extension
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Standard Midnight DApp Connector v0.19 with native ZK key management
                </p>
              </div>
            </div>

            {isConnecting && selectedType === 'lace' ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            )}
          </button>

          {/* Option 2: Stellar Freighter Wallet */}
          <button
            onClick={() => handleConnect('freighter')}
            disabled={isConnecting}
            className="w-full p-4 rounded-2xl glass-panel hover:glass-panel-elevated border border-indigo-500/30 hover:border-indigo-400/60 flex items-center justify-between group transition-all text-left disabled:opacity-50 bg-gradient-to-r from-indigo-950/20 to-transparent"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-900/60 border border-indigo-400/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform text-indigo-300 font-black">
                🚀
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Stellar Freighter Wallet
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    Stellar / Soroban
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Official Stellar Freighter extension for cross-chain identity & grant disbursements
                </p>
              </div>
            </div>

            {isConnecting && selectedType === 'freighter' ? (
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            )}
          </button>

          {/* Option 3: Instant Demo Shielded Prover */}
          <button
            onClick={() => handleConnect('demo')}
            disabled={isConnecting}
            className="w-full p-4 rounded-2xl glass-panel hover:glass-panel-elevated border border-cyan-500/30 hover:border-cyan-500/60 flex items-center justify-between group transition-all text-left disabled:opacity-50 bg-gradient-to-r from-cyan-950/20 to-transparent"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Instant Demo Shielded Prover
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Ready to Test
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Simulated Preprod Node prover for instant testing & hackathon evaluation
                </p>
              </div>
            </div>

            {isConnecting && selectedType === 'demo' ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface/90 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Supported: Midnight Preprod & Stellar Testnet</span>
          <span className="flex items-center space-x-1 text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Proofs</span>
          </span>
        </div>
      </div>
    </div>
  );
}

