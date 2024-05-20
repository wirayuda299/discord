import Image from 'next/image';

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils/mergeStyle';
import { Member } from '@/types/server';
import { SocketStates } from '@/types/socket-states';
import { createError } from '@/utils/error';
import { kickMember } from '@/actions/members';
import { toast } from 'sonner';

export default function MemberItem({
	member,
	currentUser,
	states,
	ownerId,
}: {
	member: Member;
	ownerId: string;
	currentUser: string;
	states: SocketStates;
	}) {
	
	const handleKickMember = async () => {
		try {
			await kickMember(member.server_id, member.user_id, ownerId, currentUser).then(()=> toast.success('Member kicked from server'))
		} catch (error) {
			createError(error)
		}
	}
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
									states.active_users.includes(member.user_id) &&
										'text-green-600'
								)}
							>
								{states.active_users.includes(member.user_id)
									? 'online'
									: 'offline'}
							</p>
						</div>
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className='border-none bg-black text-white'>
				<ContextMenuItem className='hover:!bg-primary hover:!text-white'>
					Profile
				</ContextMenuItem>
				<ContextMenuItem className='hover:!bg-primary hover:!text-white'>
					Message
				</ContextMenuItem>
				{(currentUser === ownerId ||
					(states.user_roles && states.user_roles.kick_member)) && (
					<ContextMenuItem
						onClick={handleKickMember}
						className='!text-red-600 hover:!bg-red-600 hover:!text-white'
					>
						Kick
					</ContextMenuItem>
				)}

				<ContextMenuItem className='!text-red-600 hover:!bg-red-600 hover:!text-white'>
					Ban
				</ContextMenuItem>
				<ContextMenuItem className='hover:!bg-primary hover:!text-white'>
					Copy user ID
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
