import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { isMemberOrAdmin } from '@/helper/server';

export default async function ServerDetail({
	params,
}: {
	params: { id: string };
  }) {
  
	const user = await currentUser();

	if (!user || user === null) return null 
	const isMemberOrAuthor = await isMemberOrAdmin(user.id, params.id);

	if (!isMemberOrAuthor.isAuthor && !isMemberOrAuthor.isMember) {
		 redirect('/direct-messages');
	}

	 (
		<div className='hidden size-full sm:block'>
			<div className='flex h-screen flex-col items-center justify-center text-white'>
				<Image
					src={'/icons/discord.svg'}
					width={200}
					height={200}
					alt='discord'
				/>
				<h3 className='pt-2 text-sm font-medium'>
					Select a channel to view or send message
				</h3>
			</div>
		</div>
	);
}
