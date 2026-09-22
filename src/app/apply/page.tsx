'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  AlertCircle,
  Loader2,
  Cpu
} from 'lucide-react';
import { getStoredScholarships, submitNewApplication } from '@/lib/store';
import { computeSHA256 } from '@/lib/crypto';
import { Scholarship } from '@/types';

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedId = searchParams.get('scholarshipId');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>('');
  
  // Form Fields
  const [studentName, setStudentName] = useState('Ananya Sen');
  const [studentEmail, setStudentEmail] = useState('ananya.sen@berkeley.edu');
  const [studentPhone, setStudentPhone] = useState('+1 (555) 489-0192');
  const [institution, setInstitution] = useState('University of California, Berkeley');
  const [studentGpa, setStudentGpa] = useState<number>(3.88);
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(32000);
  const [major, setMajor] = useState('Computer Science & Quantum Computing');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [statementOfPurpose, setStatementOfPurpose] = useState('Passionate about developing decentralized privacy technologies and accelerating equitable access to computing education.');
  
  // File upload state & hash simulator
  const [fileName, setFileName] = useState('UC_Berkeley_Official_Transcript_2026.pdf');
  const [fileHash, setFileHash] = useState<string>('');
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredScholarships();
    setScholarships(list);
    if (preselectedId && list.some(s => s.id === preselectedId)) {
      setSelectedScholarshipId(preselectedId);
    } else if (list.length > 0) {
      setSelectedScholarshipId(list[0].id);
    }
  }, [preselectedId]);

  // Compute live hash when name or institution changes
  useEffect(() => {
    async function updateHash() {
      setIsHashing(true);
      const hash = await computeSHA256(studentName + institution + studentGpa + fileName);
      setFileHash(hash);
      setIsHashing(false);
    }
    updateHash();
  }, [studentName, institution, studentGpa, fileName]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsHashing(true);
      const buffer = await file.arrayBuffer();
      const hash = await computeSHA256(buffer);
      setFileHash(hash);
      setIsHashing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const app = await submitNewApplication({
        scholarshipId: selectedScholarshipId,
        studentName,
        studentEmail,
        studentPhone,
        institution,
        studentGpa: Number(studentGpa),
        annualFamilyIncome: Number(annualFamilyIncome),
        major,
        educationLevel,
        statementOfPurpose,
        fileName
      });

      setSubmittedAppId(app.id);
      setTimeout(() => {
        router.push(`/student?newAppId=${app.id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const activeScholarship = scholarships.find(s => s.id === selectedScholarshipId);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Client-Side SHA-256 Tamper-Proof Anchoring</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Submit Scholarship Application
        </h1>
        <p className="mt-2 text-sm text-gray-400 max-w-xl mx-auto">
          Your credentials and academic records will be cryptographically hashed and evaluated by the ScholarShield AI Sentinel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Application Form */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Scholarship Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Target Scholarship Program
              </label>
              <select
                value={selectedScholarshipId}
                onChange={(e) => setSelectedScholarshipId(e.target.value)}
                className="w-full px-4 py-3 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
              >
                {scholarships.map((s) => (
                  <option key={s.id} value={s.id} className="bg-surface">
                    {s.title} — ${s.amount.toLocaleString()} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Institutional Email (.edu / verified)
                </label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Academic & Financial Data */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Institution / University
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Verified GPA (4.0 Scale)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="4.0"
                  required
                  value={studentGpa}
                  onChange={(e) => setStudentGpa(parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Household Income ($/yr)
                </label>
                <input
                  type="number"
                  required
                  value={annualFamilyIncome}
                  onChange={(e) => setAnnualFamilyIncome(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Major & Education */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Degree / Major Discipline
                </label>
                <input
                  type="text"
                  required
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate (Master's)</option>
                  <option value="Doctorate">Doctorate (Ph.D.)</option>
                  <option value="High School">High School Senior</option>
                </select>
              </div>
            </div>

            {/* Statement of Purpose */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Statement of Purpose & Vision (Max 500 words)
              </label>
              <textarea
                rows={3}
                required
                value={statementOfPurpose}
                onChange={(e) => setStatementOfPurpose(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition resize-none"
              />
            </div>

            {/* Document Upload & Hashing Zone */}
            <div className="p-4 rounded-2xl bg-surface/90 border border-dashed border-cyan-500/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-200 flex items-center space-x-1.5">
                  <UploadCloud className="w-4 h-4 text-cyan-400" />
                  <span>Upload Official Transcript / Proof (.pdf)</span>
                </span>
                <span className="text-[11px] text-cyan-400 font-mono">Live Client Hash</span>
              </div>

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 cursor-pointer"
              />

              <div className="mt-3 p-3 rounded-xl bg-background/90 border border-white/5 text-[11px] font-mono text-gray-300">
                <div className="flex justify-between items-center text-gray-400 mb-1">
                  <span>File: {fileName}</span>
                  {isHashing ? (
                    <span className="text-cyan-400 flex items-center space-x-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Hashing...</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>SHA-256 Calculated</span>
                    </span>
                  )}
                </div>
                <p className="break-all text-cyan-300/90">{fileHash || 'Calculating fingerprint...'}</p>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-primary-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl hover:shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sealing Credentials & Submitting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-cyan-300" />
                  <span>Seal Proof & Submit to ScholarShield</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Summary & Shield Pre-check */}
        <div className="space-y-6">
          {activeScholarship && (
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
                Selected Endowment
              </h3>
              <p className="text-lg font-bold text-white mb-1">{activeScholarship.title}</p>
              <p className="text-xs text-indigo-300 mb-4">{activeScholarship.provider}</p>

              <div className="space-y-2.5 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Award:</span>
                  <span className="font-bold text-emerald-400">${activeScholarship.amount.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prerequisite GPA:</span>
                  <span className="font-semibold text-white">{activeScholarship.minGpa.toFixed(2)}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-cyan-300">{activeScholarship.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline:</span>
                  <span className="text-gray-300">{activeScholarship.deadline}</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Pre-Validation Sentinel Card */}
          <div className="glass-panel-elevated rounded-3xl p-6 border border-indigo-500/30 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>AI Sentinel Pre-Scan</span>
            </div>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              Upon submission, your application will pass through our multi-point anti-fraud pipeline:
            </p>

            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Transcript metadata & font anomaly check</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Cross-institutional duplicate SSN detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Zero-knowledge financial threshold check</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading submission portal...</div>}>
      <ApplyFormContent />
    </Suspense>
  );
}
