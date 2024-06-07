import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useCallback, useMemo, useState } from 'react';

import { Message } from '@/types/messages';
import { formatMessageTimestamp } from '@/utils/date';
import { foundMessage } from '@/utils/messages';
import { useServerStates } from '@/providers';

const MessageContent = dynamic(() => import('./MessageContent'));
const RepliedMessage = dynamic(() => import('./RepliedMessage'));
const EditMessageForm = dynamic(() => import('./edit-message'));
const MessageMenu = dynamic(() => import('./message-menu'));
const MessageMenuMobile = dynamic(() => import('./message-menu-mobile'));

type Props = {
  msg: Message;
  messages: Message[];
  type: string;
  reloadMessage: () => void;
  pinMessage: (msg: Message, userId: string) => void;
};

export default function ChatItem({
  msg,
  messages,
  type,
  reloadMessage,
  pinMessage,
}: Props) {
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setSelectedThread = useServerStates((state) => state.setSelectedThread);

  const allMessages = useMemo(() => messages, [messages]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const repliedMessage = useMemo(
    () => foundMessage(allMessages, msg),
    [allMessages, msg],
  );

  return (
    <>
      <li className='w-full'>
        {msg?.shouldAddLabel && (
          <div className='flex w-full items-center gap-2 pb-5'>
            <div className='h-px w-full bg-gray-1'></div>
            <p className='min-w-min text-nowrap text-sm text-gray-2'>
              {formatMessageTimestamp(msg.created_at)}
            </p>
            <div className='h-px w-full bg-gray-1'></div>
          </div>
        )}
      </li>
      <li
        id={msg.parent_message_id || msg.message_id}
        className='group !relative w-full rounded p-2 text-gray-2 hover:bg-foreground hover:bg-foreground/25 md:hover:brightness-125'
      >
        {msg.parent_message_id && (
          <RepliedMessage msg={msg} repliedMessage={repliedMessage} />
        )}
        {isOpen ? (
          <EditMessageForm
            reloadMessage={reloadMessage}
            currentUser={userId!!}
            handleClose={handleClose}
            message={msg.message}
            messageAuthor={msg.author}
            messageId={msg.message_id}
          />
        ) : (
          <MessageContent msg={msg} />
        )}

        <MessageMenu
          msg={msg}
          pinMessage={pinMessage}
          reloadMessage={reloadMessage}
          setIsOpen={setIsOpen}
          type={type}
          userId={userId!!}
        />
        <MessageMenuMobile
          pinMessage={pinMessage}
          setIsOpen={setIsOpen}
          type={type}
          msg={msg}
          reloadMessage={reloadMessage}
          userId={userId!!}
        />

        {msg.media_image && !msg.parent_message_id && (
          <Image
            src={msg?.media_image}
            width={200}
            height={100}
            alt='media'
            priority
            className='ml-9 mt-3 aspect-auto rounded-md object-cover'
          />
        )}

        <ul className='flex flex-col gap-2 pt-2'>
          {(msg.threads || []).map((thread) => (
            <li
              onClick={() => setSelectedThread(thread)}
              key={thread.thread_id}
              className='flex-center cursor-pointer gap-2 text-sm'
            >
              <Image
                src={'/general/icons/threads.svg'}
                width={15}
                height={15}
                alt='threads'
              />
              <p className='font-semibold text-white'>{thread.username}</p>{' '}
              started a thread{' '}
              <span className='font-semibold text-white'>
                {thread.thread_name}
              </span>
            </li>
          ))}
        </ul>

        <div className='flex-center flex-wrap gap-2 pt-2'>
          {msg.reactions.map((reaction) => (
            <p
              className='rounded-md border border-blue-500 bg-blue-600/15 px-2'
              key={reaction.unified_emoji}
            >
              {reaction.emoji} <span>{reaction.count}</span>
            </p>
          ))}
        </div>
      </li>
    </>
  );
}
