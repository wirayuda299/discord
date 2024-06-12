import Image from 'next/image';
import { ChevronRight, Cog, Search } from 'lucide-react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { serverTabs } from '@/constants/server-tabs';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import ServersMembers from '../members';
import useServerMembers from '@/hooks/useServerMember';

export default function ChannelInfoMobile({
  channelName,
  serverId,
}: {
  channelName: string;
  serverId: string;
}) {
  const [activeTab, setActiveTab] =
    useState<(typeof serverTabs)[number]>('members');

  const { data, isLoading, error } = useServerMembers(serverId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
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
          <DrawerTitle>{channelName}</DrawerTitle>
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
            <ul className='flex flex-col gap-3 pt-3'>
              {data?.map((member) => (
                <li
                  key={member.id}
                  className='flex-center gap-2 rounded-md p-2 hover:bg-foreground/35'
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
                          ...(member.role && { color: member.role.role_color }),
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
  );
}
