import Image from 'next/image';
import { X } from 'lucide-react';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '../ui/dialog';

export default function ImagePreview({ image }: { image: string }) {
	return (
		<Dialog>
			<DialogTrigger>
				<Image
					src={image}
					width={200}
					height={100}
					placeholder='blur'
					blurDataURL={image}
					alt='media'
					className='ml-9 mt-3 aspect-auto rounded-md object-cover'
					loading='lazy'
				/>
			</DialogTrigger>
			<DialogContent className=' min-w-full border-none bg-transparent'>
				<Image
					width={800}
					height={400}
					src={image}
					alt='media'
					priority
					fetchPriority='high'
					sizes='100vw'
					className='mx-auto aspect-auto max-w-[calc(100%-100px)] rounded-md object-cover backdrop:blur-sm'
				/>
				<div className=' absolute right-3 top-0 min-w-24'>
					<DialogClose className='border-gray-2 flex size-10 flex-col items-center justify-center rounded-full border'>
						<X className='text-gray-2' />
					</DialogClose>
					<p className='text-gray-2 pl-1 font-light'>ESC</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
