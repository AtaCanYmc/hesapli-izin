'use client';

import { TrendingUp, Calendar, Zap, Layers } from 'lucide-react';
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Stat 1: Max ROI */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
            En Yüksek ROI
          </span>
          <TrendingUp className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{maxRoi}x</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">kat tatil</span>
        </div>
      </div>

      {/* Stat 2: Max Block */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
            Max Blok Tatil
          </span>
          <Layers className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{maxOffDays}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">gün kesintisiz</span>
        </div>
      </div>

      {/* Stat 3: Opportunities Found */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
            Fırsat Sayısı
          </span>
          <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {opportunities.length}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">paket seçeneği</span>
        </div>
      </div>

      {/* Stat 4: Average ROI */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
            Ort. Verimlilik
          </span>
          <Zap className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {avgEfficiency}x
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">kaldıraç oranı</span>
        </div>
      </div>
    </div>
  );
}
