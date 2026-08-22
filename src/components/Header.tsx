'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Wifi, WifiOff, RefreshCw, Sun, Moon, CalendarDays, Share2, Check } from 'lucide-react';
import { useLeaveStore } from '../store/useLeaveStore';
import { SUPPORTED_YEARS } from '../lib/turkeyHolidays';

export default function Header() {
  const { selectedYear, setSelectedYear, resetAll, theme, toggleTheme } = useLeaveStore();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [copiedAppShare, setCopiedAppShare] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'Hesaplı İzin PWA — Türkiye Yıllık İzin Optimizasyonu',
      text: 'Resmî tatiller ve hafta sonlarını birleştirerek maksimum tatil yapın!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // Fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedAppShare(true);
      setTimeout(() => setCopiedAppShare(false), 2000);
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-8 h-8 rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold shadow-sm shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
              Hesaplı<span className="text-zinc-500 dark:text-zinc-400 font-normal">İzin</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-md hidden xs:inline-block">
              2026–2050
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Share App Button */}
          <button
            onClick={handleShareApp}
            className="px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Uygulamayı Paylaş"
          >
            {copiedAppShare ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-zinc-500" />}
            <span className="hidden sm:inline">Paylaş</span>
          </button>

          {/* Year Switcher Select Box */}
          <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
            <CalendarDays className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer focus:outline-none pr-1"
            >
              {SUPPORTED_YEARS.map((year) => (
                <option key={year} value={year} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
            title={theme === 'dark' ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-600" />}
          </button>

          {/* Offline Badge */}
          <div
            className={`hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
              isOnline
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}
            title={isOnline ? 'Cihazınız çevrimiçi. Verileriniz tamamen lokal çalışır.' : 'Çevrimdışısınız (PWA aktif).'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-500" />
                <span>Lokal / Offline</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-500" />
                <span>Çevrimdışı Mod</span>
              </>
            )}
          </div>

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-900 font-medium text-xs rounded-md transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yükle</span>
            </button>
          )}

          {/* Reset button */}
          <button
            onClick={resetAll}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors"
            title="Ayarları Sıfırla"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
