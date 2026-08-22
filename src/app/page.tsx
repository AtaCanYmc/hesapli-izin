'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import ControlsSection from '../components/ControlsSection';
import SummaryStats from '../components/SummaryStats';
import OpportunityCard from '../components/OpportunityCard';
import CalendarView from '../components/CalendarView';
import AnnualPlanCart from '../components/AnnualPlanCart';
import { calculateLeaveOpportunities } from '../lib/optimizerEngine';
import { useLeaveStore } from '../store/useLeaveStore';
import { downloadCsvExport } from '../lib/exportUtils';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Bookmark,
  ListFilter,
  FileSpreadsheet,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  Rows3,
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function Home() {
  const {
    leaveBudget,
    selectedYear,
    algorithmMode,
    includeFridayPenalty,
    minBlockEnabled,
    minBlockDays,
    customHolidays,
    selectedPackages,
    selectedOpportunityId,
    setSelectedOpportunityId,
    pinnedOpportunities,
  } = useLeaveStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCompactView, setIsCompactView] = useState<boolean>(true);

  const opportunities = useMemo(() => {
    return calculateLeaveOpportunities(
      selectedYear,
      leaveBudget,
      algorithmMode,
      includeFridayPenalty,
      minBlockEnabled,
      minBlockDays,
      customHolidays,
      selectedPackages
    );
  }, [
    selectedYear,
    leaveBudget,
    algorithmMode,
    includeFridayPenalty,
    minBlockEnabled,
    minBlockDays,
    customHolidays,
    selectedPackages,
  ]);

  // Reset pagination to page 1 whenever search filters or packages change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedYear,
    leaveBudget,
    algorithmMode,
    includeFridayPenalty,
    minBlockEnabled,
    minBlockDays,
    customHolidays,
    selectedPackages,
  ]);

  const hasBlockSatisfiedInCart = useMemo(() => {
    return selectedPackages.some(
      (pkg) => pkg.totalOffDays >= (minBlockEnabled ? minBlockDays : 7) || pkg.satisfiesMinBlock
    );
  }, [selectedPackages, minBlockEnabled, minBlockDays]);

  const totalPages = Math.max(1, Math.ceil(opportunities.length / ITEMS_PER_PAGE));

  const paginatedOpportunities = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return opportunities.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [opportunities, currentPage]);

  const currentSelectedOpportunity = useMemo(() => {
    if (opportunities.length === 0) return null;
    const match = opportunities.find((o) => o.id === selectedOpportunityId);
    return match || opportunities[0];
  }, [opportunities, selectedOpportunityId]);

  const handleExportAllCsv = () => {
    downloadCsvExport(opportunities, selectedYear);
  };

  const usedBudget = selectedPackages.reduce((acc, curr) => acc + curr.leaveDaysRequired, 0);
  const remainingBudget = Math.max(0, leaveBudget - usedBudget);

  const startItemNum = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItemNum = Math.min(opportunities.length, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Bar Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            <span>Türkiye {selectedYear} Resmî Tatil Optimizasyonu</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Az İzin Harca, <span className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4">Çok Tatil Yap</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Hafta sonları, dinî bayramlar ve Arefe yarım günlerini birleştirin. Seçtiğiniz her izin paketi için kalan bütçenizle otomatik <strong>blok tatiller</strong> hesaplanır.
          </p>
        </div>

        {/* Interactive Controls & Settings */}
        <ControlsSection />

        {/* Annual Plan Cart (Shows when packages are added) */}
        <AnnualPlanCart />

        {/* Summary Metric Cards */}
        <SummaryStats opportunities={opportunities} leaveBudget={leaveBudget} />

        {/* Main Content Grid: Opportunities List & Interactive Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Opportunities Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-zinc-500" />
                  {selectedPackages.length > 0
                    ? `Kalan İzin İçin Öneriler (${remainingBudget} Gün İzin)`
                    : 'Önerilen İzin Paketleri'}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedPackages.length > 0
                    ? hasBlockSatisfiedInCart
                      ? `Kilitli paketiniz blok tatil şartını sağladığından kalan ${remainingBudget} gün bütçeniz için tüm esnek/verimli fırsatlar listelendi.`
                      : `Kalan ${remainingBudget} gün bütçeniz için öncelikle Blok İzinler hesaplandı.`
                    : `${selectedYear} yılı için ${leaveBudget} gün izin bütçenizle toplam ${opportunities.length} fırsat bulundu.`}
                </p>
              </div>

              {/* Action Bar: View Switcher Toggle, Pin Badge & Export All CSV */}
              <div className="flex items-center gap-2">
                {/* View Switcher Segmented Control */}
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => setIsCompactView(false)}
                    className={`p-1 rounded text-xs transition-colors flex items-center gap-1 ${
                      !isCompactView
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                    title="Detaylı Görünüm"
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Detaylı</span>
                  </button>
                  <button
                    onClick={() => setIsCompactView(true)}
                    className={`p-1 rounded text-xs transition-colors flex items-center gap-1 ${
                      isCompactView
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                    title="Kompakt Görünüm"
                  >
                    <Rows3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Kompakt</span>
                  </button>
                </div>

                {pinnedOpportunities.length > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-current" /> {pinnedOpportunities.length} Kaydedildi
                  </span>
                )}

                {opportunities.length > 0 && (
                  <button
                    onClick={handleExportAllCsv}
                    className="px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-xs font-medium flex items-center gap-1.5"
                    title="Tüm Hesaplamaları Excel/CSV Formatında İndir"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="hidden sm:inline">CSV / Excel</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of Opportunity Cards */}
            {opportunities.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
                <ShoppingBag className="w-6 h-6 text-zinc-400 mx-auto" />
                <p className="text-zinc-600 dark:text-zinc-400 text-xs font-medium max-w-md mx-auto">
                  {remainingBudget === 0
                    ? 'Tüm yıllık izin bütçenizi sepetinize eklediğiniz paketlerle doldurdunuz.'
                    : `Kalan ${remainingBudget} gün izin bütçenizle yeni bir tatil bloğu oluşturulamıyor. Bütçeyi artırabilir veya sepetteki paketleri güncelleyebilirsiniz.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={isCompactView ? 'space-y-2' : 'space-y-3'}>
                  {paginatedOpportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      isSelected={currentSelectedOpportunity?.id === opp.id}
                      onSelect={() => setSelectedOpportunityId(opp.id)}
                      isCompact={isCompactView}
                    />
                  ))}
                </div>

                {/* Minimalist Pagination Bar (Notion / Vercel style) */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      Gösterilen: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startItemNum}–{endItemNum}</span> / {opportunities.length} Fırsat
                    </span>

                    <div className="flex items-center space-x-1">
                      {/* Prev Page Button */}
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-200 dark:border-zinc-700/60 transition-colors text-xs font-medium flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Önceki</span>
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1 px-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 rounded-md text-xs font-mono font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold'
                                : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/60'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      {/* Next Page Button */}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-200 dark:border-zinc-700/60 transition-colors text-xs font-medium flex items-center gap-1"
                      >
                        <span className="hidden xs:inline">Sonraki</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Calendar Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20">
              <CalendarView
                year={selectedYear}
                selectedOpportunity={currentSelectedOpportunity}
              />
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-6 text-center text-xs text-zinc-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>%100 İstemci Tarafı & Gizlilik Odaklı — Verileriniz Sunucuya Gönderilmez.</span>
          </div>

          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <span>Hesaplı İzin PWA © {selectedYear}</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current ml-1" />
          </div>
        </div>
      </footer>
    </div>
  );
}
