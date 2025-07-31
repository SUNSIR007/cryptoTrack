import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoTrack - 实时加密货币价格监测',
  description: '开源的加密货币价格追踪工具，仅供教育和信息参考。实时监测BTC、ETH、SOL等主流加密货币价格，不提供投资建议。',
  keywords: ['cryptocurrency', 'bitcoin', 'ethereum', 'solana', 'price tracker', 'educational', 'open source'],
  authors: [{ name: 'CryptoTrack Team' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'CryptoTrack - 开源加密货币价格追踪工具',
    description: '教育用途的开源项目，实时显示主流加密货币价格信息',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoTrack - 开源加密货币价格追踪工具',
    description: '教育用途的开源项目，实时显示主流加密货币价格信息',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  other: {
    'application-name': 'CryptoTrack',
    'apple-mobile-web-app-title': 'CryptoTrack',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  }
};

export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
