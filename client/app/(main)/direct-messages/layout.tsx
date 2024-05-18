import { ReactNode } from "react";
import { auth } from "@clerk/nextjs";

import ServerSidebarLinksItem from "@/components/shared/sidebar/server-sidebar-links";
import { serverSidebarLinks } from "@/constants/sidebarLinks";
import { getConversationList } from "@/helper/conversations";
import Conversation from "@/components/shared/messages/conversation";
import SearchForm from "@/components/servers/channels/search-form";

export default async function DirectMessagesLayout({
  children,
  messages,
}: {
  children: ReactNode;
  messages: ReactNode;
}) {
  const { userId } = auth();

  const conversations = await getConversationList(userId ?? "");

  return (
		<div className='flex w-full md:w-auto md:items-start'>
			<aside className='no-scrollbar border-r-foreground hidden size-full min-h-screen min-w-[255px] max-w-[255px]  gap-3 overflow-y-auto border-r-2 md:block md:h-full md:min-w-[200px] md:bg-[#2b2d31]'>
				<div className='flex w-full flex-col '>
					<form className='border-b-foreground w-full border-b p-3'>
						<input
							className='bg-foreground text-gray-2 w-full rounded px-2 py-1 placeholder:text-xs focus-visible:outline-none'
							type='search'
							placeholder='Search or start conversation'
						/>
					</form>
					<ul className='mt-5 space-y-5'>
						{serverSidebarLinks.map((item) => (
							<ServerSidebarLinksItem
								icons={item.icons}
								label={item.label}
								path={item.path}
								key={item.label}
							/>
						))}
						<li className='w-full px-3'>
							<h4 className='border-foreground text-gray-2 border-b text-sm font-medium uppercase'>
								direct messages
							</h4>
							{(conversations || [])?.map((conversation) => (
								<Conversation
									key={conversation.recipient_id}
									conversation={conversation}
								/>
							))}
						</li>
					</ul>
				</div>
			</aside>
			<div className=' w-full p-3 md:hidden'>
				<SearchForm styles='max-w-full' />
				{conversations?.map((conversation) => (
					<Conversation
						key={conversation.recipient_id}
						conversation={conversation}
					/>
				))}
			</div>
			<div className='w-auto md:w-full'>
				<div className='hidden overflow-x-auto md:block'>{children}</div>
				{messages}
			</div>
		</div>
	);
}
