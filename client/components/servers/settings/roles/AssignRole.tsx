import Image from 'next/image';
import { ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { getServerMembers } from '@/helper/server';
import { Member } from '@/types/server';
import { createError } from '@/utils/error';
import { assignRole } from '@/actions/roles';
import { Role } from '@/helper/roles';

export default function AssignRole({
	children,
	serverId,
	role,
}: {
	children: ReactNode;
	serverId: string;
	role: Role|null;
}) {
	const [members, setMembers] = useState<Member[]>([]);

	const handleAssignRole = async (userId:string) => {
    try {
      if (!role) return 
      
			await assignRole(userId, role?.id, role?.permissions.id, `/server/${serverId}`);
		} catch (error) {
			createError(error);
		}
	};
console.log(members);

	return (
		<Dialog
			onOpenChange={async (isOpen) => {
				if (isOpen) {
					const members = await getServerMembers(serverId);
					setMembers(members);
				}
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='border-none'>
				<DialogHeader>
					<h2 className='text-center text-2xl font-semibold text-white'>
						Add Members
					</h2>
					<div className='flex justify-center gap-2'>
						<Image
							src={'/icons/guard.svg'}
							width={20}
							height={20}
							alt='guards'
						/>
						<span className='text-base font-semibold text-gray-400'>
							{role?.name}
						</span>
					</div>
				</DialogHeader>
				<ul className='flex flex-col gap-3'>
					<h4 className='pb-2 text-sm font-semibold text-white'>Members</h4>
					{members?.map((member) => (
						<li
							onClick={() => handleAssignRole(member.user_id)}
							key={member.id}
							className='flex items-center justify-between gap-3 p-2 hover:bg-background hover:brightness-110'
						>
							<div className='flex items-center gap-3'>
								<Image
									src={member.avatar}
									width={45}
									height={45}
									alt='member'
									className='size-11 rounded-full object-cover'
								/>
								<div>
									<h4 className='text-base font-semibold capitalize text-gray-2'>
										{member.username}
									</h4>
									<div className='flex items-center gap-2'>
										<div
											className='size-2 rounded-full'
											style={{
												backgroundColor: role?.role_color,
											}}
										></div>
										{member.role && (
											<p className='text-sm capitalize text-gray-2'>
												{member?.role?.name}
											</p>
										)}
									</div>
								</div>
							</div>
							<Button>
								{member.role && member.role.user_id === member.user_id ? 'Remove' : 'Add'}
							</Button>
						</li>
					))}
				</ul>
			</DialogContent>
		</Dialog>
	);
}
