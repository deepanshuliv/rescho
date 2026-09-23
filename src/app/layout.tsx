import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import MotionProvider from '@/components/ui/MotionProvider';
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
  openGraph: {
    title: 'RESCHO - Find Your Perfect Dinner Spot Together',
    description:
      'Swipe through restaurants with your partner. When you both like the same place, it is a match.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#06060a',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ff3a5c',
          colorBackground: '#09090b',
          colorInputBackground: '#111114',
          colorInputText: '#f0f0f5',
          colorText: '#f0f0f5',
          colorTextSecondary: '#8e8ea0',
        },
        elements: {
          card: 'border border-white/[0.07] shadow-2xl',
          userButtonPopoverCard: 'border border-white/[0.07] shadow-2xl',
        }
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${outfit.variable} ${plusJakarta.variable} antialiased no-pull-refresh noise font-sans`}
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-sm focus:text-text-primary"
          >
            Skip to content
          </a>
          <div className="aurora" aria-hidden />
          <MotionProvider>
            <div id="main" className="relative z-[1]">{children}</div>
          </MotionProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

