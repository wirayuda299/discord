import Image from "next/image";
import { memo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllThreads } from "@/helper/threads";
import ThreadMessages from "@/components/servers/threads/thread-messages";
import { useDebounce } from "@/hooks/useDebounce";
import useFetch from "@/hooks/useFetch";
import { Thread as ThreadType } from "@/types/messages";



function Thread({
	channelId,
	serverId,
	selectThread,
}: {
	channelId: string;
	serverId: string;
	selectThread: (thread: ThreadType) => void;
}) {
	const [value, setValue] = useState<string>('');

	const { debouncedValue } = useDebounce(value);

	const { data, isLoading } = useFetch<ThreadType[]>('all-threads', () =>
		getAllThreads(channelId, serverId)
	);

	return (
		<DropdownMenu onOpenChange={(isOpen) => isOpen && setValue('')}>
			<DropdownMenuTrigger>
				<Image
					className='min-w-6'
					src={'/icons/threads.svg'}
					width={24}
					height={24}
					alt={'threads'}
					key={'threads'}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className=' border-none bg-background p-0'>
				<header className='flex min-h-6 w-full items-center  gap-3 bg-foreground p-2 text-white'>
					<div className='flex items-center gap-2 border-r border-r-background pr-5'>
						<Image
							src={'/icons/threads.svg'}
							width={24}
							height={24}
							alt={'threads'}
							key={'threads'}
						/>
						<h3 className='text-base font-semibold'>Threads</h3>
					</div>
					<div className='flex max-w-40 items-center rounded bg-background px-2 py-0.5'>
						<input
							type='search'
							id='search'
							defaultValue={value}
							onChange={(e) => setValue(e.target.value)}
							autoComplete='off'
							className='w-full bg-transparent placeholder:text-sm focus-visible:outline-none'
							placeholder='Search'
						/>
					</div>
				</header>
				<div className='flex max-h-48 flex-col gap-2 overflow-y-auto p-2'>
					{isLoading
						? [1, 2, 3, 4].map((c) => (
								<div
									key={c}
									className='h-5 w-full animate-pulse rounded-md bg-background brightness-110'
								></div>
							))
						: debouncedValue === ''
							? data?.map((thread) => (
									<div
										key={thread.thread_id}
										className='ease rounded bg-background p-2 brightness-110 transition-colors duration-300 hover:brightness-125'
									>
										<ThreadMessages
											thread={thread}
											selectThread={selectThread}
										/>
									</div>
								))
							: data
									?.filter(
										(thread) =>
											thread.thread_name
												.toLowerCase()
												.startsWith(debouncedValue.toLowerCase()) ||
											thread.thread_name.includes(
												debouncedValue.toLocaleLowerCase()
											)
									)
									.map((thread) => (
										<div
											key={thread.thread_id}
											className='ease rounded bg-background p-2 brightness-110 transition-colors duration-300 hover:brightness-125'
										>
											<ThreadMessages
												thread={thread}
												selectThread={selectThread}
											/>
										</div>
									))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default memo(Thread);
