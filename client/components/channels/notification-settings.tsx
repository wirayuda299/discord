'use client';

import { useState } from 'react';
import Image from 'next/image';

import {
	DropdownMenu,
	DropdownMenuSub,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuRadioItem,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
} from '../ui/dropdown-menu';

const items = [
	'for 15 minutes',
	'for 1 hour',
	'for 8 hours',
	'for 24 hours',
	'until i turn it back on',
] as const;

export default function NotificationSettings() {
	const [option, setOption] = useState('only-mention');
	const [muted, setMuted] = useState<boolean>(false);
	return (
		<DropdownMenu modal>
			<DropdownMenuTrigger>
				<Image
					src={muted ? '/icons/bell.svg' : '/icons/bell-unmute.svg'}
					width={24}
					height={24}
					alt={'bell'}
					key={'bell'}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='mt-5 min-w-[200px] border-none bg-[#111214] p-0 text-white'>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger
						onClick={() => setMuted((prev) => !prev)}
						className='hover:!bg-primary text-gray-2 group w-full bg-transparent p-3 hover:text-white'
					>
						Mute channel
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent
						sideOffset={10}
						className='flex flex-col gap-1 border-none bg-[#111214] p-0 text-white '
					>
						{items.map((item) => (
							<DropdownMenuItem
								key={item}
								className='hover:!bg-primary text-gray-2 bg-transparent capitalize hover:!text-white'
							>
								{item}
							</DropdownMenuItem>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<div className='bg-background h-px w-full'></div>
				<DropdownMenuRadioGroup value={option} onValueChange={setOption}>
					<DropdownMenuRadioItem
						className='hover:!bg-primary group flex justify-between bg-transparent p-3'
						value='only-mention'
					>
						<div>
							<p className='text-gray-2 text-sm group-hover:text-white'>
								Use default category
							</p>
							<p className='text-gray-2 text-xs group-hover:text-white'>
								Only Mentions
							</p>
						</div>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem
						className='hover:!bg-primary group flex justify-between bg-transparent p-3'
						value='all-messages'
					>
						<p className='text-gray-2 text-sm  group-hover:text-white'>
							All Messages
						</p>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem
						className='hover:!bg-primary group flex justify-between bg-transparent p-3'
						value='only-mentions'
					>
						<p className='text-gray-2 text-xs group-hover:text-white'>
							Only @ Mentions
						</p>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
