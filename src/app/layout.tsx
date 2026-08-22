import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hesaplı İzin | Türkiye Yıllık İzin Optimizasyon PWA',
  description:
    'Resmî tatiller ve hafta sonlarını yıllık izinlerinizle birleştirerek maksimum kesintisiz tatil günü elde etmenizi sağlayan offline-first PWA uygulaması.',
  appleWebApp: {
    title: 'Hesaplı İzin',
    capable: true,
    statusBarStyle: 'black-translucent',
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
  themeColor: '#09090b',
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
        <meta name="apple-mobile-web-app-title" content="Hesaplı İzin" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
