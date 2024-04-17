import Image from 'next/image';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Servers } from '@/types/server';

export default function MemberSheet({
	selectedServer,
}: {
	selectedServer: Servers | null;
}) {
	if (!selectedServer) return null;

	return (
		<Sheet>
			<SheetTrigger>
				<Image
					src={'/icons/member.svg'}
					width={24}
					height={24}
					alt={'member'}
					key={'member'}
				/>
			</SheetTrigger>
			<SheetContent className='flex min-h-screen w-60 flex-col gap-4 overflow-y-auto border-none bg-[#2b2d31] p-5'>
				<div className='border-gray-1 border-b pb-5'>
					<h3 className='text-gray-2 text-base font-semibold'>Author</h3>
					<div className='flex items-center gap-3 pt-2 text-white'>
						<Image
							src={selectedServer.serverProfile.avatar}
							width={50}
							height={50}
							alt='user'
						/>
						<div>
							<h3 className='text-sm font-semibold capitalize'>
								{selectedServer.serverProfile.username}
							</h3>
							<p className='text-gray-2 text-xs'>Online</p>
						</div>
					</div>
				</div>
				<div>
					<h3 className='text-gray-2 text-base font-semibold'>Members</h3>
				</div>
			</SheetContent>
		</Sheet>
	);
}
