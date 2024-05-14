import { Suspense, type ReactNode } from "react";

import Sidebar from "@/components/shared/sidebar/sidebar";
import SidebarMobile from "@/components/shared/sidebar/mobile";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
		<div className='size-full'>
			<div className='flex h-screen w-full overflow-hidden'>
				<Suspense fallback={<div className="h-screen w-full min-w-[80px] animate-pulse bg-background brightness-110"></div>}>
					<Sidebar />
				</Suspense>
				<div className='w-full'>{children}</div>
				<SidebarMobile />
			</div>
		</div>
	);
}
