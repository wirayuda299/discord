import { Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

import ServerList from "./server-list";
import CreateServerModal from "@/components/servers/create-server/modal";
import { getAllServerCreatedByCurrentUser } from "@/helper/server";
import { getConversationList } from "@/helper/conversations";
import ConversationItem from "../messages/conversation";
import { Conversation } from '@/types/messages';
import { Servers } from '@/types/server';

export default async function Sidebar() {
	const { userId } = auth();

	let results: [Conversation[], Servers[]] | [] = [];

	if (userId) {
		results = await Promise.all([
			getConversationList(userId ?? ''),
			getAllServerCreatedByCurrentUser(userId),
		]);
	}
	const [conversations, servers] = results;

	return (
		<aside className='border-r-foreground md:bg-foreground flex size-full min-h-screen  min-w-[80px] max-w-[80px] shrink flex-col items-center overflow-y-auto overflow-x-hidden border-r-2 bg-black/50 p-4'>
			<Link
				href={'/direct-messages'}
				className='bg-primary hidden rounded-md p-2 md:block'
			>
				<Image
					src={'/icons/discord.svg'}
					priority
					className='hidden md:block'
					width={30}
					height={30}
					alt='logo'
				/>
			</Link>
			<div className=' border-background border-b'>
				{(conversations || [])?.map((conversation) => (
					<ConversationItem
						innerStyles='!bg-transparent'
						styles='hidden'
						key={conversation.recipient_id}
						conversation={conversation}
					/>
				))}
			</div>
			<ServerList servers={servers ?? []} />
			<div className='mt-3 flex flex-col gap-4 pb-10'>
				<CreateServerModal />
				<button
					title='Explore'
					className='ease bg-background hover:bg-green-1 group flex size-12 items-center justify-center rounded-full transition-colors duration-300'
				>
					<Compass className='stroke-green-1 group-hover:stroke-white' />
				</button>
			</div>
		</aside>
	);
}
