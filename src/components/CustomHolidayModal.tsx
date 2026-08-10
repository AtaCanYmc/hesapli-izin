'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Calendar, Sparkles, Building2 } from 'lucide-react';
import { useLeaveStore } from '../store/useLeaveStore';
import { HolidayType } from '../types/holiday';

interface CustomHolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomHolidayModal({ isOpen, onClose }: CustomHolidayModalProps) {
  const { selectedYear, customHolidays, addCustomHoliday, removeCustomHoliday } = useLeaveStore();

  const [name, setName] = useState('');
  const [date, setDate] = useState(`${selectedYear}-06-15`);
  const [duration, setDuration] = useState<1.0 | 0.5>(1.0);
  const [type, setType] = useState<HolidayType>('public');

  if (!isOpen) return null;

  const currentYearCustomHolidays = customHolidays.filter((h) => h.date.startsWith(`${selectedYear}`));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    addCustomHoliday({
      name: name.trim(),
      date,
      duration,
      isArefe: duration === 0.5,
      type,
    });

    setName('');
  };

  const handleAddQuickPreset = (presetName: string, defaultMonthDay: string) => {
    const fullDate = `${selectedYear}-${defaultMonthDay}`;
    addCustomHoliday({
      name: presetName,
      date: fullDate,
      duration: 1.0,
      isArefe: false,
      type: 'public',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-[92vw] sm:w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 relative overflow-hidden transition-colors max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                Özel & İdari Tatil Yönetimi
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                {selectedYear} Yılı İçin Şirket veya İdari İzin Günleri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 bg-slate-50 dark:bg-slate-950/50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-sky-500" />
            Yeni Tatil Ekle
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tatil / İzin Adı
              </label>
              <input
                type="text"
                placeholder="Örn. Şirket Kuruluş Günü"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Tarih
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Süre
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value) as 1.0 | 0.5)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={1.0}>Tam Gün (1.0)</option>
                  <option value={0.5}>Yarım Gün / Arefe (0.5)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Listeye Ekle ve Hesapla</span>
          </button>
        </form>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block">Hızlı Şablonlar:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleAddQuickPreset('Şirket İdari İzni', '06-15')}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
            >
              + Şirket İdari İzni (15 Haz)
            </button>
            <button
              type="button"
              onClick={() => handleAddQuickPreset('Köprü İdari İzni', '11-10')}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
            >
              + Köprü İdari İzni (10 Kas)
            </button>
          </div>
        </div>

        {/* List of Custom Holidays */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>{selectedYear} Eklenen Tatiller</span>
            <span className="text-[10px] font-semibold text-slate-500">{currentYearCustomHolidays.length} Adet</span>
          </h4>

          {currentYearCustomHolidays.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2 text-center">
              Henüz özel tatil eklenmedi.
            </p>
          ) : (
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {currentYearCustomHolidays.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{h.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {h.date} ({h.duration === 0.5 ? '0.5G' : '1.0G'})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCustomHoliday(h.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-lg transition-all"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
