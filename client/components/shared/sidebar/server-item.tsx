'use client';
import Image from 'next/image';
import Link from 'next/link';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Servers } from '@/types/server';
import { useSheetContext } from '@/providers/sheet';

export default function ServerItem({ server }: { server: Servers }) {
	const { handleSecondarySidebarOpen } = useSheetContext();
	return (
		<li key={server.id}>
			<TooltipProvider>
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<Link
							onClick={() => handleSecondarySidebarOpen(true)}
							href={`/server/${server.id}/channels`}
						>
							<Image
								src={server.logo}
								alt={server.name}
								width={45}
								height={45}
								sizes='40px'
								className='size-10 rounded-full object-cover'
							/>
						</Link>
					</TooltipTrigger>
					<TooltipContent
						side='right'
						sideOffset={5}
						className='z-50 rounded-lg border-none bg-black px-4 py-1.5 text-xs font-semibold capitalize text-white'
					>
						{server.name}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</li>
	);
}
