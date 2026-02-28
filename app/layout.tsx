import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Gohan — 週の献立',
  description: 'AIが毎週の夕食献立を自動生成します',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Navigation />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  );
}
