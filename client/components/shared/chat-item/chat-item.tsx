import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { usePathname, useSearchParams, useParams } from 'next/navigation';

import { Message } from '@/types/messages';
import { formatMessageTimestamp } from '@/utils/date';
import { foundMessage } from '@/utils/messages';
import { useServerStates } from '@/providers';
import { pinMessage, pinPersonalMessage } from '@/actions/messages';
import { createError } from '@/utils/error';

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
};

function ChatItem(props: Props) {
  const { userId } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setSelectedThread = useServerStates((state) => state.setSelectedThread);

  const allMessages = useMemo(() => props.messages, [props.messages]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const repliedMessage = useMemo(
    () => foundMessage(allMessages, props.msg),
    [allMessages, props.msg],
  );

  const handlePinMessage = async () => {
    try {
      if (props.type === 'channel') {
        await pinMessage(
          params.channel_id as string,
          props.msg.message_id,
          userId!!,
          pathname,
        ).then(() => {
          toast.success('Message pinned');
        });
      } else {
        await pinPersonalMessage(
          searchParams.get('conversationId') as string,
          props.msg.message_id,
          userId!!,
          pathname,
        );
      }
    } catch (error) {
      createError(error);
    }
  };

  return (
    <>
      {props.msg?.shouldAddLabel && (
        <li className='w-full'>
          <div className='flex w-full items-center gap-2 pb-5'>
            <div className='h-px w-full bg-gray-1'></div>
            <p className='min-w-min !text-nowrap text-sm text-gray-2'>
              {formatMessageTimestamp(props.msg.created_at)}
            </p>
            <div className='h-px w-full bg-gray-1'></div>
          </div>
        </li>
      )}
      <li
        id={props.msg.parent_message_id || props.msg.message_id}
        className='group !relative w-full rounded p-2 text-gray-2 hover:bg-foreground hover:bg-foreground/25 md:hover:brightness-125'
      >
        {props.msg.parent_message_id && (
          <RepliedMessage msg={props.msg} repliedMessage={repliedMessage} />
        )}
        {isOpen ? (
          <EditMessageForm
            reloadMessage={props.reloadMessage}
            messageId={props.msg.message_id}
            message={props.msg.message}
            messageAuthor={props.msg.author}
            currentUser={userId!!}
            handleClose={handleClose}
          />
        ) : (
          <MessageContent msg={props.msg} />
        )}

        <MessageMenu
          params={params}
          pathname={pathname}
          searchParams={searchParams}
          setIsOpen={setIsOpen}
          {...props}
          userId={userId!!}
        />
        <MessageMenuMobile
          pinMessage={handlePinMessage}
          setIsOpen={setIsOpen}
          {...props}
          userId={userId!!}
        />

        {props.msg.media_image && !props.msg.parent_message_id && (
          <Image
            src={props.msg?.media_image}
            width={200}
            height={100}
            alt='media'
            priority
            className='ml-9 mt-3 aspect-auto rounded-md object-cover'
          />
        )}
        {(props.msg.threads || []).length >= 1 && (
          <ul className='flex flex-col gap-2 pt-2'>
            {(props.msg.threads || []).map((thread) => (
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
        )}

        {props.msg.reactions.length <= 1 && (
          <div className='flex-center flex-wrap gap-2 pt-2'>
            {props.msg.reactions.map((reaction) => (
              <p
                className='rounded-md border border-blue-500 bg-blue-600/15 px-2'
                key={reaction.unified_emoji}
              >
                {reaction.emoji} <span>{reaction.count}</span>
              </p>
            ))}
          </div>

        )}
      </li>
    </>
  );
}

export default memo(ChatItem);
