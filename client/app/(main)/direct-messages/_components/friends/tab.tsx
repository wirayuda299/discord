'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';

import { friendtabs } from '@/constants/friends-tab';
import { cn } from '@/lib/utils';
import AddFriends from './addFriends';
import Inbox from '@/components/shared/inbox';
import InvitationRequest from './invitation-request';

const Tab = ({
  handleClick,
  activeTab,
}: {
  activeTab: string;
  handleClick: (tab: string) => void;
}) => {
  const active = useMemo(() => activeTab, [activeTab]);
  return (
    <header className='flex-center h-16 w-full max-w-max gap-5 overflow-x-auto border-b-2 border-background p-3 pr-11 max-[965px]:max-w-[510px] md:pr-0'>
      <div className='md:flex-center hidden gap-3'>
        <Image
          src='/general/icons/friend.svg'
          width={30}
          height={30}
          alt='friend'
          className='aspect-auto min-w-8 object-contain'
          priority
        />
        <h3 className='text-xl font-semibold text-secondary'>Friends</h3>
      </div>

      <ul className='flex-center gap-4'>
        {friendtabs.map((tab) => (
          <button
            aria-label={tab}
            title={tab}
            onClick={() => handleClick(tab)}
            className={cn(
              'min-w-max cursor-pointer rounded px-3 text-sm font-normal capitalize text-gray-2 hover:bg-foreground hover:brightness-125 md:text-lg',
              active === tab && 'bg-foreground brightness-125',
            )}
            key={tab}
          >
            {tab}
          </button>
        ))}
        <AddFriends />
        <Inbox>
          <InvitationRequest />
        </Inbox>
      </ul>
    </header>
  );
};

export default memo(Tab);
