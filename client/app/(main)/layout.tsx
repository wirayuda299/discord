import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';

import UserChatAndServer from './direct-messages/_components/sidebar/UserChatAndServer';

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className='flex h-full w-full overflow-hidden'>
      <aside className='flex h-dvh w-full min-w-20 max-w-20 flex-col place-items-center overflow-y-auto bg-background py-3 md:h-screen'>
        <Link
          aria-label='direct messages'
          title='direct messages'
          href='/direct-messages'
          className='flex size-12 items-center justify-center rounded-full bg-foreground p-2 md:rounded-md md:bg-primary'
        >
          <Image
            priority
            src='/general/icons/discord.svg'
            width={35}
            height={35}
            sizes='35px'
            alt='discord'
            className='hidden aspect-auto object-contain md:block'
          />
          <MessageCircle
            fill='#fff'
            stroke='#fff'
            className='mx-auto md:hidden'
            size={30}
          />
        </Link>
        <UserChatAndServer />
      </aside>
      {children}
    </main>
  );
}
