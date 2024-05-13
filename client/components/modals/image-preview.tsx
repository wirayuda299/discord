import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef, useState } from 'react';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '../ui/dialog';
import { Message } from '@/types/messages';
import { cn } from '@/lib/utils';

export default function ImagePreview({
	image,
	messages,
	styles
}: {
	image: string;
		messages: Message[];
	styles?:string
}) {
	const media = messages.map((message) => message.media_image).filter(Boolean);
	const [index, setIndex] = useState<number>(
		media.findIndex((img) => img === image)
	);
	const ref = useRef<HTMLImageElement>(null);

	const handleChange = (action: 'next' | 'prev') => {
		switch (action) {
			case 'next':
				if (!media[index + 1]) return;
				setIndex((prev) => prev + 1);
				break;
			case 'prev':
				if (!media[index - 1]) return;
				setIndex((prev) => prev - 1);
				break;

			default:
				break;
		}
	};

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (isOpen) {
					setIndex(media.findIndex((img) => img === image));
				}
			}}
		>
			<DialogTrigger>
				<Image
					src={image}
					width={200}
					height={100}
					placeholder='blur'
					blurDataURL={image}
					alt='media'
					className={cn('ml-9 mt-3 aspect-auto rounded-md object-cover', styles)}
					loading='lazy'
				/>
			</DialogTrigger>
			<DialogContent className='flex h-full min-w-full items-center  justify-center border-none bg-transparent'>
				<div>
					<Image
						ref={ref}
						width={700}
						height={400}
						src={media[index]}
						alt='media'
						priority
						fetchPriority='high'
						sizes='100%'
						className=' aspect-auto max-h-[400px] w-full max-w-[600px] rounded-md object-cover backdrop:blur-sm'
					/>
					<div className='flex items-center justify-center gap-3 pt-3'>
						<button
							aria-disabled={!media[index - 1]}
							disabled={!media[index - 1]}
							className=' rounded-full border border-gray-2 disabled:opacity-0'
							onClick={() => handleChange('prev')}
						>
							<ChevronLeft className='font-light text-gray-2' size={30} />
						</button>
						<span className='text-xl font-semibold text-gray-2'>
							{index + 1}
						</span>
						<button
							aria-disabled={!media[index + 1]}
							disabled={!media[index + 1]}
							className=' rounded-full border border-gray-2 disabled:opacity-0'
							onClick={() => handleChange('next')}
						>
							<ChevronRight className='font-light text-gray-2' size={30} />
						</button>
					</div>
				</div>

				<div className=' absolute right-1 top-3'>
					<DialogClose className='flex size-10 flex-col items-center justify-center rounded-full border border-gray-2'>
						<X className='text-gray-2' />
					</DialogClose>
					<p className='pl-1 font-light text-gray-2'>ESC</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
