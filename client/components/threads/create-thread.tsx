import Image from 'next/image';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ChatForm from '../messages/chat-form';
import { ServerStates } from '@/providers/server';
import { Dispatch, SetStateAction } from 'react';
import { Message } from '@/types/messages';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateThread({
	serverState,
	setServerStates,
	message,
}: {
	message: Message;
	serverState: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
}) {
	const router = useRouter();

	function handleSelectMessage() {
		setServerStates((prev) => ({
			...prev,
			selectedMessage: message,
		}));
	}
	return (
		<Sheet
			onOpenChange={(isOpen) => {
				if (isOpen) {
					router.push(
						`/server/${serverState.selectedServer?.id}/${serverState.selectedChannel?.channel_id}?type=thread`
					);
				} else {
					router.push(
						`/server/${serverState.selectedServer?.id}/${serverState.selectedChannel?.channel_id}`
					);
				}
			}}
		>
			<SheetTrigger asChild>
				<Link
					onClick={handleSelectMessage}
					href={`/server/${serverState.selectedServer?.id}/${serverState.selectedChannel?.channel_id}?type=threads`}
					className='hover:!bg-primary flex w-full justify-between bg-transparent p-2 text-sm hover:!text-white'
				>
					<span> Create Thread</span>
					<Image
						src={'/icons/threads.svg'}
						width={20}
						height={20}
						alt='threads'
					/>
				</Link>
			</SheetTrigger>
			<SheetContent side='right' className='border-none p-0'>
				<header className='border-b-foreground flex w-full items-center gap-4 border-b p-4 '>
					<Image
						src={'/icons/threads.svg'}
						width={25}
						height={25}
						alt='threads'
					/>
					<h3 className='text-gray-2 text-base font-semibold'>New Thread</h3>
				</header>
				<div className=' h-full  p-3'>
					<div className='mt-auto flex h-[calc(100%-50px)] w-full flex-col  justify-end gap-5'>
						<div className='bg-background flex size-14 items-center justify-center rounded-full brightness-125'>
							<Image
								src={'/icons/threads.svg'}
								width={30}
								height={30}
								alt='threads'
							/>
						</div>
						<form>
							<h4 className='text-gray-2 py-3 text-xs font-semibold uppercase'>
								Thread name (optional)
							</h4>
							<input
								type='text'
								placeholder={message.message}
								className='bg-foreground w-full rounded py-2 pl-2 caret-white placeholder:text-xs focus-visible:outline-none'
							/>
						</form>
						<div className='flex flex-wrap gap-2'>
							<p className='inline-flex gap-x-1 text-nowrap pt-[3px] text-xs leading-snug text-gray-600'>
								{new Date(message.msg_created_at).toLocaleString('en-US', {
									hour: 'numeric',
									hour12: true,
								})}
							</p>
							<div className='flex flex-wrap items-start gap-2'>
								<p className='text-gray-2 text-sm leading-snug'>
									{message.author_name}
								</p>

								<p
									className='min-w-min text-wrap  text-sm text-[#d9dee1]'
									style={{
										wordWrap: 'break-word',
										wordBreak: 'break-all',
									}}
								>
									{message.message}
									{new Date(message.msg_updated_at) >
										new Date(message.msg_created_at) && (
										<span className='text-gray-2 text-xs'>(edited)</span>
									)}
								</p>
							</div>
						</div>
						<ChatForm
							serverStates={serverState}
							setServerStates={setServerStates}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
