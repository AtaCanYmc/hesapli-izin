import { format, parseISO, addDays, getDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getHolidaysForYear } from './turkeyHolidays';
import {
  Holiday,
  LeaveOpportunity,
  OptimizationMode,
  CalendarDay,
  DayType,
} from '../types/holiday';

/**
 * Belirtilen yıl için tüm günleri içeren takvim haritasını oluşturur.
 */
export function buildYearCalendar(
  year: number,
  customHolidays: Holiday[] = [],
  existingSelectedPackages: LeaveOpportunity[] = []
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const holidaysForYear = getHolidaysForYear(year, customHolidays);
  const alreadyTakenLeaveDates = new Set<string>();
  existingSelectedPackages.forEach((pkg) => {
    pkg.leaveDates.forEach((d) => alreadyTakenLeaveDates.add(d));
  });

  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayOfWeek = getDay(currentDate);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const holidayMatch = holidaysForYear.find((h) => h.date === dateStr);

    let type: DayType = 'work';
    let holidayName: string | undefined = undefined;

    if (alreadyTakenLeaveDates.has(dateStr)) {
      type = 'leave';
      holidayName = 'Seçilen İzin Günü';
    } else if (holidayMatch) {
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
 * Sıralı Optimizasyon Motoru
 * Seçili kilitli paketlerden sonra kalan bütçe ve kilitli tarihlerle kalan izin fırsatlarını üretir.
 * Eğer kilitlenen paketlerden biri blok izin şartını (en az minBlockDays veya 7 gün) sağladıysa,
 * kalan bütçedeki önerilerde blok zorunluluğu kalkar ve kullanıcının seçtiği optimizasyon modu korunur.
 */
export function calculateLeaveOpportunities(
  year: number,
  leaveBudget: number,
  mode: OptimizationMode,
  includeFridayPenalty: boolean = false,
  minBlockEnabled: boolean = false,
  minBlockDays: number = 10,
  customHolidays: Holiday[] = [],
  existingSelectedPackages: LeaveOpportunity[] = []
): LeaveOpportunity[] {
  // Seçili paketlerin toplam kullanılan izin maliyeti
  const usedBudget = existingSelectedPackages.reduce((acc, curr) => acc + curr.leaveDaysRequired, 0);
  const remainingBudget = Math.max(0, leaveBudget - usedBudget);

  if (remainingBudget <= 0) return [];

  // Sepette kilitlenen izin paketlerinden biri blok izin şartını karşıladı mı?
  const hasBlockSatisfiedInCart = existingSelectedPackages.some(
    (pkg) => pkg.totalOffDays >= (minBlockEnabled ? minBlockDays : 7) || pkg.satisfiesMinBlock
  );

  // Eğer sepette henüz blok izin kilitlenmediyse ve mod 'max-roi' ise kalan bütçeyi öncelikle blok izne yönlendir.
  // Ancak sepetteki kilitli paketlerden biri ZATEN blok izin şartını sağladıysa kullanıcının seçtiği modu koru.
  const effectiveMode: OptimizationMode =
    existingSelectedPackages.length > 0 && !hasBlockSatisfiedInCart && mode === 'max-roi'
      ? 'long-block'
      : mode;

  const calendar = buildYearCalendar(year, customHolidays, existingSelectedPackages);
  const holidaysInYear = getHolidaysForYear(year, customHolidays);
  const rawOpportunities: LeaveOpportunity[] = [];

  // Zaten seçilmiş paketlerin tarih alanları
  const existingTakenDates = new Set<string>();
  existingSelectedPackages.forEach((pkg) => {
    pkg.leaveDates.forEach((d) => existingTakenDates.add(d));
  });

  for (const holiday of holidaysInYear) {
    const holidayIndex = calendar.findIndex((d) => d.date === holiday.date);
    if (holidayIndex === -1) continue;

    for (let leftExpand = 0; leftExpand <= 8; leftExpand++) {
      for (let rightExpand = 0; rightExpand <= 8; rightExpand++) {
        const startIndex = Math.max(0, holidayIndex - leftExpand);
        const endIndex = Math.min(calendar.length - 1, holidayIndex + rightExpand);

        const subCalendar = calendar.slice(startIndex, endIndex + 1);

        // Çakışma kontrolü: Pencere içinde önceden alınmış bir izin tarihi var mı?
        const overlapsExisting = subCalendar.some((day) => existingTakenDates.has(day.date));
        if (overlapsExisting) continue;

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

        if (leaveDaysRequired === 0 || leaveDaysRequired > remainingBudget) continue;

        const firstDayType = subCalendar[0].type;
        const lastDayType = subCalendar[subCalendar.length - 1].type;

        if (firstDayType === 'work' || lastDayType === 'work') continue;

        const totalOffDays = subCalendar.length;

        // Minimum blok izin şartı aktifse ve sepetteki kilitli paketlerden HİÇBİRİ henüz blok şartını sağlamadıysa,
        // aday paketin blok şartını (minBlockDays) karşılaması gerekir.
        // Kilitli paketlerden biri ZATEN blok şartını karşıladıysa kalan izin önerilerinde blok olma zorunluluğu kalkar!
        const enforceMinBlockOnCandidate = minBlockEnabled && !hasBlockSatisfiedInCart;
        if (enforceMinBlockOnCandidate && totalOffDays < minBlockDays) continue;

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
        if (existingSelectedPackages.length > 0 && !hasBlockSatisfiedInCart) {
          scoreReason = `🧱 Kalan ${remainingBudget} gün izinle öncelikli kesintisiz blok tatil (${totalOffDays} gün tatil)!`;
        } else if (existingSelectedPackages.length > 0 && hasBlockSatisfiedInCart) {
          scoreReason = `💡 Blok izin şartı sepette sağlandı: Kalan ${remainingBudget} gün izinle ${totalOffDays} gün tatil (${efficiencyScore}x ROI).`;
        } else if (minBlockEnabled && satisfiesMinBlock) {
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
          id: `${startDateStr}_${endDateStr}_${effectiveMode}_${includeFridayPenalty ? 'fp' : 'norm'}_${minBlockEnabled ? `mb${minBlockDays}` : 'all'}_cust${customHolidays.length}`,
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
          mode: effectiveMode,
        });
      }
    }
  }

  const uniqueOpportunities = filterOverlappingOpportunities(rawOpportunities, effectiveMode);

  return sortOpportunitiesByMode(uniqueOpportunities, effectiveMode);
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
