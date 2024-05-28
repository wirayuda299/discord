'use client';

import Image from 'next/image';
import { EllipsisVertical, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import useFetch from '@/hooks/useFetch';
import { getFriendList } from '@/helper/friends';
import { cn } from '@/lib/utils/mergeStyle';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSocket } from '@/providers/socket-io';

type User = {
	user_id: string;
	username: string;
	image: string;
	created_at: string;
};

export default function AllFriends({
	userId,
	handleSelectUser,
}: {
	userId: string;
	handleSelectUser: (user: User) => void;
}) {
	const {states} = useSocket();

	const setSelectedUser = (user: User) => handleSelectUser(user);

	const { data: friendList, isLoading: friendListLoading } = useFetch(
		'friend-list',
		() => getFriendList(userId)
	);
	return (
		<div className='h-auto max-h-screen w-full max-w-xl overflow-y-auto p-3 pb-4'>
			<p className='pb-3 text-xs font-semibold uppercase text-gray-2'>
				All friends -- {friendList?.length || 0}
			</p>
			{friendListLoading ? (
				<div className='flex flex-col gap-3'>
					{[1, 2, 3, 4].map((c) => (
						<div
							key={c}
							className='h-10 w-full animate-pulse rounded-md bg-background brightness-110'
						></div>
					))}
				</div>
			) : (
				friendList?.map((friend) => (
					<div
						key={friend.user_id}
						className='group flex items-center justify-between gap-2 rounded-md p-2 hover:bg-background hover:brightness-125'
					>
						<div className='flex items-center gap-2'>
							<Image
								src={friend.image}
								width={50}
								height={50}
								alt='user'
								className='size-14 rounded-full object-cover'
							/>
							<div>
								<Link
									href={'/'}
									className='text-base font-semibold capitalize text-gray-2'
								>
									{friend.username}
								</Link>
								<p
									className={cn(
										'text-xs text-gray-2',
										states.active_users.includes(friend.user_id) &&
											'text-green-600'
									)}
								>
									{states.active_users.includes(friend.user_id)
										? 'online'
										: 'offline'}
								</p>
							</div>
						</div>
						<div className='inline-flex gap-3'>
							<Link
								onClick={() => setSelectedUser(friend)}
								href={`/direct-messages?chat=${friend.user_id}&message_type=personal`}
								className='ease flex size-9 items-center rounded-full bg-foreground/40 transition-colors  group-hover:bg-foreground'
							>
								<MessageCircle
									className='mx-auto fill-gray-2 stroke-gray-2'
									size={20}
								/>
							</Link>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className=' ease size-9 rounded-full bg-foreground/40 transition-colors  group-hover:bg-foreground'>
										<EllipsisVertical
											className='mx-auto fill-gray-2 stroke-gray-2'
											size={20}
										/>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className=' border-none bg-foreground text-gray-2'>
									<DropdownMenuItem className='hover:!bg-primary hover:!text-white'>
										Start video call
									</DropdownMenuItem>
									<DropdownMenuItem className='hover:!bg-primary hover:!text-white'>
										Start voice call
									</DropdownMenuItem>
									<DropdownMenuItem className='text-red-600 hover:!bg-primary hover:!text-red-700'>
										Remove friend
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				))
			)}
		</div>
	);
}
