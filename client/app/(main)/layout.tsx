import type { ReactNode } from 'react';

import Sidebar from '@/components/shared/sidebar/sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex h-full justify-start overflow-hidden'>
			<Sidebar />
			{children}
		</div>
	);
}
