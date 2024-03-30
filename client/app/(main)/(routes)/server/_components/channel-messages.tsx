'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Pin } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { useSocketContext } from '@/providers/socket-io';
import { generateRandomColor } from '@/utils/random-color';
import { Skeleton } from '@/components/ui/skeleton';
import { pinMessage } from '@/actions/messages';

export function SkeletonDemo() {
	return (
		<div className='flex items-center space-x-4'>
			<Skeleton className='size-12 rounded-full' />
			<div className='space-y-2'>
				<Skeleton className='h-4 w-[250px]' />
				<Skeleton className='h-4 w-[200px]' />
			</div>
		</div>
	);
}

export default function ChannelMessages({
	channel_id,
}: {
	channel_id: string;
}) {
	const { userId } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const { channelMessages, socket, setChannelMessages } = useSocketContext();
	const ref = useRef<HTMLDivElement>(null);
	const channelId = useMemo(() => {
		return channel_id;
	}, [channel_id]);

	useEffect(() => {
		setLoading(true);
		setChannelMessages([]);
		if (!socket) return;

		socket.emit('messages-channel', { channelId });
		setLoading(false);
	}, [socket, channelId, setChannelMessages]);

	async function handlePinMessage(msgId: string) {
		try {
			await pinMessage(channel_id, msgId, window.location.pathname);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Unknown error');
			}
		}
	}

	function handleScroll(timeoutId: number | undefined) {
		if (ref && ref.current) {
			const element = ref.current;

			timeoutId = window.setTimeout(() => {
				element.scroll({
					top: element.scrollHeight,
					left: 0,
					behavior: 'smooth',
				});
			}, 100);
		}
	}

	useEffect(() => {
		let timeoutId: number | undefined;
		handleScroll(timeoutId);
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [ref, channelMessages]);

	return (
		<div
			className='z-0 flex h-screen flex-col gap-3 space-y-2 overflow-y-auto p-2 '
			ref={ref}
		>
			{loading && [1, 2, 3, 4, 5].map((c) => <SkeletonDemo key={c} />)}
			{!loading &&
				channelMessages?.map((msg, i) => (
					<Suspense
						key={new Date(msg.created_at).getTime() + i}
						fallback={<SkeletonDemo />}
					>
						<div className='relative z-0 flex gap-3'>
							<Image
								src={msg.image}
								width={40}
								height={40}
								alt='user'
								className='aspect-auto size-10 min-w-10 rounded-full object-cover'
							/>
							<div className='group flex items-center gap-2'>
								<div>
									<h3
										className={'flex items-center gap-2 text-xs font-semibold'}
										style={{
											color:
												msg.user_id === userId ? '#fff' : generateRandomColor(),
										}}
									>
										{msg.username}{' '}
										<span className='text-xs text-[#55575f]'>
											{new Date(msg.created_at).toLocaleTimeString()}
										</span>
									</h3>
									<p className='text-xs font-medium text-[#dbdee1]'>
										{msg.content}
									</p>
									{msg.image_url && (
										<Image
											className='aspect-auto size-32 rounded-md object-contain pt-3'
											alt='image'
											loading='lazy'
											src={msg?.image_url}
											width={100}
											height={100}
										/>
									)}
									{msg.user_id === userId && (
										<button
											onClick={() => handlePinMessage(msg.message_id)}
											className='float-right opacity-0 group-hover:opacity-100'
										>
											<Pin className='text-gray-1' size={15} />
										</button>
									)}
								</div>
							</div>
						</div>
					</Suspense>
				))}
		</div>
	);
}
