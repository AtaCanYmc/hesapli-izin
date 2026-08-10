'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Wifi, WifiOff, Sparkles, RefreshCw } from 'lucide-react';
import { useLeaveStore } from '../store/useLeaveStore';

export default function Header() {
  const { selectedYear, setSelectedYear, resetAll } = useLeaveStore();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-md shadow-sky-500/20">
            <Calendar className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                Hesaplı<span className="text-sky-400">İzin</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-sky-950 text-sky-300 border border-sky-800/60 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" /> PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Resmî Tatil & Hafta Sonu İzin Optimizasyonu
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Year Switcher */}
          <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setSelectedYear(2026)}
              className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                selectedYear === 2026
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2026
            </button>
            <button
              onClick={() => setSelectedYear(2027)}
              className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                selectedYear === 2027
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2027
            </button>
          </div>

          {/* Offline Badge */}
          <div
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                : 'bg-amber-950/40 text-amber-400 border-amber-800/50'
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
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Ayarları Sıfırla"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
