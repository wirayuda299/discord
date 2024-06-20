import Image from 'next/image';
import { FolderSearch, ChevronRight, Cog, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { serverTabs } from '@/constants/server-tabs';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messages'
import useServerMembers from '@/hooks/useServerMember';

export default function ChannelInfoMobile({
  channelName,
  serverId,
  messages
}: {
  channelName: string;
  serverId: string;
  messages: Message[]

}) {
  const [activeTab, setActiveTab] =
    useState<(typeof serverTabs)[number]>('members');

  const media = useMemo(() => messages.map(msg => msg.media_image).filter(Boolean), [messages])

  const linksSet = useMemo(() => new Set(
    messages?.map(msg => msg.message).filter(msg => msg.startsWith('https'))
  ), [messages])

  const pins = []

  const links = useMemo(() => Array.from(linksSet), [linksSet])

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
            <ul className='flex flex-col gap-3 pt-3'>
              {data && data.length < 1 ? (

                <div className='flex flex-col items-center justify-center p-5'>
                  <FolderSearch size={95} className='mx-auto' />
                  <p className='pt-2 text-center text-sm text-gray-1'>
                    We Searched far and wide. Unfortunately, no result were found
                  </p>
                </div>

              ) : (

                data?.map((member) => (
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
                ))
              )}

            </ul>
          )}

          {activeTab === 'media' && (
            media.length < 1 ? (
              <div className='flex flex-col items-center justify-center p-5'>
                <FolderSearch size={95} className='mx-auto' />
                <p className='pt-2 text-center text-sm text-gray-1'>
                  We Searched far and wide. Unfortunately, no result were found
                </p>
              </div>
            ) : (
              media?.map(img => (
                <Image
                  src={img}
                  width={100}
                  height={100}
                  alt="media"
                  className='object-cover size-28 rounded-md'
                  key={img} />

              )))
          )}

          <div className="flex flex-wrap gap-5 pt-5">
            {activeTab === 'links' && (
              links.length < 1 ? (
                <div className='flex flex-col items-center justify-center p-5'>
                  <FolderSearch size={95} className='mx-auto' />
                  <p className='pt-2 text-center text-sm text-gray-1'>
                    We Searched far and wide. Unfortunately, no result were found
                  </p>
                </div>

              ) : (

                links?.map(link => (
                  <a href={link}
                    target="_blank"
                    className='w-full h-10 bg-background/50 rounded-md flex-center px-3 text-blue-500 hover:underline' key={link}>

                    {link}

                  </a>
                ))
              )
            )}

          </div>

          {activeTab === 'pins' && (

            pins.length < 1 ? (

              <div className='flex flex-col items-center justify-center p-5'>
                <FolderSearch size={95} className='mx-auto' />
                <p className='pt-2 text-center text-sm text-gray-1'>
                  We Searched far and wide. Unfortunately, no result were found
                </p>
              </div>
            ) : (
              <p>Pinned messages</p>
            ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
