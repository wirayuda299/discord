"use client";

import Image from "next/image";
import Link from "next/link";

import { useUserContext } from "@/providers/users";
import SearchForm from "@/components/shared/search-form";
import Inbox from "@/components/shared/inbox";
import ChatForm from "../shared/messages/chat-form";
import { useServerContext } from "@/providers/server";
import ChatItem from "../shared/messages/chat-item";
import useSocket from "@/hooks/useSocket";
import { useMemo } from "react";

export default function ChatList() {
  const { selectedUser, handleSelectUser } = useUserContext();
  const { setServerStates, serversState } = useServerContext();
	const { states, reloadPersonalMessage, socket, params, searchParams, userId } = useSocket();
	
	const messages= useMemo(()=>states.personal_messages, [states.personal_messages])

  if (!searchParams.get("chat")) return null;


  return (
		<div className='size-full'>
			<header className='flex items-center justify-between border-b border-b-foreground p-2'>
				<div className='flex items-center gap-3'>
					<Image
						src={selectedUser?.image || '/icons/discord.svg'}
						width={40}
						height={40}
						alt='user'
						priority
						className='rounded-full object-cover'
					/>
					<h4 className='text-sm font-medium capitalize text-gray-2'>
						{selectedUser?.username}
					</h4>
				</div>
				<div className='hidden gap-4 lg:inline-flex'>
					<SearchForm />
					<Inbox>
						<p>personal notifications</p>
					</Inbox>
				</div>
				<Link href={'/direct-messages'} className='md:hidden'>
					Back
				</Link>
			</header>
			<div className='flex h-[calc(100vh-50px)] flex-col justify-end overflow-y-auto'>
				<ul className='h-full overflow-y-auto p-3'>
					{messages?.map((message) => (
						<ChatItem
							channelId=""
							setServerStates={setServerStates}
							socketStates={states}
							replyType='personal'
							key={message.created_at}
							styles='hidden'
							reloadMessage={reloadPersonalMessage}
							messages={states.personal_messages}
							msg={message}
							socket={socket}
							userId={userId || ''}
							serverStates={serversState}
						/>
					))}
				</ul>
				<ChatForm
					reloadMessage={reloadPersonalMessage}
					params={params}
					searchParams={searchParams}
					userId={userId!!}
					socket={socket}
					type='personal'
					handleSelectUser={handleSelectUser}
					setServerStates={setServerStates}
					placeholder='Message'
					serverStates={serversState}
				/>
			</div>
		</div>
	);
}
