import ClerkProviders from '@/providers/clerk';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex h-screen items-center justify-center'>
			<ClerkProviders>{children}</ClerkProviders>
		</div>
	);
}
