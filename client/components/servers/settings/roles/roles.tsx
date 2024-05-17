import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import RolesSettings from './settings';

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const roles = [
	{
		name: '@everyone',
		member: 100,
	},
	{
		name: 'moderator',
		member: 1,
	},
	{
		name: 'security',
		member: 1,
	},
];



export default function Roles() {
	const [selectedRole, setSelectedRole] = useState<string | null>(null);
	const [selectedTab, setSelectedTab] = useState<string>('display');

	const selectRole = (role: string | null) => setSelectedRole(role);
	const selectTab = (tab: string = 'display') => setSelectedTab(tab);



	useEffect(() => {
		selectTab('display');
	}, [selectedRole]);

	return (
		<section className='py-5'>
			<div className='w-full'>
				{selectedRole ? (
					<RolesSettings
						selectedTab={selectedTab}
						selectTab={selectTab}
						roles={roles}
						selectedRole={selectedRole}
						selectRole={selectRole}
					/>
				) : (
					<>
						<h3 className='text-xl font-semibold text-white'>Roles</h3>
						<p className='text-sm font-normal text-gray-2'>
							Use roles to group your members and and assign permissions.{' '}
						</p>
						<div className='group mt-5 flex w-full justify-between gap-3 rounded-md  bg-foreground p-5 hover:bg-foreground/50'>
							<div
								aria-roledescription='select role'
								role='button'
								className='flex cursor-pointer items-center gap-3'
								onClick={() => selectRole('@everyone')}
							>
								<div className='flex size-8 items-center rounded-full bg-background group-hover:bg-foreground'>
									<Image
										className='mx-auto'
										src={'/icons/members.svg'}
										width={20}
										height={20}
										alt='members'
									/>
								</div>
								<div>
									<h4 className='text-left text-base font-semibold capitalize text-gray-2'>
										Default permissions
									</h4>
									<p className='text-xs font-medium text-gray-2'>
										@everyone - applies to all members
									</p>
								</div>
							</div>
							<button>
								<ChevronRight />
							</button>
						</div>
						<Table>
							<TableCaption>A list of role that been created.</TableCaption>
							<TableHeader className='!bg-transparent'>
								<TableRow className=' border-gray-2/15 !bg-transparent'>
									<TableHead className='text-white'>Roles</TableHead>
									<TableHead className='text-white'>Member</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className='border-foreground'>
								{roles.map((role) => (
									<TableRow
										key={role.name}
										onClick={() => selectRole(role.name)}
										className='cursor-pointer border-gray-2/10 hover:!bg-background hover:!brightness-110'
									>
										<TableCell className=' text-base'>
											<div className='flex items-center gap-2'>
												<div className='size-2 rounded-full bg-gray-2'></div>
												{role.name}
											</div>
										</TableCell>
										<TableCell className='inline-flex gap-2'>
											<span>{role.member}</span>
											<Image
												src={'/icons/member.svg'}
												width={20}
												height={20}
												alt='member'
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</>
				)}
			</div>
		</section>
	);
}
