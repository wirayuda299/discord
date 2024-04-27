'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { EllipsisVertical, MessageCircle } from 'lucide-react';
import { useSWRConfig } from 'swr';

import { friendtabs } from '@/constants/friends-tab';
import { formUrlQuery } from '@/utils/form-url-query';
import { cn } from '@/lib/utils';
import InviteUser from './modals/invite-user';
import useFetch from '@/hooks/useFetch';
import { getMyInvitation, getPendingInvitation } from '@/helper/user';
import { getCreatedDate } from '@/utils/createdDate';
import { Button } from './ui/button';
import { createError } from '@/utils/error';
import { acceptinvitation, cancelInvitation } from '@/actions/invitation';
import Inbox from './channels/inbox';
import { getFriendList } from '@/helper/friends';
import { useSocketContext } from '@/providers/socket-io';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export default function Friends() {
	const { userId } = useAuth();
	const {activeUsers}=useSocketContext()
	const searchParams = useSearchParams();
	const { mutate } = useSWRConfig();

	const setActiveTab = (tab: string): string => {
		const activeTab = formUrlQuery(searchParams.toString(), 'tab', tab);
		return activeTab as string;
	};

	const handleCancleInvitation = async () => {
		try {
			await cancelInvitation(userId!!).then(() => {
				mutate('pending-invitation');
			});
		} catch (error) {
			createError(error);
		}
	};

	const { data, isLoading } = useFetch('pending-invitation', () =>
		getPendingInvitation(userId!!)
	);

	const { data: myInvitations, isLoading: myInvitationsLoading } = useFetch(
		'my-invitations',
		() => getMyInvitation(userId!!)
	);
	const { data: friendList, isLoading: friendListLoading } = useFetch(
		'friend-list',
		() => getFriendList(userId!!)
	);

	const handleAcceptInvitation = async (friendId: string) => {
		try {
			await acceptinvitation(friendId).then(() => {
				const mutateKeys = ['pending-invitation', 'my-invitations', 'friend-list'] as const;
				mutateKeys.forEach(key => {
					mutate(key)
				})
			});
		} catch (error) {
			createError(error);
		}
	}

	return (
		<div className='w-full'>
			<div className='flex w-full items-center justify-between gap-5 border-b border-b-foreground px-3 py-[13.2px] '>
				<div className='flex items-center gap-5'>
					<div className='flex  items-center gap-2'>
						<Image
							src={'/icons/friend.svg'}
							width={30}
							height={30}
							alt='friend'
							loading='lazy'
						/>
						<h3 className='text-xl font-semibold text-gray-2 brightness-150'>
							Friends
						</h3>
					</div>
					<ul className='flex items-center gap-2'>
						{friendtabs.map((tab) => (
							<Link
								href={setActiveTab(tab)}
								className={cn(
									'cursor-pointer rounded px-3 text-base font-normal capitalize text-gray-2 bg-background hover:brightness-125',
									searchParams.get('tab') === tab &&
										'bg-background brightness-125'
								)}
								key={tab}
							>
								{tab}
							</Link>
						))}
						<InviteUser />
					</ul>
				</div>
				<div className='flex items-center gap-3'>
					<Inbox>
						{myInvitationsLoading ? (
							<p>Loading...</p>
						) : (
							myInvitations?.map((invitation) => (
								<div
									className='flex w-full items-center justify-between p-3'
									key={invitation.id}
								>
									<div className='flex items-center gap-2'>
										<Image
											src={invitation.image}
											width={50}
											height={50}
											loading='lazy'
											alt='user'
											className='size-14 rounded-full object-cover'
										/>
										<div>
											<h4 className='text-base font-semibold capitalize text-gray-2'>
												{invitation?.username}
											</h4>
											<p className='text-xs text-gray-2'>
												send you friend request
											</p>
										</div>
									</div>
									<Button
										size='sm'
										onClick={() => handleAcceptInvitation(invitation.id)}
									>
										Accept
									</Button>
								</div>
							))
						)}
					</Inbox>
					<Image
						src={'/icons/ask.svg'}
						width={24}
						height={24}
						alt={'ask'}
						key={'ask'}
					/>
				</div>
			</div>
			{searchParams.get('tab') === 'pending' && (
				<div className='flex flex-col gap-3 divide-y divide-gray-800 p-3'>
					{isLoading
						? [1, 2, 3, 4].map((c) => (
								<div
									key={c}
									className='h-10 w-full animate-pulse rounded-md bg-background brightness-125'
								></div>
							))
						: data?.map((pendingInvitation, i) => (
								<div
									key={pendingInvitation?.user_to_invite}
									className={cn(
										'flex items-center hover:bg-background hover:brightness-125 justify-between gap-2 p-2 rounded-md',
										i > 0 && 'pt-5'
									)}
								>
									<div className='flex items-center gap-2'>
										<Image
											src={pendingInvitation.image}
											width={50}
											height={50}
											loading='lazy'
											alt='user'
											className='size-14 rounded-full object-cover'
										/>
										<div>
											<h4 className='text-base font-semibold capitalize text-gray-2'>
												{pendingInvitation?.username}
											</h4>
											<p className='text-xs text-gray-2'>
												Invited{' '}
												{getCreatedDate(new Date(pendingInvitation.created_at))}
											</p>
										</div>
									</div>
									<Button
										onClick={(e) => {
											e.stopPropagation();
											handleCancleInvitation();
										}}
										size='sm'
										variant='destructive'
									>
										Cancel
									</Button>
								</div>
							))}
				</div>
			)}

			{searchParams.get('tab') === 'all' && (
				<div className='h-auto max-h-screen w-full max-w-xl overflow-y-auto p-3 pb-4'>
					<p className='pb-3 text-xs font-semibold uppercase text-gray-2'>
						All friends -- {friendList?.length}
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
												activeUsers.includes(friend.user_id) && 'text-green-600'
											)}
										>
											{activeUsers.includes(friend.user_id)
												? 'online'
												: 'offline'}
										</p>
									</div>
								</div>
								<div className='inline-flex gap-3'>
									<button className=' ease size-9 rounded-full bg-foreground/40 transition-colors  group-hover:bg-foreground'>
										<MessageCircle
											className='mx-auto fill-gray-2 stroke-gray-2'
											size={20}
										/>
									</button>
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
											<DropdownMenuItem className='hover:!bg-primary hover:!text-white'>Start video call</DropdownMenuItem>
											<DropdownMenuItem className='hover:!bg-primary hover:!text-white'>Start voice call</DropdownMenuItem>
											<DropdownMenuItem className='text-red-600 hover:!bg-primary hover:!text-red-700'>Remove friend</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
}
