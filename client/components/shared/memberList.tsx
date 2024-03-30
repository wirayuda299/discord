'use client';
import Image from 'next/image';
import { Suspense } from 'react';

import { cn } from '@/lib/utils';
import { useSheetContext } from '@/providers/sheet';
import { ServerMember } from '@/types/server';
import { getCreatedDate } from '@/utils/createdDate';
import { generateRandomColor } from '@/utils/random-color';

export default function MemberList({
	members,
}: {
	members: ServerMember[] | undefined;
}) {
	const { memberSidebar } = useSheetContext();

	return (
		<div
			className={cn(
				'min-h-screen min-w-60 bg-[#2b2d31] transition-transform ease-out duration-300 p-5',
				memberSidebar ? ' animate-slide-left ' : 'animate-slide-right hidden'
			)}
		>
			{members && members?.length < 1 ? (
				<p>Only you here</p>
			) : (
				<Suspense fallback={<p>Loading...</p>}>
					{members?.map((member) => (
						<div key={member.id}>
							<header className='flex gap-3'>
								<Image
									className='aspect-auto rounded-full object-contain'
									src={member.image}
									width={45}
									height={45}
									alt='member'
								/>
								<div>
									<h3
										className='text-base font-semibold capitalize'
										style={{
											color: generateRandomColor(),
										}}
									>
										{member.username}
									</h3>
									<p className='text-gray-1 text-xs'>
										joined {getCreatedDate(new Date(member.created_at))}
									</p>
								</div>
							</header>
						</div>
					))}
				</Suspense>
			)}
		</div>
	);
}
