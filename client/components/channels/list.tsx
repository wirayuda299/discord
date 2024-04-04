'use client';

import { ChevronLeft, Plus, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { useServerContext } from '@/providers/server';
import { Channel } from '@/types/channels';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';

export default function ChannelList({ channels }: { channels: Channel[] }) {
	const { userId } = useAuth();
	const { setSelectedChannel } = useServerContext();
	const [selectedCategory, setSelectedCategory] = useState<string>('');

	const groupedChannels = useMemo(() => {
		return channels.reduce((acc: Channel[], channel) => {
			const category = acc.find((c) => c.category_id === channel.category_id);
			if (category) {
				category.channels.push(channel);
			} else {
				acc.push({
					category_id: channel.category_id,
					category_name: channel.category_name,
					channels: [channel],
					channel_id: channel.channel_id,
					channel_name: channel.channel_name,
					channel_type: channel.channel_type,
				});
			}
			return acc;
		}, []);
	}, [channels]);

	return (
		<div className='text-gray-2'>
			{groupedChannels.map((channel) => (
				<div className='my-4' key={channel.category_id}>
					<div className='flex w-full items-center justify-between'>
						<div
							onClick={() =>
								setSelectedCategory((prev) =>
									prev === channel.category_name ? '' : channel.category_name
								)
							}
							className='flex cursor-pointer items-center gap-1 '
						>
							<ChevronLeft
								size={18}
								className={cn(
									'-rotate-90 transition-all ease duration-500',
									selectedCategory === channel.category_name && 'rotate-90'
								)}
							/>
							<h3 className='text-xs font-semibold uppercase'>
								#{channel.category_name} channel
							</h3>
						</div>
						<button>
							<Plus size={18} />
						</button>
					</div>
					<ul
						className={cn(
							'h-0 flex flex-col gap-1',
							selectedCategory === channel.category_name
								? 'h-auto overflow-auto transition-all ease duration-300'
								: 'overflow-hidden'
						)}
					>
						{channel?.channels?.map((c) => (
							<li
								key={c.channel_id}
								onClick={() => setSelectedChannel(channel)}
								className='hover:bg-background/25 group cursor-pointer rounded-lg px-5 py-2 text-sm'
							>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-1'>
										{c.channel_type === 'audio' && (
											<Image
												src={'/icons/volume.svg'}
												width={18}
												height={18}
												alt='volume icon'
											/>
										)}
										<span>#{c.category_name}</span>
									</div>
									{/* {userId ===  && (
									<button className='hidden group-hover:block'>
										<UserPlus size={18} />
									</button>
								)} */}
								</div>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
