'use client';
import { useState, TouchEvent } from 'react';

import { Channel } from '@/types/channels';
import { Servers } from '@/types/server';
import ChannelItem from '@/components/shared/channel-item';
import { cn } from '@/lib/utils';
import { useSheetContext } from '@/providers/sheet';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	ChevronLeft,
	CircleFadingPlus,
	Cog,
	Pen,
	Plus,
	UserPlus,
} from 'lucide-react';

const items = [
	{
		label: 'invite people',
		icon: <UserPlus size={18} />,
	},
	{
		label: 'server settings',
		icon: <Cog size={18} />,
	},
	{
		label: 'create channel ',
		icon: (
			<div className='rounded-full bg-gray-400 p-px text-black'>
				<Plus size={18} />
			</div>
		),
	},
	{
		label: 'create category',
		icon: <CircleFadingPlus size={18} />,
	},
	{
		label: 'edit server profile',
		icon: <Pen size={18} />,
	},
];

export default function ServerChannel({
	server,
	channels,
	styles,
}: {
	server?: Servers;
	channels: {
		audio: Channel[];
		text: Channel[];
	};
	styles?: string;
}) {
	const [startX, setStartX] = useState<number | null>(null);
	const {
		handleSecondarySidebarOpen,
		secondarySidebarOpen,
		handleSidebarOpen,
	} = useSheetContext();

	const handleTouchStart = (e: TouchEvent) => setStartX(e.touches[0].clientX);
	const handleTouchEnd = (e: TouchEvent) => setStartX(null);

	const handleTouchMove = (e: TouchEvent) => {
		if (!startX) return;
		const currentX = e.touches[0].clientX;
		const difference = startX - currentX;
		if (difference > 50) {
			handleSecondarySidebarOpen(false);
			handleSidebarOpen(true);
		}
	};

	return (
		<div
			data-secondary={secondarySidebarOpen}
			id='server channel'
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			className={cn(
				'min-w-72 max-w-72 transition-all ease duration-300',
				styles,
				!secondarySidebarOpen ? '-left-full  z-[-2]' : 'left-16'
			)}
		>
			<ul className='h-screen space-y-4 bg-[#2b2d31] py-[21px]'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className='flex w-full items-center justify-between border-b-2 border-b-black px-5 pb-6'>
							<span className='text-base font-semibold lowercase'>
								{server?.name}
							</span>{' '}
							<ChevronLeft className='-rotate-90' />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='mt-2 w-full min-w-[250px]
border-none bg-[#111214]'
					>
						<DropdownMenuLabel>Server boost</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{items.map((item) => (
							<DropdownMenuItem
								className={cn(
									'hover:!bg-secondary-purple my-2 flex items-center justify-between font-medium text-sm capitalize',
									item.label.includes('invite') &&
										'text-secondary-purple hover:text-white'
								)}
								key={item.label}
							>
								{item.label}
								{item.icon}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<ChannelItem
					inviteCode={server?.invite_code!}
					channels={channels.text}
					title='text channels'
					type='text'
					serverId={server?.id!}
				/>
				<ChannelItem
					serverId={server?.id!}
					inviteCode={server?.invite_code!}
					channels={channels.audio}
					title='voice channels'
					type='audio'
				/>
			</ul>
		</div>
	);
}
