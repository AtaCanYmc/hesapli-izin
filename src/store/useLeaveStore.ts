import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OptimizationMode } from '../types/holiday';

interface LeaveStoreState {
  leaveBudget: number;
  selectedYear: 2026 | 2027;
  algorithmMode: OptimizationMode;
  includeFridayPenalty: boolean; // Cuma izni 2 gün sayılsın kuralı
  minBlockEnabled: boolean; // Minimum X gün kesintisiz blok izin kuralı
  minBlockDays: number; // Minimum kesintisiz blok gün hedefi (ör. 10 gün)
  selectedOpportunityId: string | null;
  pinnedOpportunities: string[];
  
  // Actions
  setLeaveBudget: (budget: number) => void;
  setSelectedYear: (year: 2026 | 2027) => void;
  setAlgorithmMode: (mode: OptimizationMode) => void;
  toggleFridayPenalty: () => void;
  setIncludeFridayPenalty: (enabled: boolean) => void;
  toggleMinBlockEnabled: () => void;
  setMinBlockEnabled: (enabled: boolean) => void;
  setMinBlockDays: (days: number) => void;
  setSelectedOpportunityId: (id: string | null) => void;
  togglePinOpportunity: (id: string) => void;
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
      selectedOpportunityId: null,
      pinnedOpportunities: [],

      setLeaveBudget: (budget) => set({ leaveBudget: Math.max(1, Math.min(30, budget)) }),
      setSelectedYear: (year) => set({ selectedYear: year, selectedOpportunityId: null }),
      setAlgorithmMode: (mode) => set({ algorithmMode: mode }),
      toggleFridayPenalty: () => set((state) => ({ includeFridayPenalty: !state.includeFridayPenalty })),
      setIncludeFridayPenalty: (enabled) => set({ includeFridayPenalty: enabled }),
      toggleMinBlockEnabled: () => set((state) => ({ minBlockEnabled: !state.minBlockEnabled })),
      setMinBlockEnabled: (enabled) => set({ minBlockEnabled: enabled }),
      setMinBlockDays: (days) => set({ minBlockDays: Math.max(3, Math.min(30, days)) }),
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

      resetAll: () =>
        set({
          leaveBudget: 5,
          selectedYear: 2026,
          algorithmMode: 'max-roi',
          includeFridayPenalty: false,
          minBlockEnabled: false,
          minBlockDays: 10,
          selectedOpportunityId: null,
          pinnedOpportunities: [],
        }),
    }),
    {
      name: 'hesapli-izin-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
