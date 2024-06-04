'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { useSocketState } from '@/providers/socket-io';
import { useServerContext } from '@/providers/servers';

const ThreadsMessages = dynamic(() => import('../threads/thread-messages'));
const CreateThread = dynamic(() => import('../threads/create-thread'));
const ChatItem = dynamic(
  () => import('@/components/shared/chat-item/chat-item'),
);
const ChatForm = dynamic(() => import('@/components/shared/chat-form'));

export default function ChannelsMessages() {
  const pathname = usePathname();
  const params = useParams();

  const socket = useSocketState('socket');
  const messages = useSocketState('channel_messages');
  const thread = useServerContext('selectedThread');

  const serverId = params?.id as string;
  const channelId = params?.channel_id as string;

  const reloadChannelMessage = useCallback(async () => {
    const { reloadChannelMessages } = await import('@/providers/socket-io');
    reloadChannelMessages(socket, serverId, channelId);
  }, [channelId, serverId, socket]);

  const reloadThread = useCallback(async () => {
    if (!thread) return;
    const { reloadThreadMessage } = await import('@/providers/socket-io');

    reloadThreadMessage(socket, thread?.thread_id, serverId);
  }, [serverId, socket, thread]);

  const handlePinMessage = useCallback(
    async (msgId: string, userId: string) => {
      const { toast } = await import('sonner');
      const { createError } = await import('@/utils/error');
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
          messages?.map((message) => (
            <ChatItem
              key={message.message_id}
              messages={messages}
              msg={message}
              type='channel'
              reloadMessage={reloadChannelMessage}
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
          reloadMessage={thread ? reloadThread : reloadChannelMessage}
          type={thread ? 'thread' : 'channel'}
        />
      </div>
      <CreateThread channelId={channelId} pathname={pathname} />
    </div>
  );
}
