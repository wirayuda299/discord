import dynamic from 'next/dynamic';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

import CreateServerModal from '@/components/servers/create-server/modal';
import { getConversationList } from '@/helper/conversations';
import { getAllServerCreatedByCurrentUser } from '@/helper/server';

const PersonalMessagesMobile = dynamic(
  () => import('@/components/shared/personal-message-mobile'),
);

export default async function UserChatAndServer() {
  const { userId } = auth();
  const [conversations, servers] = await Promise.all([
    getConversationList(userId || ''),
    getAllServerCreatedByCurrentUser(userId || ''),
  ]);
  return (
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
  );
}
