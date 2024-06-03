'use client';

import { useState } from 'react';
import Image from 'next/image';

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';

const items = [
  'for 15 minutes',
  'for 1 hour',
  'for 8 hours',
  'for 24 hours',
  'until i turn it back on',
] as const;

export default function NotificationSettings() {
  const [option, setOption] = useState('only-mention');
  const [muted, setMuted] = useState<boolean>(false);
  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger
        aria-label='notifications'
        name='notifications'
        title='notifications'
      >
        <Image
          className='min-w-6'
          src={
            muted
              ? '/server/icons/bell-mute.svg'
              : '/server/icons/bell-unmute.svg'
          }
          width={24}
          height={24}
          alt={'bell'}
          key={'bell'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mt-5 min-w-[250px] border-none bg-[#111214] p-0 text-white'>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            onClick={() => setMuted((prev) => !prev)}
            className='group w-full bg-transparent p-3 text-gray-2 hover:!bg-primary hover:text-white'
          >
            Mute channel
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            sideOffset={10}
            className='flex flex-col gap-1 border-none bg-[#111214] p-0 text-white'
          >
            {items.map((item) => (
              <DropdownMenuItem
                key={item}
                className='bg-transparent capitalize text-gray-2 hover:!bg-primary hover:!text-white'
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <div className='h-px w-full bg-background'></div>
        <DropdownMenuRadioGroup value={option} onValueChange={setOption}>
          <DropdownMenuRadioItem
            className='group flex !list-none justify-between bg-transparent p-3 hover:!bg-primary'
            value='only-mention'
          >
            <div>
              <p className='text-sm text-gray-2 group-hover:text-white'>
                Use default category
              </p>
              <p className='text-xs text-gray-2 group-hover:text-white'>
                Only Mentions
              </p>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className='group flex justify-between bg-transparent p-3 hover:!bg-primary'
            value='all-messages'
          >
            <p className='text-sm text-gray-2 group-hover:text-white'>
              All Messages
            </p>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className='group flex justify-between bg-transparent p-3 hover:!bg-primary'
            value='only-mentions'
          >
            <p className='text-xs text-gray-2 group-hover:text-white'>
              Only @ Mentions
            </p>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
