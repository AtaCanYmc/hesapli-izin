'use client';

import { Award, Sparkles, Calendar, CheckCircle } from 'lucide-react';
import { LeaveOpportunity } from '../types/holiday';

interface SummaryStatsProps {
  opportunities: LeaveOpportunity[];
  leaveBudget: number;
}

export default function SummaryStats({ opportunities, leaveBudget }: SummaryStatsProps) {
  if (opportunities.length === 0) return null;

  const maxRoi = Math.max(...opportunities.map((o) => o.efficiencyScore));
  const maxOffDays = Math.max(...opportunities.map((o) => o.totalOffDays));
  const avgEfficiency = Number(
    (opportunities.reduce((acc, curr) => acc + curr.efficiencyScore, 0) / opportunities.length).toFixed(1)
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {/* Stat 1: Max ROI */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3 sm:space-x-4 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="p-2.5 sm:p-3 bg-sky-100 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-xl text-sky-600 dark:text-sky-400 shrink-0">
          <Award className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            En Yüksek ROI
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{maxRoi}x</span>
            <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium hidden xs:inline">Kat Tatil</span>
          </div>
        </div>
      </div>

      {/* Stat 2: Max Block */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3 sm:space-x-4 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="p-2.5 sm:p-3 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            Max Blok Tatil
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{maxOffDays}</span>
            <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium hidden xs:inline">Gün Kesintisiz</span>
          </div>
        </div>
      </div>

      {/* Stat 3: Opportunities Found */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3 sm:space-x-4 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="p-2.5 sm:p-3 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            Fırsat Sayısı
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {opportunities.length}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium hidden xs:inline">Farklı Paket</span>
          </div>
        </div>
      </div>

      {/* Stat 4: Average ROI */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3 sm:space-x-4 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="p-2.5 sm:p-3 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            Ort. Verimlilik
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {avgEfficiency}x
            </span>
            <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-300 font-medium hidden xs:inline">Kaldıraç</span>
          </div>
        </div>
      </div>
    </div>
  );
}
