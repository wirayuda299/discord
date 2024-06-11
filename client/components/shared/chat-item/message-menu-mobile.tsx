import Image from 'next/image';
import { Copy, Ellipsis, Trash } from 'lucide-react';
import { Dispatch, SetStateAction, memo } from 'react';

import { createError } from '@/utils/error';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '../../ui/drawer';
import TopEmoji from './top-emoji';
import { Message } from '@/types/messages';
import EmojiPicker from '../emoji-picker';
import { copyText } from '@/utils/copy';
import { useSelectedMessageStore } from '@/providers';

type Props = {
  msg: Message;
  reloadMessage: () => void;
  userId: string;
  type: string;
  pinMessage: (msg: Message, userId: string) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function MessageMenuMobile({
  userId,
  msg,
  reloadMessage,
  setIsOpen,
  type,
  pinMessage,
}: Props) {
  const setMessage = useSelectedMessageStore(
    (state) => state.setSelectedMessage,
  );

  const handleAddOrRemoveReactions = async (
    messageId: string,
    emoji: string,
    unifiedEmoji: string,
  ) => {
    try {
      const { addOrRemoveReaction } = await import('@/actions/reactions');
      await addOrRemoveReaction(messageId, emoji, unifiedEmoji, userId!!);
      reloadMessage();
    } catch (error) {
      createError(error);
    }
  };

  return (
    <div className='absolute right-0 top-0 flex gap-4 p-1 opacity-0 shadow-xl group-hover:opacity-100 md:hidden'>
      <Drawer>
        <DrawerTrigger aria-label='menu' name='menu' title='menu'>
          <Ellipsis />
        </DrawerTrigger>
        <DrawerContent className='mt-3 flex flex-col gap-5 space-y-2 border-none bg-black p-3'>
          <div className='flex-center gap-4'>
            <TopEmoji
              handleAddOrRemoveReactions={handleAddOrRemoveReactions}
              msg={msg}
            />
            <EmojiPicker
              appendEmoji={(emoji) =>
                handleAddOrRemoveReactions(
                  msg.message_id,
                  emoji.emoji,
                  emoji.code,
                )
              }
            />
          </div>
          <ul className='grid gap-3 rounded-md bg-background/50 p-3 text-white'>
            <li className='border-b border-gray-1 pb-3'>
              {msg.author === userId && (
                <DrawerClose
                  className='flex-center gap-3 text-sm'
                  onClick={() => setIsOpen(true)}
                >
                  <Image
                    src={'/general/icons/pencil.svg'}
                    width={20}
                    height={20}
                    alt='pencil'
                  />
                  <span>Edit message</span>
                </DrawerClose>
              )}
            </li>

            <li className='border-b border-gray-1 pb-3'>
              {type !== 'personal' && (
                <DrawerClose
                  aria-label='create thread'
                  title='create thread'
                  className='flex-center gap-3 text-sm'
                  onClick={() =>
                    setMessage({ message: msg, action: 'create_thread', type })
                  }
                >
                  <Image
                    src={'/general/icons/threads.svg'}
                    width={20}
                    height={20}
                    alt='threads'
                  />
                  <span> Create Thread</span>
                </DrawerClose>
              )}
            </li>
            <li>
              <DrawerClose
                className='flex-center gap-3 text-sm'
                onClick={() =>
                  setMessage({
                    message: msg,
                    action: 'reply',
                    type,
                  })
                }
              >
                <Image
                  src={'/general/icons/reply.svg'}
                  width={20}
                  height={20}
                  alt='reply'
                />
                <span>Reply</span>
              </DrawerClose>
            </li>
          </ul>
          <ul className='mt-5 grid gap-3 rounded-md bg-background/50 p-3 text-white'>
            <li className='border-b border-gray-1 pb-3'>
              <DrawerClose
                onClick={() => copyText(msg.message, 'Message copied')}
                className='flex-center gap-3 text-sm'
              >
                <Copy size={18} className='text-gray-2' />
                <span>Copy text</span>
              </DrawerClose>
            </li>
            <li className='border-b border-gray-1 pb-3'>
              <DrawerClose
                onClick={() => pinMessage(msg, userId!!)}
                className='flex-center gap-3 text-sm'
              >
                <Image
                  src={'/general/icons/pin.svg'}
                  width={20}
                  height={20}
                  alt='pin'
                />
                <span>Pin message</span>
              </DrawerClose>
            </li>
            <li className='border-b border-gray-1 pb-3'>
              <DrawerClose
                onClick={() => copyText(msg.message_id, 'Message ID copied')}
                className='flex-center gap-3 text-sm'
              >
                <Copy size={18} className='text-gray-2' />
                <span>Copy message ID</span>
              </DrawerClose>
            </li>
            <li>
              <button className='flex-center gap-3 text-sm'>
                <Trash size={18} className='text-red-600' />
                <span className='text-red-600'>Delete message</span>
              </button>
            </li>
          </ul>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default memo(MessageMenuMobile);
