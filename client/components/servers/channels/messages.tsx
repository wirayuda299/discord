'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { useServerStates, useSocketStore } from '@/providers';
import { Message } from '@/types/messages';

const ThreadsMessages = dynamic(() => import('../threads/thread-messages'));
const CreateThread = dynamic(() => import('../threads/create-thread'));
const ChatItem = dynamic(
  () => import('@/components/shared/chat-item/chat-item'),
);
const ChatForm = dynamic(() => import('@/components/shared/chat-form'));

export default function ChannelsMessages() {
  const pathname = usePathname();
  const params = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const thread = useServerStates((state) => state.selectedThread);
  const socket = useSocketStore((state) => state.socket);

  const serverId = params?.id as string;
  const channelId = params?.channel_id as string;

  useEffect(() => {
    if (serverId && channelId) {
      socket?.emit('get-channel-message', {
        serverId,
        channelId,
      });
    }
  }, [socket, serverId, channelId]);

  useEffect(() => {
    socket?.on('set-message', (messages) => setMessages(messages));
  }, [socket, setMessages]);

  console.log(messages);

  return (
    <div className='flex min-h-screen w-full grow flex-col justify-between p-3'>
      <ul className='flex h-max flex-col gap-5 py-5'>
        {thread ? (
          <ThreadsMessages
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
              reloadMessage={() =>
                socket?.emit('get-channel-message', {
                  serverId,
                  channelId,
                })
              }
            />
          ))
        )}
      </ul>
      <CreateThread channelId={channelId} pathname={pathname} />
      <div className='sticky bottom-0 left-0 right-0 backdrop-blur-sm'>
        <ChatForm
          reloadMessage={() =>
            thread
              ? socket?.emit('thread-messages', {
                  threadId: thread.thread_id,
                  serverId,
                })
              : socket?.emit('get-channel-message', {
                  serverId,
                  channelId,
                })
          }
          placeholder='send message'
          type={thread ? 'thread' : 'channel'}
        />
      </div>
    </div>
  );
}