import {  useSWRConfig } from 'swr';
import { toast } from 'sonner';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import SearchForm from '../../../shared/search-form';
import { Role, removeRoleFromUser } from '@/helper/roles';
import useFetch from '@/hooks/useFetch';
import { getMembersByRole } from '@/helper/server';
import { createError } from '@/utils/error';
const AssignRole = dynamic(() => import('./AssignRole'), { ssr: false });

export default function MemberWithRole({
	serverId,
	selectedRole,
}: {
	serverId: string;
	selectedRole: Role | null;
}) {
	const { mutate } = useSWRConfig();
	const { data, isLoading, error } = useFetch('members-by-role', () =>
		getMembersByRole(serverId, selectedRole?.name || '')
	);

	const handleDeleteRole = async (userId: string) => {
		try {
			await removeRoleFromUser(userId);
			toast.success('Role has been removed from user');
		} catch (error) {
			createError(error);
		} finally {
			mutate('user-permissions');
			mutate('members');
			mutate('members-by-role');
		}
	};

	if (isLoading) return <p>Loading....</p>;
	if (error) return <p>{error.message}</p>;

	return (
		<div className='w-full '>
			<div className='flex gap-3 py-3'>
				<SearchForm styles='max-w-full py-2.5' />
				<AssignRole role={selectedRole}>
					<Button>Add Members</Button>
				</AssignRole>
			</div>
			{data && data.length < 1 ? (
				<div className='flex gap-2'>
					<Image
						src={'/icons/members.svg'}
						width={20}
						height={20}
						alt='members'
					/>
					<p className='text-sm text-gray-2'>No members were found.</p>
					<AssignRole role={selectedRole}>
						<p className='cursor-pointer text-sm font-semibold text-blue-400'>
							Add member to this role
						</p>
					</AssignRole>
				</div>
			) : (
				<ul className='flex flex-col gap-5'>
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
									<div className='flex items-center gap-3'>
										<h4 className='text-base font-semibold capitalize text-gray-2'>
											{member.username}
										</h4>
										{member.icon && (
											<Image
												src={member.icon}
												width={20}
												height={20}
												alt='icon'
												className='size-5 rounded-full object-cover'
											/>
										)}
									</div>
									<div className='flex items-center gap-2'>
										<div
											className='size-2 rounded-full'
											style={{
												backgroundColor: member?.role_color,
											}}
										></div>
										<p className='text-sm capitalize text-gray-2'>
											{member?.name}
										</p>
									</div>
								</div>
							</div>
							<Button onClick={() => handleDeleteRole(member.user_id)}>
								Remove
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
