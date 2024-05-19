import Image from 'next/image';
import { ReactNode } from 'react';
import { useSWRConfig } from 'swr';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';
import { createError } from '@/utils/error';
import { assignRole } from '@/actions/roles';
import { Role } from '@/helper/roles';
import useSocket from '@/hooks/useSocket';
import useFetch from '@/hooks/useFetch';
import { toast } from 'sonner';
import { getMemberWithoutRole } from '@/helper/server';

export default function AssignRole({
	children,
	serverId,
	role,
}: {
	children: ReactNode;
	serverId: string;
	role: Role | null;
}) {
	const { mutate } = useSWRConfig();
	const { data, isLoading, error } = useFetch('members', () =>
		getMemberWithoutRole(serverId)
	);
	const { getUserRole, reloadChannelMessage,params  } = useSocket();

	const handleAssignRole = async (userId: string) => {
		try {
			if (!role) return;

			await assignRole(userId, role?.id, role?.permissions.id);

			toast.success('Role has been added to user');
		} catch (error) {
			createError(error);
		} finally {
			getUserRole(userId);
			reloadChannelMessage(params.channel_id as string, serverId);
			mutate('members');
			mutate('members-by-role');
		}
	};

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>{error.message}</p>;

	return (
		<Dialog>
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
					{data && data?.length < 1 ? (
						<p className='text-center text-gray-2'>
							There&apos;s no member in this server or all members already have
							role
						</p>
					) : (
						<>
							<h4 className='pb-2 text-sm font-semibold text-white'>Members</h4>
							{data?.map((member) => (
								<li
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
										</div>
									</div>

									<Button onClick={() => handleAssignRole(member.user_id)}>
										Add
									</Button>
								</li>
							))}
						</>
					)}
				</ul>
			</DialogContent>
		</Dialog>
	);
}
