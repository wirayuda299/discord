import { Compass, Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { getAllServerCreatedByCurrentUser } from '@/actions/server';
import CreateServer from '../create-server/modal';
import ServerItem from './server-item';
import { cn } from '@/lib/utils';

export default async function Sidebar({ styles }: { styles?: string }) {
	const userServers = await getAllServerCreatedByCurrentUser();

	return (
		<aside
			className={cn(
				'flex min-h-screen h-full w-16  z-40  min-w-16 flex-col items-center overflow-y-auto overflow-x-hidden bg-dark-1 p-2 sm:w-20 ',
				styles
			)}
		>
			<Link
				href={'/me'}
				className='bg-secondary-purple hidden aspect-square flex-col items-center rounded-lg p-2 md:flex '
			>
				<Image
					src={'/icons/logo.svg'}
					width={30}
					height={30}
					alt='discord logo'
				/>
			</Link>
			<div className='bg-main-foreground mt-2 h-0.5 w-full rounded-full brightness-125'></div>
			<Suspense fallback={<Loader />}>
				{userServers && userServers.length >= 1 && (
					<>
						<ul className='mt-2 flex flex-col gap-2'>
							{userServers?.map((server) => (
								<ServerItem key={server.id} server={server} />
							))}
						</ul>
						<div className='bg-main-foreground mt-2 h-0.5 w-full rounded-full brightness-125'></div>
					</>
				)}
			</Suspense>
			<CreateServer />
			<button
				title='discover server'
				className='bg-main-foreground mt-3 flex min-h-12 min-w-12 items-center justify-center rounded-full p-2 brightness-110'
			>
				<Compass stroke='rgb(49 51 56)' className='brightness-150' size={25} />
			</button>
		</aside>
	);
}
