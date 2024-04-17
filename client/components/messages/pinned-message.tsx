import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getPinnedMessages } from '@/helper/message';

export default function PinnedMessage({ channelId }: { channelId: string }) {
	const { data, isLoading } = useSWR('pinned-messages', () =>
		getPinnedMessages(channelId)
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Image
					src={'/icons/pin.svg'}
					width={24}
					height={24}
					alt={'pin'}
					key={'pin'}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-background mt-4 min-w-64 border-none p-0'>
				<header className='bg-foreground text-gray-2 min-h-12 p-2'>
					<h3 className='text-base font-semibold'>Pinned Message</h3>
				</header>
				{isLoading && <p>Loading...</p>}
				{data && data?.length < 1 ? (
					<div className='flex min-h-60 w-full flex-col items-center justify-center'>
						<Image
							src={'/icons/boom.svg'}
							width={100}
							height={100}
							alt={'boom'}
							key={'boom'}
						/>
						<p className='max-w-[calc(100%-50px)] pt-2 text-center text-sm text-white'>
							This channel doesn&apos;t have any pinned messages...yet.
						</p>
					</div>
				) : (
					<div className='size-full max-h-48 max-w-96 space-y-3 overflow-y-auto'>
						{data?.map((msg) => (
							<div
								key={msg.messages_id}
								className='text-gray-2 hover:bg-background group relative flex gap-2 p-3 hover:brightness-110'
							>
								<Image
									className='aspect-auto size-10 rounded-full object-cover'
									src={msg.image}
									width={30}
									height={30}
									alt='author'
								/>
								<div>
									<h4 className='text-sm font-semibold'>{msg.username}</h4>
									<p className=' break-before-auto whitespace-pre-wrap break-all text-sm font-light'>
										{msg.content}
									</p>
								</div>
								<Link
									href={`#${msg.messages_id}`}
									className='bg-background absolute right-2	 top-2 hidden rounded-md px-3 py-1 text-xs brightness-125 group-hover:block'
								>
									jump
								</Link>
							</div>
						))}
					</div>
				)}
				<footer className='bg-foreground min-h-16 p-2 text-white'>
					<h4 className='text-center text-base font-semibold uppercase text-green-600'>
						ProTip:
					</h4>
					<p className='text-gray-2  pt-2 text-center text-sm'>
						User with &apos;Manage messages&apos; can pin a message <br /> from
						it&apos;s context menu.
					</p>
				</footer>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
