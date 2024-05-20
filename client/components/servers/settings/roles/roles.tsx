import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import RolesSettings from "./settings";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/hooks/useFetch";
import { Role, getAllRoles } from "@/helper/roles";
import SearchForm from "../../channels/search-form";
import { Button } from "@/components/ui/button";
import GeneralLoader from "@/components/shared/loader/general";

export default function Roles({
	serverId,
	serverAuthor,
	styles,
}: {
	serverId: string;
    serverAuthor:string
    styles?: string;
	}) {
	const { data, isLoading, error } = useFetch('roles', () =>
		getAllRoles(serverId)
	);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [selectedTab, setSelectedTab] = useState<string>('display');
	const [type, setType] = useState<'create' | 'update' | null>(null);

	const selectRole = (role: Role | null) => setSelectedRole(role);
	const selectTab = (tab: string = 'display') => setSelectedTab(tab);
	const selectType = (type: 'create' | 'update' | null) => setType(type);

	if (isLoading) return <GeneralLoader />;
	if (error) return <p>{error.message}</p>;

	return (
		<section className='w-full py-5'>
			<div className='size-full'>
				{type === 'create' || type === 'update' || selectedRole ? (
					<RolesSettings
						styles={styles}
						serverAuthor={serverAuthor}
						type={type || 'create'}
						selectedTab={selectedTab}
						selectTab={selectTab}
						roles={data || []}
						serverId={serverId}
						selectedRole={selectedRole}
						selectType={selectType}
						selectRole={selectRole}
					/>
				) : (
					<div className='w-full'>
						<h3 className='text-xl font-semibold text-white'>Roles</h3>
						<p className='text-sm font-normal text-gray-2'>
							Use roles to group your members and and assign permissions.{' '}
						</p>
						<div className='group mt-5 flex w-full justify-between gap-3 rounded-md  bg-foreground p-5 hover:bg-foreground/50'>
							<div className='flex cursor-pointer items-center gap-3'>
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
										All members are allowed to send message and view channel
									</p>
								</div>
							</div>
							<button>
								<ChevronRight className='text-gray-2' />
							</button>
						</div>
						<div className='mt-5 flex gap-3'>
							<SearchForm styles='max-w-full py-3' />
							<Button onClick={() => setType('create')}>Create</Button>
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
								{data?.map((role) => (
									<TableRow
										key={role.name}
										onClick={() => {
											selectRole(role);
											setType('update');
										}}
										className='cursor-pointer border-gray-2/10 hover:!bg-background hover:!brightness-110'
									>
										<TableCell className=' text-base'>
											<div className='flex items-center gap-2 text-gray-2'>
												<div
													className='size-2 rounded-full'
													style={{ backgroundColor: role.role_color }}
												></div>
												{role.name}
											</div>
										</TableCell>
										<TableCell className='inline-flex gap-2'>
											<span className='text-gray-2'>{role.members.length}</span>
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
					</div>
				)}
			</div>
		</section>
	);
}
