import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';
import type { Socket } from 'socket.io-client';

import PulseLoader from '@/components/shared/pulse-loader';
import { Message, Thread } from '@/types/messages';

const ThreadsMessages = dynamic(() => import('../threads/thread-messages'));
const CreateThread = dynamic(() => import('../threads/create-thread'));
const ChatItem = dynamic(
  () => import('@/components/shared/chat-item/chat-item'),
);
const ChatForm = dynamic(() => import('@/components/shared/chat-form'));

export default function ChannelsMessages({
  loading,
  socket,
  messages,
  thread,
}: {
  loading: boolean;
  socket: Socket | null;
  messages: Message[];
  thread: Thread | null;
}) {
  const pathname = usePathname();
  const params = useParams();

  const serverId = params?.id as string;
  const channelId = params?.channel_id as string;

  return (
    <div className='px-2 pb-10 min-h-dvh max-h-dvh md:min-h-screen md:max-h-screen '>
      {loading ? (
        <PulseLoader />
      ) : (
        <ul className='flex min-h-dvh md:min-h-screen flex-col gap-5'>
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
      )}
      <CreateThread channelId={channelId} pathname={pathname} />
      <div className='sticky !bottom-0 left-0 right-0 backdrop-blur-sm'>
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
          placeholder='Send message...'
          type={thread ? 'thread' : 'channel'}
        />
      </div>
    </div>
  );
}
