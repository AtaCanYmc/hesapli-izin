import { format, parseISO, addDays, getDay, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import holidaysData from '../data/holidays.json';
import {
  Holiday,
  LeaveOpportunity,
  OptimizationMode,
  CalendarDay,
  DayType,
} from '../types/holiday';

const ALL_HOLIDAYS = holidaysData as Holiday[];

/**
 * Belirtilen yıl için tüm günleri içeren takvim haritasını oluşturur.
 */
export function buildYearCalendar(year: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const startDate = new Date(year, 0, 1); // 1 Ocak
  const endDate = new Date(year, 11, 31); // 31 Aralık

  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayOfWeek = getDay(currentDate);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const holidayMatch = ALL_HOLIDAYS.find((h) => h.date === dateStr);

    let type: DayType = 'work';
    let holidayName: string | undefined = undefined;

    if (holidayMatch) {
      holidayName = holidayMatch.name;
      if (holidayMatch.duration === 0.5) {
        type = 'half-day';
      } else {
        type = 'holiday';
      }
    } else if (isWeekend) {
      type = 'weekend';
    }

    days.push({
      date: dateStr,
      dayOfWeek,
      dayNumber: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      type,
      holidayName,
    });

    currentDate = addDays(currentDate, 1);
  }

  return days;
}

/**
 * Ana Optimizasyon Motoru
 * Verilen yıl, bütçe ve moda göre en avantajlı izin fırsatlarını üretir.
 */
export function calculateLeaveOpportunities(
  year: number,
  leaveBudget: number,
  mode: OptimizationMode
): LeaveOpportunity[] {
  if (leaveBudget <= 0) return [];

  const calendar = buildYearCalendar(year);
  const rawOpportunities: LeaveOpportunity[] = [];

  // Yıl içindeki resmî tatilleri ve köprü noktalarını tara
  const holidaysInYear = ALL_HOLIDAYS.filter((h) => h.date.startsWith(`${year}`));

  for (const holiday of holidaysInYear) {
    const holidayIndex = calendar.findIndex((d) => d.date === holiday.date);
    if (holidayIndex === -1) continue;

    // Tatil etrafında farklı pencere yarıçapları tara (1 günden 12 güne kadar)
    for (let leftExpand = 0; leftExpand <= 7; leftExpand++) {
      for (let rightExpand = 0; rightExpand <= 7; rightExpand++) {
        const startIndex = Math.max(0, holidayIndex - leftExpand);
        const endIndex = Math.min(calendar.length - 1, holidayIndex + rightExpand);

        const subCalendar = calendar.slice(startIndex, endIndex + 1);

        // İzin gerekip gerekmediğini ve bütçeye uygunluğunu kontrol et
        let leaveDaysRequired = 0;
        const leaveDates: string[] = [];
        const holidaysIncludedSet = new Set<string>();
        let halfDaysCount = 0;

        for (const day of subCalendar) {
          if (day.type === 'work') {
            leaveDaysRequired += 1.0;
            leaveDates.push(day.date);
          } else if (day.type === 'half-day') {
            leaveDaysRequired += 0.5;
            leaveDates.push(day.date);
            halfDaysCount++;
            if (day.holidayName) holidaysIncludedSet.add(day.holidayName);
          } else if (day.type === 'holiday') {
            if (day.holidayName) holidaysIncludedSet.add(day.holidayName);
          }
        }

        // Geçersiz durumları filtrele:
        // 1. Hiç izin harcamıyorsa (zaten tatil ise) pencere uzatılmalı
        // 2. İzin ihtiyacı bütçeyi aşıyorsa
        // 3. Pencere başında veya sonunda boşa iş günü kalmışsa (pencere tatille başlamalı/bitmeli)
        if (leaveDaysRequired === 0 || leaveDaysRequired > leaveBudget) continue;

        const firstDayType = subCalendar[0].type;
        const lastDayType = subCalendar[subCalendar.length - 1].type;

        // Pencerenin başlangıcı veya bitişi 'work' günü olmamalı (tam köprü olmalı)
        if (firstDayType === 'work' || lastDayType === 'work') continue;

        const totalOffDays = subCalendar.length;
        const efficiencyScore = Number((totalOffDays / leaveDaysRequired).toFixed(2));

        // Çok düşük ROI (örneğin 1'den küçük) olan anlamsız teklifleri başa alma
        if (efficiencyScore < 1.3) continue;

        const startDateStr = subCalendar[0].date;
        const endDateStr = subCalendar[subCalendar.length - 1].date;

        const holidaysList = Array.from(holidaysIncludedSet);

        // Başlık ve açıklama üret
        const formattedStart = format(parseISO(startDateStr), 'd MMMM', { locale: tr });
        const formattedEnd = format(parseISO(endDateStr), 'd MMMM', { locale: tr });
        const title = `${formattedStart} - ${formattedEnd} Tatili`;

        let scoreReason = '';
        if (halfDaysCount > 0 && efficiencyScore >= 4.0) {
          scoreReason = `⚡ ${halfDaysCount} Arefe (0.5 gün) fırsatıyla ${efficiencyScore}x yüksek verimlilik!`;
        } else if (totalOffDays >= 9) {
          scoreReason = `🏖️ ${totalOffDays} günlük kesintisiz dev tatil bloğu!`;
        } else {
          scoreReason = `🎯 ${leaveDaysRequired} gün izin harcayarak ${totalOffDays} gün tatil kazanın (${efficiencyScore}x ROI).`;
        }

        rawOpportunities.push({
          id: `${startDateStr}_${endDateStr}_${mode}`,
          title,
          startDate: startDateStr,
          endDate: endDateStr,
          totalOffDays,
          leaveDaysRequired,
          efficiencyScore,
          leaveDates,
          holidaysIncluded: holidaysList,
          halfDaysCount,
          scoreReason,
          mode,
        });
      }
    }
  }

  // Çakışan/iç içe geçen fırsatları temizle (Deduplication / Non-Maxima Suppression)
  const uniqueOpportunities = filterOverlappingOpportunities(rawOpportunities, mode);

  // Algoritmaya özel sıralama fonksiyonu
  return sortOpportunitiesByMode(uniqueOpportunities, mode);
}

