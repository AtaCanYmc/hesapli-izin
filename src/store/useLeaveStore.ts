import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OptimizationMode } from '../types/holiday';

interface LeaveStoreState {
  leaveBudget: number;
  selectedYear: 2026 | 2027;
  algorithmMode: OptimizationMode;
  selectedOpportunityId: string | null;
  pinnedOpportunities: string[];
  
  // Actions
  setLeaveBudget: (budget: number) => void;
  setSelectedYear: (year: 2026 | 2027) => void;
  setAlgorithmMode: (mode: OptimizationMode) => void;
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
      selectedOpportunityId: null,
      pinnedOpportunities: [],

      setLeaveBudget: (budget) => set({ leaveBudget: Math.max(1, Math.min(30, budget)) }),
      setSelectedYear: (year) => set({ selectedYear: year, selectedOpportunityId: null }),
      setAlgorithmMode: (mode) => set({ algorithmMode: mode }),
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
