import Image from 'next/image';
import { Dispatch, SetStateAction, Suspense, memo } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';

import PinnedMessage from '@/components/shared/pinned-message';
import {
  PinnedMessageType,
  deletePersonalPinnedMessage,
} from '@/helper/message';
import { Friend } from '@/helper/friends';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Inbox from '@/components/shared/inbox';
import { Message } from '@/types/messages';

const HeaderMobile = dynamic(() => import('./header-mobile'));
const SearchForm = dynamic(() => import('@/components/shared/search-form'));

type Props = {
  friend: Friend;
  pathname: string;
  pinnedMessages: PinnedMessageType[];
  messages: Message[];
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

function PersonalMessagesHeader({
  friend,
  pathname,
  pinnedMessages,
  messages,
  setIsOpen,
}: Props) {
  const router = useRouter();

  return (
    <header className='flex-center sticky top-0 z-10 h-16 w-full justify-between gap-3 border-b border-background bg-black px-5 py-1 md:bg-foreground'>
      <div className='flex-center w-full gap-3'>
        <Image
          className='size-8 rounded-full object-cover'
          src={friend?.image || '/general/icons/discord.svg'}
          width={30}
          height={30}
          alt='user'
        />
        <div className='flex-center w-full justify-between'>
          <div className='flex-center'>
            <div className='w-full'>
              <h3 className='text-lg font-semibold text-white'>
                {friend?.username}
              </h3>
            </div>
            <HeaderMobile
              pathname={pathname}
              pinnedMessages={pinnedMessages}
              friend={friend}
              messages={messages}
            />
          </div>
          <button
            title='close'
            className='md:hidden'
            onClick={
              setIsOpen
                ? () => {
                    setIsOpen(false);
                    router.push('/direct-messages');
                  }
                : undefined
            }
          >
            <X size={18} className='text-gray-2' />
          </button>
        </div>
      </div>

      <div className='hidden items-center gap-3 md:flex'>
        <Suspense
          fallback={
            <div className='size-5 animate-pulse rounded bg-foreground brightness-125'></div>
          }
        >
          <PinnedMessage type='personal' pinnedMessages={pinnedMessages}>
            <ul className='relative flex max-h-96 flex-col gap-6 overflow-y-auto p-3'>
              {pinnedMessages?.map((msg) => (
                <li
                  key={msg?.message_id}
                  className='group flex justify-between rounded-md p-2 hover:bg-foreground hover:brightness-125'
                >
                  <div className='flex-center gap-2'>
                    <Image
                      src={msg.avatar}
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
                        {msg.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      deletePersonalPinnedMessage(msg.message_id, pathname)
                    }
                    className='absolute right-1 hidden size-5 rounded-full bg-foreground text-xs text-white group-hover:block'
                  >
                    <X size={15} className='mx-auto' />
                  </button>
                </li>
              ))}
            </ul>
          </PinnedMessage>
        </Suspense>
        <Sheet>
          <SheetTrigger>
            <Image
              className='min-w-7'
              src={'/general/icons/user-2.svg'}
              width={25}
              height={25}
              alt='user'
            />
          </SheetTrigger>

          <SheetContent className='border-l-background bg-foreground p-0'>
            <div className='flex h-full flex-col items-center rounded-lg bg-background p-4 text-white'>
              <div className='mb-4 flex items-center justify-center rounded-full bg-pink-600 text-4xl'>
                <Image
                  src={friend.image}
                  height={200}
                  width={200}
                  className='size-36 min-w-36 rounded-full object-cover'
                  alt='user'
                />
              </div>
              <div className='text-center'>
                <h2 className='text-2xl font-bold capitalize'>
                  {friend.username}
                </h2>
              </div>
              <div className='mt-4'>
                <h3 className='text-lg font-semibold text-white'>
                  MEMBER SINCE
                </h3>
                <p className='text-center text-xs'>
                  {new Date(friend.created_at).toDateString()}
                </p>
              </div>
              <div className='mt-4'>
                <h4 className='text-center text-lg text-white'>NOTE</h4>
                <p className='text-center italic'>Click to add a note</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <SearchForm styles='min-w-[150px]' />
        <Inbox>Inbox</Inbox>
        <Image
          className='min-w-7'
          src={'/general/icons/ask.svg'}
          width={25}
          height={25}
          alt='ask'
        />
      </div>
    </header>
  );
}
export default memo(PersonalMessagesHeader);
