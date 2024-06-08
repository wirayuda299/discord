import type { Socket } from 'socket.io-client';
import { memo, useCallback, useEffect, useState } from 'react';

import ChatItem from '@/components/shared/chat-item/chat-item';
import { Message, Thread } from '@/types/messages';

function ThreadsMessages({
  thread,
  serverId,
  socket,
  handlePinMessage,
}: {
  thread: Thread | null;
  socket: Socket | null;
  serverId: string;
  handlePinMessage: (msgId: string, userId: string) => Promise<void>;
}) {
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);

  const reloadThread = useCallback(async () => {
    if (!thread) return;

    socket?.emit('thread-messages', {
      threadId: thread.thread_id,
      serverId,
    });
  }, [serverId, socket, thread]);

  useEffect(() => {
    if (thread && socket) {
      reloadThread();
    }
    return () => {
      socket?.off('set-thread-messages');
    };
  }, [reloadThread, socket, thread]);

  useEffect(() => {
    socket?.on('set-thread-messages', (messages: Message[]) => {
      setThreadMessages(messages);
    });
  }, [socket]);

  return (
    <>
      {threadMessages?.map((message) => (
        <ChatItem
          key={message.message_id}
          messages={threadMessages}
          msg={message}
          type='thread'
          reloadMessage={reloadThread}
          pinMessage={(msg, userId) => handlePinMessage(msg.message_id, userId)}
        />
      ))}
    </>
  );
}

export default memo(ThreadsMessages);
