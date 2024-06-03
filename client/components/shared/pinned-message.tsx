import Image from 'next/image';
import { ReactNode, memo } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PinnedMessageType } from '@/helper/message';

function PinnedMessages({
  children,
  pinnedMessages,
  type,
}: {
  children: ReactNode;
  pinnedMessages: PinnedMessageType[];
  type: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='pinned messages'
        name='pinned messages'
        title='pinned messages'
      >
        <Image
          className='min-w-7'
          src={'/general/icons/pin.svg'}
          width={25}
          height={25}
          alt={'pin'}
          key={'pin'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mt-4 min-w-72 border-none bg-foreground p-0'>
        <header className='min-h-12 bg-[#111214] p-2 text-gray-2'>
          <h3 className='text-base font-semibold'>Pinned Message</h3>
        </header>
        {pinnedMessages.length < 1 ? (
          <div className='flex min-h-60 w-full flex-col items-center justify-center'>
            <Image
              src={'/general/icons/boom.svg'}
              width={100}
              height={100}
              alt={'boom'}
              key={'boom'}
            />
            <p className='max-w-[calc(100%-50px)] pt-2 text-center text-sm text-white'>
              This channel doesn&apos;t have any pinned messages...yet.
            </p>
          </div>
        ) : (
          children
        )}
        {type !== 'personal' && (
          <footer className='min-h-16 bg-foreground p-2 text-white'>
            <h4 className='text-center text-base font-semibold uppercase text-green-600'>
              ProTip:
            </h4>
            <p className='pt-2 text-center text-sm text-gray-2'>
              User with &apos;Manage messages&apos; can pin a message <br />{' '}
              from it&apos;s context menu.
            </p>
          </footer>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default memo(PinnedMessages);
