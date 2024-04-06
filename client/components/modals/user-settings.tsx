import { useState, type ReactNode } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '../ui/dialog';
import { cn } from '@/lib/utils';
import UserAccount from '../settings/user-account';
import EditProfile from '../settings/edit-profile';
import { settings } from '@/constants/settings';

export default function UserSettingsModals({
	children,
}: {
	children: ReactNode;
}) {
	const { user, isLoaded, isSignedIn } = useUser();

	const [selectedSetting, setSelectedSetting] = useState<string>('my account');
	if (!isLoaded || !isSignedIn) return null;

	return (
		<Dialog modal>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='bg-background hidden h-screen min-w-full  border-none p-0 text-white md:block'>
				<div className='flex size-full justify-center gap-5'>
					<div className=' w-full max-w-[410px] bg-[#2b2d31] py-10'>
						<aside className='sticky top-0 flex h-screen   flex-col overflow-y-auto p-5 lg:items-end'>
							<ul className='flex w-max flex-col gap-3'>
								{settings.map((setting) => (
									<li key={setting.label}>
										<h2 className='text-gray-2 border-b-background mb-3 w-max border-b text-sm font-semibold uppercase'>
											{setting.label}
										</h2>
										<ul className='flex flex-col gap-1'>
											{setting.items.map((item) => (
												<li
													onClick={() => setSelectedSetting(item)}
													className={cn(
														'hover:bg-background min-w-[200px] cursor-pointer text-nowrap rounded p-2 text-sm font-medium capitalize text-[#b5b8bc] transition ease hover:text-[#ced0d3]',
														selectedSetting === item &&
															'bg-background text-white hover:bg-background/55'
													)}
													key={item}
												>
													{item}
												</li>
											))}
										</ul>
									</li>
								))}
							</ul>
						</aside>
					</div>
					<div className='no-scrollbar h-screen w-full overflow-y-auto px-6 py-10'>
						{selectedSetting === 'my account' && <UserAccount user={user} />}
						{selectedSetting === 'profiles' && (
							<EditProfile
								avatar={user.imageUrl}
								username={user.username ?? ''}
							/>
						)}
						{selectedSetting === 'devices' && (
							<div className='w-full'>
								<UserButton>
									<UserButton.UserProfilePage label='profile'>
										Page
									</UserButton.UserProfilePage>
								</UserButton>
							</div>
						)}
					</div>
					<div className=' min-w-24 pt-10'>
						<DialogClose className='border-gray-2 flex size-10 flex-col items-center justify-center rounded-full border'>
							<X className='text-gray-2' />
						</DialogClose>
						<p className='text-gray-2 font-light'>ESC</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
