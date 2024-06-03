import { ChevronRight, FolderSearch, X } from 'lucide-react';
import Image from 'next/image';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Friend } from '@/helper/friends';
import { memo, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messages';
import {
  PinnedMessageType,
  deletePersonalPinnedMessage,
} from '@/helper/message';

const tabs = ['media', 'pins', 'links'] as const;

type Props = {
  friend: Friend;
  messages: Message[];
  pinnedMessages: PinnedMessageType[];
  pathname: string;
};

function HeaderMobile({ friend, messages, pinnedMessages, pathname }: Props) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('media');
  const media = useMemo(
    () => messages.map((message) => message.media_image).filter(Boolean),
    [messages],
  );

  return (
    <Drawer>
      <DrawerTrigger className='pt-1 md:hidden'>
        <ChevronRight size={18} />
      </DrawerTrigger>
      <DrawerContent className='border-t bg-black text-white'>
        <DrawerHeader className='flex flex-col items-center justify-center'>
          <Image
            src={friend.image}
            width={80}
            height={80}
            alt={friend.username}
            className='mx-auto size-20 rounded-full object-cover'
          />
          <DrawerTitle className='text-center text-2xl capitalize'>
            {friend.username}
          </DrawerTitle>
        </DrawerHeader>
        <div className='flex-center gap-5 p-3'>
          {tabs.map((tab) => (
            <button
              onClick={() => setActiveTab(tab)}
              aria-label={tab}
              title={tab}
              className={cn(
                'before:content-[" "] relative text-base capitalize transition-all duration-300 ease-in-out before:absolute before:bottom-0 before:left-full before:h-[2px] before:w-0 before:rounded-full before:bg-primary before:opacity-0',
                activeTab === tab &&
                  'before:left-0 before:w-full before:opacity-100',
              )}
              key={tab}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'media' && (
          <div className='flex flex-wrap gap-2'>
            {media.length >= 1 ? (
              media.map((img) => (
                <Image
                  src={img}
                  width={100}
                  height={100}
                  alt='media'
                  key={img}
                  className='aspect-square size-28 rounded-md object-cover'
                />
              ))
            ) : (
              <div className='flex flex-col items-center justify-center p-5'>
                <FolderSearch size={95} className='mx-auto' />
                <p className='pt-2 text-center text-sm text-gray-1'>
                  We Searched far and wide. Unfortunately, no result were found
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'pins' &&
          (pinnedMessages.length >= 1 ? (
            <ul className='relative flex max-h-96 flex-col gap-6 overflow-y-auto p-3'>
              {pinnedMessages?.map((msg) => (
                <li
                  key={msg?.message_id}
                  className='group flex justify-between rounded-md p-2 hover:bg-foreground hover:bg-foreground/30'
                >
                  <div className='flex-center gap-2'>
                    <Image
                      src={msg.image}
                      width={35}
                      height={35}
                      alt='author'
                      className='size-9 rounded-full object-cover'
                    />
                    <div className=''>
                      <h5 className='flex-center gap-2 truncate text-sm text-white'>
                        {msg.username}
                        <span className='text-[10px] text-white'>
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </h5>
                      <p className='truncate text-sm font-medium text-white'>
                        {/* @ts-ignore */}
                        {msg.content}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      deletePersonalPinnedMessage(msg.message_id, pathname)
                    }
                    className='absolute right-6 hidden size-5 rounded-full bg-foreground text-xs text-white group-hover:block'
                  >
                    <X size={15} className='mx-auto' />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className='flex flex-col items-center justify-center p-5'>
              <FolderSearch size={95} className='mx-auto' />
              <p className='pt-2 text-center text-sm text-gray-1'>
                We Searched far and wide. Unfortunately, no result were found
              </p>
            </div>
          ))}
      </DrawerContent>
    </Drawer>
  );
}

export default memo(HeaderMobile);
