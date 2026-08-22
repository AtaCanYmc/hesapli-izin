'use client';

import { AlertTriangle, Layers, ArrowRight, Check } from 'lucide-react';
import { LeaveOpportunity } from '../types/holiday';
import { useLeaveStore } from '../store/useLeaveStore';

interface BlockLeaveWarningModalProps {
  isOpen: boolean;
  opportunity: LeaveOpportunity | null;
  onClose: () => void;
  onConfirmAddAnyway: () => void;
}

export default function BlockLeaveWarningModal({
  isOpen,
  opportunity,
  onClose,
  onConfirmAddAnyway,
}: BlockLeaveWarningModalProps) {
  const { setAlgorithmMode } = useLeaveStore();

  if (!isOpen || !opportunity) return null;

  const handleSwitchToLongBlock = () => {
    setAlgorithmMode('long-block');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-md w-full p-5 shadow-lg space-y-5 relative overflow-hidden transition-colors">
        
        {/* Header Icon & Title */}
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 leading-snug">
              İlk Paket İçin Blok İzin Tavsiyesi
            </h3>
            <span className="text-[10px] font-mono font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 inline-block mt-1">
              İş Kanunu m. 56 Uyarı Sistemleri
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-2.5 bg-zinc-50 dark:bg-zinc-950/40 p-3.5 rounded-md border border-zinc-200 dark:border-zinc-800/80">
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Sepetinize eklemek üzere olduğunuz <strong>"{opportunity.title}"</strong> paketi{' '}
            <strong className="text-amber-600 dark:text-amber-400">{opportunity.totalOffDays} günlük</strong> kısa bir tatil sunmaktadır.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Türk İş Kanunu gereği, yıllık izin bütçeniz henüz boşken <strong>öncelikle 7–10+ günlük uzun kesintisiz bir blok tatili</strong> planınıza eklemeniz önerilir.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSwitchToLongBlock}
            className="w-full py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-900 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Uzun Blok Tatillere Odaklan (Tavsiye Edilen)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onConfirmAddAnyway}
            className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-700/60"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Kuralı Atla & Yine de Sepete Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
