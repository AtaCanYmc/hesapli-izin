'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Building2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-lg w-[92vw] sm:w-full p-5 shadow-lg space-y-5 relative overflow-hidden transition-colors max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-700 dark:text-zinc-300 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 leading-tight">
                Özel & İdari Tatil Yönetimi
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {selectedYear} Yılı İçin Şirket veya İdari İzin Günleri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="space-y-3 bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-md border border-zinc-200 dark:border-zinc-800/80">
          <h4 className="text-xs font-mono uppercase font-semibold text-zinc-700 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-zinc-500" />
            Yeni Tatil Ekle
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Tatil / İzin Adı
              </label>
              <input
                type="text"
                placeholder="Örn. Şirket Kuruluş Günü"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Tarih
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Süre
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value) as 1.0 | 0.5)}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                >
                  <option value={1.0}>Tam Gün (1.0)</option>
                  <option value={0.5}>Yarım Gün / Arefe (0.5)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-900 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Listeye Ekle ve Hesapla</span>
          </button>
        </form>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-zinc-400 block">Hızlı Şablonlar:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleAddQuickPreset('Şirket İdari İzni', '06-15')}
              className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
            >
              + Şirket İdari İzni (15 Haz)
            </button>
            <button
              type="button"
              onClick={() => handleAddQuickPreset('Köprü İdari İzni', '11-10')}
              className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
            >
              + Köprü İdari İzni (10 Kas)
            </button>
          </div>
        </div>

        {/* List of Custom Holidays */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
            <span>{selectedYear} Eklenen Tatiller</span>
            <span className="text-xs font-mono text-zinc-400">{currentYearCustomHolidays.length} Adet</span>
          </h4>

          {currentYearCustomHolidays.length === 0 ? (
            <p className="text-xs text-zinc-400 italic py-2 text-center">
              Henüz özel tatil eklenmedi.
            </p>
          ) : (
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {currentYearCustomHolidays.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs"
                >
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">{h.name}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {h.date} ({h.duration === 0.5 ? '0.5G' : '1.0G'})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCustomHoliday(h.id)}
                    className="p-1 text-rose-600 hover:bg-rose-500/10 rounded transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
