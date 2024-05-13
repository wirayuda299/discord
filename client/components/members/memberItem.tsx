import { cn } from '@/lib/utils';
import { Member } from '@/types/server';
import Image from 'next/image';

export default function MemberItem({
	member,
	activeUsers,
}: {
	member: Member;
	activeUsers: string[];
}) {
	return (
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
	);
}
