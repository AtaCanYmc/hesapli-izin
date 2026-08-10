'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Trash2,
  Share2,
  Download,
  Printer,
  ShoppingBag,
  Plus,
  MessageCircle,
} from 'lucide-react';
import { useLeaveStore } from '../store/useLeaveStore';
import { downloadIcsFile, triggerPdfPrint, shareOpportunityWhatsApp } from '../lib/exportUtils';

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
    <section className="bg-gradient-to-br from-sky-900/40 via-slate-900 to-indigo-950/50 border-2 border-sky-500/60 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl mb-6 sm:mb-8 space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sky-800/40 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20 shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                Yıllık İzin Kombinasyon Sepetim ({selectedPackages.length})
              </h2>
              <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-emerald-500 text-slate-950 rounded-full">
                Kilitli Plan
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-sky-200">
              Seçilen paketleriniz kilitlendi. Kalan bütçenizle <strong>Blok İzinler</strong> hesaplandı!
            </p>
          </div>
        </div>

        <button
          onClick={clearPlan}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700/60 transition-all text-xs font-bold flex items-center gap-1.5 self-end sm:self-center shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-sky-800/50">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase block truncate">
            Kazanılan Tatil
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400">{totalOffDays} GÜN</span>
        </div>

        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase block truncate">
            Harcanan İzin
          </span>
          <span className="text-xl sm:text-2xl font-black text-sky-300">{totalUsedLeave} GÜN</span>
        </div>

        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase block truncate">
            Kalan Bütçe
          </span>
          <span className={`text-xl sm:text-2xl font-black ${remainingBudget > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
            {remainingBudget} GÜN
          </span>
        </div>

        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase block truncate">
            Kombine ROI
          </span>
          <span className="text-xl sm:text-2xl font-black text-purple-400">{combinedEfficiency}x</span>
        </div>
      </div>

      {/* List of Added Packages */}
      <div className="space-y-2.5">
        <h3 className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider">
          Sepetteki İzin Paketleriniz:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {selectedPackages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-sky-700/50 flex items-start justify-between gap-2.5 shadow-md"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1 truncate">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-sky-500 text-slate-950 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-white truncate">{pkg.title}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-sky-200 font-medium">
                  {pkg.totalOffDays} Gün Tatil / {pkg.leaveDaysRequired} Gün İzin ({pkg.efficiencyScore}x)
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {pkg.leaveDates.map((d, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-slate-800 text-sky-300 text-[10px] rounded font-mono"
                    >
                      {format(parseISO(d), 'd MMM', { locale: tr })}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => removePackageFromPlan(pkg.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all shrink-0"
                title="Paketi Sepetten Çıkar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Share Bar */}
      <div className="pt-2 border-t border-sky-800/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <p className="text-[11px] sm:text-xs text-sky-200 font-medium italic">
          💡 Bütçeniz dolana kadar yeni blok tatil paketleri ekleyebilirsiniz.
        </p>

        <button
          onClick={handleShareAllWhatsApp}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Kombinasyonlu Planı WhatsApp'ta Paylaş</span>
        </button>
      </div>
    </section>
  );
}
