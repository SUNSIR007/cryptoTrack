import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../src/lib/theme-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoTrack - 实时加密货币价格监测',
  description: '实时监测BTC、ETH、SOL和BNB等加密货币价格',
  keywords: ['cryptocurrency', 'bitcoin', 'ethereum', 'solana', 'price tracker'],
  authors: [{ name: 'CryptoTrack Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
};

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
