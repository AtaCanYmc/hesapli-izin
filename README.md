# 🏖️ Hesaplı İzin — Türkiye Yıllık İzin Optimizasyonu PWA

<div align="center">

> **Resmî tatilleri, Arefeleri ve hafta sonlarını yıllık izinlerinizle birleştirerek maksimum tatil günü elde edin.**  
> **Maximize your vacation days in Turkey (2026–2050) by smartly combining public holidays, official half-days (Arefe), and weekends.**

[ 🇹🇷 Türkçe README ](#-türkçe) | [ 🇬🇧 English README ](#-english)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline_First-emerald?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

<a name="-türkçe"></a>
## 🇹🇷 Türkçe README

### 🌟 Genel Bakış

**Hesaplı İzin**, Türkiye'de çalışanlar için geliştirilmiş, resmî tatilleri, dinî bayramları (Arefeler dahil) ve hafta sonlarını yıllık izinlerle akıllıca birleştirerek **minimum izin günü harcayarak maksimum kesintisiz tatil** elde etmeyi sağlayan, %100 çevrimdışı çalışan bir **Progressive Web App (PWA)** uygulamasıdır.

Tüm hesaplamalar **%100 istemci tarafında (client-side)** tarayıcınızda gerçekleşir. İzin bütçeniz, seçtiğiniz planlar veya şirket bilgileri hiçbir sunucuya gönderilmez.

---

### ✨ Öne Çıkan Özellikler

- 🎯 **3 Farklı Optimizasyon Algoritması (`optimizerEngine.ts`)**:
  - **Maksimum Verimlilik (ROI)**: $\text{Verimlilik Skoru} = \frac{\text{Toplam Kesintisiz Tatil Günü}}{\text{Harcanan İzin Günü}}$ kaldıraç oranını maksimize eder.
  - **Uzun Blok Tatiller**: İzinleri bölmeden tek/çift hamlede 9–10+ günlük kesintisiz tatil blokları oluşturur.
  - **Arefe & Yarım Gün Odaklı**: 0.5 günlük Arefe kaldıraçlarını (28 Ekim, Bayram Arefeleri) önceliklendirir.

- 📅 **2026 – 2050 Türkiye Resmî Tatil Zekası**:
  - Önümüzdeki 25 yılın tüm sabit millî tatillerini ve Hicri takvim kaymalarına göre hesaplanan Ramazan & Kurban Bayramı tarihlerini otomatik hesaplar.

- ⚙️ **Özel Şirket & Kanun İzin Kuralları**:
  - **Cuma İzni 2 Gün Sayılsın Kuralı**: Cuma izinlerinde hafta sonu kotadan düşen kurumlar için 2x maliyet hesabı.
  - **Min. X Gün Blok İzin Şartı (İş Kanunu m. 56)**: İznin bir parçasının en az 10 gün kesintisiz olma zorunluluğunu denetler.
  - **Akıllı Blok İzin Uyarısı**: Sepet boşken ilk olarak kısa izin eklenmeye çalışıldığında kullanıcıyı uyarır.

- 🛒 **Çoklu İzin Paket Seçimi & Sıralı Optimizasyon**:
  - Bir izin paketi sepete eklendiğinde kalan bütçe otomatik hesaplanır ve kalan günler için öncelik **Uzun Blok İzinlere** verilir.
  - **Kombinasyonlu İzin Sepeti**: Yıl boyunca farklı bayramları birleştirerek toplam tatil kazancını hesaplar.

- 🏢 **Özel & İdari Tatil Yönetimi**:
  - Şirket izin günlerinizi veya sonradan ilan edilen idari izinleri ekleyip hesaba dahil edin.

- 📥 **Dışa Aktarma, İndirme ve Paylaşım**:
  - **iCalendar (.ics)**: Google Calendar, Outlook ve Apple Calendar'a tek tıkla aktarma.
  - **PDF / HR İzin Dilekçesi**: İnsan Kaynakları onayına sunulmaya hazır yazdırılabilir rapor (`window.print()`).
  - **Excel / CSV**: Türkçe karakter destekli UTF-8 BOM kodlamalı `.csv` indirmesi.
  - **WhatsApp & Web Share API**: Tek tıkla WhatsApp ve mobil paylaşım sheet'i üzerinden plan gönderme.

- 🌙 **Koyu (Dark) ve Açık (Light) Tema Desteği**:
  - Güneş / Ay ikonu ile anlık tema geçişi ve kalıcı tercih saklama.

- ⚡ **Offline-First PWA**:
  - Mobil (iOS / Android) ve masaüstü cihazlara çevrimdışı uygulama olarak yüklenebilir.

---

### 🛠️ Teknoloji Yığını

- **Framework**: Next.js 14+ (App Router, Static Export)
- **Dil**: TypeScript (Tam Tip Güvenliği)
- **Stil**: Tailwind CSS v3 (Karanlık/Açık Tema)
- **State**: Zustand (`localStorage` Kalıcılığı)
- **PWA**: `@ducanh2912/next-pwa` (Service Worker, Manifest)
- **İkonlar**: `lucide-react`
- **Tarih Kütüphanesi**: `date-fns` (Türkçe Yerelleştirme)

---

### 🚀 Kurulum ve Yerel Geliştirme

```bash
# Depoyu klonlayın
git clone https://github.com/your-username/hesapli-izin.git
cd hesapli-izin

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Statik production derlemesi yapın
npm run build
```

---

<a name="-english"></a>
## 🇬🇧 English README

### 🌟 Overview

**Hesaplı İzin** is a production-ready, privacy-focused Progressive Web App (PWA) designed for employees working in Turkey. It calculates optimal leave schedules to yield the maximum number of consecutive off days while minimizing spent annual leave balance across **2026 to 2050**.

Everything runs **100% client-side** inside the browser. No personal data, leave preferences, or company details are ever transmitted to any remote server.

---

### ✨ Key Features

- 🎯 **Multi-Strategy Optimization Engine (`optimizerEngine.ts`)**:
  - **Maximum Efficiency (ROI)**: Maximizes the Return-on-Investment score ($\text{Efficiency} = \frac{\text{Total Off Days}}{\text{Spent Leave Days}}$).
  - **Long Block Vacations**: Groups contiguous off-days into unbroken 9–10+ day long breaks.
  - **Arefe & Half-Day Focus**: Capitalizes on 0.5-day Arefe opportunities (28 Oct, Ramazan/Kurban Arefe).

- 📅 **Turkey Official Holidays Engine (2026 – 2050)**:
  - Supports all fixed national holidays and moving religious holidays (Ramazan & Kurban Bayramı) for the next 25 years with sub-day precision.

- ⚙️ **Corporate & Legal Rule Support**:
  - **Friday Leave 2-Day Penalty Rule**: Adjusts cost calculations for companies where taking Friday off deducts Saturday/weekend from leave allowance (2x cost).
  - **Minimum X Days Block Requirement (Labor Law Art. 56)**: Filters opportunities to ensure employees satisfy mandatory continuous block leave requirements (e.g. min 10 days).
  - **Smart Block Warning Modal**: Warns users if they attempt to add short breaks to an empty annual plan before securing a long block vacation.

- 🛒 **Multi-Package Sequential Leave Planner & Cart**:
  - Add multiple leave packages to your annual plan cart.
  - Automatically recalculates remaining leave budget and locks selected calendar dates.
  - Automatically prioritizes long block vacations for any remaining leave balance.

- 🏢 **Custom & Administrative Holiday Creator**:
  - Add company-specific holidays, local liberation days, or government-announced administrative bridge days.

- 📥 **Export & Download Options**:
  - **iCalendar (.ics)**: 1-click import into Google Calendar, Outlook, and Apple Calendar.
  - **PDF / HR Request Form**: Generates a printable annual leave request report for HR approval (`window.print()`).
  - **Excel / CSV Export**: UTF-8 BOM encoded CSV download supporting Turkish characters.
  - **WhatsApp & Native Web Share**: 1-click sharing formatted for WhatsApp and mobile share sheets.

- 🌙 **Dark / Light Mode**:
  - Complete dark and light theme switching with persistent local storage preference.

- ⚡ **Offline-First PWA & Service Worker**:
  - Built with Workbox caching strategies. Can be installed as a standalone app on iOS, Android, macOS, and Windows.

---

### 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, Static Export)
- **Language**: TypeScript (Strict type safety)
- **Styling**: Tailwind CSS v3 with dynamic dark mode
- **State Management**: Zustand with `persist` middleware (Local Storage)
- **PWA**: `@ducanh2912/next-pwa` (Service Worker, Web App Manifest)
- **Icons**: `lucide-react`
- **Date Math**: `date-fns` (Turkish locale)

---

### 🚀 Getting Started & Setup

```bash
# Clone repository
git clone https://github.com/your-username/hesapli-izin.git
cd hesapli-izin

# Install dependencies
npm install

# Start local development server
npm run dev

# Build static production bundle
npm run build
```

---

### 🚢 Deployment (GitHub Pages & CI/CD)

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the static PWA to **GitHub Pages** whenever code is pushed to the `main` branch.

To enable GitHub Pages for your repository:
1. Navigate to **Settings -> Pages** in your GitHub repository.
2. Select **GitHub Actions** as the deployment source.
3. Push changes to `main` and your app will be live at `https://<username>.github.io/hesapli-izin/`.

---

## 📁 Directory Structure

```text
hesapli-izin/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD workflow
├── public/
│   ├── manifest.json           # Web App Manifest
│   ├── .nojekyll               # Jekyll bypass for GitHub Pages
│   └── icon.svg                # PWA App Icon
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind base & dark/light theme CSS
│   │   ├── layout.tsx          # Root layout & PWA metadata
│   │   └── page.tsx            # Main application dashboard page
│   ├── components/
│   │   ├── Header.tsx          # App bar with theme toggle, year picker & install button
│   │   ├── ControlsSection.tsx # Budget slider, algorithm tabs & corporate rules
│   │   ├── OpportunityCard.tsx # Leave opportunity card with export & share menu
│   │   ├── CalendarView.tsx    # Monthly interactive color-coded calendar
│   │   ├── AnnualPlanCart.tsx  # Multi-package annual vacation plan cart
│   │   ├── SummaryStats.tsx    # Key analytics metrics cards
│   │   ├── CustomHolidayModal.tsx  # Modal to create custom/company holidays
│   │   └── BlockLeaveWarningModal.tsx # Warning modal for first non-block package
│   ├── lib/
│   │   ├── optimizerEngine.ts  # Core optimization algorithms engine
│   │   ├── turkeyHolidays.ts   # 2026-2050 Turkey official holiday generator
│   │   └── exportUtils.ts      # iCalendar (.ics), CSV, PDF print & share helpers
│   ├── store/
│   │   └── useLeaveStore.ts    # Persistent Zustand application store
│   └── types/
│       └── holiday.ts          # TypeScript type definitions
├── next.config.js              # Next.js static export & PWA wrapper config
├── tailwind.config.js          # Tailwind design tokens & themes
└── tsconfig.json               # TypeScript configuration
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
