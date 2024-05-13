import { Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

import ServerList from "./server-list";
import CreateServerModal from "../create-server/modal";
import { getAllServerCreatedByCurrentUser } from "@/helper/server";
import { getConversationList } from "@/helper/conversations";
import ConversationItem from "../shared/messages/conversation";

export default async function Sidebar() {
  const { userId } = auth();
  if (!userId) return null;

  const [conversations, servers] = await Promise.all([
		getConversationList(userId ?? ''),
		getAllServerCreatedByCurrentUser(userId),
	]);

  return (
		<aside className='flex size-full min-h-screen min-w-[80px] max-w-[80px]  shrink flex-col items-center overflow-y-auto overflow-x-hidden border-r-2 border-r-foreground bg-black/50 p-4 md:bg-foreground'>
			<Link
				href={'/direct-messages'}
				className='hidden rounded-md bg-primary p-2 md:block'
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
			<ul className=" border-b border-background">
				{(conversations || [])?.map((conversation) => (
          <ConversationItem
            innerStyles="!bg-transparent"
            styles="hidden"
						key={conversation.recipient_id}
						conversation={conversation}
					/>
				))}
			</ul>
			<ServerList servers={servers ?? []} />
			<div className='mt-3 flex flex-col gap-4 pb-10'>
				<CreateServerModal />
				<button className='ease group flex size-12 items-center justify-center rounded-full bg-background transition-colors duration-300 hover:bg-green-1'>
					<Compass className='stroke-green-1 group-hover:stroke-white' />
				</button>
			</div>
		</aside>
	);
}
