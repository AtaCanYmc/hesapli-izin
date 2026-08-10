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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative overflow-hidden transition-colors">
        
        {/* Header Icon & Title */}
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 rounded-2xl text-amber-700 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug">
              İlk Paket İçin Blok İzin Tavsiyesi
            </h3>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800 inline-block mt-1">
              İş Kanunu m. 56 Uyarı Sistemleri
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60">
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Sepetinize eklemek üzere olduğunuz <strong>"{opportunity.title}"</strong> paketi{' '}
            <strong className="text-amber-600 dark:text-amber-400">{opportunity.totalOffDays} günlük</strong> kısa bir tatil sunmaktadır.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Türk İş Kanunu ve genel iktisadi izin kuralları gereği, yıllık izin bütçeniz henüz boşken **öncelikle 7-10+ günlük uzun kesintisiz bir blok tatili** planınıza eklemeniz önerilir. Kısa izinlerle başlamak bütçenizi erken parçalayabilir.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSwitchToLongBlock}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>Uzun Blok Tatillere Odaklan (Tavsiye Edilen)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onConfirmAddAnyway}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Kuralı Atla & Yine de Sepete Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
