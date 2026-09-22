import Link from 'next/link';
import { Scholarship } from '@/types';
import { Calendar, DollarSign, Award, CheckCircle2, ArrowRight, Users, Sparkles } from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  studentGpa?: number;
}

export default function ScholarshipCard({ scholarship, studentGpa }: ScholarshipCardProps) {
  const isEligible = studentGpa !== undefined ? studentGpa >= scholarship.minGpa : true;

  return (
    <div className={`glass-panel rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between relative group ${
      scholarship.featured ? 'border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-surface/90' : ''
    }`}>
      {scholarship.featured && (
        <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-bold text-[11px] rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-md">
          <Sparkles className="w-3 h-3" />
          <span>Premier Endowment</span>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-gray-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              {scholarship.providerLogo || '🎓'}
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 uppercase tracking-wider">
                {scholarship.category}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mt-1 line-clamp-1">
                {scholarship.title}
              </h3>
            </div>
          </div>
        </div>

        <p className="text-xs text-indigo-300/90 font-medium mb-3">
          By {scholarship.provider}
        </p>

        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 mb-4">
          {scholarship.description}
        </p>

        {/* Criteria & Tags */}
        <div className="grid grid-cols-2 gap-2 mb-4 py-3 border-y border-white/5 text-xs">
          <div>
            <span className="text-gray-400 block text-[11px]">Min GPA</span>
            <span className={`font-semibold ${studentGpa && studentGpa < scholarship.minGpa ? 'text-rose-400' : 'text-emerald-400'}`}>
              {scholarship.minGpa.toFixed(2)}+
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Total Value</span>
            <span className="font-bold text-cyan-300 text-sm">
              ${scholarship.amount.toLocaleString()} {scholarship.currency}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Deadline</span>
            <span className="text-gray-300 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>{scholarship.deadline}</span>
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px]">Available Slots</span>
            <span className="text-gray-300 flex items-center space-x-1">
              <Users className="w-3 h-3 text-cyan-400" />
              <span>{scholarship.totalSlots - scholarship.appliedCount} left of {scholarship.totalSlots}</span>
            </span>
          </div>
        </div>

        {/* Field Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {scholarship.targetFields.slice(0, 3).map((field, idx) => (
            <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-surface-elevated text-gray-300 border border-gray-700">
              {field}
            </span>
          ))}
          {scholarship.targetFields.length > 3 && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-surface-elevated text-gray-400">
              +{scholarship.targetFields.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-1 text-xs text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Shield Verified</span>
        </div>
        <Link
          href={`/apply?scholarshipId=${scholarship.id}`}
          className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md group-hover:shadow-cyan-500/20 transition-all"
        >
          <span>Apply Grant</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
