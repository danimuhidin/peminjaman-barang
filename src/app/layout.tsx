// app/layout.tsx
import './globals.css'; // Import global CSS (termasuk Tailwind)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Contoh font

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aplikasi Peminjaman Barang',
  description: 'Aplikasi manajemen peminjaman barang dengan Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen"> {/* Tambahkan padding bottom sesuai tinggi navbar */}
          <main className="flex-grow bg-gray-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}