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
  AlertTriangle,
  ShieldCheck,
  Printer,
  Share2,
  MessageCircle,
  Plus,
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
  isCompact?: boolean;
}

export default function OpportunityCard({
  opportunity,
  isSelected,
  onSelect,
  isCompact = false,
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

  if (isCompact) {
    return (
      <>
        <div
          onClick={onSelect}
          className={`relative group rounded-lg p-3 sm:p-3.5 transition-all duration-150 cursor-pointer border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isAddedToCart
              ? 'bg-zinc-50/80 dark:bg-zinc-900/80 border-emerald-500/80 dark:border-emerald-500/80 shadow-sm'
              : isSelected
              ? 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm'
              : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
          }`}
        >
          {/* Left section: Badges & Title & Subtitle */}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-mono text-[10px] font-bold rounded">
                {opportunity.efficiencyScore}x
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {opportunity.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex-wrap font-mono">
              <span>{formattedStart.split(' (')[0]} — {formattedEnd.split(' (')[0]}</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{opportunity.totalOffDays}G Tatil</span>
              <span>/</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">{opportunity.leaveDaysRequired}G İzin</span>
            </div>
          </div>

          {/* Right section: Compact Actions */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button
              onClick={handleToggleCart}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                isAddedToCart
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-900'
              }`}
            >
              {isAddedToCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isAddedToCart ? 'Ekli' : 'Ekle'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePinOpportunity(opportunity.id);
              }}
              className={`p-1 rounded border transition-colors ${
                isPinned
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              title={isPinned ? 'Planı Kaldır' : 'Planı Kaydet'}
            >
              {isPinned ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onSelect}
              className={`p-1 rounded border transition-colors ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              title="Takvimde Gör"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <BlockLeaveWarningModal
          isOpen={showWarningModal}
          opportunity={opportunity}
          onClose={() => setShowWarningModal(false)}
          onConfirmAddAnyway={handleConfirmAddAnyway}
        />
      </>
    );
  }

  return (
    <>
      <div
        onClick={onSelect}
        className={`relative group rounded-lg p-5 transition-all duration-150 cursor-pointer border ${
          isAddedToCart
            ? 'bg-zinc-50/80 dark:bg-zinc-900/80 border-emerald-500/80 dark:border-emerald-500/80 shadow-sm'
            : isSelected
            ? 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm'
            : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
        }`}
      >
        {/* Top Row Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Efficiency Score Badge */}
              <span className="px-2 py-0.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-mono text-[11px] font-semibold rounded">
                {opportunity.efficiencyScore}x ROI
              </span>

              {/* Min Block Requirement Badge */}
              {minBlockEnabled && opportunity.satisfiesMinBlock && (
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-medium rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Min. {opportunity.minBlockTarget}G Blok
                </span>
              )}

              {/* Half day highlight */}
              {opportunity.halfDaysCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-[11px] font-medium rounded flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {opportunity.halfDaysCount} Arefe (0.5G)
                </span>
              )}

              {/* Friday Penalty Highlight */}
              {opportunity.hasFridayPenalty && (
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 text-[11px] font-medium rounded flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Cuma (+{opportunity.fridayPenaltyCount})
                </span>
              )}
            </div>

            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
              {opportunity.title}
            </h3>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 relative shrink-0">
            {/* Add to Annual Plan Button */}
            <button
              onClick={handleToggleCart}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isAddedToCart
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-900'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Planınızda Ekli</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Planıma Ekle</span>
                </>
              )}
            </button>

            {/* Share & Export Menu Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExportMenu(!showExportMenu);
                }}
                className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                title="Planı Paylaş veya İndir"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 top-9 z-30 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg p-1 space-y-0.5">
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp'ta Paylaş</span>
                  </button>
                  <button
                    onClick={handleNativeShare}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Sistem Paylaşım Menüsü</span>
                  </button>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                  <button
                    onClick={handleDownloadIcs}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Takvime Ekle (.ics)</span>
                  </button>
                  <button
                    onClick={handlePrintPdf}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5 text-zinc-400" />
                    <span>PDF / HR Dilekçe</span>
                  </button>
                  <button
                    onClick={handleCopySchedule}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Metni Kopyala</span>
                  </button>
                </div>
              )}
            </div>

            {/* Pin Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePinOpportunity(opportunity.id);
              }}
              className={`p-1.5 rounded-md border transition-colors ${
                isPinned
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              title={isPinned ? 'Planı Kaldır' : 'Planı Kaydet'}
            >
              {isPinned ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 gap-3 mb-3 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-md border border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <CalendarIcon className="w-4 h-4 text-zinc-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 block truncate">
                Kesintisiz Tatil
              </span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                {opportunity.totalOffDays} GÜN
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 block truncate">
                İzin Maliyeti
              </span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                {opportunity.leaveDaysRequired} GÜN
              </span>
            </div>
          </div>
        </div>

        {/* Holidays Included */}
        {opportunity.holidaysIncluded.length > 0 && (
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Bayramlar:</span>
            {opportunity.holidaysIncluded.map((h, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 rounded font-medium"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Leave Dates breakdown */}
        <div className="mb-3">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
            Alınması Gereken İzin Günleri:
          </span>
          <div className="flex flex-wrap gap-1">
            {formattedLeaveDates.map((dateStr, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 text-[11px] font-mono rounded border border-zinc-200 dark:border-zinc-700/80"
              >
                {dateStr}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Reason & Select Action */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal italic truncate">
            {opportunity.scoreReason}
          </p>

          <button
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors shrink-0 ${
              isSelected
                ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isSelected ? 'İnceleniyor' : 'Takvimde Gör'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Warning Modal for non-block add attempt */}
      <BlockLeaveWarningModal
        isOpen={showWarningModal}
        opportunity={opportunity}
        onClose={() => setShowWarningModal(false)}
        onConfirmAddAnyway={handleConfirmAddAnyway}
      />
    </>
  );
}
