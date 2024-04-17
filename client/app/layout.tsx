import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { ServerContextProvider } from '@/providers/server';

import { Toaster } from '@/components/ui/sonner';
import { SocketContextProvider } from '@/providers/socket-io';

const inter = Inter({
	subsets: ['latin'],
	weight: ['300', '400', '600', '500', '700', '800', '900'],
	fallback: ['sans-serif'],
});

export const metadata: Metadata = {
	title: 'Discord',
	description: 'Discord clone',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body
					className={`${inter.className} md:bg-background size-full bg-black`}
				>
					<SocketContextProvider>
						<ServerContextProvider>
							<div className='mx-auto w-full max-w-[1440px]'>{children}</div>
							<Toaster className='text-white' />
						</ServerContextProvider>
					</SocketContextProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
