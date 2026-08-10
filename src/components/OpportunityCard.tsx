'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  Zap,
  Bookmark,
  BookmarkCheck,
  Eye,
  Check,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { LeaveOpportunity } from '../types/holiday';
import { useLeaveStore } from '../store/useLeaveStore';

interface OpportunityCardProps {
  opportunity: LeaveOpportunity;
  isSelected: boolean;
  onSelect: () => void;
}

export default function OpportunityCard({
  opportunity,
  isSelected,
  onSelect,
}: OpportunityCardProps) {
  const { pinnedOpportunities, togglePinOpportunity } = useLeaveStore();
  const [copied, setCopied] = useState(false);

  const isPinned = pinnedOpportunities.includes(opportunity.id);

  const formattedStart = format(parseISO(opportunity.startDate), 'd MMMM yyyy (EEEE)', { locale: tr });
  const formattedEnd = format(parseISO(opportunity.endDate), 'd MMMM yyyy (EEEE)', { locale: tr });

  const formattedLeaveDates = opportunity.leaveDates.map((d) =>
    format(parseISO(d), 'd MMMM (EEE)', { locale: tr })
  );

  const handleCopySchedule = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `🎉 İzin Planım:\n📅 Tatil Aralığı: ${formattedStart} - ${formattedEnd} (${opportunity.totalOffDays} Gün Kesintisiz)\n🏖️ Alınacak İzin Tarihleri: ${formattedLeaveDates.join(', ')} (${opportunity.leaveDaysRequired} gün izin)\n⚡ Verimlilik Skoru: ${opportunity.efficiencyScore}x\n(Hesaplı İzin PWA ile oluşturuldu)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onSelect}
      className={`relative group rounded-3xl p-6 transition-all duration-300 cursor-pointer border ${
        isSelected
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/80 border-sky-500/80 shadow-2xl ring-2 ring-sky-500/30 -translate-y-1'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 shadow-lg hover:-translate-y-0.5'
      }`}
    >
      {/* Top Banner Row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Efficiency score badge */}
            <span className="px-3 py-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-md shadow-sky-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              {opportunity.efficiencyScore}x Verimlilik
            </span>

            {/* Half day highlight */}
            {opportunity.halfDaysCount > 0 && (
              <span className="px-2.5 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-700/60 text-xs font-semibold rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                {opportunity.halfDaysCount} Arefe (0.5 Gün)
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
            {opportunity.title}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePinOpportunity(opportunity.id);
            }}
            className={`p-2 rounded-xl border transition-all ${
              isPinned
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white'
            }`}
            title={isPinned ? 'Planı Kaldır' : 'Planı Kaydet'}
          >
            {isPinned ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopySchedule}
            className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white transition-all"
            title="Planı Kopyala"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Key Numbers Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">
              Kesintisiz Tatil
            </span>
            <span className="text-lg font-extrabold text-emerald-400">
              {opportunity.totalOffDays} GÜN
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-800/50 flex items-center justify-center text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">
              Harcanacak İzin
            </span>
            <span className="text-lg font-extrabold text-sky-300">
              {opportunity.leaveDaysRequired} GÜN
            </span>
          </div>
        </div>
      </div>

      {/* Holidays Included Pills */}
      {opportunity.holidaysIncluded.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400">Bayramlar:</span>
          {opportunity.holidaysIncluded.map((h, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-0.5 bg-rose-950/40 text-rose-300 border border-rose-800/50 rounded-lg font-medium"
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Leave Dates breakdown */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-slate-400 block mb-1.5">
          Alınması Gereken İzin Günleri:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {formattedLeaveDates.map((dateStr, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-slate-800 text-sky-200 text-xs rounded-lg font-mono border border-slate-700/80"
            >
              {dateStr}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Reason & Select CTA */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <p className="text-xs text-slate-300 font-medium italic truncate max-w-[70%]">
          {opportunity.scoreReason}
        </p>

        <button
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
            isSelected
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isSelected ? 'Takvimde İnceleniyor' : 'Takvimde Gör'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
