import { addDays, format, parseISO } from 'date-fns';
import { Holiday } from '../types/holiday';

// 2026 - 2050 Yılları Dini Bayramlar Haritası (Ramazan Arefe ve Kurban Arefe Başlangıç Tarihleri)
interface ReligiousHolidayEntry {
  ramazanArefe: string[]; // YYYY-MM-DD (Bir yılda 2 Ramazan denk gelebilen yıllar için dizi)
  kurbanArefe: string[]; // YYYY-MM-DD (Bir yılda 2 Kurban denk gelebilen yıllar için dizi)
}

const RELIGIOUS_HOLIDAYS_MAP: Record<number, ReligiousHolidayEntry> = {
  2026: { ramazanArefe: ['2026-03-19'], kurbanArefe: ['2026-05-26'] },
  2027: { ramazanArefe: ['2027-03-08'], kurbanArefe: ['2027-05-15'] },
  2028: { ramazanArefe: ['2028-02-25'], kurbanArefe: ['2028-05-03'] },
  2029: { ramazanArefe: ['2029-02-13'], kurbanArefe: ['2029-04-23'] },
  2030: { ramazanArefe: ['2030-02-03', '2030-12-25'], kurbanArefe: ['2030-04-12'] },
  2031: { ramazanArefe: ['2031-12-14'], kurbanArefe: ['2031-04-01'] },
  2032: { ramazanArefe: ['2032-12-03'], kurbanArefe: ['2032-03-20'] },
  2033: { ramazanArefe: ['2033-11-22'], kurbanArefe: ['2033-03-10'] },
  2034: { ramazanArefe: ['2034-11-11'], kurbanArefe: ['2034-02-27'] },
  2035: { ramazanArefe: ['2035-10-31'], kurbanArefe: ['2035-02-16'] },
  2036: { ramazanArefe: ['2036-10-19'], kurbanArefe: ['2036-02-05'] },
  2037: { ramazanArefe: ['2037-10-09'], kurbanArefe: ['2037-01-25'] },
  2038: { ramazanArefe: ['2038-09-28'], kurbanArefe: ['2038-01-14'] },
  2039: { ramazanArefe: ['2039-09-18'], kurbanArefe: ['2039-01-04', '2039-12-24'] },
  2040: { ramazanArefe: ['2040-09-06'], kurbanArefe: ['2040-12-13'] },
  2041: { ramazanArefe: ['2041-08-27'], kurbanArefe: ['2041-12-02'] },
  2042: { ramazanArefe: ['2042-08-16'], kurbanArefe: ['2042-11-21'] },
  2043: { ramazanArefe: ['2043-08-05'], kurbanArefe: ['2043-11-10'] },
  2044: { ramazanArefe: ['2044-07-24'], kurbanArefe: ['2044-10-30'] },
  2045: { ramazanArefe: ['2045-07-14'], kurbanArefe: ['2045-10-19'] },
  2046: { ramazanArefe: ['2046-07-03'], kurbanArefe: ['2046-10-09'] },
  2047: { ramazanArefe: ['2047-06-22'], kurbanArefe: ['2047-09-28'] },
  2048: { ramazanArefe: ['2048-06-11'], kurbanArefe: ['2048-09-16'] },
  2049: { ramazanArefe: ['2049-05-31'], kurbanArefe: ['2049-09-06'] },
  2050: { ramazanArefe: ['2050-05-20'], kurbanArefe: ['2050-08-26'] },
};

/**
 * Belirtilen Yıl (2026 - 2050) İçin Tüm Resmî ve Dinî Tatilleri Dinamik Üretir.
 */
