import { format, parseISO, addDays, getDay } from 'date-fns';
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
 * Verilen yıl, bütçe, mod, Cuma kuralı ve minimum blok tatil şartına göre en avantajlı izin fırsatlarını üretir.
 */
export function calculateLeaveOpportunities(
  year: number,
  leaveBudget: number,
  mode: OptimizationMode,
  includeFridayPenalty: boolean = false,
  minBlockEnabled: boolean = false,
  minBlockDays: number = 10
): LeaveOpportunity[] {
  if (leaveBudget <= 0) return [];

  const calendar = buildYearCalendar(year);
  const rawOpportunities: LeaveOpportunity[] = [];

  // Yıl içindeki resmî tatilleri ve köprü noktalarını tara
  const holidaysInYear = ALL_HOLIDAYS.filter((h) => h.date.startsWith(`${year}`));

  for (const holiday of holidaysInYear) {
    const holidayIndex = calendar.findIndex((d) => d.date === holiday.date);
    if (holidayIndex === -1) continue;

    // Tatil etrafında farklı pencere yarıçapları tara
    for (let leftExpand = 0; leftExpand <= 8; leftExpand++) {
      for (let rightExpand = 0; rightExpand <= 8; rightExpand++) {
        const startIndex = Math.max(0, holidayIndex - leftExpand);
        const endIndex = Math.min(calendar.length - 1, holidayIndex + rightExpand);

        const subCalendar = calendar.slice(startIndex, endIndex + 1);

        let leaveDaysRequired = 0;
        let baseLeaveDays = 0;
        let fridayPenaltyCount = 0;
        const leaveDates: string[] = [];
        const holidaysIncludedSet = new Set<string>();
        let halfDaysCount = 0;

        for (const day of subCalendar) {
          if (day.type === 'work') {
            baseLeaveDays += 1.0;
            leaveDates.push(day.date);

            if (includeFridayPenalty && day.dayOfWeek === 5) {
              leaveDaysRequired += 2.0;
              fridayPenaltyCount += 1.0;
            } else {
              leaveDaysRequired += 1.0;
            }
          } else if (day.type === 'half-day') {
            baseLeaveDays += 0.5;
            leaveDates.push(day.date);
            halfDaysCount++;
            if (day.holidayName) holidaysIncludedSet.add(day.holidayName);

            if (includeFridayPenalty && day.dayOfWeek === 5) {
              leaveDaysRequired += 1.0;
              fridayPenaltyCount += 0.5;
            } else {
              leaveDaysRequired += 0.5;
            }
          } else if (day.type === 'holiday') {
            if (day.holidayName) holidaysIncludedSet.add(day.holidayName);
          }
        }

        // Bütçe ve kural kontrolleri
        if (leaveDaysRequired === 0 || leaveDaysRequired > leaveBudget) continue;

        const firstDayType = subCalendar[0].type;
        const lastDayType = subCalendar[subCalendar.length - 1].type;

        if (firstDayType === 'work' || lastDayType === 'work') continue;

        const totalOffDays = subCalendar.length;

        // Minimum Blok İzin Filtresi (Ör. 10 gün kesintisiz tatil şartı)
        if (minBlockEnabled && totalOffDays < minBlockDays) continue;

        const efficiencyScore = Number((totalOffDays / leaveDaysRequired).toFixed(2));

        if (efficiencyScore < 1.1) continue;

        const startDateStr = subCalendar[0].date;
        const endDateStr = subCalendar[subCalendar.length - 1].date;

        const holidaysList = Array.from(holidaysIncludedSet);

        const formattedStart = format(parseISO(startDateStr), 'd MMMM', { locale: tr });
        const formattedEnd = format(parseISO(endDateStr), 'd MMMM', { locale: tr });
        const title = `${formattedStart} - ${formattedEnd} Tatili`;

        const hasFridayPenalty = fridayPenaltyCount > 0;
        const satisfiesMinBlock = totalOffDays >= minBlockDays;

        let scoreReason = '';
        if (minBlockEnabled && satisfiesMinBlock) {
          scoreReason = `🛡️ Minimum ${minBlockDays} gün blok izin kuralına uygun: ${totalOffDays} gün kesintisiz tatil!`;
        } else if (hasFridayPenalty) {
          scoreReason = `⚠️ Cuma kuralı dahil: ${baseLeaveDays} gün ham izin yerine ${leaveDaysRequired} gün izin maliyeti (${efficiencyScore}x ROI).`;
        } else if (halfDaysCount > 0 && efficiencyScore >= 4.0) {
          scoreReason = `⚡ ${halfDaysCount} Arefe (0.5 gün) fırsatıyla ${efficiencyScore}x yüksek verimlilik!`;
        } else if (totalOffDays >= 9) {
          scoreReason = `🏖️ ${totalOffDays} günlük kesintisiz dev tatil bloğu!`;
        } else {
          scoreReason = `🎯 ${leaveDaysRequired} gün izin harcayarak ${totalOffDays} gün tatil kazanın (${efficiencyScore}x ROI).`;
        }

        rawOpportunities.push({
          id: `${startDateStr}_${endDateStr}_${mode}_${includeFridayPenalty ? 'fp' : 'norm'}_${minBlockEnabled ? `mb${minBlockDays}` : 'all'}`,
          title,
          startDate: startDateStr,
          endDate: endDateStr,
          totalOffDays,
          leaveDaysRequired,
          baseLeaveDays,
          efficiencyScore,
          leaveDates,
          holidaysIncluded: holidaysList,
          halfDaysCount,
          hasFridayPenalty,
          fridayPenaltyCount,
          satisfiesMinBlock,
          minBlockTarget: minBlockDays,
          scoreReason,
          mode,
        });
      }
    }
  }

  const uniqueOpportunities = filterOverlappingOpportunities(rawOpportunities, mode);

  return sortOpportunitiesByMode(uniqueOpportunities, mode);
}

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
      return b.halfDaysCount - a.halfDaysCount || b.efficiencyScore - a.efficiencyScore;
    }
  });

  const selected: LeaveOpportunity[] = [];

  for (const opp of sorted) {
    const isOverlapping = selected.some((s) => {
      if (s.startDate === opp.startDate && s.endDate === opp.endDate) return true;
      const overlapCount = opp.leaveDates.filter((d) => s.leaveDates.includes(d)).length;
      return overlapCount > 0 && Math.abs(s.totalOffDays - opp.totalOffDays) <= 2;
    });

    if (!isOverlapping) {
      selected.push(opp);
    }
  }

  return selected;
}

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
