import { Compass } from 'lucide-react';
import Image from 'next/image';
import { auth } from '@clerk/nextjs';

import ServerList from './server-list';
import CreateServerModal from '../create-server/modal';
import { getAllServerCreatedByCurrentUser } from '@/helper/server';

export default async function Sidebar() {
	const { userId } = auth();
	if (!userId) return null;

	const servers = await getAllServerCreatedByCurrentUser(userId);

	return (
		<aside className='md:bg-foreground border-r-foreground flex size-full min-h-screen  min-w-[80px] max-w-[80px] shrink flex-col items-center overflow-y-auto border-r-2 bg-black/50 p-4'>
			<header className='bg-primary hidden rounded-md p-2 md:block'>
				<Image
					src={'/icons/discord.svg'}
					priority
					className='hidden md:block'
					width={30}
					height={30}
					alt='logo'
				/>
			</header>
			<ServerList servers={servers ?? []} />
			<div className='mt-3 flex flex-col gap-4 pb-10'>
				<CreateServerModal />
				<button className='bg-background ease hover:bg-green-1 group flex size-12 items-center justify-center rounded-full transition-colors duration-300'>
					<Compass className='stroke-green-1 group-hover:stroke-white' />
				</button>
			</div>
		</aside>
	);
}
