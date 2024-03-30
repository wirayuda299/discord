'use client';

import { MoveLeft } from 'lucide-react';
import { useState, TouchEvent } from 'react';

import ChannelMessages from '@/app/(main)/(routes)/server/_components/channel-messages';
import ChatForm from '@/components/shared/chat-form';
import { cn } from '@/lib/utils';
import { useSheetContext } from '@/providers/sheet';
import { useSearchParams } from 'next/navigation';

export default function SelectedChannelMobile() {
	const {
		sidebarOpen,
		handleSidebarOpen,
		selectedChannel,
		handleSecondarySidebarOpen,
		handleSelectedChannel,
	} = useSheetContext();
	const [startX, setStartX] = useState<number | null>(null);
	const params = useSearchParams();

	const handleTouchStart = (e: TouchEvent) => setStartX(e.touches[0].clientX);
	const handleTouchEnd = () => setStartX(null);

	const handleTouchMove = (e: TouchEvent) => {
		if (!startX) return;

		const currentX = e.touches[0].clientX;
		const difference = startX - currentX;

		if (difference > 20) {
			handleSidebarOpen(true);
		}
		if (difference < -20) {
			handleSidebarOpen(false);
			handleSecondarySidebarOpen(true);
			handleSelectedChannel(null);
		}
	};

	return (
		<div
			id='selected-channel-mobile'
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onTouchStart={handleTouchStart}
			className={cn(
				'fixed top-0 z-50 flex h-screen w-full flex-col justify-between rounded-lg border-l-2 border-l-main-foreground bg-[#1e1f22] px-3 text-white transition-all duration-300 ease-in-out md:hidden',
				sidebarOpen || params.get('type') === 'text'
					? 'right-0'
					: '-right-[calc(100%-20px)]',
				(!selectedChannel || !sidebarOpen) && '-right-[calc(100%-20px)]',
				selectedChannel || (!sidebarOpen && '-right-full')
			)}
		>
			{selectedChannel && (
				<>
					<header className='flex items-center gap-2 border-b py-2'>
						<button onClick={() => handleSidebarOpen(false)}>
							<MoveLeft />
						</button>
						<h2>#{selectedChannel?.channel_name}</h2>
					</header>
					<ChannelMessages channel_id={selectedChannel?.channel_id!} />
					{sidebarOpen && (
						<ChatForm
							channelName={selectedChannel?.channel_name!}
							channelId={selectedChannel?.channel_id!}
						/>
					)}
				</>
			)}
		</div>
	);
}
