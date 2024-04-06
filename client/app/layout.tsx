import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { ServerContextProvider } from '@/providers/server';

import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
	subsets: ['latin'],
	weight: ['300', '400', '600', '500', '700', '800', '900'],
});

export const metadata: Metadata = {
	title: 'Discord',
	description: 'Discord clone',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<ClerkProvider>
				<body className={`${inter.className} md:bg-background bg-black`}>
					<ServerContextProvider>
						{children}
						<Toaster className='text-white' />
					</ServerContextProvider>
				</body>
			</ClerkProvider>
		</html>
	);
}
