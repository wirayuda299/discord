import Image from 'next/image';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import type { Socket } from 'socket.io-client';
import Link from 'next/link';

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils/mergeStyle';
import { Member } from '@/types/server';
import { createError } from '@/utils/error';
import { banMember, kickMember } from '@/actions/members';
import { copyText } from '@/utils/copy';
import usePermissions from '@/hooks/usePermissions';

export default function MemberItem({
	member,
	currentUser,
	ownerId,
	socket,
	serverId,
	activeUsers
}: {
	member: Member;
	ownerId: string;
	serverId: string;
	currentUser: string;
	activeUsers: string[];
	socket: Socket | null;
}) {
	const { isCurrentUserBanned, permissions, loading, isError } = usePermissions(
		currentUser,
		serverId
	);
	const { mutate } = useSWRConfig();

	const handleKickMember = async () => {
		try {
			await kickMember(
				member.server_id,
				member.user_id,
				ownerId,
				currentUser
			).then(() => toast.success('Member kicked from server'));
			mutate('banned-members');
		} catch (error) {
			createError(error);
		}
	};

	const handleBanMember = async () => {
		try {
			await banMember(member.server_id, member.user_id, currentUser);
			socket?.emit('banned_members', { serverId: member.server_id });
		} catch (error) {
			createError(error);
		}
	};

	if (loading || isError) return null;

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div key={member.id} className='w-full rounded-md hover:bg-background'>
					<div className='flex gap-2 p-1'>
						<Image
							src={member.avatar}
							width={50}
							height={50}
							alt='user'
							className='size-12 rounded-full object-cover'
						/>
						<div>
							<h3 className='text-base font-medium capitalize text-gray-2'>
								{member.username}
							</h3>
							<p
								className={cn(
									'text-xs text-gray-2',
									activeUsers.includes(member.user_id) && 'text-green-600'
								)}
							>
								{activeUsers.includes(member.user_id) ? 'online' : 'offline'}
							</p>
						</div>
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className='flex flex-col gap-3 border-none bg-black text-white'>
				{currentUser !== member.user_id && (
					<ContextMenuItem className='hover:!bg-primary hover:!text-white'>
						<Link href={`/direct-messages?chat=${member.user_id}`}>
							Message
						</Link>
					</ContextMenuItem>
				)}
				{!isCurrentUserBanned && currentUser !== member.user_id && (
					<>
						{(currentUser === ownerId ||
							(permissions && permissions.kick_member)) && (
							<ContextMenuItem
								onClick={handleKickMember}
								className='inline-flex gap-2 !text-red-600 hover:!bg-red-600 hover:!text-white'
							>
								Kick <span className='capitalize'> {member.username}</span>
							</ContextMenuItem>
						)}
						{(currentUser === ownerId ||
							(permissions && permissions.ban_member)) && (
							<ContextMenuItem
								onClick={handleBanMember}
								className='inline-flex gap-2 !text-red-600 hover:!bg-red-600 hover:!text-white'
							>
								Ban <span className='capitalize'> {member.username}</span>
							</ContextMenuItem>
						)}
					</>
				)}

				<ContextMenuItem
					onClick={() => copyText(member.user_id, 'User ID copied')}
					className='hover:!bg-primary hover:!text-white'
				>
					Copy user ID
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
