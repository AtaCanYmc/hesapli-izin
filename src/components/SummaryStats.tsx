'use client';

import { LeaveOpportunity } from '../types/holiday';
import { Sparkles, Calendar, Award, CheckCircle2 } from 'lucide-react';

interface SummaryStatsProps {
  opportunities: LeaveOpportunity[];
  leaveBudget: number;
}

export default function SummaryStats({ opportunities, leaveBudget }: SummaryStatsProps) {
  if (opportunities.length === 0) return null;

  const topOpp = opportunities[0];
  const maxOffDays = opportunities.reduce((acc, curr) => Math.max(acc, curr.totalOffDays), 0);
  const avgEfficiency = (
    opportunities.reduce((acc, curr) => acc + curr.efficiencyScore, 0) / opportunities.length
  ).toFixed(1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1 */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="p-3 bg-sky-100 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-xl text-sky-600 dark:text-sky-400">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            En Yüksek ROI
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{topOpp.efficiencyScore}x</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Kat Tatil</span>
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Max Kesintisiz Blok
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{maxOffDays}</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Gün Kesintisiz</span>
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="p-3 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Bulunan Fırsatlar
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{opportunities.length}</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Farklı Paket</span>
          </div>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-sm dark:shadow-lg transition-colors duration-300">
        <div className="p-3 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Ortalama Verimlilik
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{avgEfficiency}x</span>
            <span className="text-xs text-purple-600 dark:text-purple-300 font-medium">Kaldıraç</span>
          </div>
        </div>
      </div>
    </div>
  );
}
