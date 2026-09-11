import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RESCHO - Find Your Perfect Dinner Spot Together',
  description:
    'A gamified restaurant matching app. Connect with your partner, swipe through restaurants, and find the perfect place for your next meal together.',
  keywords: ['restaurant', 'dating', 'dinner', 'matching', 'food', 'swipe'],
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/favicon.png' }],
    shortcut: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ff3a5c',
          colorBackground: '#0e0e14',
          colorInputBackground: '#16161f',
          colorInputText: '#f0f0f5',
          colorText: '#f0f0f5',
          colorTextSecondary: '#8e8ea0',
        },
        elements: {
          card: 'border border-white/5 shadow-2xl',
          userButtonPopoverCard: 'border border-white/5 shadow-2xl',
        }
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${outfit.variable} ${plusJakarta.variable} antialiased no-pull-refresh noise font-sans`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

