import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';

import { directMessagesItems } from '@/constants/direct-messages-menu';
import { getConversationList } from '@/helper/conversations';

const SidebarMobile = dynamic(() => import('./mobile'));
const SidebarItem = dynamic(() => import('./item'));
const SearchForm = dynamic(() => import('@/components/shared/search-form'));

export default async function Sidebar() {
  const { userId } = auth();
  const conversations = await getConversationList(userId || '');

  return (
    <aside className='flex h-screen w-full min-w-64 max-w-64 flex-col place-items-center gap-3 bg-background/50 p-3'>
      <SearchForm styles='max-w-full' />
      <div className='my-2 h-[2px] w-full rounded-full bg-background'></div>
      <ul className='hidden w-full flex-col gap-8 self-start md:flex'>
        {directMessagesItems?.map((item) => (
          <SidebarItem key={item.label} icon={item.icon} label={item.label} />
        ))}

        <p className='border-b border-b-gray-1 text-sm uppercase'>
          Direct messages
        </p>

        {conversations?.map((conversation) => {
          return (
            <li key={conversation.conversationId}>
              <Link
                aria-label='direct messages'
                title='direct messages'
                className='group hidden gap-2 rounded-md p-1 hover:bg-foreground hover:brightness-105 md:flex md:items-center'
                href={`/direct-messages?userId=${conversation.friendId}&friendId=${conversation?.id}&conversationId=${conversation?.conversationId}`}
              >
                <Image
                  src={conversation.friendImage}
                  width={50}
                  height={50}
                  alt={conversation.friendUsername}
                  className='size-12 rounded-full object-cover'
                />
                <p className='text-lg group-hover:text-white'>
                  {conversation.friendUsername}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <SidebarMobile conversations={conversations} />
    </aside>
  );
}
