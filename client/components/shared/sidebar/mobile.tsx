import Link from "next/link";

import { navItemsMobile } from "@/constants/sidebarLinks";

export default function SidebarMobile() {
  return (
		<div className='border-t-foreground fixed bottom-0 h-16 w-full border-t-2 bg-black md:hidden'>
			<ul className='flex h-full items-center justify-evenly'>
				{navItemsMobile.map((item) => (
					<li key={item.path}>
						<Link href={item.path}>{item.icon}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
