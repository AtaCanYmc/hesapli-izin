'use client';

import { useState } from 'react';
import { TrendingUp, CalendarDays, Zap, AlertTriangle, Layers, Building2, Plus } from 'lucide-react';
import { useLeaveStore } from '../store/useLeaveStore';
import { OptimizationMode } from '../types/holiday';
import CustomHolidayModal from './CustomHolidayModal';

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
    shortDesc: 'Minimum izin harcayarak en yüksek tatil oranını yakalar.',
    badge: 'Yüksek Oran',
    icon: TrendingUp,
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'long-block',
    name: 'Uzun Blok Tatiller',
    shortDesc: 'İzinleri bölmeden 9-10 günlük kesintisiz tatiller oluşturur.',
    badge: 'Uzun Tatil',
    icon: CalendarDays,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'arefe-focused',
    name: 'Arefe & Yarım Gün Odaklı',
    shortDesc: '0.5 günlük Arefe izinlerini (28 Ekim & Bayram) önceliklendirir.',
    badge: '0.5 Gün',
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
    customHolidays,
  } = useLeaveStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentYearCustomCount = customHolidays.filter((h) => h.date.startsWith(`${selectedYear}`)).length;

  return (
    <section className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-7 shadow-xl dark:shadow-2xl backdrop-blur-xl mb-6 sm:mb-8 space-y-6 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Budget Input & Slider */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                1. Yıllık İzin Bütçeniz
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedYear} yılında harcamak istediğiniz izin günü sayısı.
              </p>
            </div>
            <span className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-3 py-1 rounded-2xl border border-sky-200 dark:border-sky-800/80 shrink-0">
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
            <div className="flex justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-500 font-medium px-1">
              <span>1 Gün</span>
              <span>10 Gün</span>
              <span>20 Gün</span>
              <span>25 Gün</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Hızlı Seçenekler
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {PRESET_BUDGETS.map((budget) => (
                <button
                  key={budget}
                  onClick={() => setLeaveBudget(budget)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              2. Optimizasyon Stratejisi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              İzinlerinizi hangi önceliğe göre birleştirmek istersiniz?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {ALGORITHM_OPTIONS.map((algo) => {
              const Icon = algo.icon;
              const isSelected = algorithmMode === algo.id;

              return (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithmMode(algo.id)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-sky-50/50 dark:bg-slate-800/90 border-sky-500 dark:border-sky-500/80 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20'
                      : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br ${algo.color} flex items-center justify-center text-white shadow-sm shrink-0`}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">{algo.name}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {algo.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Special Corporate Rules & Custom Holidays Section */}
      <div className="pt-4 sm:pt-5 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Rule 1: Friday Penalty */}
        <div className="flex items-start justify-between gap-2.5 bg-slate-50 dark:bg-slate-950/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
          <div className="flex items-start space-x-2.5">
            <div className="p-2 sm:p-2.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 rounded-xl text-amber-700 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Cuma İzni 2 Gün Sayılsın
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cuma izinlerinde Hafta Sonu da kotadan düşer (2x maliyet).
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={includeFridayPenalty}
              onChange={toggleFridayPenalty}
              className="sr-only peer"
            />
            <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Rule 2: Minimum Block Leave Requirement */}
        <div className="flex flex-col justify-between gap-2.5 bg-slate-50 dark:bg-slate-950/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start space-x-2.5">
              <div className="p-2 sm:p-2.5 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Min. Blok İzin Şartı
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  İznin bir parçası en az {minBlockDays} gün kesintisiz olmalıdır.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={minBlockEnabled}
                onChange={toggleMinBlockEnabled}
                className="sr-only peer"
              />
              <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {minBlockEnabled && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">Hedef Blok:</span>
              <div className="flex gap-1 flex-wrap">
                {MIN_BLOCK_OPTIONS.map((days) => (
                  <button
                    key={days}
                    onClick={() => setMinBlockDays(days)}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${
                      minBlockDays === days
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {days} G
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature 3: Custom & Administrative Holiday Creator */}
        <div className="flex flex-col justify-between p-3.5 sm:p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-200 dark:border-purple-800/40">
          <div className="flex items-start space-x-2.5">
            <div className="p-2 sm:p-2.5 bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700/60 rounded-xl text-purple-700 dark:text-purple-300 shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                Özel / İdari Tatil Ekle
                {currentYearCustomCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-extrabold bg-purple-600 text-white rounded-full">
                    {currentYearCustomCount} Ekli
                  </span>
                )}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Şirket izni veya idari izin günlerinizi ekleyip hesaplayın.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2.5 w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Özel Tatil Yönetimi</span>
          </button>
        </div>

      </div>

      {/* Modal */}
      <CustomHolidayModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
