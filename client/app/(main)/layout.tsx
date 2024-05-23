import { Suspense, type ReactNode } from "react";
import dynamic from "next/dynamic";

import Sidebar from "@/components/shared/sidebar/sidebar";
const SidebarMobile = dynamic(
	() => import('@/components/shared/sidebar/mobile')
);
export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
		<div className='size-full'>
			<div className='flex h-screen w-full overflow-hidden'>
				<Suspense
					fallback={
						<div className='h-screen min-w-[80px] max-w-[80px] animate-pulse bg-foreground'></div>
					}
				>
					<Sidebar />
				</Suspense>
				<div className='w-full'>{children}</div>
				<SidebarMobile />
			</div>
		</div>
	);
}
