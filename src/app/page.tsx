'use client';

import { useMemo } from 'react';
import Header from '../components/Header';
import ControlsSection from '../components/ControlsSection';
import SummaryStats from '../components/SummaryStats';
import OpportunityCard from '../components/OpportunityCard';
import CalendarView from '../components/CalendarView';
import { calculateLeaveOpportunities } from '../lib/optimizerEngine';
import { useLeaveStore } from '../store/useLeaveStore';
import { downloadCsvExport } from '../lib/exportUtils';
import { Sparkles, ShieldCheck, Heart, Bookmark, ListFilter, FileSpreadsheet } from 'lucide-react';

export default function Home() {
  const {
    leaveBudget,
    selectedYear,
    algorithmMode,
    includeFridayPenalty,
    minBlockEnabled,
    minBlockDays,
    selectedOpportunityId,
    setSelectedOpportunityId,
    pinnedOpportunities,
  } = useLeaveStore();

  const opportunities = useMemo(() => {
    return calculateLeaveOpportunities(
      selectedYear,
      leaveBudget,
      algorithmMode,
      includeFridayPenalty,
      minBlockEnabled,
      minBlockDays
    );
  }, [selectedYear, leaveBudget, algorithmMode, includeFridayPenalty, minBlockEnabled, minBlockDays]);

  const currentSelectedOpportunity = useMemo(() => {
    if (opportunities.length === 0) return null;
    const match = opportunities.find((o) => o.id === selectedOpportunityId);
    return match || opportunities[0];
  }, [opportunities, selectedOpportunityId]);

  const handleExportAllCsv = () => {
    downloadCsvExport(opportunities, selectedYear);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Bar Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Hero Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-xs font-semibold text-sky-800 dark:text-sky-300">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Türkiye 2026 & 2027 Resmî Tatil Zekası</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Az İzin Harca, <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 dark:from-sky-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">Çok Tatil Yap</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Hafta sonları, dinî bayramlar ve Arefe yarım günlerini akıllıca birleştirin. Gizlilik odaklı, tamamen tarayıcınızda çalışan offline PWA motoru.
          </p>
        </div>

        {/* Interactive Controls & Preset Selector */}
        <ControlsSection />

        {/* Key Metrics Overview */}
        <SummaryStats opportunities={opportunities} leaveBudget={leaveBudget} />

        {/* Main Content Grid: Opportunities List & Interactive Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Opportunities Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ListFilter className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  Önerilen İzin Paketleri
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedYear} yılı için {leaveBudget} gün izin bütçenizle toplam{' '}
                  <span className="text-sky-600 dark:text-sky-300 font-bold">{opportunities.length}</span> fırsat bulundu.
                  {minBlockEnabled && (
                    <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold">(Min. {minBlockDays} Gün Kesintisiz Şartı Aktif)</span>
                  )}
                  {includeFridayPenalty && (
                    <span className="ml-1 text-amber-600 dark:text-amber-400 font-semibold">(Cuma=2 Gün Kuralı Aktif)</span>
                  )}
                </p>
              </div>

              {/* Action Buttons: Pin Badge & Export All CSV */}
              <div className="flex items-center gap-2">
                {pinnedOpportunities.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 rounded-full flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-current" /> {pinnedOpportunities.length} Kaydedildi
                  </span>
                )}

                {opportunities.length > 0 && (
                  <button
                    onClick={handleExportAllCsv}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all text-xs font-bold flex items-center gap-1.5"
                    title="Tüm Hesaplamaları Excel/CSV Formatında İndir"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>CSV / Excel</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of Opportunity Cards */}
            {opportunities.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  {minBlockEnabled
                    ? `Seçtiğiniz ${leaveBudget} gün izin bütçesi ile minimum ${minBlockDays} gün kesintisiz blok tatil oluşturan fırsat bulunamadı. Lütfen izin bütçenizi artırın veya minimum blok şartını düşürün.`
                    : 'Seçilen bütçe ve kriterlere uygun fırsat bulunamadı. Lütfen izin bütçenizi artırın veya kural ayarlarınızı kontrol edin.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSelected={currentSelectedOpportunity?.id === opp.id}
                    onSelect={() => setSelectedOpportunityId(opp.id)}
                  />
                ))}
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
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>%100 İstemci Tarafı & Gizlilik Odaklı — Verileriniz Sunucuya Gönderilmez.</span>
          </div>

          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span>Hesaplı İzin PWA © {selectedYear} — Tutkuyla Geliştirildi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </div>
        </div>
      </footer>
    </div>
  );
}
