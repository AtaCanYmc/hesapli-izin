'use client';

import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Trash2,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';
import { useLeaveStore } from '../store/useLeaveStore';

export default function AnnualPlanCart() {
  const {
    leaveBudget,
    selectedYear,
    selectedPackages,
    removePackageFromPlan,
    clearPlan,
  } = useLeaveStore();

  if (selectedPackages.length === 0) return null;

  const totalUsedLeave = selectedPackages.reduce((acc, curr) => acc + curr.leaveDaysRequired, 0);
  const totalOffDays = selectedPackages.reduce((acc, curr) => acc + curr.totalOffDays, 0);
  const remainingBudget = Math.max(0, leaveBudget - totalUsedLeave);

  const combinedEfficiency = Number((totalOffDays / totalUsedLeave).toFixed(2));

  const handleShareAllWhatsApp = () => {
    const lines = selectedPackages.map(
      (p, i) =>
        `📌 ${i + 1}. Paket: ${p.title} (${p.totalOffDays} Gün Tatil / ${p.leaveDaysRequired} Gün İzin)`
    );

    const text = `🎉 ${selectedYear} Yıllık İzin Kombinasyon Planım:\n\n${lines.join('\n')}\n\n🏆 Toplam Tatil: ${totalOffDays} Gün Kesintisiz\n⏱️ Toplam Harcanan İzin: ${totalUsedLeave} Gün\n⚡ Toplam Verimlilik Skoru: ${combinedEfficiency}x Kaldıraç\n\nHesaplı İzin PWA ile hesaplandı.`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 mb-6 space-y-5 shadow-sm transition-colors animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                İzin Kombinasyon Sepeti ({selectedPackages.length})
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded">
                Kilitli Plan
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Seçilen paketler kilitlendi. Kalan bütçeniz için otomatik <strong>blok izinler</strong> hesaplanır.
            </p>
          </div>
        </div>

        <button
          onClick={clearPlan}
          className="px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-500/10 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 border border-zinc-200 dark:border-zinc-700/60 transition-colors text-xs font-medium flex items-center gap-1.5 self-end sm:self-center shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-md border border-zinc-200 dark:border-zinc-800/80">
        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-500 block truncate">
            Kazanılan Tatil
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{totalOffDays} GÜN</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-500 block truncate">
            Harcanan İzin
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{totalUsedLeave} GÜN</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-500 block truncate">
            Kalan Bütçe
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{remainingBudget} GÜN</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-500 block truncate">
            Kombine ROI
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{combinedEfficiency}x</span>
        </div>
      </div>

      {/* List of Added Packages */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
          Sepetteki İzin Paketleri:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {selectedPackages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className="p-3 rounded-md bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1 truncate">
                  <span className="w-4 h-4 rounded bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">{pkg.title}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {pkg.totalOffDays} Gün Tatil / {pkg.leaveDaysRequired} Gün İzin ({pkg.efficiencyScore}x)
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {pkg.leaveDates.map((d, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono rounded"
                    >
                      {format(parseISO(d), 'd MMM', { locale: tr })}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => removePackageFromPlan(pkg.id)}
                className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors shrink-0"
                title="Paketi Sepetten Çıkar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Share Bar */}
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal italic">
          💡 Bütçeniz dolana kadar yeni blok tatil paketleri ekleyebilirsiniz.
        </p>

        <button
          onClick={handleShareAllWhatsApp}
          className="w-full sm:w-auto px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-900 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Kombinasyonlu Planı WhatsApp'ta Paylaş</span>
        </button>
      </div>
    </section>
  );
}
