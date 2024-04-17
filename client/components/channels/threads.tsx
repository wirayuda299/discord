import Image from 'next/image';

import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function Thread() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger disabled>
				<Image
					src={'/icons/threads.svg'}
					width={24}
					height={24}
					alt={'threads'}
					key={'threads'}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-background border-none p-0'>
				<header className='bg-foreground flex min-h-6 w-full  items-center gap-3 p-2 text-white'>
					<div className='border-r-background flex items-center gap-2 border-r pr-5'>
						<Image
							src={'/icons/threads.svg'}
							width={24}
							height={24}
							alt={'threads'}
							key={'threads'}
						/>
						<h3 className='text-base font-semibold'>Threads</h3>
					</div>
					<form className='flex items-center gap-2'>
						<label
							htmlFor='search'
							className='bg-background flex max-w-40 items-center rounded px-2 py-0.5'
						>
							<input
								type='search'
								id='search'
								className='w-full bg-transparent placeholder:text-sm'
								placeholder='Search'
							/>
						</label>
						<Button className='h-7' size='sm'>
							Create
						</Button>
					</form>
				</header>
				<div className='p-2'>
					<h4 className='text-gray-2 text-sm'>Older threads</h4>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
