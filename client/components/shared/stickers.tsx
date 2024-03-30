import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { useQuery } from 'react-query';

import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getGifs } from '@/actions/gifs';

type SelectedStickerType = 'gifs' | 'stickers' | 'videos' | 'text';

const options: SelectedStickerType[] = ['gifs', 'stickers', 'videos'];

export default function Sticker({
	setSelectedTenor,
}: {
	setSelectedTenor: Dispatch<
		SetStateAction<{ id: string; url: string } | null>
	>;
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedStickerType, setSelectedStickerType] =
		useState<SelectedStickerType>('stickers');

	const { data, isLoading, isError } = useQuery({
		queryKey: ['emojies'],
		queryFn: async () => await getGifs(),
	});
	if (isLoading) return null;
	if (isError) return 'error';

	return (
		<DropdownMenu modal open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Image
					src={'/icons/gif.svg'}
					className='cursor-pointer  disabled:cursor-not-allowed'
					width={20}
					height={20}
					alt='gif icon'
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-main-foreground max-h-[400px] w-[300px] overflow-y-auto border border-none border-gray-500 shadow-2xl min-[880px]:w-[400px]'>
				{isLoading ? (
					<div className='flex h-72 min-w-[300px] items-center justify-center'>
						<div className='size-10 animate-spin rounded-full border-t-2'></div>
					</div>
				) : (
					<>
						<DropdownMenuLabel className='capitalize'>
							<div>
								<div className='mt-2 flex items-center gap-2'>
									{options.map((option) => (
										<button
											onClick={() => {
												setSelectedStickerType(option);
											}}
											key={option}
											className={cn(
												'ease rounded-md bg-opacity-10 px-2 py-1 capitalize text-white transition-colors duration-300 hover:bg-gray-700',
												selectedStickerType === option && 'bg-[var(--primary)]'
											)}
										>
											{option}
										</button>
									))}
								</div>
								<form className='mt-2'>
									<Input
										placeholder='Search tenor'
										autoComplete='off'
										className='bg-[var(--primary)] ring-offset-[[var(--primary)]]  focus:border-none focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
									/>
								</form>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup className='flex flex-wrap justify-center gap-1'>
							{data?.results?.map((gif: any) => (
								<DropdownMenuItem key={gif?.id}>
									<Image
										onClick={() =>
											setSelectedTenor({
												id: gif?.id,
												url: gif.media[0].gif.url,
											})
										}
										className='aspect-square rounded-md  object-cover'
										unoptimized
										src={gif?.media[0]?.gif?.url}
										alt={'gif'}
										width={100}
										height={100}
										loading='lazy'
									/>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
