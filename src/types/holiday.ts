export type HolidayType = 'national' | 'religious' | 'public';

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  duration: 1.0 | 0.5; // 1.0 = tam gün, 0.5 = yarım gün (Arefe)
  isArefe: boolean;
  type: HolidayType;
}

export type OptimizationMode = 'max-roi' | 'long-block' | 'arefe-focused';

export interface LeaveOpportunity {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalOffDays: number; // Toplam kesintisiz tatil günü
  leaveDaysRequired: number; // Harcanacak yıllık izin günü (Cuma kuralı dahil)
  baseLeaveDays: number; // Baz izin günü maliyeti (Cuma kuralı hariç ham gün sayısı)
  efficiencyScore: number; // Verimlilik Skoru (totalOffDays / leaveDaysRequired)
  leaveDates: string[]; // Alınacak izin tarihleri (YYYY-MM-DD)
  holidaysIncluded: string[]; // Kapsanan resmî/dini tatil isimleri
  halfDaysCount: number; // Kapsanan Arefe / yarım gün sayısı
  hasFridayPenalty: boolean; // Cuma izni 2 gün kuralı uygulandı mı?
  fridayPenaltyCount: number; // Cuma kuralından dolayı eklenen ek izin günü sayısı
  satisfiesMinBlock: boolean; // Minimum blok izin şartını karşılıyor mu?
  minBlockTarget?: number; // Hedeflenen minimum kesintisiz blok tatil günü sayısı (ör. 10)
  scoreReason: string; // Fırsatın öne çıkan özelliği açıklaması
  mode: OptimizationMode;
}

export type DayType = 'work' | 'weekend' | 'holiday' | 'half-day' | 'leave';

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Pazar, 1 = Pazartesi, ..., 5 = Cuma, 6 = Cumartesi
  dayNumber: number;
  month: number; // 0..11
  year: number;
  type: DayType;
  holidayName?: string;
  isRecommendedLeave?: boolean;
}

export interface UserPreferences {
  leaveBudget: number; // Toplam kullanılabilir yıllık izin günü
  selectedYear: 2026 | 2027;
  algorithmMode: OptimizationMode;
  includeFridayPenalty: boolean; // Cuma günü alınan izinlerin 2 gün sayılması kuralı
  minBlockEnabled: boolean; // Minimum X gün blok izin kullanma zorunluluğu
  minBlockDays: number; // Minimum kesintisiz tatil günü hedefi (ör. 10 gün)
}
