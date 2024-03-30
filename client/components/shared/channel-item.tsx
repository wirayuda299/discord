'use client';

import { GearIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Channel } from '@/types/channels';
import CreateChannel from './create-channel/create-channel';
import { setCookie } from '@/actions/cookies';
import InviteUser from './invite-user';
import { useSheetContext } from '@/providers/sheet';
import { useAuth } from '@clerk/nextjs';

export default function ChannelItem({
	channels,
	title,
	type,
	inviteCode,
	serverId,
}: {
	channels: Channel[];
	title: string;
	type: 'text' | 'audio';
	inviteCode: string;
	serverId: string;
}) {
	const params = useParams();
	const pathname = usePathname();
	const { userId } = useAuth();

	const {
		handleSelectedChannel,
		handleSecondarySidebarOpen,
		handleSidebarOpen,
	} = useSheetContext();

	const handleClick = (key: string, value: string, channel: Channel) => {
		if (type === 'text') {
			setCookie(key, value, pathname);
		}
		if (channel.type === 'text') {
			handleSelectedChannel(channel);
			handleSecondarySidebarOpen(true);
			handleSidebarOpen(true);
		} else {
			handleSecondarySidebarOpen(false);
			handleSidebarOpen(false);
		}
	};

	return (
		<Accordion type='multiple' className='w-full grow'>
			<AccordionItem value={title} className='border-b-transparent'>
				<AccordionTrigger className='p-2'>
					<div className='flex w-full items-center justify-between'>
						<h2 className='ease cursor-pointer text-xs font-semibold uppercase text-[#949ba4] transition-colors duration-300 hover:text-white'>
							{title}
						</h2>
						<CreateChannel serverId={params.id as string} type={type} />
					</div>
				</AccordionTrigger>
				<AccordionContent
					className={cn(
						'mt-2 flex flex-col gap-3',
						title.includes('text') ? 'pl-8 ' : 'pl-6'
					)}
				>
					{channels?.map((channel) => (
						<Link
							prefetch
							href={`/server/${channel.server_id}/channels/${channel.channel_id}?type=${type}`}
							onClick={() =>
								handleClick(channel.server_id, channel.channel_id, channel)
							}
							className={cn(
								'group flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium lowercase leading-normal text-[#949ba4] transition-colors duration-300  hover:text-white hover:brightness-125',
								channel.channel_id === params.channel_id
									? 'bg-black bg-opacity-10'
									: 'hover:bg-black hover:bg-opacity-10 '
							)}
							key={channel.channel_id}
						>
							<div className='flex items-center gap-2'>
								{title.includes('text') ? (
									<span>#</span>
								) : (
									<Image
										src={'/icons/volume.svg'}
										width={20}
										height={20}
										alt='volume icon'
									/>
								)}
								{/* @ts-ignore */}
								{channel.channel_name ?? channel.name}
							</div>
							{userId === channel.user_id && (
								<div className='ease flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100'>
									<InviteUser
										channelId={channel.channel_id}
										serverId={serverId}
										channelName={channel.channel_name}
										inviteCode={inviteCode}
									/>
									<button>
										<GearIcon stroke='#949ba4' />
									</button>
								</div>
							)}
						</Link>
					))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