export function getHolidaysForYear(year: number): Holiday[] {
  const holidays: Holiday[] = [];

  // 1. Sabit Millî Tatiller (Miladi Takvim)
  holidays.push(
    {
      id: `tr-${year}-yilbasi`,
      date: `${year}-01-01`,
      name: 'Yılbaşı',
      duration: 1.0,
      isArefe: false,
      type: 'national',
    },
    {
      id: `tr-${year}-23-nisan`,
      date: `${year}-04-23`,
      name: 'Ulusal Egemenlik ve Çocuk Bayramı',
      duration: 1.0,
      isArefe: false,
      type: 'national',
    },
    {
      id: `tr-${year}-1-mayis`,
      date: `${year}-05-01`,
      name: 'Emek ve Dayanışma Günü',
      duration: 1.0,
      isArefe: false,
      type: 'national',
    },
    {
      id: `tr-${year}-19-mayis`,
      date: `${year}-05-19`,
      name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
      duration: 1.0,
      isArefe: false,
      type: 'national',
    },
    {
      id: `tr-${year}-15-temmuz`,
      date: `${year}-07-15`,
      name: '15 Temmuz Demokrasi ve Milli Birlik Günü',
      duration: 1.0,
      isArefe: false,
      type: 'national',
    },
    {
      id: `tr-${year}-30-agustos`,
      date: `${year}-08-30`,
      name: 'Zafer Bayramı',
      duration: 1.0,
      isArefe: false,
      type: 'national',
    },
    {
      id: `tr-${year}-cumhuriyet-arefe`,
      date: `${year}-10-28`,
      name: 'Cumhuriyet Bayramı Arefesi',
      duration: 0.5,
      isArefe: true,
      type: 'national',
    },
    {
      id: `tr-${year}-29-ekim`,
      date: `${year}-10-29`,
      name: 'Cumhuriyet Bayramı',
      duration: 1.0,
      isArefe: false,
      type: 'national',
    }
  );

  // 2. Dinî Bayramlar (Hicri Takvim Kayması)
  const relEntry = RELIGIOUS_HOLIDAYS_MAP[year];
  if (relEntry) {
    // Ramazan Bayramı (Arefe 0.5 + 3 gün)
    relEntry.ramazanArefe.forEach((arefeDateStr, idx) => {
      const arefeDate = parseISO(arefeDateStr);
      holidays.push({
        id: `tr-${year}-ramazan-arefe-${idx}`,
        date: arefeDateStr,
        name: 'Ramazan Bayramı Arefesi',
        duration: 0.5,
        isArefe: true,
        type: 'religious',
      });

      for (let dayNum = 1; dayNum <= 3; dayNum++) {
        const d = addDays(arefeDate, dayNum);
        const dStr = format(d, 'yyyy-MM-dd');
        holidays.push({
          id: `tr-${year}-ramazan-${dayNum}-${idx}`,
          date: dStr,
          name: `Ramazan Bayramı ${dayNum}. Gün`,
          duration: 1.0,
          isArefe: false,
          type: 'religious',
        });
      }
    });

    // Kurban Bayramı (Arefe 0.5 + 4 gün)
    relEntry.kurbanArefe.forEach((arefeDateStr, idx) => {
      const arefeDate = parseISO(arefeDateStr);
      holidays.push({
        id: `tr-${year}-kurban-arefe-${idx}`,
        date: arefeDateStr,
        name: 'Kurban Bayramı Arefesi',
        duration: 0.5,
        isArefe: true,
        type: 'religious',
      });

      for (let dayNum = 1; dayNum <= 4; dayNum++) {
        const d = addDays(arefeDate, dayNum);
        const dStr = format(d, 'yyyy-MM-dd');
        holidays.push({
          id: `tr-${year}-kurban-${dayNum}-${idx}`,
          date: dStr,
          name: `Kurban Bayramı ${dayNum}. Gün`,
          duration: 1.0,
          isArefe: false,
          type: 'religious',
        });
      }
    });
  }

  // Tarihe göre sırala
  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

// 2026 - 2050 Yılları Listesi
export const SUPPORTED_YEARS = Array.from({ length: 2050 - 2026 + 1 }, (_, i) => 2026 + i);
