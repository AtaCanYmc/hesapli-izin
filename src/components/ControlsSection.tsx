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
}[] = [
  {
    id: 'max-roi',
    name: 'Maksimum Verimlilik (ROI)',
    shortDesc: 'Minimum izin harcayarak en yüksek tatil oranını yakalar.',
    badge: 'Yüksek Oran',
    icon: TrendingUp,
  },
  {
    id: 'long-block',
    name: 'Uzun Blok Tatiller',
    shortDesc: 'İzinleri bölmeden 9-10 günlük kesintisiz tatiller oluşturur.',
    badge: 'Uzun Tatil',
    icon: CalendarDays,
  },
  {
    id: 'arefe-focused',
    name: 'Arefe & Yarım Gün Odaklı',
    shortDesc: '0.5 günlük Arefe izinlerini (28 Ekim & Bayram) önceliklendirir.',
    badge: '0.5 Gün',
    icon: Zap,
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
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 mb-6 space-y-6 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Budget Input & Slider */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                1. Yıllık İzin Bütçeniz
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {selectedYear} yılında harcamak istediğiniz izin günü sayısı.
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700 shrink-0">
              {leaveBudget} <span className="text-xs font-sans text-zinc-500 font-normal">GÜN</span>
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
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100 transition-all"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 font-medium px-0.5">
              <span>1G</span>
              <span>10G</span>
              <span>20G</span>
              <span>25G</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
              Hızlı Seçenekler
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_BUDGETS.map((budget) => (
                <button
                  key={budget}
                  onClick={() => setLeaveBudget(budget)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    leaveBudget === budget
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-semibold'
                      : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60'
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
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              2. Optimizasyon Stratejisi
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              İzinlerinizi hangi önceliğe göre birleştirmek istersiniz?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ALGORITHM_OPTIONS.map((algo) => {
              const Icon = algo.icon;
              const isSelected = algorithmMode === algo.id;

              return (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithmMode(algo.id)}
                  className={`p-3 rounded-md text-left transition-colors flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-zinc-50 dark:bg-zinc-800/80 border-zinc-900 dark:border-zinc-100'
                      : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                          isSelected
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {algo.badge}
                      </span>
                    </div>

                    <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 mb-1">{algo.name}</h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {algo.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Special Rules & Custom Holidays */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Rule 1: Friday Penalty */}
        <div className="flex items-start justify-between gap-2.5 bg-zinc-50 dark:bg-zinc-950/40 p-3 rounded-md border border-zinc-200 dark:border-zinc-800/60">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Cuma İzni 2 Gün Sayılsın
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
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
            <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
          </label>
        </div>

        {/* Rule 2: Minimum Block Leave Requirement */}
        <div className="flex flex-col justify-between gap-2 bg-zinc-50 dark:bg-zinc-950/40 p-3 rounded-md border border-zinc-200 dark:border-zinc-800/60">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start space-x-2.5">
              <Layers className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Min. Blok İzin Şartı
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
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
              <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
            </label>
          </div>

          {minBlockEnabled && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-1">
              <span className="text-[11px] font-mono text-zinc-500">Hedef:</span>
              <div className="flex gap-1">
                {MIN_BLOCK_OPTIONS.map((days) => (
                  <button
                    key={days}
                    onClick={() => setMinBlockDays(days)}
                    className={`px-2 py-0.5 text-[11px] font-mono font-medium rounded transition-colors ${
                      minBlockDays === days
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {days}G
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature 3: Custom & Administrative Holiday Creator */}
        <div className="flex flex-col justify-between p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-md border border-zinc-200 dark:border-zinc-800/60">
          <div className="flex items-start space-x-2.5">
            <Building2 className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                Özel / İdari Tatil
                {currentYearCustomCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded">
                    {currentYearCustomCount} Ekli
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Şirket veya idari izin günlerinizi ekleyip hesaplayın.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2.5 w-full py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-900 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Özel Tatil Yönetimi</span>
          </button>
        </div>

      </div>

      {/* Modal */}
      <CustomHolidayModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
