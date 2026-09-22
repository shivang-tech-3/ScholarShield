'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, GraduationCap, Search, CheckCircle2, UserCheck, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/scholarships', label: 'Explore Grants' },
    { href: '/verify', label: 'Verify Credential' },
    { href: '/student', label: 'Student Portal' },
    { href: '/admin', label: 'Reviewer Shield' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-primary-500 to-cyan-400 p-0.5 shadow-lg group-hover:glow-indigo transition-all">
            <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              ScholarShield
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              Verified v2.4
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Quick CTA */}
        <div className="flex items-center space-x-3">
          <Link
            href="/apply"
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-md hover:shadow-indigo-500/25 transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Apply Now</span>
          </Link>
          <Link
            href="/verify"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-surface-elevated border border-gray-700 hover:border-cyan-500/50 text-gray-200 hover:text-cyan-300 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Audit Lookup</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
