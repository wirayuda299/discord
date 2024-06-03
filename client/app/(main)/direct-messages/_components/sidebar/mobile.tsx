import Image from 'next/image';
import Link from 'next/link';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Friends from '../friends/friends';
import { Conversation } from '@/types/messages';
import PersonalMessagesMobile from '@/components/shared/personal-message-mobile';

export default function SidebarMobile({
  conversations,
}: {
  conversations: Conversation[];
}) {
  return (
    <div className='flex w-full flex-col gap-8 md:hidden'>
      <Sheet>
        <SheetTrigger asChild>
          <div className='flex-center group grow cursor-pointer gap-2 rounded py-1 transition-colors ease-in-out hover:bg-foreground'>
            <Image
              src={'/general/icons/friend.svg'}
              width={30}
              height={30}
              alt={'friends'}
              className='aspect-auto object-contain group-hover:brightness-0 group-hover:invert'
            />
            <span className='text-lg font-semibold capitalize group-hover:text-white'>
              friends
            </span>
          </div>
        </SheetTrigger>
        <SheetContent
          side={'right'}
          className='left-10 !w-full min-w-full bg-background p-0'
        >
          <Friends
            rootStyle='p-0 max-w-full min-w-full'
            innerStyle='bg-black text-white !max-w-full w-full'
          />
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger>
          <div className='flex-center group grow cursor-pointer gap-2 rounded py-1 transition-colors ease-in-out hover:bg-foreground'>
            <Image
              src={'/general/icons/nitro.svg'}
              width={30}
              height={30}
              alt={'friends'}
              className='aspect-auto object-contain group-hover:brightness-0 group-hover:invert'
            />
            <span className='text-lg font-semibold capitalize group-hover:text-white'>
              nitro
            </span>
          </div>
        </SheetTrigger>
        <SheetContent
          side={'right'}
          className='left-10 !w-full min-w-full bg-background p-0'
        >
          Nitro
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger>
          <div className='flex-center group grow cursor-pointer gap-2 rounded py-1 transition-colors ease-in-out hover:bg-foreground'>
            <Image
              src={'/general/icons/shop.svg'}
              width={30}
              height={30}
              alt={'friends'}
              className='aspect-auto object-contain group-hover:brightness-0 group-hover:invert'
            />
            <span className='text-lg font-semibold capitalize group-hover:text-white'>
              shop
            </span>
          </div>
        </SheetTrigger>
        <SheetContent
          side={'right'}
          className='left-10 !w-full min-w-full bg-background p-0'
        >
          Shop
        </SheetContent>
      </Sheet>

      <ul className='flex flex-col gap-3'>
        <p className='border-b border-b-gray-1 text-sm uppercase'>
          Direct messages
        </p>
        {conversations?.map((conversation) => (
          <li key={conversation.conversationId}>
            <PersonalMessagesMobile
              conversationId={conversation.conversationId}
              friendId={conversation.id}
              userId={conversation.friendId}
            >
              <Link
                aria-label='direct messages'
                title='direct messages'
                className='flex-center group gap-2 rounded-md p-1 hover:bg-foreground hover:brightness-105 md:hidden'
                href={`/direct-messages?userId=${conversation.friendId}&friendId=${conversation?.id}&conversationId=${conversation?.conversationId}`}
              >
                <Image
                  src={conversation?.friendImage}
                  width={50}
                  height={50}
                  alt={conversation?.friendUsername}
                  className='size-12 rounded-full object-cover'
                />

                <p className='text-lg group-hover:text-white'>
                  {conversation.friendUsername}
                </p>
              </Link>
            </PersonalMessagesMobile>
          </li>
        ))}
      </ul>
    </div>
  );
}
