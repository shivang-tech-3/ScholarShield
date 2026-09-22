'use client';

import { VerificationResult } from '@/types';
import { ShieldCheck, ShieldAlert, X, Copy, ExternalLink, QrCode, FileCheck2, Award } from 'lucide-react';
import { useState } from 'react';

interface VerificationModalProps {
  result: VerificationResult | null;
  onClose: () => void;
}

export default function VerificationModal({ result, onClose }: VerificationModalProps) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const isAuthentic = result.status === 'AUTHENTIC';

  const copyHash = () => {
    navigator.clipboard.writeText(result.documentHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        {/* Banner */}
        <div className={`p-6 flex items-center justify-between border-b ${
          isAuthentic 
            ? 'bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border-emerald-500/30' 
            : 'bg-gradient-to-r from-rose-950/60 to-amber-950/60 border-rose-500/30'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${isAuthentic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {isAuthentic ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white">
                  {isAuthentic ? 'Cryptographically Verified Authentic' : 'Verification Security Alert'}
                </h3>
              </div>
              <p className="text-xs text-gray-300">
                Certificate Registry ID: <span className="font-mono text-cyan-300 font-semibold">{result.certificateId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-surface hover:bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-surface/80 border border-white/5 space-y-1">
              <span className="text-xs text-gray-400 block">Recipient Scholar</span>
              <span className="font-semibold text-white text-base">{result.studentName}</span>
              <span className="text-xs text-indigo-300 block">{result.institution}</span>
            </div>

            <div className="p-4 rounded-xl bg-surface/80 border border-white/5 space-y-1">
              <span className="text-xs text-gray-400 block">Grant Award</span>
              <span className="font-semibold text-cyan-300 text-base">{result.metadata.grantValue || 'Approved Grant'}</span>
              <span className="text-xs text-gray-400 block">{result.metadata.scholarshipName || 'ScholarShield Endowment'}</span>
            </div>

            <div className="p-4 rounded-xl bg-surface/80 border border-white/5 space-y-1">
              <span className="text-xs text-gray-400 block">Certified GPA</span>
              <span className="font-semibold text-emerald-400 text-base">{result.metadata.gpa.toFixed(2)} / 4.00</span>
              <span className="text-xs text-gray-400 block">Transcript Matched & Sealed</span>
            </div>

            <div className="p-4 rounded-xl bg-surface/80 border border-white/5 space-y-1">
              <span className="text-xs text-gray-400 block">Valid Period</span>
              <span className="font-semibold text-gray-200 text-base">{result.issueDate} to {result.validUntil}</span>
              <span className="text-xs text-emerald-400 block">Active Status</span>
            </div>
          </div>

          {/* Cryptographic Hash Details */}
          <div className="p-4 rounded-xl bg-surface border border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span className="flex items-center space-x-1.5">
                <FileCheck2 className="w-4 h-4" />
                <span>SHA-256 Document Integrity Proof</span>
              </span>
              <button
                onClick={copyHash}
                className="flex items-center space-x-1 text-gray-400 hover:text-cyan-300 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Proof'}</span>
              </button>
            </div>
            <div className="font-mono text-xs text-gray-300 bg-background/90 p-2.5 rounded-lg break-all border border-white/5">
              {result.documentHash}
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 pt-1">
              <span>Security Standard: {result.algorithm}</span>
              <span>Attested By: {result.verifier}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface/90 border-t border-white/10 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
