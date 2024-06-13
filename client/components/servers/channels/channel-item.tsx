'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Categories } from '@/types/channels';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Servers } from '@/types/server';
import { useServerStates } from '@/providers';

export default function ChannelItem({
  category,
  server,
}: {
  category: Categories;
  server: Servers;
}) {
  const params = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const setSelectedChannel = useServerStates(
    (state) => state.setSelectedChannel,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <li key={category.category_id}>
      <Accordion type='multiple'>
        <AccordionItem className='border-none' value={category.channel_name}>
          <AccordionTrigger
            aria-label='view channels'
            name='view channels'
            title='view channels'
            className='text-base font-normal hover:text-white'
          >
            {category.category_name}
          </AccordionTrigger>
          <AccordionContent>
            {category?.channels.map((channel) => (
              <Link
                aria-label={'reset'}
                onClick={
                  windowWidth >= 768
                    ? undefined
                    : () => setSelectedChannel(channel)
                }
                href={{
                  pathname: `/server/${server.id as string}/${channel.channel_id}`,
                  search: `channel_type=${
                    channel.channel_type
                  }&channel_name=${encodeURIComponent(channel.channel_name)}`,
                }}
                key={channel.channel_id}
                className={cn(
                  'flex-center cursor-pointer gap-2 rounded p-2 pl-5 text-base hover:bg-foreground hover:text-white hover:brightness-105',
                  params.channel_id === channel.channel_id &&
                    'bg-foreground brightness-110',
                )}
              >
                <div className='flex items-center gap-3'>
                  <Image
                    src={`/server/icons/${
                      channel.channel_type === 'text'
                        ? 'hashtag.svg'
                        : 'audio.svg'
                    }`}
                    width={18}
                    height={18}
                    alt='audio'
                  />
                  {channel.channel_name}
                </div>
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </li>
  );
}
