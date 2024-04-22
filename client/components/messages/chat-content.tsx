import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import Image from "next/image";
import type { Socket } from "socket.io-client";

import EditMessageForm from "./edit-message";
import MessageMenu from "./menu";
import EmojiPickerButton from "./emoji-picker";
import { ServerStates } from "@/providers/server";
import { Message } from "@/types/messages";
import { cn } from "@/lib/utils";
import CreateThread from "../threads/create-thread";

type Props = {
  userId: string;
  threadId?: string;
  handleClick: (e: any) => void;
  serverStates: ServerStates;
  message: Message;
  setServerStates: Dispatch<SetStateAction<ServerStates>>;
  handleSelectedMessage: (msg: Message) => void;
  socket: Socket | null;
  children?: ReactNode;
};

export default function ChatContent({
  handleClick,
  serverStates,
  userId,
  setServerStates,
  handleSelectedMessage,
  message,
  socket,
  children,
  threadId,
}: Props) {
  const [value, setValue] = useState<string>("");
  const [formOpen, setFormOpen] = useState<boolean>(false);

  return (
		<div className="w-full">
			<div className='group !relative flex items-center'>
				<div>
					<div className='flex flex-wrap gap-x-2 text-white'>
						<div className='flex gap-2'>
							<p className='inline-flex gap-x-1 text-nowrap pt-[2px] text-xs leading-snug text-gray-600'>
								{new Date(message.created_at).toLocaleString('en-US', {
									hour: 'numeric',
									hour12: true,
								})}{' '}
							</p>
							<p className='text-xs leading-snug text-gray-2 md:text-sm'>
								{message.username}
							</p>
						</div>
						{!formOpen && (
							<p
								className='min-w-min text-wrap  text-xs text-[#d9dee1] md:text-sm'
								style={{
									wordWrap: 'break-word',
									wordBreak: 'break-all',
								}}
							>
								{message.message}{' '}
								{new Date(message.update_at).getTime() >
									new Date(message.created_at).getTime() && (
									<span className='text-xs text-gray-2'>(edited)</span>
								)}
							</p>
						)}
					</div>
					<div className='ml-9 mt-2 flex flex-wrap gap-2'>
						{message.reactions.map((reaction) => (
							<div
								key={reaction.unified_emoji}
								className='inline-flex w-auto gap-1 rounded-md border border-primary bg-[#373a54] px-2 py-px text-base'
							>
								{reaction.emoji}{' '}
								<span className='font-semibold text-white'>
									{reaction.count}
								</span>
							</div>
						))}
					</div>
				</div>

				<div
					className={cn(
						'absolute right-9 h-7 !min-w-20 rounded bg-background/50 opacity-0 shadow-lg group-hover:opacity-100 sm:right-0 md:brightness-110'
					)}
				>
					<div className=' flex h-full items-center gap-4 px-2'>
						<EmojiPickerButton handleClick={handleClick} />
						{message.author === userId && (
							<button
								name='Edit message'
								title='Edit message'
								type='button'
								className='min-w-5'
								onClick={() => setFormOpen((prev) => !prev)}
							>
								<Image
									src={'/icons/pencil.svg'}
									width={20}
									height={20}
									alt='pencil'
								/>
							</button>
						)}
						<CreateThread
							styles='!bg-transparent '
							message={message}
							serverState={serverStates}
							setServerStates={setServerStates}
							setValue={setValue}
							value={value}
						/>
						{message.author === userId && (
							<MessageMenu
								handleSelectedMessage={handleSelectedMessage}
								currentUser={userId}
								channelId={serverStates.selectedChannel?.channel_id!}
								message={message}
								serverId={serverStates.selectedServer?.id!}
							>
								{children}
							</MessageMenu>
						)}
					</div>
				</div>
			</div>
			{formOpen && (
				<EditMessageForm
					threadId={threadId}
					socket={socket}
					channelId={serverStates.selectedChannel?.channel_id!!}
					currentUser={userId!}
					messageAuthor={message.author}
					messageId={message.message_id}
					serverId={serverStates.selectedServer?.id!}
					message={message.message}
					handleClose={() => setFormOpen(false)}
				/>
			)}
		</div>
	);
}
