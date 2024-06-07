'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { createError } from '@/utils/error';
import {
  reloadThreadMessage,
  reloadChannelMessages,
} from '@/providers/socket-io';
import { useServerStates, useSocketStore } from '@/providers';

const ThreadsMessages = dynamic(() => import('../threads/thread-messages'));
const CreateThread = dynamic(() => import('../threads/create-thread'));
const ChatItem = dynamic(
  () => import('@/components/shared/chat-item/chat-item'),
);
const ChatForm = dynamic(() => import('@/components/shared/chat-form'));

export default function ChannelsMessages() {
  const pathname = usePathname();
  const params = useParams();
  const thread = useServerStates((state) => state.selectedThread);

  const { channelMessages, socket } = useSocketStore((state) => ({
    socket: state.socket,
    channelMessages: state.channel_messages,
  }));

  const serverId = params?.id as string;
  const channelId = params?.channel_id as string;

  const handlePinMessage = useCallback(
    async (msgId: string, userId: string) => {
      const { pinMessage } = await import('@/actions/messages');

      try {
        await pinMessage(channelId, msgId, userId, pathname).then(() => {
          toast.success('Message pinned');
        });
      } catch (error) {
        createError(error);
      }
    },
    [channelId, pathname],
  );

  return (
    <div className='flex min-h-screen w-full grow flex-col justify-between p-3'>
      <ul className='flex h-max flex-col gap-5 py-5'>
        {thread ? (
          <ThreadsMessages
            handlePinMessage={handlePinMessage}
            serverId={serverId}
            socket={socket}
            thread={thread}
          />
        ) : (
          channelMessages?.map((message) => (
            <ChatItem
              key={message.message_id}
              messages={channelMessages}
              msg={message}
              type='channel'
              reloadMessage={() =>
                reloadChannelMessages(socket, serverId, channelId)
              }
              pinMessage={(msg, userId) =>
                handlePinMessage(msg.message_id, userId)
              }
            />
          ))
        )}
      </ul>
      <div className='sticky bottom-0 left-0 right-0 backdrop-blur-sm'>
        <ChatForm
          placeholder='send message'
          reloadMessage={
            thread
              ? () => reloadThreadMessage(socket, thread?.thread_id, serverId)
              : () => reloadChannelMessages(socket, serverId, channelId)
          }
          type={thread ? 'thread' : 'channel'}
        />
      </div>
      <CreateThread channelId={channelId} pathname={pathname} />
    </div>
  );
}
