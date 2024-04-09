import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { ReactNode } from 'react';

export default function ClerkProviders({ children }: { children: ReactNode }) {
	return (
		<>
			<ClerkLoading>
				<div>Clerk is loading</div>
			</ClerkLoading>
			<ClerkLoaded>{children}</ClerkLoaded>
		</>
	);
}
