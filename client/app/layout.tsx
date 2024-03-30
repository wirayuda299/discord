import './global.css';

import { ClerkProvider } from '@clerk/nextjs';
import { Open_Sans as OpenSans } from 'next/font/google';
import type { ReactNode } from 'react';

import ReactQueryProvider from '@/providers/react-query';
import { SocketContextProvider } from '@/providers/socket-io';
import { Toaster } from '../components/ui/sonner';
import { ThemeProvider } from '../providers/theme';
import { SheetContextProvider } from '@/providers/sheet';

const font = OpenSans({
	display: 'swap',
	weight: ['400', '300', '600', '800'],
	subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body
					className={`${font.className} dark:bg-main-foreground size-full max-h-screen min-h-screen !overflow-hidden bg-white`}
				>
					<ReactQueryProvider>
						<SocketContextProvider>
							<SheetContextProvider>
								<ThemeProvider
									attribute='class'
									defaultTheme='dark'
									enableSystem={false}
									disableTransitionOnChange
									forcedTheme='dark'
								>
									{children}
									<Toaster />
								</ThemeProvider>
							</SheetContextProvider>
						</SocketContextProvider>
					</ReactQueryProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
