import Image from 'next/image';
import { type Dispatch, type SetStateAction, memo, useCallback } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { Copy, Ellipsis, Trash } from 'lucide-react';
import { toast } from 'sonner';
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EmojiPicker from '../emoji-picker';
import { Message } from '@/types/messages';

import { discordEmojis } from '@/constants/emoji';
import TopEmoji from './top-emoji';
import { copyText } from '@/utils/copy';
import { revalidate } from '@/utils/cache';
import { useSelectedMessageStore } from '@/providers';
import { createError } from '@/utils/error';
import { pinMessage, pinPersonalMessage } from '@/actions/messages';
import { usePermissionsContext } from '@/providers/permissions';

type Props = {
  msg: Message;
  userId: string;
  type: string;
  reloadMessage: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  params: Params;
};

function MessageMenu(props: Props) {
  const {
    type,
    msg,
    userId,
    reloadMessage,
    setIsOpen,
    params,
    pathname,
    searchParams,
  } = props;
  const setMessage = useSelectedMessageStore(
    (state) => state.setSelectedMessage,
  );
  const { loading, errors, server, permission } = usePermissionsContext();

  const handleAddOrRemoveReactions = useCallback(
    async (messageId: string, emoji: string, unifiedEmoji: string) => {
      const { addOrRemoveReaction } = await import('@/actions/reactions');
      try {
        await addOrRemoveReaction(messageId, emoji, unifiedEmoji, userId);
        reloadMessage();
      } catch (error) {
        createError(error);
      }
    },
    [reloadMessage, userId],
  );

  const handlePinMessage = async () => {
    try {
      if (type === 'channel') {
        await pinMessage(
          params.channel_id,
          msg.message_id,
          userId,
          pathname,
        ).then(() => {
          toast.success('Message pinned');
        });
      } else {
        await pinPersonalMessage(
          searchParams.get('conversationId') as string,
          msg.message_id,
          userId,
          pathname,
        ).then(() => {
          toast.success('Message pinned');
        });
      }
    } catch (error) {
      createError(error);
    }
  };

  if (loading || errors) return null;

  const canCreateThread =
    (server && server.owner_id === userId) ||
    (permission && permission.manage_thread);
  const canPinMessage =
    server?.owner_id === userId || (permission && permission.manage_message);

  return (
    <div className='absolute right-0 top-0 hidden gap-4 bg-foreground p-1 opacity-0 shadow-xl group-hover:opacity-100 md:flex'>
      <EmojiPicker
        appendEmoji={(emoji) =>
          handleAddOrRemoveReactions(msg.message_id, emoji.emoji, emoji.code)
        }
        style='size-5'
      />

      {msg.author === userId ? (
        <button
          aria-label='Edit message'
          name='Edit message'
          title='Edit message'
          type='button'
          className='min-w-5'
          onClick={() => setIsOpen(true)}
        >
          <Image
            src='/general/icons/pencil.svg'
            width={20}
            height={20}
            alt='pencil'
          />
        </button>
      ) : (
        <button
          aria-label='reply'
          name='reply'
          title='reply'
          onClick={() => setMessage({ message: msg, action: 'reply', type })}
        >
          <Image
            src='/general/icons/reply.svg'
            width={20}
            height={20}
            alt='reply'
          />
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger aria-label='menu' name='menu' title='menu'>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='space-y-1 border-none bg-[#111214] p-3'>
          <TopEmoji
            handleAddOrRemoveReactions={handleAddOrRemoveReactions}
            msg={msg}
          />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='!bg-transparent text-xs text-white hover:!bg-primary'>
              Add reactions
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                avoidCollisions
                className='border-none bg-black text-white'
              >
                {discordEmojis.map((emoji) => (
                  <DropdownMenuItem
                    onClick={() =>
                      handleAddOrRemoveReactions(
                        msg.message_id,
                        emoji.emoji,
                        emoji.code,
                      )
                    }
                    key={emoji.name}
                    className='flex-center cursor-pointer justify-between gap-3 bg-transparent text-xs !text-white hover:!bg-primary'
                  >
                    <span className='text-sm'>{emoji.name}</span>{' '}
                    <span className='text-xl'>{emoji.emoji}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {msg.author === userId && (
            <DropdownMenuItem
              onClick={() => setIsOpen(true)}
              className='flex-center justify-between !bg-transparent text-xs !text-white hover:!bg-primary'
            >
              <span>Edit message</span>
              <Image
                src='/general/icons/pencil.svg'
                width={20}
                height={20}
                alt='pencil'
              />
            </DropdownMenuItem>
          )}

          {type !== 'personal' && canPinMessage && (
            <DropdownMenuItem
              onClick={handlePinMessage}
              className='flex-center justify-between !bg-transparent text-xs !text-white hover:!bg-primary'
            >
              <span>Pin message</span>
              <Image
                src='/general/icons/pin.svg'
                width={20}
                height={20}
                alt='pin'
              />
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => setMessage({ message: msg, action: 'reply', type })}
            className='flex-center justify-between !bg-transparent text-xs !text-white hover:!bg-primary'
          >
            <span>Reply</span>
            <Image
              src='/general/icons/reply.svg'
              width={20}
              height={20}
              alt='reply'
            />
          </DropdownMenuItem>

          {type !== 'personal' && canCreateThread && (
            <DropdownMenuItem
              aria-label='create thread'
              title='create thread'
              onClick={() =>
                setMessage({ message: msg, action: 'create_thread', type })
              }
              className='flex-center justify-between !bg-transparent text-xs !text-white hover:!bg-primary'
            >
              <span>Create Thread</span>
              <Image
                src='/general/icons/threads.svg'
                width={20}
                height={20}
                alt='threads'
              />
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            aria-label='copy message'
            title='copy message'
            onClick={() => copyText(msg.message, 'Message copied')}
            className='flex-center justify-between !bg-transparent text-xs !text-white hover:!bg-primary'
          >
            <span>Copy Message</span>
            <Copy size={18} className='text-[#949ba4]' />
          </DropdownMenuItem>

          {msg.author === userId && (
            <DropdownMenuItem
              aria-label='delete message'
              title='delete message'
              onClick={async () => {
                const { deleteMessage } = await import('@/helper/message');
                deleteMessage(msg.message_id, msg.media_image_asset_id).then(() => {
                  revalidate(pathname)
                  reloadMessage();

                });

              }}
              className='flex-center cursor-pointer justify-between !bg-transparent text-xs !text-red-600'
            >
              <span>Delete Message</span>
              <Trash size={18} className='text-red-600' />
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            aria-label='copy message ID'
            title='copy message ID'
            onClick={() => copyText(msg.message_id, 'Message ID copied')}
            className='flex-center justify-between !bg-transparent text-xs !text-white hover:!bg-primary'
          >
            <span>Copy message ID</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default memo(MessageMenu);
