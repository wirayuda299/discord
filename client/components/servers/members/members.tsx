import Image from 'next/image';
import { useParams } from 'next/navigation';
import { memo } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Servers } from '@/types/server';
import useSocket from '@/hooks/useSocket';
import useFetch from '@/hooks/useFetch';
import { getServerMembers } from '@/helper/server';
import MemberItem from './memberItem';

function MemberSheet({ selectedServer }: { selectedServer: Servers | null }) {
	const { states } = useSocket();
	const params = useParams();

	const { data, error, isLoading } = useFetch(
		'members',
		() => getServerMembers((params?.id as string) || '')
	);
	if (!selectedServer) return null;

	return (
		<Sheet>
			<SheetTrigger>
				<Image
					className='min-w-6'
					src={'/icons/member.svg'}
					width={24}
					height={24}
					alt={'member'}
					key={'member'}
				/>
			</SheetTrigger>
			<SheetContent className='flex min-h-screen w-60 flex-col gap-4 overflow-y-auto border-none bg-[#2b2d31] p-5'>
				<div className='border-b border-gray-1 pb-5'>
					<h3 className='text-base font-semibold text-gray-2'>Author</h3>
					<div className='flex items-center gap-3 pt-2 text-white'>
						<Image
							className='size-12 rounded-full object-cover'
							src={selectedServer?.serverProfile?.avatar || '/discord.svg'}
							width={50}
							height={50}
							alt='user'
						/>
						<div>
							<h3 className='text-sm font-medium capitalize leading-relaxed'>
								{selectedServer?.serverProfile?.username}
							</h3>
							<p className='text-xs text-gray-2'>
								{states.active_users.includes(
									selectedServer?.serverProfile?.user_id
								) ? (
									<span className='text-green-600'>online</span>
								) : (
									'offline'
								)}
							</p>
						</div>
					</div>
				</div>
				<div>
					<h3 className='mb-3 text-base font-semibold text-gray-2'>Members</h3>
					{error && <p>{error.message}</p>}
					{isLoading ? (
						<div className='space-y-4'>
							{[1, 2, 3, 4].map((c) => (
								<div
									key={c}
									className='h-8 w-full animate-pulse rounded-md bg-background brightness-110'
								></div>
							))}
						</div>
					) : (
						data?.map((member) => (
							<MemberItem
								member={member}
								activeUsers={states.active_users}
								key={member.id}
							/>
						))
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
export default memo(MemberSheet);
