'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { Categories } from '@/types/channels';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import ChannelsDetailMobile from './channels/mobile';

export default function ChannelItem({ category }: { category: Categories }) {
  const params = useParams();

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
                aria-label={'server'}
                href={{
                  pathname: `/server/${encodeURIComponent(
                    params.id as string,
                  )}/${encodeURIComponent(channel.channel_id)}`,

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
                <ChannelsDetailMobile channel={channel} />
                <div className='hidden items-center gap-3 md:flex'>
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
