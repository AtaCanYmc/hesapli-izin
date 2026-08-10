'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Wifi, WifiOff, Sparkles, RefreshCw, Sun, Moon, CalendarDays } from 'lucide-react';
import { useLeaveStore } from '../store/useLeaveStore';
import { SUPPORTED_YEARS } from '../lib/turkeyHolidays';

export default function Header() {
  const { selectedYear, setSelectedYear, resetAll, theme, toggleTheme } = useLeaveStore();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

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

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-md shadow-sky-500/20">
            <Calendar className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                Hesaplı<span className="text-sky-600 dark:text-sky-400">İzin</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-500 dark:text-sky-400" /> 2026-2050
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Resmî Tatil & Hafta Sonu İzin Optimizasyonu
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Year Switcher Select Box (2026 - 2050) */}
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <CalendarDays className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none pr-1"
            >
              {SUPPORTED_YEARS.map((year) => (
                <option key={year} value={year} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {year} Yılı
                </option>
              ))}
            </select>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 transition-all"
            title={theme === 'dark' ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-sky-600" />}
          </button>

          {/* Offline Badge */}
          <div
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
            }`}
            title={isOnline ? 'Cihazınız çevrimiçi. Verileriniz tamamen lokal çalışır.' : 'Çevrimdışısınız (PWA aktif).'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span>Çevrimdışı Hazır</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Çevrimdışı Mod</span>
              </>
            )}
          </div>

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Uygulamayı Yükle</span>
            </button>
          )}

          {/* Reset button */}
          <button
            onClick={resetAll}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            title="Ayarları Sıfırla"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
