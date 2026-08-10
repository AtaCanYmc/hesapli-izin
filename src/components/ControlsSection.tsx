'use client';

import { TrendingUp, CalendarDays, Zap, AlertTriangle, Layers } from 'lucide-react';
import { useLeaveStore } from '../store/useLeaveStore';
import { OptimizationMode } from '../types/holiday';

const ALGORITHM_OPTIONS: {
  id: OptimizationMode;
  name: string;
  shortDesc: string;
  badge: string;
  icon: any;
  color: string;
}[] = [
  {
    id: 'max-roi',
    name: 'Maksimum Verimlilik (ROI)',
    shortDesc: 'Minimum izin harcayarak en yüksek tatil oranını (Verimlilik Skoru) yakalar.',
    badge: 'Yüksek Oran',
    icon: TrendingUp,
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'long-block',
    name: 'Uzun Blok Tatiller',
    shortDesc: 'İzinleri bölmeden tek/çift hamlede 9-10 günlük kesintisiz tatiller oluşturur.',
    badge: 'Uzun Tatil',
    icon: CalendarDays,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'arefe-focused',
    name: 'Arefe & Yarım Gün Odaklı',
    shortDesc: 'Türkiye’deki 0.5 günlük Arefe izinlerini (28 Ekim & Bayram Arefeleri) önceliklendirir.',
    badge: '0.5 Gün Fırsatı',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
  },
];

const PRESET_BUDGETS = [3, 5, 8, 10, 14];
const MIN_BLOCK_OPTIONS = [5, 7, 9, 10, 14];

export default function ControlsSection() {
  const {
    leaveBudget,
    setLeaveBudget,
    algorithmMode,
    setAlgorithmMode,
    selectedYear,
    includeFridayPenalty,
    toggleFridayPenalty,
    minBlockEnabled,
    toggleMinBlockEnabled,
    minBlockDays,
    setMinBlockDays,
  } = useLeaveStore();

  return (
    <section className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl dark:shadow-2xl backdrop-blur-xl mb-8 space-y-6 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Budget Input & Slider */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                1. Yıllık İzin Bütçeniz
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedYear} yılında harcamak istediğiniz izin günü sayısı.
              </p>
            </div>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-3.5 py-1 rounded-2xl border border-sky-200 dark:border-sky-800/80">
              {leaveBudget} <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">GÜN</span>
            </span>
          </div>

          {/* Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={leaveBudget}
              onChange={(e) => setLeaveBudget(parseFloat(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 font-medium px-1">
              <span>1 Gün</span>
              <span>10 Gün</span>
              <span>20 Gün</span>
              <span>25 Gün</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Hızlı Seçenekler
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_BUDGETS.map((budget) => (
                <button
                  key={budget}
                  onClick={() => setLeaveBudget(budget)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    leaveBudget === budget
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  {budget} Gün
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Algorithm Selector Tabs */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              2. Optimizasyon Stratejisi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              İzinlerinizi hangi önceliğe göre birleştirmek istersiniz?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ALGORITHM_OPTIONS.map((algo) => {
              const Icon = algo.icon;
              const isSelected = algorithmMode === algo.id;

              return (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithmMode(algo.id)}
                  className={`relative p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-sky-50/50 dark:bg-slate-800/90 border-sky-500 dark:border-sky-500/80 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20'
                      : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${algo.color} flex items-center justify-center text-white shadow-sm`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {algo.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{algo.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {algo.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Special Corporate Rules Section */}
      <div className="pt-5 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Rule 1: Friday Penalty */}
        <div className="flex items-start justify-between gap-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 rounded-xl text-amber-700 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cuma İzni 2 Gün Sayılsın
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cuma izinlerinde Hafta Sonu da kotadan düşer (2x maliyet).
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={includeFridayPenalty}
              onChange={toggleFridayPenalty}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Rule 2: Minimum Block Leave Requirement */}
        <div className="flex flex-col justify-between gap-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Min. Blok İzin Şartı
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    İş Kanunu m.56
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  İznin bir parçası en az {minBlockDays} gün kesintisiz blok olmalıdır.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={minBlockEnabled}
                onChange={toggleMinBlockEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Sub-selector for min block days */}
          {minBlockEnabled && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Min. Kesintisiz Tatil:</span>
              <div className="flex gap-1.5">
                {MIN_BLOCK_OPTIONS.map((days) => (
                  <button
                    key={days}
                    onClick={() => setMinBlockDays(days)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      minBlockDays === days
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {days} Gün
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
