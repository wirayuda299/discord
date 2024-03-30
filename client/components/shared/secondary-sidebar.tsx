'use client';

import { Plus, RectangleEllipsis } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction, useRef, useState, TouchEvent } from 'react';

import { menuItems } from '@/constants/menu-items';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function SecondarySidebar({
	isOpen,
	setIsOpen,
	styles,
}: {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	styles?: string;
}) {
	const ref = useRef(null);
	useClickOutside(ref, () => setIsOpen(false));
	const [startX, setStartX] = useState<number | null>(null);

	const handleTouchStart = (e: TouchEvent) => setStartX(e.touches[0].clientX);
	const handleTouchEnd = (e: TouchEvent) => setStartX(null);

	const handleTouchMove = (e: TouchEvent) => {
		if (!startX) return;
		const currentX = e.touches[0].clientX;
		const difference = startX - currentX;

		if (difference > 50) {
			setIsOpen(false);
		}
	};
	return (
		<ul
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onTouchMove={handleTouchMove}
			ref={ref}
			className={cn(
				'ease fixed z-[999] h-screen w-max min-w-72 space-y-4 bg-dark-2 py-[21px]  transition-all duration-500 md:static sm:z-0',
				isOpen ? 'left-0 ' : '-left-full ',
				styles
			)}
		>
			<form className='border-b-2 border-b-black px-3 pb-3'>
				<Input
					placeholder='Find or start a conversation'
					className='bg-dark-1 placeholder:text-gray-1 rounded-md placeholder:text-xs focus-visible:border-none focus-visible:outline-none focus-visible:ring-0'
				/>
			</form>
			<div className=' flex w-full flex-col gap-3 px-2'>
				{menuItems.map((item) => (
					<li
						key={item.label}
						className='ease group rounded-md p-2 transition-colors duration-300  hover:bg-[#404249]'
					>
						<Link className='flex items-center gap-3' href={`/${item.label}`}>
							<Image
								className='grayscale group-hover:invert'
								src={item.icon}
								width={25}
								height={25}
								alt={item.label}
							/>
							<h3 className='text-base font-semibold capitalize'>
								{item.label}
							</h3>
						</Link>
					</li>
				))}
				<div className='flex items-center justify-between pl-2'>
					<h4 className='text-xs uppercase text-[#949ba4]'>Direct messages</h4>
					<button>
						<Plus className='text-[#949ba4]' />
					</button>
				</div>
			</div>
			<button
				className={cn(
					'absolute -right-3 top-1/2 block rotate-90 sm:hidden',
					isOpen && 'right-0'
				)}
				onClick={() => setIsOpen(false)}
			>
				<RectangleEllipsis className='text-gray-1' />
			</button>
		</ul>
	);
}
