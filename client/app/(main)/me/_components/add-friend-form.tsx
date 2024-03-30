import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function AddFriendDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className='min-w-max truncate rounded-sm bg-[#248046] px-2 py-1 text-xs font-semibold text-white md:ml-1'>
					Add friend
				</button>
			</DialogTrigger>
			<DialogContent className='bg-main-foreground border-none'>
				<form className=' p-3'>
					<label
						htmlFor='search'
						className='block text-base font-semibold uppercase'
					>
						Add friend
					</label>
					<p className='text-sm leading-relaxed text-[#949ba4]'>
						You can add friends with their Discord username.
					</p>
					<div className='mt-3 flex items-center rounded-md bg-[#1e1f22] p-3'>
						<input
							type='text'
							autoComplete='off'
							id='search'
							placeholder='You can add friends with their Discord username.'
							className='w-full bg-transparent placeholder:text-sm placeholder:text-[#949ba4] focus-visible:border-none focus-visible:outline-none focus-visible:ring-0'
						/>
						<button
							title='Send friend request'
							className='bg-secondary-purple w-max truncate rounded-md px-3 py-1 text-sm'
						>
							Send friend request
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
