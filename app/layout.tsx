// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../app/components/Navbar';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Job Board',
  description: 'A mini job board application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
