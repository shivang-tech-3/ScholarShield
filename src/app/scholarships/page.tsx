'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, CheckCircle2, GraduationCap, X } from 'lucide-react';
import ScholarshipCard from '@/components/ScholarshipCard';
import { getStoredScholarships } from '@/lib/store';
import { Scholarship, ScholarshipCategory } from '@/types';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [studentGpa, setStudentGpa] = useState<number>(3.5);
  const [maxIncome, setMaxIncome] = useState<number>(100000);
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);

  useEffect(() => {
    setScholarships(getStoredScholarships());
  }, []);

  const categories: ('ALL' | ScholarshipCategory)[] = [
    'ALL',
    'STEM',
    'Women in Tech',
    'Need-Based',
    'Merit',
    'Global',
  ];

  const filtered = scholarships.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.targetFields.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;

    if (onlyEligible) {
      const gpaEligible = studentGpa >= s.minGpa;
      const incomeEligible = s.maxAnnualIncome ? maxIncome <= s.maxAnnualIncome : true;
      return matchesSearch && matchesCategory && gpaEligible && incomeEligible;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
          Scholarship Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Explore Verified Educational Grants & Fellowships
        </h1>
        <p className="mt-2 text-gray-400 text-sm max-w-2xl">
          All programs listed below are cryptographically anchored and backed by verified institutional sponsors.
        </p>
      </div>

      {/* Filter and Matcher Panel */}
      <div className="glass-panel rounded-2xl p-6 mb-8 border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by grant name, AI, Computer Science, Stanford, Biology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface/90 rounded-xl text-sm text-white placeholder-gray-400 border border-gray-700 focus:border-indigo-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Eligibility Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface/90 border border-gray-700">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-gray-200">Only Show Matching</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-xs text-gray-400 font-medium mr-2 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                  : 'bg-surface text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live GPA & Income Calculator Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-gray-300 mb-2">
              <span>Your Cumulative GPA Target</span>
              <span className="text-cyan-400 font-bold">{studentGpa.toFixed(2)} / 4.00</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="4.0"
              step="0.05"
              value={studentGpa}
              onChange={(e) => setStudentGpa(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-gray-300 mb-2">
              <span>Annual Household Income Limit</span>
              <span className="text-emerald-400 font-bold">${maxIncome.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={maxIncome}
              onChange={(e) => setMaxIncome(parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
        <p>Showing <span className="font-bold text-white">{filtered.length}</span> scholarship opportunities</p>
        <span className="text-xs text-indigo-400 font-mono">100% Cryptographically Verified</span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} studentGpa={studentGpa} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl border border-white/5">
          <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No scholarships match the selected filters</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
            Try lowering your GPA filter, increasing the household income ceiling, or selecting 'ALL' categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setOnlyEligible(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