/**
 * Benzer veya kapsayan tarih aralıklarını filtreler, en verimlisini seçer.
 */
function filterOverlappingOpportunities(
  opportunities: LeaveOpportunity[],
  mode: OptimizationMode
): LeaveOpportunity[] {
  const sorted = [...opportunities].sort((a, b) => {
    if (mode === 'max-roi') {
      return b.efficiencyScore - a.efficiencyScore || b.totalOffDays - a.totalOffDays;
    } else if (mode === 'long-block') {
      return b.totalOffDays - a.totalOffDays || b.efficiencyScore - a.efficiencyScore;
    } else {
      // arefe-focused
      return b.halfDaysCount - a.halfDaysCount || b.efficiencyScore - a.efficiencyScore;
    }
  });

  const selected: LeaveOpportunity[] = [];

  for (const opp of sorted) {
    const isOverlapping = selected.some((s) => {
      // Tamamen aynı başlangıç veya bitiş
      if (s.startDate === opp.startDate && s.endDate === opp.endDate) return true;

      // İzin tarihleri yüksek oranda çakışıyor mu?
      const overlapCount = opp.leaveDates.filter((d) => s.leaveDates.includes(d)).length;
      return overlapCount > 0 && Math.abs(s.totalOffDays - opp.totalOffDays) <= 2;
    });

    if (!isOverlapping) {
      selected.push(opp);
    }
  }

  return selected;
}

/**
 * Algoritma moduna göre fırsatları son sıralamaya sokar.
 */
function sortOpportunitiesByMode(
  opps: LeaveOpportunity[],
  mode: OptimizationMode
): LeaveOpportunity[] {
  switch (mode) {
    case 'max-roi':
      return opps.sort((a, b) => b.efficiencyScore - a.efficiencyScore || b.totalOffDays - a.totalOffDays);

    case 'long-block':
      return opps.sort((a, b) => b.totalOffDays - a.totalOffDays || b.efficiencyScore - a.efficiencyScore);

    case 'arefe-focused':
      return opps.sort((a, b) => {
        if (b.halfDaysCount !== a.halfDaysCount) {
          return b.halfDaysCount - a.halfDaysCount;
        }
        return b.efficiencyScore - a.efficiencyScore;
      });

    default:
      return opps;
  }
}
