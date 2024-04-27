import { Link, UserPlus2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';

export default function AddUser({
	size = 18,
	styles,
}: {
	size: number;
	styles?: string;
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className={styles}>
				<UserPlus2
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						setIsOpen(true);
					}}
					stroke='#fff'
					className='text-base'
					size={size}
				/>
			</DialogTrigger>
			<DialogContent className='size-full border-none bg-black md:mx-auto md:h-max md:max-h-[500px] md:max-w-[500px] md:overflow-y-auto'>
				<DialogTitle>
					<DialogTitle className='text-white'>Invite a friend</DialogTitle>
				</DialogTitle>

				<button className='flex size-10 items-center justify-center rounded-full bg-background'>
					<Link stroke='#fff' size={18} />
				</button>
				<ul className='mt-5'>
					<li className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<Image
								src={'/icons/discord.svg'}
								width={40}
								className='aspect-auto object-contain'
								height={40}
								alt='user'
							/>
							<h3 className='font-semibold text-white'>Username</h3>
						</div>
						<button className='rounded-full bg-background px-3 text-sm text-white'>
							Invite
						</button>
					</li>
				</ul>
			</DialogContent>
		</Dialog>
	);
}
