import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Holiday, LeaveOpportunity, OptimizationMode } from '../types/holiday';

interface LeaveStoreState {
  leaveBudget: number;
  selectedYear: number; // 2026 - 2050
  algorithmMode: OptimizationMode;
  includeFridayPenalty: boolean;
  minBlockEnabled: boolean;
  minBlockDays: number;
  theme: 'dark' | 'light';
  selectedOpportunityId: string | null;
  pinnedOpportunities: string[];
  customHolidays: Holiday[];
  selectedPackages: LeaveOpportunity[]; // Yıllık izin sepetine eklenen kilitli paketler
  
  // Actions
  setLeaveBudget: (budget: number) => void;
  setSelectedYear: (year: number) => void;
  setAlgorithmMode: (mode: OptimizationMode) => void;
  toggleFridayPenalty: () => void;
  setIncludeFridayPenalty: (enabled: boolean) => void;
  toggleMinBlockEnabled: () => void;
  setMinBlockEnabled: (enabled: boolean) => void;
  setMinBlockDays: (days: number) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setSelectedOpportunityId: (id: string | null) => void;
  togglePinOpportunity: (id: string) => void;
  addCustomHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  removeCustomHoliday: (id: string) => void;
  clearCustomHolidays: () => void;
  addPackageToPlan: (opportunity: LeaveOpportunity) => void;
  removePackageFromPlan: (opportunityId: string) => void;
  clearPlan: () => void;
  resetAll: () => void;
}

export const useLeaveStore = create<LeaveStoreState>()(
  persist(
    (set) => ({
      leaveBudget: 5,
      selectedYear: 2026,
      algorithmMode: 'max-roi',
      includeFridayPenalty: false,
      minBlockEnabled: false,
      minBlockDays: 10,
      theme: 'dark',
      selectedOpportunityId: null,
      pinnedOpportunities: [],
      customHolidays: [],
      selectedPackages: [],

      setLeaveBudget: (budget) => set({ leaveBudget: Math.max(1, Math.min(30, budget)) }),
      setSelectedYear: (year) => set({ selectedYear: Math.max(2026, Math.min(2050, year)), selectedOpportunityId: null, selectedPackages: [] }),
      setAlgorithmMode: (mode) => set({ algorithmMode: mode }),
      toggleFridayPenalty: () => set((state) => ({ includeFridayPenalty: !state.includeFridayPenalty })),
      setIncludeFridayPenalty: (enabled) => set({ includeFridayPenalty: enabled }),
      toggleMinBlockEnabled: () => set((state) => ({ minBlockEnabled: !state.minBlockEnabled })),
      setMinBlockEnabled: (enabled) => set({ minBlockEnabled: enabled }),
      setMinBlockDays: (days) => set({ minBlockDays: Math.max(3, Math.min(30, days)) }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      setSelectedOpportunityId: (id) => set({ selectedOpportunityId: id }),
      
      togglePinOpportunity: (id) =>
        set((state) => {
          const exists = state.pinnedOpportunities.includes(id);
          return {
            pinnedOpportunities: exists
              ? state.pinnedOpportunities.filter((p) => p !== id)
              : [...state.pinnedOpportunities, id],
          };
        }),

      addCustomHoliday: (holidayData) =>
        set((state) => {
          const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          const newHoliday: Holiday = { ...holidayData, id };
          return {
            customHolidays: [...state.customHolidays.filter((h) => h.date !== holidayData.date), newHoliday],
          };
        }),

      removeCustomHoliday: (id) =>
        set((state) => ({
          customHolidays: state.customHolidays.filter((h) => h.id !== id),
        })),

      clearCustomHolidays: () => set({ customHolidays: [] }),

      addPackageToPlan: (opportunity) =>
        set((state) => {
          const exists = state.selectedPackages.some((p) => p.id === opportunity.id);
          if (exists) return state;
          return {
            selectedPackages: [...state.selectedPackages, opportunity],
          };
        }),

      removePackageFromPlan: (id) =>
        set((state) => ({
          selectedPackages: state.selectedPackages.filter((p) => p.id !== id),
        })),

      clearPlan: () => set({ selectedPackages: [] }),

      resetAll: () =>
        set({
          leaveBudget: 5,
          selectedYear: 2026,
          algorithmMode: 'max-roi',
          includeFridayPenalty: false,
          minBlockEnabled: false,
          minBlockDays: 10,
          theme: 'dark',
          selectedOpportunityId: null,
          pinnedOpportunities: [],
          customHolidays: [],
          selectedPackages: [],
        }),
    }),
    {
      name: 'hesapli-izin-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
