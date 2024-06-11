import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';

import ServersMenu from '@/components/servers/menu';
import { getAllChannels, getServerById } from '@/helper/server';
import ChannelItem from '@/components/servers/channel-item';

type Props = {
  params: {
    id: string;
  };
  children: ReactNode;
};

export default async function ServerLayout({ params, children }: Props) {
  const [server, categories] = await Promise.all([
    getServerById(params.id),
    getAllChannels(params.id),
  ]);

  if (!server) return notFound();

  return (
    <main className='flex w-full'>
      <aside className='sticky left-0 top-0 flex h-dvh w-full min-w-64 max-w-64 flex-col place-items-center bg-background/50 md:h-screen'>
        <Suspense
          key={params.id}
          fallback={
            <div className='h-8 w-full animate-pulse rounded-md bg-foreground brightness-110'></div>
          }
        >
          <ServersMenu server={server} />
        </Suspense>
        {server.banner && server.settings.show_banner_background && (
          <div className='relative min-h-40 min-w-full'>
            <Image
              src={server.banner}
              className='w-full object-cover'
              fill
              alt='server logo'
            />
          </div>
        )}

        {server.settings.show_progress_bar && (
          <div className='w-full p-2'>
            <div className='flex w-full justify-between'>
              <p className='text-sm font-semibold uppercase text-white'>
                LVL {server.level}
              </p>
              <p className='text-xs text-gray-2'>{server.boost_count} boost</p>
            </div>
            <div className='mt-1 h-1 w-full bg-gray-2'>
              <div
                className='h-1 rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600'
                style={{
                  width: server.level_progress + '%',
                }}
              ></div>
            </div>
          </div>
        )}
        <ul className='flex w-full flex-col gap-3 self-start p-2 py-5'>
          {categories?.map((category) => (
            <ChannelItem
              category={category}
              key={category.category_id}
              server={server}
            />
          ))}
        </ul>
      </aside>
      {children}
    </main>
  );
}
