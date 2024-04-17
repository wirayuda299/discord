import { Link, UserPlus2 } from 'lucide-react';
import Image from 'next/image';

import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';

export default function AddUserDrawer({
	styles,
	size = 18,
}: {
	styles?: string;
	size?: number;
}) {
	return (
		<Drawer>
			<DrawerTrigger
				asChild
				className={styles}
				onClick={(e) => e.stopPropagation()}
			>
				<UserPlus2 stroke='#fff' size={size} />
			</DrawerTrigger>
			<DrawerContent className='w-full border-none bg-black p-3  md:top-0 md:mx-auto md:h-max md:max-h-[500px] md:max-w-[500px] md:overflow-y-auto'>
				<DrawerHeader>
					<DrawerTitle className='text-white'>Invite a friend</DrawerTitle>
				</DrawerHeader>
				<button className='bg-background flex size-10 items-center justify-center rounded-full'>
					<Link stroke='#fff' size={18} />
				</button>
				<ul className='mt-5'>
					<li className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<Image
								src={'/icons/discord.svg'}
								width={40}
								className='aspect-auto object-contain'
								height={40}
								alt='user'
							/>
							<h3 className='font-semibold text-white'>Username</h3>
						</div>
						<button className='bg-background rounded-full px-3 text-sm text-white'>
							Invite
						</button>
					</li>
				</ul>
			</DrawerContent>
		</Drawer>
	);
}
