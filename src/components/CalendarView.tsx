'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { buildYearCalendar } from '../lib/optimizerEngine';
import { LeaveOpportunity, CalendarDay } from '../types/holiday';

interface CalendarViewProps {
  year: number;
  selectedOpportunity: LeaveOpportunity | null;
}

const MONTH_NAMES = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const WEEKDAY_SHORT = ['Pz', 'Pt', 'Sa', 'Çr', 'Pr', 'Cu', 'Ct'];

export default function CalendarView({ year, selectedOpportunity }: CalendarViewProps) {
  // Varsayılan olarak eğer seçili bir fırsat varsa o fırsatın ayına git
  const initialMonth = selectedOpportunity
    ? parseISO(selectedOpportunity.startDate).getMonth()
    : 0;

  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth);

  const fullCalendar = buildYearCalendar(year);

  // Filtrelenmiş ay günleri
  const monthDays = fullCalendar.filter((d) => d.month === currentMonth);

  // Ayın ilk gününün haftanın hangi günü olduğunu bul (0=Pazar, 1=Pazartesi, vb.)
  const firstDayOfMonth = new Date(year, currentMonth, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0-6

  // Takvimi hizalamak için boş hücreler
  const emptyPrefixSlots = Array.from({ length: startDayOfWeek });

  // Seçili fırsatın kapsadığı tarih aralığı
  const isDateInOpportunityRange = (dateStr: string) => {
    if (!selectedOpportunity) return false;
    return dateStr >= selectedOpportunity.startDate && dateStr <= selectedOpportunity.endDate;
  };

  const isRecommendedLeaveDate = (dateStr: string) => {
    if (!selectedOpportunity) return false;
    return selectedOpportunity.leaveDates.includes(dateStr);
  };

  const nextMonth = () => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  const prevMonth = () => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-xl">
      {/* Calendar Header & Month Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-sky-400" />
            İnteraktif Takvim Görünümü
          </h2>
          <p className="text-xs text-slate-400">
            {selectedOpportunity
              ? `Seçili Fırsat: ${selectedOpportunity.title}`
              : 'Bir fırsat kartına tıklayarak takvim üzerinde detaylı görün.'}
          </p>
        </div>

        {/* Month Picker Controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700/60"
            title="Önceki Ay"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-extrabold text-base text-white px-4 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700/60 min-w-[130px] text-center">
            {MONTH_NAMES[currentMonth]} {year}
          </span>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700/60"
            title="Sonraki Ay"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Color Legend Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60 mb-6 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          <span className="text-slate-300">Alınacak İzin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shadow-sm shadow-rose-500/50"></span>
          <span className="text-slate-300">Resmî / Dini Tatil</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-500 shadow-sm shadow-amber-500/50"></span>
          <span className="text-slate-300">Arefe (Yarım Gün)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-sky-900 border border-sky-600"></span>
          <span className="text-slate-300">Hafta Sonu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-700"></span>
          <span className="text-slate-300">İş Günü</span>
        </div>
      </div>

      {/* Grid Header: Weekday Labels */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center mb-2">
        {WEEKDAY_SHORT.map((wd, i) => (
          <div
            key={i}
            className={`text-xs font-bold py-1.5 uppercase tracking-wider ${
              i === 0 || i === 6 ? 'text-sky-400' : 'text-slate-400'
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Grid Body: Days */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Empty slots before day 1 */}
        {emptyPrefixSlots.map((_, idx) => (
          <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-xl bg-slate-950/20 opacity-30" />
        ))}

        {/* Days of month */}
        {monthDays.map((day: CalendarDay) => {
          const inRange = isDateInOpportunityRange(day.date);
          const isLeave = isRecommendedLeaveDate(day.date);

          // Stratejik renk sınıfları
          let bgClass = 'bg-slate-800/40 text-slate-300 border-slate-800';
          let badgeText = '';

          if (isLeave) {
            bgClass =
              'bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black border-emerald-400 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50 scale-105';
            badgeText = 'İzin';
          } else if (day.type === 'holiday') {
            bgClass =
              'bg-gradient-to-br from-rose-600 to-red-700 text-white font-bold border-rose-500 shadow-md shadow-rose-600/20';
            badgeText = 'Tatil';
          } else if (day.type === 'half-day') {
            bgClass =
              'bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20';
            badgeText = 'Arefe';
          } else if (day.type === 'weekend') {
            bgClass = 'bg-sky-950/60 text-sky-200 font-semibold border-sky-800/60';
            badgeText = 'H.Sonu';
          } else if (inRange) {
            bgClass = 'bg-sky-900/40 text-sky-200 border-sky-700/60 font-semibold';
          }

          return (
            <div
              key={day.date}
              className={`relative h-14 sm:h-16 p-1.5 sm:p-2 rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${bgClass}`}
              title={day.holidayName ? `${day.date}: ${day.holidayName}` : day.date}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold">{day.dayNumber}</span>
                {badgeText && (
                  <span className="text-[9px] sm:text-[10px] px-1 py-0.2 rounded font-bold uppercase truncate max-w-[45px]">
                    {badgeText}
                  </span>
                )}
              </div>

              {day.holidayName && (
                <p className="text-[9px] font-medium leading-tight truncate opacity-90">
                  {day.holidayName}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
