'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { friendStatus } from '@/constants/friend-status';
import { cn } from '@/lib/utils';
import { formUrlQuery } from '@/utils/url-query';

export default function Status({ selectedStatus }: { selectedStatus: string }) {
	const params = useSearchParams();
	const router = useRouter();

	const handleStatusChange = useCallback(
		(status: string) => {
			const path = formUrlQuery(params.toString(), 'status', status);
			router.push(path as string);
		},
		[params, router]
	);

	return (
		<header className='flex min-w-max items-center gap-1 md:gap-3'>
			{friendStatus.map((status) => (
				<button
					onClick={() => handleStatusChange(status)}
					key={status}
					className={cn(
						'ease min-w-max max-w-max truncate rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors duration-300 hover:bg-[#404249] md:text-sm lg:text-base',
						selectedStatus === status && 'bg-[#404249]'
					)}
				>
					{status}
				</button>
			))}
		</header>
	);
}
