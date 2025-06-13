import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InnovateX',
  description: 'Real-time voting platform',
  icons: {
    icon: '/logos/innovatex.png',
    shortcut: '/logos/innovatex.png',
    apple: '/logos/innovatex.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}