import Image from 'next/image';
import { Copy, Ellipsis, Trash } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '../../ui/drawer';
import TopEmoji from './top-emoji';
import { Message } from '@/types/messages';
import EmojiPicker from '../emoji-picker';
import { addOrRemoveReaction } from '@/actions/reactions';
import { createError } from '@/utils/error';
import { useMessage } from '@/providers/message';
import { copyText } from '@/utils/copy';

type Props = {
  msg: Message;
  reloadMessage: () => void;
  userId: string;
  type: string;
  pinMessage: (msg: Message, userId: string) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MessageMenuMobile({
  userId,
  msg,
  reloadMessage,
  setIsOpen,
  type,
  pinMessage,
}: Props) {
  const { setMessage } = useMessage();

  const handleAddOrRemoveReactions = async (
    messageId: string,
    emoji: string,
    unifiedEmoji: string,
  ) => {
    try {
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
          <div className='mt-5 flex flex-col justify-center gap-5 divide-y divide-gray-1 rounded-md bg-background/50 p-3 text-white'>
            {msg.author === userId && (
              <DrawerClose
                className='flex-center gap-3'
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
            <DrawerClose
              className='flex-center gap-3 pt-2'
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
          </div>
          <div className='mt-5 flex flex-col justify-center gap-5 divide-y divide-gray-1 rounded-md bg-background/50 p-3 text-white'>
            <DrawerClose
              onClick={() => copyText(msg.message, 'Message copied')}
              className='flex-center gap-3'
            >
              <Copy size={18} className='text-gray-2' />
              <span>Copy text</span>
            </DrawerClose>
            <DrawerClose
              onClick={() => pinMessage(msg, userId!!)}
              className='flex-center gap-3 pt-2'
            >
              <Image
                src={'/general/icons/pin.svg'}
                width={20}
                height={20}
                alt='pin'
              />
              <span>Pin message</span>
            </DrawerClose>
            <DrawerClose
              onClick={() => copyText(msg.message_id, 'Message ID copied')}
              className='flex-center gap-3 pt-2'
            >
              <Copy size={18} className='text-gray-2' />
              <span>Copy message ID</span>
            </DrawerClose>
            <button className='flex-center gap-3 pt-2'>
              <Trash size={18} className='text-red-600' />
              <span className='text-red-600'>Delete message</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
