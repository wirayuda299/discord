'use client';

import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { pinPersonalMessage } from '@/actions/messages';
import { createError } from '@/utils/error';

import type { Message } from '@/types/messages';
import type { PinnedMessageType } from '@/helper/message';
import type { Friend } from '@/helper/friends';
import { useSocketStore } from '@/providers';

const PersonalMessagesHeader = dynamic(() => import('./header'));
const ChatItem = dynamic(
  () => import('@/components/shared/chat-item/chat-item'),
);
const ChatForm = dynamic(() => import('@/components/shared/chat-form'));
const UserInfo = dynamic(() => import('./user-info'));

type Props = {
  friend: Friend;
  styles?: string;
  pinnedMessages: PinnedMessageType[];
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function PersonalMessages({
  styles,
  friend,
  pinnedMessages,
  setIsOpen,
}: Props) {
  const { socket, personalMessages } = useSocketStore((state) => ({
    socket: state.socket,
    personalMessages: state.personal_messages,
  }));
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const recipientId = searchParams.get('userId') as string;
  const conversationId = searchParams.get('conversationId') as string;

  const reloadPersonalMessage = useCallback(() => {
    if (!socket) return;

    socket?.emit('personal-message', {
      conversationId,
      userId: recipientId,
    });
  }, [socket, conversationId, recipientId]);

  const handlePinMessage = useCallback(
    async (msg: Message & { conversation_id: string }, userId: string) => {
      try {
        await pinPersonalMessage(
          msg?.conversation_id,
          msg?.message_id,
          userId,
          pathname,
        ).then(() => toast.success('Message pinned'));
      } catch (error) {
        createError(error);
      }
    },
    [pathname],
  );
  if (!recipientId) return null;

  return (
    <main
      className={cn(
        'h-dvh w-full grow overflow-y-auto text-white md:h-screen',
        styles,
      )}
    >
      <PersonalMessagesHeader
        setIsOpen={setIsOpen}
        messages={personalMessages}
        friend={friend}
        pathname={pathname}
        pinnedMessages={pinnedMessages}
      />
      <UserInfo friend={friend} />
      <ul className='flex h-max flex-col gap-5 px-3 pb-5'>
        {personalMessages?.map((message) => (
          <ChatItem
            // @ts-ignore
            pinMessage={(msg, userId) => handlePinMessage(msg, userId)}
            reloadMessage={reloadPersonalMessage}
            type='personal'
            key={message?.message_id}
            msg={message}
            messages={personalMessages}
          />
        ))}
      </ul>
      <div className='sticky bottom-0 left-0 right-0 p-3 backdrop-blur-sm'>
        <ChatForm
          placeholder={`Message to ${friend?.username}`}
          type='personal'
        />
      </div>
    </main>
  );
}
