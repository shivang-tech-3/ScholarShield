'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Search, 
  Filter, 
  FileText, 
  Cpu, 
  ExternalLink,
  Award,
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import FraudScoreBadge from '@/components/FraudScoreBadge';
import VerificationModal from '@/components/VerificationModal';
import { getStoredApplications, updateApplicationStatus, getStoredVerifications } from '@/lib/store';
import { ScholarshipApplication, VerificationResult } from '@/types';

export default function AdminPage() {
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<ScholarshipApplication | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationModalResult, setVerificationModalResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    const list = getStoredApplications();
    setApplications(list);
    if (list.length > 0) {
      setSelectedApp(list[0]);
    }
  }, []);

  const handleStatusChange = (appId: string, newStatus: ScholarshipApplication['status']) => {
    const updated = updateApplicationStatus(appId, newStatus);
    setApplications(updated);
    const refreshed = updated.find(a => a.id === appId);
    if (refreshed) setSelectedApp(refreshed);
  };

  const handleOpenCertificate = (badgeId: string) => {
    const verifications = getStoredVerifications();
    const cert = verifications[badgeId];
    if (cert) {
      setVerificationModalResult(cert);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.scholarshipTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = filterRisk === 'ALL' || app.fraudAnalysis.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const totalFundsManaged = applications.reduce((sum, a) => sum + a.scholarshipAmount, 0);
  const approvedFunds = applications.filter(a => a.status === 'approved' || a.status === 'disbursed').reduce((sum, a) => sum + a.scholarshipAmount, 0);
  const highRiskCount = applications.filter(a => a.fraudAnalysis.riskLevel === 'HIGH').length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>ScholarShield Sentinel AI & Grant Review Queue</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Grant Reviewer & Anti-Fraud Center
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-surface-elevated border border-gray-700 text-xs text-right">
            <span className="text-gray-400 block">Total Pool Managed</span>
            <span className="font-bold text-cyan-300 text-sm">${totalFundsManaged.toLocaleString()} USD</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-right">
            <span className="text-emerald-400 block">Disbursed Funds</span>
            <span className="font-bold text-emerald-300 text-sm">${approvedFunds.toLocaleString()} USD</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-2xl border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Total Applications</span>
            <p className="text-2xl font-bold text-white">{applications.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">High Risk Anomalies Intercepted</span>
            <p className="text-2xl font-bold text-rose-400">{highRiskCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Registrar Authenticity Rate</span>
            <p className="text-2xl font-bold text-emerald-400">97.4%</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Reviewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Applications Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate, school, app ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface/90 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Risk filter buttons */}
            <div className="flex gap-1.5 text-xs">
              {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setFilterRisk(risk)}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                    filterRisk === risk
                      ? 'bg-indigo-600 text-white'
                      : 'bg-surface text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'glass-panel-elevated border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'glass-panel border-white/5 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-gray-200">{app.studentName}</span>
                    <FraudScoreBadge analysis={app.fraudAnalysis} />
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{app.scholarshipTitle}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                    <span>{app.institution}</span>
                    <span className="font-semibold text-emerald-400">${app.scholarshipAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Candidate & Sentinel Report (7 cols) */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              {/* Header & Status Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface border border-gray-700 text-gray-300">
                      {selectedApp.id}
                    </span>
                    <span className="text-xs text-gray-400">
                      GPA: <strong className="text-emerald-400">{selectedApp.studentGpa}</strong> • Income: <strong className="text-white">${selectedApp.annualFamilyIncome.toLocaleString()}</strong>
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedApp.studentName}</h2>
                  <p className="text-xs text-cyan-300">{selectedApp.institution} — {selectedApp.major}</p>
                </div>

                {/* Quick Review Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Grant</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                    className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center space-x-1.5 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {/* AI Sentinel Deep Scan */}
              <div className="p-5 rounded-2xl bg-surface/90 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      ScholarShield AI Fraud Analysis Engine
                    </span>
                  </div>
                  <FraudScoreBadge analysis={selectedApp.fraudAnalysis} showDetails={true} />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                  {selectedApp.fraudAnalysis.flagReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-gray-300">
                      {selectedApp.fraudAnalysis.riskLevel === 'HIGH' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Cryptographic Seal Details */}
              <div className="p-5 rounded-2xl bg-surface/90 border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Cryptographic Transcripts & Proofs
                </h3>

                {selectedApp.documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl bg-background/80 border border-white/5 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-200 font-bold">{doc.name}</span>
                      <span className="text-[10px] text-gray-400">{doc.fileSize} • {doc.uploadedAt}</span>
                    </div>
                    <p className="text-[11px] text-cyan-400/90 break-all">{doc.hash}</p>
                    {doc.fraudFlagReason && (
                      <p className="text-[11px] text-rose-400 pt-1 font-sans">
                        Flag: {doc.fraudFlagReason}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => handleOpenCertificate(selectedApp.verificationBadgeId)}
                  className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-gray-700 text-xs font-semibold text-cyan-300 border border-cyan-500/30 flex items-center justify-center space-x-2 transition"
                >
                  <Award className="w-4 h-4" />
                  <span>Inspect Public Blockchain / Registry Proof</span>
                </button>
              </div>

              {/* Statement of Purpose */}
              <div className="p-4 rounded-2xl bg-surface/90 border border-white/5 text-xs text-gray-300 space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider block">Statement of Purpose</span>
                <p className="italic leading-relaxed">{selectedApp.statementOfPurpose}</p>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center text-gray-400">
              Select an applicant from the queue to inspect AI audit logs.
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
