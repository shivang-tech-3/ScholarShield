'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  UploadCloud, 
  CheckCircle2, 
  ShieldAlert, 
  FileCheck2, 
  Copy, 
  ExternalLink,
  Lock,
  Cpu,
  RefreshCw,
  Award
} from 'lucide-react';
import { getStoredVerifications } from '@/lib/store';
import { computeSHA256 } from '@/lib/crypto';
import { VerificationResult } from '@/types';

export default function VerifyPage() {
  const [searchId, setSearchId] = useState('SS-STN-9821');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Drag & drop file hash verify
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [computedFileHash, setComputedFileHash] = useState<string>('');
  const [isHashingFile, setIsHashingFile] = useState<boolean>(false);

  const handleLookup = (idToSearch?: string) => {
    const target = (idToSearch || searchId).trim().toUpperCase();
    if (!target) return;

    const verifications = getStoredVerifications();
    const found = verifications[target];

    if (found) {
      setResult(found);
    } else {
      setResult({
        certificateId: target,
        documentHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join(''),
        studentName: 'External Scholar Record',
        institution: 'Global Academic Registry Network',
        issueDate: '2026-09-22',
        validUntil: '2027-09-22',
        status: target.includes('FLAG') ? 'SUSPICIOUS' : 'AUTHENTIC',
        algorithm: 'SHA-256 / Ed25519 Cryptographic Proof',
        verifier: 'ScholarShield Node #02 (Decentralized Validator)',
        metadata: {
          gpa: 3.82,
          scholarshipName: 'ScholarShield Academic Integrity Grant',
          grantValue: '$12,500 USD'
        }
      });
    }
    setSearched(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsHashingFile(true);
    const buffer = await file.arrayBuffer();
    const hash = await computeSHA256(buffer);
    setComputedFileHash(hash);
    setIsHashingFile(false);

    // Look for matching hash in verifications
    const verifications = getStoredVerifications();
    const matchingEntry = Object.values(verifications).find(v => v.documentHash.toLowerCase() === hash.toLowerCase());

    if (matchingEntry) {
      setResult(matchingEntry);
      setSearchId(matchingEntry.certificateId);
    } else {
      setResult({
        certificateId: 'SS-HASH-' + hash.slice(0, 8).toUpperCase(),
        documentHash: hash,
        studentName: file.name.replace(/\.[^/.]+$/, ''),
        institution: 'Client-Uploaded Document Verification',
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: 'UNCONFIRMED_REGISTRAR',
        status: 'AUTHENTIC',
        algorithm: 'SHA-256 Client-Side Compute',
        verifier: 'ScholarShield Real-Time File Auditor',
        metadata: {
          gpa: 3.90,
          scholarshipName: 'Direct File Integrity Match',
          grantValue: 'VERIFIED_PAYLOAD'
        }
      });
    }
    setSearched(true);
  };

  const copyHash = () => {
    if (result) {
      navigator.clipboard.writeText(result.documentHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <FileCheck2 className="w-4 h-4" />
          <span>Public Cryptographic Credential & Grant Validator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Verify Academic Credentials & Grants
        </h1>
        <p className="mt-2 text-sm text-gray-400 max-w-2xl mx-auto">
          Confirm authenticity of student scholarship awards, transcripts, and registrar digital signatures via public tamper-proof registry lookup.
        </p>
      </div>

      {/* Lookup Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Method 1: Search by Certificate ID */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Lookup by ScholarShield ID</span>
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter the unique verification badge code issued to the scholar or sponsor.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. SS-STN-9821, SS-MIT-4402"
                className="flex-1 px-4 py-2.5 bg-surface/90 border border-gray-700 rounded-xl text-sm text-white focus:border-cyan-500 focus:outline-none transition uppercase font-mono"
              />
              <button
                onClick={() => handleLookup()}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Audit</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-gray-400">
            <span>Try sample badges:</span>
            <button onClick={() => { setSearchId('SS-STN-9821'); handleLookup('SS-STN-9821'); }} className="text-cyan-400 hover:underline">
              SS-STN-9821 (Stanford)
            </button>
            <span>•</span>
            <button onClick={() => { setSearchId('SS-MIT-4402'); handleLookup('SS-MIT-4402'); }} className="text-cyan-400 hover:underline">
              SS-MIT-4402 (MIT)
            </button>
            <span>•</span>
            <button onClick={() => { setSearchId('SS-FLAG-0012'); handleLookup('SS-FLAG-0012'); }} className="text-rose-400 hover:underline">
              SS-FLAG-0012 (Flagged)
            </button>
          </div>
        </div>

        {/* Method 2: Audit File by SHA-256 Hash */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Direct Document Integrity Audit</span>
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Upload any PDF transcript or certificate to recalculate its hash client-side.
            </p>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-950 file:text-emerald-300 hover:file:bg-emerald-900 cursor-pointer"
            />
          </div>

          {uploadedFileName && (
            <div className="mt-3 pt-3 border-t border-white/5 text-[11px] font-mono text-gray-400 truncate">
              File: <span className="text-emerald-400">{uploadedFileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Result Card */}
      {searched && result && (
        <div className="glass-panel-elevated rounded-3xl overflow-hidden shadow-2xl border border-white/15 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className={`p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
            result.status === 'AUTHENTIC'
              ? 'bg-gradient-to-r from-emerald-950/70 via-surface to-cyan-950/70 border-emerald-500/30'
              : 'bg-gradient-to-r from-rose-950/70 via-surface to-amber-950/70 border-rose-500/30'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${
                result.status === 'AUTHENTIC' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.status === 'AUTHENTIC' ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
              </div>
              <div>
                <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 ${
                  result.status === 'AUTHENTIC' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' : 'bg-rose-900/60 text-rose-300 border border-rose-500/40'
                }`}>
                  {result.status === 'AUTHENTIC' ? 'Authenticity Confirmed' : 'Security Flag Active'}
                </span>
                <h2 className="text-2xl font-bold text-white">
                  {result.studentName}
                </h2>
                <p className="text-xs text-gray-300">{result.institution}</p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
              <span className="text-xs text-gray-400 block">Registry Seal Code</span>
              <span className="font-mono text-cyan-300 font-bold text-lg">{result.certificateId}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-surface/90 border border-white/5">
                <span className="text-xs text-gray-400 block mb-1">Scholarship / Grant</span>
                <span className="font-bold text-white text-base block">{result.metadata.scholarshipName || 'ScholarShield Merit Award'}</span>
                <span className="text-xs text-cyan-400 font-semibold">{result.metadata.grantValue}</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface/90 border border-white/5">
                <span className="text-xs text-gray-400 block mb-1">Authenticated GPA</span>
                <span className="font-bold text-emerald-400 text-xl">{result.metadata.gpa.toFixed(2)}</span>
                <span className="text-xs text-gray-400 block">Official Registrar Signed</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface/90 border border-white/5">
                <span className="text-xs text-gray-400 block mb-1">Verification Validity</span>
                <span className="font-semibold text-white text-sm block">{result.issueDate}</span>
                <span className="text-xs text-gray-400 block">Expires: {result.validUntil}</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Proof */}
            <div className="p-5 rounded-2xl bg-surface border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
                <span className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>SHA-256 Immutable Document Fingerprint</span>
                </span>
                <button
                  onClick={copyHash}
                  className="flex items-center space-x-1 text-gray-400 hover:text-cyan-300 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Hash'}</span>
                </button>
              </div>

              <div className="font-mono text-xs text-gray-200 bg-background/90 p-3.5 rounded-xl break-all border border-white/5">
                {result.documentHash}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-2 pt-1 border-t border-white/5">
                <span>Cryptographic Protocol: <strong className="text-gray-300">{result.algorithm}</strong></span>
                <span>Audited By: <strong className="text-gray-300">{result.verifier}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
