import Image from 'next/image';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { Copy, Ellipsis, Reply, Trash } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from '../../ui/dropdown-menu';
import { pinMessage } from '@/actions/messages';
import { Message } from '@/types/messages';
import { createError } from '@/utils/error';
import { copyText } from '@/utils/copy';
import CreateThread from '../../servers/threads/create-thread';
import { Permission } from '@/types/server';

type Props = {
	channelId: string;
	serverId: string;
	type: 'personal' | 'thread' | 'channel' | 'reply';
	currentUser: string;
	message: Message;
	handleSelectedMessage: (
		msg: Message,
		action: string,
		type: 'personal' | 'thread' | 'channel' | 'reply'
	) => void;
	serverAuthor: string;
	permissions: Permission | undefined;
};

export default function MessageMenu({
	channelId,
	serverAuthor,
	serverId,
	message,
	currentUser,
	handleSelectedMessage,
	type,
	permissions,
}: Props) {
	const { mutate } = useSWRConfig();

	const handlePinMessage = async () => {
		try {
			await pinMessage(
				channelId,
				message.message_id,
				currentUser,
				`/server/${serverId}`
			).then(() => {
				toast.success('Message pinned');
				mutate('pinned-messages');
			});
		} catch (error) {
			createError(error);
		}
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<Ellipsis size={25} color='#fff' className='text-white' />
			</DropdownMenuTrigger>
			<DropdownMenuContent className=' flex flex-col gap-2 border-none bg-[#111214] text-gray-2'>
				{type !== 'personal' && (
					<>
						{(serverAuthor === currentUser ||
							(permissions && permissions.manage_message)) && (
							<DropdownMenuItem
								className='inline-flex w-full min-w-40 cursor-pointer justify-between bg-transparent hover:!bg-primary hover:!text-white'
								onClick={handlePinMessage}
							>
								<span> Pin Message</span>{' '}
								<Image
									src={'/icons/pin.svg'}
									width={20}
									height={20}
									alt='pin'
								/>
							</DropdownMenuItem>
						)}
					</>
				)}

				<DropdownMenuItem
					onClick={() => handleSelectedMessage(message, 'reply', type)}
					className='w-full justify-between bg-transparent hover:!bg-primary hover:!text-white '
				>
					<span>Reply</span>
					<Reply />
				</DropdownMenuItem>
				{type !== 'personal' && (
					<>
						{(serverAuthor === currentUser ||
							(permissions && permissions.manage_thread)) && (
							<CreateThread message={message}>
								<button
									type='button'
									className='flex w-full justify-between bg-transparent p-2 text-sm hover:bg-primary hover:text-white'
									onClick={() =>
										handleSelectedMessage(message, 'create_thread', 'thread')
									}
								>
									<span>Create Thread</span>
									<Image
										src={'/icons/threads.svg'}
										width={20}
										height={20}
										alt='threads'
									/>
								</button>
							</CreateThread>
						)}
					</>
				)}

				<DropdownMenuItem
					onClick={() => copyText(message.message, 'Message copied')}
					className='inline-flex w-full justify-between bg-transparent hover:!bg-primary hover:!text-white'
				>
					<span>Copy Text</span>
					<Copy size={20} />
				</DropdownMenuItem>
				{(type === 'personal' && message.author === currentUser) ||
					((serverAuthor === currentUser ||
						(permissions && permissions.manage_message)) && (
						<DropdownMenuItem className='group inline-flex w-full cursor-pointer justify-between bg-transparent text-red-600 hover:!bg-primary hover:!text-white'>
							<span>Delete Message</span>
							<Trash
								size={20}
								color='red'
								className='ease transition-colors group-hover:fill-red-600'
							/>
						</DropdownMenuItem>
					))}
				<DropdownMenuItem
					onClick={() => copyText(message.message, 'Message ID copied')}
					className='inline-flex justify-between bg-transparent hover:!bg-primary hover:!text-white'
				>
					<span>Copy Message ID</span>
					<Copy size={20} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
