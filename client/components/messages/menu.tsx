import Image from 'next/image';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { Copy, Ellipsis, Reply, Trash } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from '../ui/dropdown-menu';
import { pinMessage } from '@/actions/messages';
import { Message } from '@/types/messages';
import { Dispatch, SetStateAction } from 'react';
import { ServerStates } from '@/providers/server';
import { createError } from '@/utils/error';
import CreateThread from '../threads/create-thread';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/form-url-query';

export default function MessageMenu({
	channelId,
	serverId,
	message,
	currentUser,
	serverStates,
	setServerStates,
}: {
	channelId: string;
	serverId: string;
	currentUser: string;
	message: Message;
	serverStates: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
}) {
	const { mutate } = useSWRConfig();
	const searchParams = useSearchParams();
	const router = useRouter();

	function copyText(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			toast.success('Text copied');
		});
	}

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

	const handleSelectedMessage = (msg: Message) => {
		router.push(formUrlQuery(searchParams.toString(), 'type', 'reply')!);
		setServerStates((prev) => ({
			...prev,
			selectedMessage: msg,
		}));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Ellipsis size={25} color='#fff' className='text-white' />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='text-gray-2 flex flex-col gap-2 border-none bg-[#111214]'>
				<DropdownMenuItem
					className='hover:!bg-primary inline-flex w-full min-w-40 cursor-pointer justify-between bg-transparent hover:!text-white'
					onClick={handlePinMessage}
				>
					<span> Pin Message</span>{' '}
					<Image src={'/icons/pin.svg'} width={20} height={20} alt='pin' />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleSelectedMessage(message)}
					className='hover:!bg-primary w-full justify-between bg-transparent hover:!text-white '
				>
					<span>Reply</span>
					<Reply />
				</DropdownMenuItem>

				<CreateThread
					message={message}
					serverState={serverStates}
					setServerStates={setServerStates}
				/>
				<DropdownMenuItem
					onClick={() => copyText(message.message)}
					className='hover:!bg-primary inline-flex w-full justify-between bg-transparent hover:!text-white'
				>
					<span>Copy Text</span>
					<Copy size={20} />
				</DropdownMenuItem>
				{message.author_id === currentUser && (
					<DropdownMenuItem className='hover:!bg-primary inline-flex w-full justify-between bg-transparent text-red-600 hover:!text-white'>
						<span>Delete Message</span>
						<Trash size={20} color='red' />
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					onClick={() => copyText(message.message_id)}
					className='hover:!bg-primary inline-flex justify-between bg-transparent hover:!text-white'
				>
					<span>Copy Message ID</span>
					<Copy size={20} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
