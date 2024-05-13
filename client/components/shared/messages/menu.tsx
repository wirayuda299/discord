import type { Socket } from "socket.io-client";
import Image from "next/image";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { Copy, Ellipsis, Reply, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../../ui/dropdown-menu";
import { pinMessage } from "@/actions/messages";
import { Message } from "@/types/messages";
import { createError } from "@/utils/error";
import { copyText } from "@/utils/copy";
import CreateThread from "../../servers/threads/create-thread";

type Props = {
  channelId: string;
  styles?: string;
  serverId: string;
  type: string;
  currentUser: string;
  message: Message;
  handleSelectedMessage: (
    type: string,
    parentMessageId: string,
    messageId: string,
    msg: Message,
  ) => void;
  socket: Socket | null;
};

export default function MessageMenu({
  channelId,
  serverId,
  message,
  currentUser,
  handleSelectedMessage,
  socket,
  styles,
  type
}: Props) {
  const { mutate } = useSWRConfig();

  const handlePinMessage = async () => {
    try {
      await pinMessage(
        channelId,
        message.message_id,
        currentUser,
        `/server/${serverId}`,
      ).then(() => {
        toast.success("Message pinned");
        mutate("pinned-messages");
      });
    } catch (error) {
      createError(error);
    }
  };

  return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Ellipsis size={25} color='#fff' className='text-white' />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='flex flex-col gap-2 border-none bg-[#111214] text-gray-2'>
				{type !== 'personal' && message.author === currentUser && (
					<DropdownMenuItem
						className='inline-flex w-full min-w-40 cursor-pointer justify-between bg-transparent hover:!bg-primary hover:!text-white'
						onClick={handlePinMessage}
					>
						<span> Pin Message</span>{' '}
						<Image src={'/icons/pin.svg'} width={20} height={20} alt='pin' />
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					onClick={() =>
						handleSelectedMessage(
							'reply',
							message.message_id,
							message.message_id,
							message
						)
					}
					className='w-full justify-between bg-transparent hover:!bg-primary hover:!text-white '
				>
					<span>Reply</span>
					<Reply />
				</DropdownMenuItem>
				{type !== 'personal' && (
					<CreateThread
						styles={styles}
						channelId={channelId}
						message={message}
						serverId={serverId}
						socket={socket}
						text={<span>Create Thread</span>}
					/>
				)}

				<DropdownMenuItem
					onClick={() => copyText(message.message, 'Message copied')}
					className='inline-flex w-full justify-between bg-transparent hover:!bg-primary hover:!text-white'
				>
					<span>Copy Text</span>
					<Copy size={20} />
				</DropdownMenuItem>
				{message.author === currentUser && (
					<DropdownMenuItem className='group inline-flex w-full cursor-pointer justify-between bg-transparent text-red-600 hover:!bg-primary hover:!text-white'>
						<span>Delete Message</span>
						<Trash
							size={20}
							color='red'
							className='ease transition-colors group-hover:fill-red-600'
						/>
					</DropdownMenuItem>
				)}
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
