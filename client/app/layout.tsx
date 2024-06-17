import './globals.css';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/nextjs';

import PulseLoader from '@/components/shared/pulse-loader';
import { Toaster } from '@/components/ui/sonner';
import { SocketProvider } from '@/providers/socket-io';

const inter = Inter({ subsets: ['latin'], fallback: ['sans-serif'] });

export const metadata: Metadata = {
  title: 'Discord-clone',
  description: 'Generated by create next app',
};


export const viewport: Viewport = {
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maxiumScale: 1,
  userScalable: false,


}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={
            inter.className + 'h-full w-full overflow-hidden text-secondary'
          }
        >
          <ClerkLoading>
            <PulseLoader />
          </ClerkLoading>
          <ClerkLoaded>
            <SocketProvider>
              <div className='w-full max-w-screen-2xl !overflow-hidden bg-black text-secondary md:bg-foreground'>
                {children}
              </div>
            </SocketProvider>
          </ClerkLoaded>
          <Toaster
            duration={1500}
            className='border-none bg-background !text-white'
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
