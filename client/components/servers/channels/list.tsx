'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import { ChevronRight, Plus, UserPlus } from 'lucide-react';

import { Channel } from '@/types/channels';
import { Servers } from '@/types/server';

import { cn } from '@/lib/utils/mergeStyle';
import { useServerContext } from '@/providers/server';

import CreateChannelModals from '@/components/servers/channels/create-channel-modal';
import AddUser from '@/components/servers/add-user';
import { findBannedMembers } from '@/utils/banned_members';
import useFetch from '@/hooks/useFetch';
import { getBannedMembers } from '@/helper/members';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { getCurrentUserPermissions } from '@/helper/roles';

export default function ChannelList({
	channels,
	server,
}: {
	channels: Channel[];
	server: Servers;
}) {
	const {
		serversState: { selectedChannel },
		setServerStates,
	} = useServerContext();
	const params = useParams();
	const { userId } = useAuth();
	const [selectedCategory, setSelectedCategory] = useState('');
	const {
		data: permissions,
		error,
		isLoading,
	} = useFetch('user-permissions', () =>
		getCurrentUserPermissions(userId!!, server.id)
	);
	const {
		data: bannedMembers,
		error: bannedMembersError,
		isLoading: bannedMembersLoading,
	} = useFetch('banned-members', () => getBannedMembers(server.id));

	const isCurrentUserBanned = findBannedMembers(bannedMembers || [], userId!!);

	const toggleCategory = useCallback((categoryName: string) => {
		setSelectedCategory((prev) => (prev === categoryName ? '' : categoryName));
	}, []);

	const selectChannel = useCallback(
		(channel: Channel | null) => {
			setServerStates((prev) => ({ ...prev, selectedChannel: channel }));
		},
		[setServerStates]
	);

	useEffect(() => {
		const channel = channels
			.map((c) => c.channels)[0]
			.find((c) => c.channel_id === params.channelId);

		setServerStates((prev) => {
			return { ...prev, selectedChannel: channel || null };
		});
	}, [params.channelId, channels, setServerStates]);
	if (isLoading || bannedMembersLoading)
		return (
			<div className='h-6 w-full animate-pulse rounded bg-background brightness-110'></div>
		);
	if (error || bannedMembersError)
		return <p>{error.message ?? bannedMembersError.message}</p>;

	return (
		<ul className='text-gray-2'>
			{channels?.map((channel) => (
				<li className='my-4' key={channel.category_id}>
					<div className='flex w-full items-center justify-between pr-2'>
						<div
							onClick={() => toggleCategory(channel.category_name)}
							className='flex cursor-pointer items-center gap-1'
						>
							<ChevronRight
								size={18}
								className={cn(
									'transition-all ease duration-300',
									selectedCategory === channel.category_name && 'rotate-90'
								)}
							/>
							<h3 className='text-xs font-semibold uppercase'>
								{channel.category_name} channel
							</h3>
						</div>
						{!isCurrentUserBanned && (
							<>
								{(server.owner_id === userId ||
									(permissions && permissions.manage_channel)) && (
									<CreateChannelModals
										serverAuthor={server.owner_id}
										serverId={server.id}
										type={channel.channel_type}
									>
										<button role='button' title='create channel'>
											<Plus size={18} />
										</button>
									</CreateChannelModals>
								)}
							</>
						)}
					</div>
					<ul
						className={cn(
							'h-0 flex flex-col gap-1',
							selectedCategory === channel.category_name ||
								selectedChannel?.channel_id === channel.channel_id
								? 'h-auto overflow-auto [&>*:nth-child(1)]:mt-2 transition-all ease duration-300'
								: 'overflow-hidden'
						)}
					>
						{channel.channels.map((c) => (
							<Link
								role='listitem'
								href={`/server/${encodeURIComponent(server.id)}/${encodeURIComponent(c.channel_id)}?channel_type=${encodeURIComponent(c.channel_type)}`}
								key={c.channel_id}
								onClick={() => selectChannel(c)}
								className={cn(
									'hover:bg-background/80 group ml-2 h-max cursor-pointer rounded-lg px-3 py-1 text-sm',
									c.channel_id === selectedChannel?.channel_id &&
										'bg-background/80'
								)}
							>
								<div className='flex h-max items-center justify-between'>
									<div className='flex items-center gap-1'>
										{c.channel_type === 'audio' ? (
											<Image
												src='/icons/volume.svg'
												width={18}
												height={18}
												alt='volume icon'
											/>
										) : (
											<Image
												src='/icons/hashtag.svg'
												width={24}
												height={24}
												alt='hashtag'
											/>
										)}
										<span>{c.channel_name}</span>
									</div>
									{userId === server.owner_id && (
										<AddUser styles='opacity-0 group-hover:opacity-100'>
											<UserPlus size={18} />
										</AddUser>
									)}
								</div>
							</Link>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
