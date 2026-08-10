import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hesaplı İzin | Türkiye Yıllık İzin Optimizasyon PWA',
  description:
    'Resmî tatilleri ve hafta sonlarını yıllık izinlerinizle birleştirerek maksimum kesintisiz tatil günü elde etmenizi sağlayan offline-first PWA uygulaması.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  keywords: [
    'yıllık izin optimizasyonu',
    'resmi tatiller 2026',
    'resmi tatiller 2027',
    'tatil hesaplama',
    'köprü gün izin',
    'arefe izin hesaplama',
    'PWA tatil uygulaması',
  ],
};

export const viewport: Viewport = {
  themeColor: '#0284c7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
