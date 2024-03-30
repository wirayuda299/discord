'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';

import SecondarySidebar from '@/components/shared/secondary-sidebar';
import Status from './status';
import AddFriendForm from './add-friend-form';

export default function UserManagement({
	selectedStatus,
}: {
	selectedStatus: string;
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClick = () => setIsOpen((prev) => !prev);

	return (
		<div className='flex h-screen w-full max-w-4xl flex-row-reverse overflow-y-hidden  md:w-max md:max-w-full'>
			<div className='no-scrollbar flex h-[75px] w-full max-w-full items-center gap-2 overflow-x-auto border-b-2 border-black px-2 py-4  md:max-w-2xl  md:gap-5'>
				<div className='no-scrollbar flex w-full items-center overflow-x-auto px-5 md:gap-5'>
					<div className='hidden items-center gap-2 md:flex'>
						<Image
							className='aspect-auto min-w-7 object-contain invert'
							src={'/icons/friend.svg'}
							width={25}
							height={25}
							alt='friend icon'
						/>
						<h3 className='font-semibold'>Friend</h3>
					</div>
					<Status selectedStatus={selectedStatus} />
					<AddFriendForm />
					<button
						onClick={handleClick}
						className='ease ml-3 transition-all duration-500 md:mr-5 md:hidden'
					>
						<Menu />
					</button>
				</div>
			</div>
			<SecondarySidebar isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
}
