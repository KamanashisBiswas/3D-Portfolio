import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

// ─── Font Definitions ────────────────────────────────────────────────────────

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Kamanashis Biswas | 3D Science Lab Portfolio',
  description:
    'Cinematic, interactive 3D science laboratory portfolio for Kamanashis Biswas — Full-Stack Web Developer.',
  openGraph: {
    title: 'Kamanashis Biswas | 3D Science Lab Portfolio',
    description:
      'Cinematic, interactive 3D science laboratory portfolio for Kamanashis Biswas — Full-Stack Web Developer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kamanashis Biswas | 3D Science Lab Portfolio',
    description:
      'Cinematic, interactive 3D science laboratory portfolio for Kamanashis Biswas — Full-Stack Web Developer.',
  },
};

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
