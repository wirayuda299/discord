import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';

import CreateServerModal from '@/components/create-server/modal';
import { getConversationList } from '@/helper/conversations';
import { getAllServerCreatedByCurrentUser } from '@/helper/server';
const PersonalMessagesMobile = dynamic(
  () => import('../../components/shared/personal-message-mobile'),
);
export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = auth();
  const [conversations, servers] = await Promise.all([
    getConversationList(userId || ''),
    getAllServerCreatedByCurrentUser(userId || ''),
  ]);

  return (
    <main className='flex h-full w-full overflow-hidden'>
      <aside className='flex h-dvh w-full min-w-20 max-w-20 flex-col place-items-center overflow-y-auto bg-background py-3 md:h-screen'>
        <Link
          aria-label='direct messages'
          title='direct messages'
          href='/direct-messages'
          className='flex size-12 items-center justify-center rounded-full bg-foreground p-2 md:rounded-md md:bg-primary'
        >
          <Image
            priority
            src='/general/icons/discord.svg'
            width={35}
            height={35}
            sizes='35px'
            alt='discord'
            className='hidden aspect-auto object-contain md:block'
          />
          <MessageCircle
            fill='#fff'
            stroke='#fff'
            className='mx-auto md:hidden'
            size={30}
          />
        </Link>
        <ul className='flex flex-col gap-3 py-3'>
          {conversations?.map((conversation) => {
            return (
              <li key={conversation.conversationId}>
                <Link
                  aria-label='direct messages'
                  className='hidden md:block'
                  href={`/direct-messages?userId=${conversation.friendId}&friendId=${conversation?.id}&conversationId=${conversation?.conversationId}`}
                >
                  <Image
                    src={conversation.friendImage}
                    width={50}
                    priority
                    fetchPriority='high'
                    height={50}
                    sizes='50px'
                    alt={conversation.friendUsername}
                    className='size-12 rounded-full object-cover'
                  />
                </Link>
                <PersonalMessagesMobile
                  conversationId={conversation.conversationId}
                  friendId={conversation.id}
                  userId={conversation.friendId}
                >
                  <Link
                    aria-label='direct messages'
                    href={`/direct-messages?userId=${conversation.friendId}&friendId=${conversation?.id}&conversationId=${conversation?.conversationId}`}
                  >
                    <Image
                      src={conversation?.friendImage}
                      width={50}
                      priority
                      sizes='50px'
                      fetchPriority='high'
                      height={50}
                      alt={conversation?.friendUsername}
                      className='size-12 w-full rounded-full object-cover md:hidden'
                    />
                  </Link>
                </PersonalMessagesMobile>
                <hr className='mt-3 border-b border-gray-1' />
              </li>
            );
          })}

          {servers?.map((server) => (
            <li key={server.id}>
              <Link aria-label='server' href={`/server/${server.id}`}>
                <Image
                  src={server.logo}
                  width={50}
                  priority
                  fetchPriority='high'
                  height={50}
                  sizes='50px'
                  alt={server.name}
                  className='size-12 rounded-full object-cover'
                />
              </Link>
            </li>
          ))}
          <li>
            <CreateServerModal />
          </li>
        </ul>
      </aside>
      {children}
    </main>
  );
}
