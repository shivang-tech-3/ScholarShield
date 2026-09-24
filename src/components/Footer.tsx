import Link from 'next/link';
import { ShieldCheck, Lock, Award, HeartHandshake, Github, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface/80 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <span className="font-bold text-lg text-white">ScholarShield</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Cryptographic academic credential authenticity, tamper-proof scholarship escrow, and AI-driven anti-fraud protection for universities and sponsors.
            </p>
            <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>All Verification Nodes Operational</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/scholarships" className="hover:text-indigo-300 transition">Scholarship Directory</Link></li>
              <li><Link href="/apply" className="hover:text-indigo-300 transition">Interactive Application Hub</Link></li>
              <li><Link href="/verify" className="hover:text-indigo-300 transition">SHA-256 Public Validator</Link></li>
              <li><Link href="/admin" className="hover:text-indigo-300 transition">Fraud Sentinel AI</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Security & Compliance
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-1.5"><Lock className="w-3.5 h-3.5 text-indigo-400" /> <span>Zero-Knowledge Proofs</span></li>
              <li className="flex items-center space-x-1.5"><Award className="w-3.5 h-3.5 text-cyan-400" /> <span>Registrar Signatures</span></li>
              <li className="flex items-center space-x-1.5"><HeartHandshake className="w-3.5 h-3.5 text-emerald-400" /> <span>Automated Escrow</span></li>
              <li className="flex items-center space-x-1.5"><Terminal className="w-3.5 h-3.5 text-purple-400" /> <span>Audited Smart Dispatch</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Repository & Code
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Open platform for verified academic credential validation and grant integrity.
            </p>
            <div className="flex flex-col space-y-2">
              <a
                href="https://github.com/shivang-tech-3/ScholarShield"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-surface-elevated border border-gray-700 hover:border-gray-500 text-sm text-gray-200 hover:text-white transition"
              >
                <Github className="w-4 h-4" />
                <span>shivang-tech-3 / ScholarShield</span>
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSerHDaXIGBi-GWtshZHQfT8IjTk61yqO9eX0iXVmuiLZLrRPg/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/40 hover:border-indigo-400 text-sm text-indigo-300 hover:text-white transition"
              >
                <span>💬 Give User Feedback</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ScholarShield Ecosystem. All cryptographic rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>SHA-256 Tamper-Proof</span>
            <span>•</span>
            <span>Ed25519 Signatures</span>
            <span>•</span>
            <span>Strict Anti-Fraud</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
