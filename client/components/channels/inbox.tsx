import { useState } from 'react';
import Image from 'next/image';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';

const items = ['for you', 'unreads', 'mentions'] as const;

export default function Inbox() {
	const [selectedFilter, setSelectedFilter] = useState<string>('for you');
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Image
					src={'/icons/inbox.svg'}
					width={24}
					height={24}
					alt={'inbox'}
					key={'inbox'}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-background mt-3 min-w-96 border-none p-0 text-white'>
				<header className='bg-foreground min-h-10 p-2'>
					<div className=' flex w-full items-center justify-between gap-3  text-white'>
						<div className='border-r-background flex items-center gap-2 border-r pr-5'>
							<Image
								src={'/icons/inbox.svg'}
								width={24}
								height={24}
								alt={'inbox'}
								key={'inbox'}
							/>
							<h3 className='text-base font-semibold'>Inbox</h3>
						</div>
						<div className='bg-background inline-flex gap-1 rounded-full px-3'>
							<Image
								src={'/icons/user-1.svg'}
								width={15}
								height={15}
								alt={'user-1'}
								key={'user-1'}
							/>
							<span className='text-xs'>0</span>
						</div>
					</div>
					<div className='flex gap-3 pt-5 text-white'>
						{items.map((item) => (
							<button
								onClick={() => setSelectedFilter(item)}
								key={item}
								className={cn(
									'transition-colors ease-in-out duration-300 rounded px-2 py-1 text-sm font-medium hover:bg-background capitalize',
									selectedFilter === item && 'bg-background hover:bg-opacity-65'
								)}
							>
								{item}
							</button>
						))}
					</div>
				</header>
				<div className='p-2'>Notifications</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
