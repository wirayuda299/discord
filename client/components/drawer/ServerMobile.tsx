import { Bell, ChevronRight, Cog } from 'lucide-react';
import Image from 'next/image';
import { KeyedMutator } from 'swr';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Servers } from '@/types/server';
import CreateChannelDrawerMobile from './create-channel';
import CreateCategoryMobile from './create-category';
import AddUserDrawer from './add-user';

export default function ServerDrawerMobile<T>({
	server,
	mutate,
}: {
	server: Servers;
	mutate: KeyedMutator<T>;
}) {
	if (!server) return null;

	return (
		<Drawer>
			<DrawerTrigger>
				<ChevronRight className='text-gray-2' size={17} />
			</DrawerTrigger>
			<DrawerContent className='top-0 !h-full  border-none bg-black p-3'>
				<div className='min-h-full overflow-y-auto pb-28'>
					{server.logo && (
						<Image
							src={server?.logo}
							width={50}
							priority
							height={50}
							alt='server logo'
							className='size-14 rounded-full object-cover'
						/>
					)}
					<h2 className='mt-3 text-xl font-semibold capitalize text-white'>
						{server?.name}
					</h2>

					<div className='mt-1 flex items-center gap-3 text-xs text-white'>
						<div className='bg-green-1 size-2 rounded-full'></div>
						<span>0 Online</span>
						<div className='bg-gray-2 size-2 rounded-full'></div>
						<span>0 Member</span>
					</div>

					<ul className='mt-5 flex justify-between text-white'>
						<li className='flex flex-col items-center'>
							<Image
								src={'/icons/boost.svg'}
								width={25}
								height={25}
								alt='boost'
								className='aspect-auto object-contain'
							/>
							<p className='text-gray-2 text-xs font-semibold capitalize'>
								boost
							</p>
						</li>
						<li className='flex flex-col items-center'>
							<AddUserDrawer />
							<p className='text-gray-2 text-xs font-semibold capitalize'>
								invite
							</p>
						</li>
						<li className='flex flex-col items-center'>
							<Bell />
							<p className='text-gray-2 text-xs font-semibold capitalize'>
								notifications
							</p>
						</li>
						<li className='flex flex-col items-center'>
							<Cog />
							<p className='text-gray-2 text-xs font-semibold capitalize'>
								settings
							</p>
						</li>
					</ul>

					<ul className='bg-background/25 divide-background mt-8  gap-3 divide-y rounded-md p-3 text-white'>
						<CreateChannelDrawerMobile serverId={server?.id} mutate={mutate} />
						<CreateCategoryMobile />
						<li className='py-3 text-sm font-semibold capitalize'>
							create event
						</li>
					</ul>

					<ul className='bg-background/25 mt-8  divide-y divide-gray-700 rounded-md p-3 text-white'>
						<li className='py-3 text-sm font-semibold capitalize'>
							Edit server profile
						</li>
						<li className='py-3 text-sm font-semibold capitalize'>
							Report raid
						</li>
						<li className='py-3 text-sm font-semibold capitalize'>
							Report server
						</li>
					</ul>
					<div className='h-max'>
						<h3 className='mt-3 text-base font-semibold text-white'>
							Developer mode
						</h3>
						<button className='bg-background/25 mt-3 w-full p-2 text-left font-semibold capitalize text-white'>
							Copy server id
						</button>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
