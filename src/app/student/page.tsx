'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/navigation';
import { 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Award, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import FraudScoreBadge from '@/components/FraudScoreBadge';
import VerificationModal from '@/components/VerificationModal';
import { getStoredApplications, getStoredVerifications } from '@/lib/store';
import { ScholarshipApplication, VerificationResult } from '@/types';

function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('newAppId');

  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<ScholarshipApplication | null>(null);
  const [verificationModalResult, setVerificationModalResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    const list = getStoredApplications();
    setApplications(list);
    if (highlightId) {
      const match = list.find(a => a.id === highlightId);
      if (match) setSelectedApp(match);
      else if (list.length > 0) setSelectedApp(list[0]);
    } else if (list.length > 0) {
      setSelectedApp(list[0]);
    }
  }, [highlightId]);

  const handleOpenCertificate = (badgeId: string) => {
    const verifications = getStoredVerifications();
    const cert = verifications[badgeId];
    if (cert) {
      setVerificationModalResult(cert);
    }
  };

  const getStatusStep = (status: ScholarshipApplication['status']) => {
    switch (status) {
      case 'submitted': return 1;
      case 'under_review': return 2;
      case 'verified': return 3;
      case 'approved': return 4;
      case 'disbursed': return 5;
      case 'rejected': return -1;
      default: return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            Student Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            Application Status & Credentials
          </h1>
        </div>
        <a
          href="/apply"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Apply to Another Grant</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Applications List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
            <span>Submitted Applications</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono">
              {applications.length} Active
            </span>
          </h2>

          <div className="space-y-3">
            {applications.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'glass-panel-elevated border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'glass-panel border-white/5 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400">{app.id}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      app.status === 'approved' || app.status === 'disbursed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : app.status === 'rejected'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">{app.scholarshipTitle}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{app.studentName}</span>
                    <span className="font-semibold text-emerald-400">${app.scholarshipAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Tracker View */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      ID: {selectedApp.id}
                    </span>
                    <span className="text-xs text-gray-400">
                      Submitted: {selectedApp.submittedAt.slice(0, 10)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedApp.scholarshipTitle}</h2>
                  <p className="text-xs text-cyan-300">{selectedApp.institution} • {selectedApp.major}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Grant Value</span>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    ${selectedApp.scholarshipAmount.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Progress Milestones Tracker */}
              <div className="p-4 rounded-2xl bg-surface/90 border border-white/5">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">
                  Scholarship Verification Lifecycle
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {[
                    { label: 'Application Submitted', step: 1 },
                    { label: 'AI Sentinel Audit', step: 2 },
                    { label: 'Officer Review & Vote', step: 3 },
                    { label: 'Approved & Disbursed', step: 4 }
                  ].map((m) => {
                    const currentStep = getStatusStep(selectedApp.status);
                    const isDone = currentStep >= m.step;
                    const isCurrent = currentStep === m.step;

                    return (
                      <div
                        key={m.step}
                        className={`p-3 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : isCurrent
                            ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 animate-pulse'
                            : 'bg-surface/50 border-white/5 text-gray-500'
                        }`}
                      >
                        <div className="text-xs font-bold mb-1">Step 0{m.step}</div>
                        <div className="text-[11px] font-semibold">{m.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fraud Check & Cryptographic Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-surface/90 border border-white/5 space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    AI Fraud Analysis Report
                  </span>
                  <FraudScoreBadge analysis={selectedApp.fraudAnalysis} showDetails={true} />
                  
                  <div className="pt-2 text-xs text-gray-400 space-y-1">
                    {selectedApp.fraudAnalysis.flagReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-[11px] text-gray-300">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-surface/90 border border-white/5 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Digital Credential Badge
                    </span>
                    <p className="text-lg font-mono font-bold text-cyan-300">{selectedApp.verificationBadgeId}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Attested by ScholarShield Multi-Sig Node
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenCertificate(selectedApp.verificationBadgeId)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 text-indigo-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>View Tamper-Proof Certificate</span>
                  </button>
                </div>
              </div>

              {/* Escrow Disbursement Transaction */}
              {selectedApp.disbursementTxHash && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold block">Escrow Disbursement Confirmed</span>
                    <span className="font-mono text-gray-300 break-all text-[11px]">
                      Tx: {selectedApp.disbursementTxHash}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold">
                    Released
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center text-gray-400">
              Select an application to view detailed tracking.
            </div>
          )}
        </div>
      </div>

      <VerificationModal
        result={verificationModalResult}
        onClose={() => setVerificationModalResult(null)}
      />
    </div>
  );
}

export default function StudentPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading student tracker...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}
