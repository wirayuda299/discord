import Image from 'next/image';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function UserInfo({
	selectedOption,
	avatar,
	username,
	bio,
	styles,
}: {
	selectedOption: string;
	avatar: string;
	username: string;
	bio: string;
	styles?: string;
}) {
	return (
		<div className={cn('h-max w-full rounded-lg bg-[#1E1F22]', styles)}>
			<div className='h-20 w-full rounded-t-md bg-black'></div>
			<div className='flex items-center justify-between px-5'>
				{selectedOption === 'user' ? (
					<Image
						className='border-background aspect-auto min-h-[90px] w-[90px] min-w-[90px] -translate-y-5 rounded-full border-4 object-cover'
						src={avatar}
						width={90}
						height={90}
						alt='user'
					/>
				) : (
					<Image
						className='border-background aspect-auto min-h-[90px] w-[90px] min-w-[90px] -translate-y-5 rounded-full border-4 object-cover'
						src={avatar}
						width={90}
						height={90}
						alt='user'
					/>
				)}
				<div className='aspect-square size-8 rounded-md bg-black p-1'>
					<div className='size-full rounded-md bg-green-600 text-center'>#</div>
				</div>
			</div>
			<div className='w-full p-3'>
				<div className='w-full rounded-md bg-black p-5 '>
					<div className='border-b-foreground border-b  pb-4'>
						<h3 className='text-wrap break-words text-sm font-semibold'>
							{username}
						</h3>
						<p className='text-wrap break-words text-sm'>{bio}</p>
					</div>
					<div className='pt-3'>
						<h4 className='text-xs font-semibold uppercase'>
							Customizing user profile
						</h4>
						<div className='flex items-center gap-3'>
							<div className='mt-2 w-max rounded-md bg-blue-600 p-2'>
								<Image
									src={'/images/pencil.png'}
									width={50}
									height={50}
									alt='pencil'
								/>
							</div>
							<div>
								<h5 className='text-sm font-semibold'>User profile</h5>
							</div>
						</div>
						<Button className='mt-3 w-full !bg-[#4e5058]'>
							Example button
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
