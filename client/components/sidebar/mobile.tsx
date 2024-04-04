import { Bell, LayoutGrid, MessageCircle, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';

export default function SidebarMobile() {
	return (
		<div className='border-t-foreground fixed bottom-0 h-16 w-full border-t-2 bg-black md:hidden'>
			<ul className='flex h-full items-center justify-evenly'>
				<li>
					<Link href={'/me'}>
						<LayoutGrid color='#fff' size={30} />
					</Link>
				</li>
				<li>
					<Link href={'/messages'}>
						<MessageCircle color='#fff' size={30} />
					</Link>
				</li>
				<li>
					<Link href={'/notification'}>
						<Bell color='#fff' size={30} />
					</Link>
				</li>
				<li>
					<Link href={'/profile'}>
						<UserRoundPlus color='#fff' size={30} />
					</Link>
				</li>
			</ul>
		</div>
	);
}
