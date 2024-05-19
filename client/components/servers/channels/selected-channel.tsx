"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import { Suspense, memo, useRef } from "react";

import { cn } from "@/lib/utils/mergeStyle";

import ChanelInfo from "@/components/servers/channels/channel-info";
import Thread from "./threads";
import NotificationSettings from "./notification-settings";
import PinnedMessage from "@/components/shared/messages/pinned-message";
import Inbox from "./inbox";
import MemberSheet from "../members/members";
import ChatForm from "@/components/shared/messages/chat-form";
import ChatItem from "@/components/shared/messages/chat-item";
import SearchForm from "./search-form";
import { useServerContext } from "@/providers/server";
import useSwipe from "@/hooks/useSwipe";
import useSocket from "@/hooks/useSocket";
import useScroll from "@/hooks/useScroll";
import { Message } from "@/types/messages";

function SelectedChannel() {
  const ref = useRef<HTMLUListElement>(null);

  const { serversState, setServerStates } = useServerContext();
  const { reloadChannelMessage, states, socket, params, searchParams, userId} = useSocket();
  const { onTouchEnd, onTouchMove, onTouchStart } = useSwipe(setServerStates);
  const { selectedChannel } = serversState;

  const path = `/server/${params?.id}/${params?.channel_id}?channel_type=${selectedChannel?.channel_type}`;

  useScroll(ref, states.channel_messages);

  return (
		<div
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			className={cn(
				'fixed md:static transition-all ease-out duration-300 top-0 md:z-0 z-40 h-screen overflow-y-auto overflow-x-hidden bg-black md:bg-background  w-full',
				serversState.selectedChannel ? 'right-0' : '-right-full'
			)}
		>
			<header className='flex min-h-14 w-full items-center justify-between border-b-2 border-b-foreground p-2 '>
				<div className='flex items-center gap-3'>
					<Link
						href={'/server/' + params.id}
						className='block md:hidden'
						onClick={() => {
							setServerStates((prev) => ({
								...prev,
								selectedChannel: null,
							}));
						}}
					>
						<MoveLeft className='text-gray-2' />
					</Link>
					<div className='flex items-center gap-1 '>
						<h3 className='text-md flex items-center gap-2 font-medium lowercase text-white'>
							<Image
								src={'/icons/hashtag.svg'}
								width={24}
								height={24}
								alt={'hashtag'}
								key={'hashtag'}
							/>
							{serversState.selectedChannel?.channel_name}
						</h3>
						<div className='md:hidden'>
							<ChanelInfo />
						</div>
					</div>
				</div>
				<div className='hidden items-center gap-4 md:flex'>
					<Suspense
						fallback={
							<div className='aspect-square h-6 w-12 rounded-md bg-background brightness-110'></div>
						}
					>
						<Thread
							channelId={params.channel_id as string}
							serverId={params.id as string}
						/>
					</Suspense>
					<NotificationSettings />
					<Suspense
						fallback={
							<div className='aspect-square h-6 w-12 rounded-md bg-background brightness-110'></div>
						}
					>
						<PinnedMessage channelId={params.channel_id as string} />
					</Suspense>
					<Suspense
						fallback={
							<div className='aspect-square h-6 w-12 rounded-md bg-background brightness-110'></div>
						}
					>
						<MemberSheet
							serverId={params.id as string}
							selectedServer={serversState.selectedServer}
						/>
					</Suspense>
					<SearchForm />
					<Inbox>
						<p>channel notifications</p>
					</Inbox>
					<Image
						src={'/icons/ask.svg'}
						width={24}
						height={24}
						alt={'ask'}
						key={'ask'}
					/>
				</div>
			</header>
			<div className='flex h-[calc(100vh-120px)] max-w-full flex-col'>
				<ul
					className='ease flex min-h-full flex-col gap-5 overflow-y-auto p-2 transition-all duration-500 md:p-5'
					ref={ref}
				>
					{states.channel_messages.length >= 1 &&
						states.channel_messages?.map((msg:Message) => (
							<ChatItem
								params={params}
								searchParams={searchParams}
								replyType={'channel'}
								reloadMessage={() =>
									reloadChannelMessage(
										params.channel_id as string,
										params.id as string
									)
								}
								socket={socket}
								serverStates={serversState}
								messages={states.channel_messages}
								userId={userId!!}
								msg={msg}
								key={msg.message_id}
							/>
						))}
				</ul>

				<ChatForm
					socket={socket}
					type='channel'
					reloadMessage={() =>
						reloadChannelMessage(
							selectedChannel?.channel_id!!,
							params.id as string
						)
					}
					setServerStates={setServerStates}
					path={path}
					serverStates={serversState}
					placeholder={`Message #${selectedChannel?.channel_name}`}
				/>
			</div>
		</div>
	);
}

export default memo(SelectedChannel);
