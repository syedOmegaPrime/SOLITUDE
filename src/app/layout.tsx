import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a fallback, Geist is primary
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it's causing an error and not essential
import './globals.css';
import { AppProviders } from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SOLITUDE',
  description: 'A marketplace for high-quality 2D and 3D assets, tailored for the creative community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${inter.variable} antialiased flex flex-col min-h-screen`}>
        <AppProviders>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
