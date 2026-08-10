'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  Zap,
  Bookmark,
  BookmarkCheck,
  Eye,
  Check,
  Copy,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Download,
  Printer,
  Share2,
  MessageCircle,
  PlusCircle,
} from 'lucide-react';
import { LeaveOpportunity } from '../types/holiday';
import { useLeaveStore } from '../store/useLeaveStore';
import {
  downloadIcsFile,
  triggerPdfPrint,
  shareOpportunityWhatsApp,
  shareOpportunityNative,
} from '../lib/exportUtils';
import BlockLeaveWarningModal from './BlockLeaveWarningModal';

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
  const {
    pinnedOpportunities,
    togglePinOpportunity,
    minBlockEnabled,
    selectedPackages,
    addPackageToPlan,
    removePackageFromPlan,
  } = useLeaveStore();

  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const isPinned = pinnedOpportunities.includes(opportunity.id);
  const isAddedToCart = selectedPackages.some((p) => p.id === opportunity.id);

  const formattedStart = format(parseISO(opportunity.startDate), 'd MMMM yyyy (EEEE)', { locale: tr });
  const formattedEnd = format(parseISO(opportunity.endDate), 'd MMMM yyyy (EEEE)', { locale: tr });

  const formattedLeaveDates = opportunity.leaveDates.map((d) =>
    format(parseISO(d), 'd MMMM (EEE)', { locale: tr })
  );

  const handleToggleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAddedToCart) {
      removePackageFromPlan(opportunity.id);
    } else {
      const isShortNonBlockPackage = opportunity.totalOffDays < 7;
      if (selectedPackages.length === 0 && isShortNonBlockPackage) {
        setShowWarningModal(true);
      } else {
        addPackageToPlan(opportunity);
      }
    }
  };

  const handleConfirmAddAnyway = () => {
    addPackageToPlan(opportunity);
    setShowWarningModal(false);
  };

  const handleCopySchedule = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `🎉 İzin Planım:\n📅 Tatil Aralığı: ${formattedStart} - ${formattedEnd} (${opportunity.totalOffDays} Gün Kesintisiz)\n🏖️ Alınacak İzin Tarihleri: ${formattedLeaveDates.join(', ')} (${opportunity.leaveDaysRequired} gün izin maliyeti${opportunity.hasFridayPenalty ? ' - Cuma 2 gün kuralı dahil' : ''})\n⚡ Verimlilik Skoru: ${opportunity.efficiencyScore}x\n(Hesaplı İzin PWA ile oluşturuldu)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowExportMenu(false);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareOpportunityWhatsApp(opportunity);
    setShowExportMenu(false);
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await shareOpportunityNative(opportunity);
    setShowExportMenu(false);
  };

  const handleDownloadIcs = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadIcsFile(opportunity);
    setShowExportMenu(false);
  };

  const handlePrintPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerPdfPrint(opportunity);
    setShowExportMenu(false);
  };

  return (
    <>
      <div
        onClick={onSelect}
        className={`relative group rounded-3xl p-4 sm:p-6 transition-all duration-300 cursor-pointer border ${
          isAddedToCart
            ? 'bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-sky-950/60 dark:to-slate-900 border-emerald-500 shadow-xl ring-2 ring-emerald-500/30'
            : isSelected
            ? 'bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/80 border-sky-500 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/30 -translate-y-1'
            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/90 shadow-sm hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        {/* Top Banner Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Efficiency score badge */}
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-md shadow-sky-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                {opportunity.efficiencyScore}x Verimlilik
              </span>

              {/* Min Block Requirement Badge */}
              {minBlockEnabled && opportunity.satisfiesMinBlock && (
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-[11px] sm:text-xs font-semibold rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Min. {opportunity.minBlockTarget}G Blok
                </span>
              )}

              {/* Half day highlight */}
              {opportunity.halfDaysCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 text-[11px] sm:text-xs font-semibold rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  {opportunity.halfDaysCount} Arefe (0.5G)
                </span>
              )}

              {/* Friday Penalty Highlight */}
              {opportunity.hasFridayPenalty && (
                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700/60 text-[11px] sm:text-xs font-semibold rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  Cuma (+{opportunity.fridayPenaltyCount})
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors break-words">
              {opportunity.title}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 relative w-full sm:w-auto">
            {/* Add to Annual Plan Button */}
            <button
              onClick={handleToggleCart}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm flex-1 sm:flex-initial ${
                isAddedToCart
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Planınızda Ekli</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Planıma Ekle</span>
                </>
              )}
            </button>

            {/* Share & Download Menu Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExportMenu(!showExportMenu);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                title="Planı Paylaş veya İndir"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute right-0 top-10 z-30 w-52 max-w-[85vw] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-1">
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 rounded-xl flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>WhatsApp'ta Paylaş</span>
                  </button>
                  <button
                    onClick={handleNativeShare}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 rounded-xl flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Sistem Paylaşım Menüsü</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={handleDownloadIcs}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Takvime Ekle (.ics)</span>
                  </button>
                  <button
                    onClick={handlePrintPdf}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>PDF / HR Dilekçe</span>
                  </button>
                  <button
                    onClick={handleCopySchedule}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Metni Kopyala</span>
                  </button>
                </div>
              )}
            </div>

            {/* Pin Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePinOpportunity(opportunity.id);
              }}
              className={`p-2 rounded-xl border transition-all ${
                isPinned
                  ? 'bg-amber-100 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isPinned ? 'Planı Kaldır' : 'Planı Kaydet'}
            >
              {isPinned ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Key Numbers Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3.5 bg-slate-50 dark:bg-slate-950/50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/50">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase truncate">
                Kesintisiz Tatil
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 truncate block">
                {opportunity.totalOffDays} GÜN
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/50 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase truncate">
                İzin Maliyeti
              </span>
              <div className="flex items-baseline space-x-1 truncate">
                <span className="text-base sm:text-lg font-extrabold text-sky-600 dark:text-sky-300">
                  {opportunity.leaveDaysRequired} GÜN
                </span>
                {opportunity.hasFridayPenalty && (
                  <span className="text-[10px] text-slate-400 line-through hidden xs:inline">
                    ({opportunity.baseLeaveDays})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Holidays Included Pills */}
        {opportunity.holidaysIncluded.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1 sm:gap-1.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Bayramlar:</span>
            {opportunity.holidaysIncluded.map((h, i) => (
              <span
                key={i}
                className="text-[11px] sm:text-xs px-2 py-0.5 bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 rounded-lg font-medium"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Leave Dates breakdown */}
        <div className="mb-3.5">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Alınması Gereken İzin Günleri:
          </span>
          <div className="flex flex-wrap gap-1">
            {formattedLeaveDates.map((dateStr, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-200 text-[11px] sm:text-xs rounded-lg font-mono border border-slate-200 dark:border-slate-700/80"
              >
                {dateStr}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Reason & Select CTA */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium italic truncate max-w-full">
            {opportunity.scoreReason}
          </p>

          <button
            className={`w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              isSelected
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-900 dark:group-hover:text-white'
          }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isSelected ? 'Takvimde İnceleniyor' : 'Takvimde Gör'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Warning Modal for empty cart non-block add attempt */}
      <BlockLeaveWarningModal
        isOpen={showWarningModal}
        opportunity={opportunity}
        onClose={() => setShowWarningModal(false)}
        onConfirmAddAnyway={handleConfirmAddAnyway}
      />
    </>
  );
}
