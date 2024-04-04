import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Discord',
	description: 'Discord clone',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<ClerkProvider>
				<body className={`${inter.className} md:bg-background bg-black`}>
					{children}
					<Toaster className='text-white' />
				</body>
			</ClerkProvider>
		</html>
	);
}
