import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '../ui/button';
import UserUpdateForm from '../user-update-form';

export default function EditProfile({
	username,
	avatar,
}: {
	avatar: string;
	username: string;
}) {
	const [selectedOption, setSelectedOption] = useState<string>('user profile');
	return (
		<div className='w-full '>
			<h2 className='text-base font-semibold text-white'>Profiles</h2>
			<ul
				className={cn(
					'border-b-foreground before:bg-primary relative mt-5 flex items-center gap-10 border-b pb-2 before:absolute before:bottom-0 before:h-0.5 before:w-28 before:transition-all before:ease before:duration-300 before:rounded-full before:content-[""]',
					selectedOption === 'user profile'
						? 'before:left-0'
						: 'before:left-[140px]'
				)}
			>
				<li
					onClick={() => setSelectedOption('user profile')}
					className='text-gray-2 cursor-pointer text-sm font-normal uppercase hover:text-white '
				>
					user profile
				</li>
				<li
					onClick={() => setSelectedOption('server profile')}
					className='text-gray-2 cursor-pointer text-sm font-normal uppercase hover:text-white '
				>
					server profile
				</li>
			</ul>

			{selectedOption === 'user profile' && (
				<div
					className={cn(
						'mt-4 h-36 p-2 w-full rounded-lg bg-[url("/images/banner.png")] bg-cover bg-fixed bg-center transition-all overflow-hidden ease duration-500 flex flex-col justify-center '
					)}
				>
					<div className='flex items-center justify-between'>
						<Image
							className='aspect-auto size-32 object-contain lg:w-44 '
							src={'/images/art.png'}
							width={200}
							height={144}
							alt='art'
						/>
						<div className='flex items-center gap-3'>
							<div>
								<h3 className='truncate text-wrap text-base font-extrabold lg:text-xl'>
									Fresh look, Clean aim. Must be valorant
								</h3>
								<p className='truncate text-balance text-xs'>
									Keep your profile looking clutch with new avatar decorations
									and profile effects.
								</p>
							</div>
							<Button size={'sm'} className='bg-white font-light text-blue-600'>
								Go to shop
							</Button>
						</div>
					</div>
				</div>
			)}
			<UserUpdateForm avatar={avatar} username={username} />
		</div>
	);
}
