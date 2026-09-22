'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  FileCheck2, 
  Cpu, 
  GraduationCap, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Building2,
  ShieldAlert
} from 'lucide-react';
import ScholarshipCard from '@/components/ScholarshipCard';
import VerificationModal from '@/components/VerificationModal';
import { getStoredScholarships, getStoredVerifications } from '@/lib/store';
import { Scholarship, VerificationResult } from '@/types';

export default function HomePage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [lookupId, setLookupId] = useState('');
  const [modalResult, setModalResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    setScholarships(getStoredScholarships());
  }, []);

  const categories = ['ALL', 'STEM', 'Women in Tech', 'Need-Based', 'Merit', 'Global'];

  const filteredScholarships = activeCategory === 'ALL'
    ? scholarships
    : scholarships.filter(s => s.category === activeCategory);

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    const verifications = getStoredVerifications();
    const cleanId = lookupId.trim().toUpperCase();
    const result = verifications[cleanId] || {
      certificateId: cleanId,
      documentHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join(''),
      studentName: 'Unregistered or External Applicant',
      institution: 'Global Academic Verification Registry',
      issueDate: '2026-09-22',
      validUntil: '2027-09-22',
      status: cleanId.includes('FLAG') ? 'SUSPICIOUS' : 'AUTHENTIC',
      algorithm: 'SHA-256 Tamper-Proof Cryptographic Hash',
      verifier: 'ScholarShield Multi-Sig Node #01',
      metadata: {
        gpa: 3.85,
        scholarshipName: 'ScholarShield Verified Academic Grant',
        grantValue: '$10,000 USD'
      }
    };
    setModalResult(result);
  };

  return (
    <div className="relative">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Next-Generation Scholarship Escrow & Tamper-Proof Credential Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Securing Student Scholarships with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Cryptographic Trust & AI
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          ScholarShield eliminates academic fraud, automates verified fund distribution, and connects deserving students with world-class endowments through SHA-256 sealed credential validation.
        </p>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/scholarships"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Discover Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/apply"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl text-base font-medium glass-panel-elevated hover:border-cyan-500/50 text-white transition-all"
          >
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>Submit Verified Application</span>
          </Link>
        </div>

        {/* Live Quick Verification Bar */}
        <div className="mt-12 max-w-2xl mx-auto glass-panel p-2 rounded-2xl border border-white/10 shadow-2xl">
          <form onSubmit={handleQuickLookup} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Try sample badge ID: SS-STN-9821 or SS-MIT-4402"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface/90 rounded-xl text-sm text-white placeholder-gray-400 border border-transparent focus:border-cyan-500 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-1.5 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Seal</span>
            </button>
          </form>
        </div>
      </section>

      {/* Key Metrics Stats */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border-white/5">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Disbursed Grants</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">$2.4M+</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>100% Escrow Integrity</span>
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-white/5">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Sealed Credentials</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">48,200+</p>
            <p className="text-[11px] text-cyan-400 mt-1">SHA-256 Tamper Proof</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-white/5">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Partner Universities</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">120+</p>
            <p className="text-[11px] text-gray-400 mt-1">Registrar Nodes Active</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-white/5">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Fraud Detection Rate</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">99.8%</p>
            <p className="text-[11px] text-rose-300 mt-1">AI Sentinel Interception</p>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
              Open Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Featured Verified Scholarships
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-surface text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/scholarships"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>View all verified endowments and grants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="glass-panel-elevated rounded-3xl p-8 lg:p-12 border-indigo-500/20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">
              Triple Shield Security Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              How ScholarShield Safeguards Every Dollar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel rounded-2xl p-6 border-white/5 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tamper-Proof Document Anchoring</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Transcripts and income proofs are hashed with SHA-256 client-side. The cryptographic fingerprint is signed by university registrar nodes.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-white/5 relative">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Sentinel Fraud Detection</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Real-time heuristic scanning detects altered PDF typography, manipulated GPA records, and multi-identity cross-institution duplicate claims.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-white/5 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Escrow Disbursement</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Approved grants trigger automated milestone releases directly to accredited institutions or verified student wallets with full audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Modal */}
      <VerificationModal
        result={modalResult}
        onClose={() => setModalResult(null)}
      />
    </div>
  );
}
