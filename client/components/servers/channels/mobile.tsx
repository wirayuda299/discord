'use client';

import Image from 'next/image';
import { ChevronRight, Cog, MoveLeft, Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Categories } from '@/types/channels';
import ChannelsMessages from './messages';
import { DialogClose } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Servers } from '@/types/server';
import { serverTabs } from '@/constants/server-tabs';
import { cn } from '@/lib/utils';
import useFetch from '@/hooks/useFetch';
import { getServerMembers } from '@/helper/server';

export default function ChannelsDetailMobile({
  channel,
  server,
}: {
  channel: Categories;
  server: Servers;
}) {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] =
    useState<(typeof serverTabs)[number]>('members');

  const { data, isLoading, error } = useFetch('members', () =>
    getServerMembers(server.id),
  );

  if (isLoading || error) return null;

  return (
    <Sheet
      modal={false}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.push(`/server/${params.id}`);
        }
      }}
    >
      <SheetTrigger asChild>
        <div className='flex items-center gap-3 md:hidden'>
          <Image
            src={`/server/icons/${
              channel.channel_type === 'text' ? 'hashtag.svg' : 'audio.svg'
            }`}
            width={18}
            height={18}
            alt='channel icon'
          />
          {channel.channel_name}
        </div>
      </SheetTrigger>
      <SheetContent className='left-0 !min-w-full overflow-y-auto bg-black p-0 text-white md:hidden'>
        <SheetHeader className='sticky top-0 z-10 h-16 gap-1 border-b border-foreground bg-black p-5'>
          <div className='flex items-center gap-3'>
            <DialogClose>
              <MoveLeft />
            </DialogClose>
            <div className='flex items-center gap-1'>
              <p className='text-xl font-semibold'># {channel.channel_name}</p>
              <Drawer>
                <DrawerTrigger>
                  <ChevronRight size={18} />
                </DrawerTrigger>
                <DrawerContent className='bg-black p-3 text-white'>
                  <DrawerHeader className='flex items-center justify-center'>
                    <Image
                      src={'/server/icons/hashtag.svg'}
                      width={20}
                      height={20}
                      alt='logo'
                    />
                    <DrawerTitle>{channel.channel_name}</DrawerTitle>
                  </DrawerHeader>

                  <div className='flex items-center justify-center gap-3'>
                    <button className='size-12 rounded-full bg-foreground/50'>
                      <Search className='mx-auto' />
                    </button>
                    <button className='size-12 rounded-full bg-foreground/50'>
                      <Image
                        src={'/general/icons/threads.svg'}
                        width={20}
                        height={20}
                        alt='thread'
                        className='mx-auto'
                      />
                    </button>
                    <button className='size-12 rounded-full bg-foreground/50'>
                      <Cog className='mx-auto' />
                    </button>
                  </div>

                  <div>
                    <ul className='flex-center gap-5 pb-3 pt-5'>
                      {serverTabs?.map((tab) => (
                        <li
                          onClick={() => setActiveTab(tab)}
                          className={cn(
                            'cursor-pointer text-base capitalize transition-colors duration-300 ease-in-out',
                            activeTab === tab && 'text-primary',
                          )}
                          key={tab}
                        >
                          {tab}
                        </li>
                      ))}
                    </ul>
                    <div className='h-px w-full bg-foreground'></div>
                    {activeTab === 'members' && (
                      <ul className='mt-5 flex max-h-96 flex-col gap-4 overflow-y-auto'>
                        {data?.map((member) => (
                          <li
                            key={member.id}
                            className='flex-center gap-2 rounded-md p-2 hover:bg-foreground/30'
                          >
                            <Image
                              src={member.serverProfile.avatar}
                              width={50}
                              height={50}
                              alt={member.username}
                              className='size-12 rounded-full object-cover'
                            />
                            <Link href={'#'}>
                              <div className='flex-center gap-2'>
                                {member.role && member.role.icon && (
                                  <Image
                                    src={member.role.icon}
                                    width={20}
                                    height={20}
                                    alt='icon'
                                    className='size-4 rounded-full object-cover'
                                  />
                                )}
                                <h3
                                  className='text-xl font-semibold'
                                  style={{
                                    ...(member.role && {
                                      color: member.role.role_color,
                                    }),
                                  }}
                                >
                                  {member.username}
                                </h3>
                              </div>
                              {member.role && (
                                <p className='text-xs'>{member.role.name}</p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </SheetHeader>
        <ChannelsMessages />
      </SheetContent>
    </Sheet>
  );
}
