'use client';

import { useState } from 'react';
import { parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { buildYearCalendar } from '../lib/optimizerEngine';
import { LeaveOpportunity, CalendarDay } from '../types/holiday';
import { useLeaveStore } from '../store/useLeaveStore';

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
  const { customHolidays, selectedPackages } = useLeaveStore();

  const initialMonth = selectedOpportunity
    ? parseISO(selectedOpportunity.startDate).getMonth()
    : 0;

  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth);

  const fullCalendar = buildYearCalendar(year, customHolidays, selectedPackages);
  const monthDays = fullCalendar.filter((d) => d.month === currentMonth);

  const firstDayOfMonth = new Date(year, currentMonth, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const emptyPrefixSlots = Array.from({ length: startDayOfWeek });

  const isDateInActiveOpportunityRange = (dateStr: string) => {
    if (!selectedOpportunity) return false;
    return dateStr >= selectedOpportunity.startDate && dateStr <= selectedOpportunity.endDate;
  };

  const isRecommendedLeaveDate = (dateStr: string) => {
    if (!selectedOpportunity) return false;
    return selectedOpportunity.leaveDates.includes(dateStr);
  };

  const isCartLeaveDate = (dateStr: string) => {
    return selectedPackages.some((pkg) => pkg.leaveDates.includes(dateStr));
  };

  const nextMonth = () => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  const prevMonth = () => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-sm transition-colors">
      {/* Calendar Header & Month Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-zinc-500" />
            İnteraktif Takvim
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {selectedOpportunity
              ? `İncelenen: ${selectedOpportunity.title}`
              : 'Seçili fırsatın takvim önizlemesi.'}
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/60 transition-colors"
            title="Önceki Ay"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 px-3 py-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-md border border-zinc-200 dark:border-zinc-700/60 min-w-[120px] text-center">
            {MONTH_NAMES[currentMonth]} {year}
          </span>

          <button
            onClick={nextMonth}
            className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/60 transition-colors"
            title="Sonraki Ay"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Color Legend Bar */}
      <div className="flex flex-wrap items-center gap-3 p-2.5 bg-zinc-50 dark:bg-zinc-950/60 rounded-md border border-zinc-200 dark:border-zinc-800/60 mb-4 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-zinc-600 dark:text-zinc-400">İzin</span>
        </div>
        {selectedPackages.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-zinc-600 dark:text-zinc-400">Sepet</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-zinc-600 dark:text-zinc-400">Resmî Tatil</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-zinc-600 dark:text-zinc-400">Arefe</span>
        </div>
      </div>

      {/* Grid Header: Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAY_SHORT.map((wd, i) => (
          <div
            key={i}
            className={`text-[11px] font-mono uppercase font-semibold py-1 ${
              i === 0 || i === 6 ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Grid Body: Days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty slots before day 1 */}
        {emptyPrefixSlots.map((_, idx) => (
          <div key={`empty-${idx}`} className="h-11 sm:h-14 rounded-md bg-zinc-100/50 dark:bg-zinc-950/20 opacity-30" />
        ))}

        {/* Days of month */}
        {monthDays.map((day: CalendarDay) => {
          const inActiveRange = isDateInActiveOpportunityRange(day.date);
          const isLeaveActive = isRecommendedLeaveDate(day.date);
          const isCartLeave = isCartLeaveDate(day.date);

          let bgClass = 'bg-zinc-50 dark:bg-zinc-950/40 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800/80';
          let badgeText = '';

          if (isLeaveActive) {
            bgClass =
              'bg-emerald-600 dark:bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm';
            badgeText = 'İzin';
          } else if (isCartLeave) {
            bgClass =
              'bg-blue-600 dark:bg-blue-600 text-white font-bold border-blue-600 shadow-sm';
            badgeText = 'Sepet';
          } else if (day.type === 'holiday') {
            bgClass =
              'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold border-rose-500/30';
            badgeText = 'Tatil';
          } else if (day.type === 'half-day') {
            bgClass =
              'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold border-amber-500/30';
            badgeText = 'Arefe';
          } else if (day.type === 'weekend') {
            bgClass = 'bg-zinc-100 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 font-medium border-zinc-200 dark:border-zinc-800';
            badgeText = 'H.S';
          } else if (inActiveRange) {
            bgClass = 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 font-medium';
          }

          return (
            <div
              key={day.date}
              className={`relative h-11 sm:h-14 p-1 sm:p-1.5 rounded-md border transition-colors flex flex-col justify-between overflow-hidden ${bgClass}`}
              title={day.holidayName ? `${day.date}: ${day.holidayName}` : day.date}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">{day.dayNumber}</span>
                {badgeText && (
                  <span className="text-[9px] font-mono uppercase truncate opacity-90">
                    {badgeText}
                  </span>
                )}
              </div>

              {day.holidayName && (
                <p className="text-[8px] font-medium leading-tight truncate opacity-80 hidden sm:block">
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
