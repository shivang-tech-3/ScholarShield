import { FraudAnalysis } from '@/types';
import { ShieldCheck, ShieldAlert, ShieldX, Sparkles } from 'lucide-react';

interface FraudScoreBadgeProps {
  analysis: FraudAnalysis;
  showDetails?: boolean;
}

export default function FraudScoreBadge({ analysis, showDetails = false }: FraudScoreBadgeProps) {
  const { riskScore, riskLevel, integrityScore } = analysis;

  if (riskLevel === 'LOW') {
    return (
      <div className="inline-flex flex-col">
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Authentic (Risk: {riskScore}%)</span>
        </span>
        {showDetails && (
          <span className="text-[11px] text-emerald-400/80 mt-1 font-mono">
            Integrity Index: {integrityScore}/100 • Zero Tamper Detected
          </span>
        )}
      </div>
    );
  }

  if (riskLevel === 'MEDIUM') {
    return (
      <div className="inline-flex flex-col">
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/40 text-amber-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Manual Review Required (Risk: {riskScore}%)</span>
        </span>
        {showDetails && (
          <span className="text-[11px] text-amber-400/80 mt-1 font-mono">
            Integrity: {integrityScore}/100 • Flags Under Examination
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col">
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 border border-rose-500/40 text-rose-300 animate-pulse">
        <ShieldX className="w-3.5 h-3.5 text-rose-400" />
        <span>High Fraud Risk Detected (Risk: {riskScore}%)</span>
      </span>
      {showDetails && (
        <span className="text-[11px] text-rose-400/80 mt-1 font-mono">
          Integrity: {integrityScore}/100 • Critical Anomaly Flags
        </span>
      )}
    </div>
  );
}
