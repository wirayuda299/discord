import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import UserChatAndServer from './direct-messages/_components/sidebar/UserChatAndServer';

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className='flex h-full w-full max-w-screen-2xl mx-auto overflow-hidden'>
      <aside className='flex h-dvh w-full min-w-20 max-w-20 flex-col place-items-center overflow-y-auto border-r border-foreground bg-black py-3 md:h-screen md:bg-background'>
        <Link
          aria-label='direct messages'
          title='direct messages'
          href='/direct-messages'
          className='flex size-12 items-center justify-center rounded-full bg-foreground md:rounded-md md:bg-primary'
        >
          <Image
            priority
            src='/general/icons/logo.svg'
            width={50}
            height={50}
            sizes='50px'
            alt='logo'
            className=' aspect-auto object-cover rounded-md'
          />

        </Link>
        <UserChatAndServer />
      </aside>
      {children}
    </main>
  );
}
