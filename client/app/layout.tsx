import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
// import { Poppins } from "next/font/google";
import type { Metadata, Viewport } from 'next';
import {  type ReactNode } from 'react';

import { ServerContextProvider } from '@/providers/server';

import { Toaster } from '@/components/ui/sonner';
import { SocketContextProvider } from '@/providers/socket-io';
import { UserContextProvider } from '@/providers/users';

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "600", "500", "700", "800", "900"],
//   fallback: ["sans-serif"],
//   display: "swap",
//   adjustFontFallback: true,
// });

export const metadata: Metadata = {
	title: 'Discord',
	description: 'Discord clone',
};

export const viewport: Viewport = {
	maximumScale: 1,
	userScalable: false,
	initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<ClerkProvider
				signUpUrl='/sign-up'
				signInUrl='/sign-in'
				afterSignInUrl='/direct-messages'
				afterSignUpUrl='/direct-messages'
			>
				<body className={` size-full bg-black md:bg-background`}>
					<SocketContextProvider>
						<ServerContextProvider>
							<UserContextProvider>
									<div className='mx-auto w-full max-w-[1440px]'>
										{children}
									</div>
									<Toaster className='text-white' />
							</UserContextProvider>
						</ServerContextProvider>
					</SocketContextProvider>

				</body>
			</ClerkProvider>
		</html>
	);
}
