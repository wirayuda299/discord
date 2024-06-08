import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  getServerByCode,
  getServerById,
  isMemberOrAdmin,
} from '@/helper/server';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { joinServer } from '@/actions/server';

type Props = {
  searchParams: {
    serverId: string;
    inviteCode: string;
  };
};

export default async function Invite({ searchParams }: Props) {
  const { userId } = auth();
  const isMemberOrAuthor = await isMemberOrAdmin(
    userId!,
    searchParams.serverId,
  );
  if (isMemberOrAuthor.isAuthor || isMemberOrAuthor.isMember) {
    redirect('/direct-messages');
  }
  const server = await getServerByCode(searchParams.inviteCode);

  const handleJoinServer = async () => {
    'use server';
    await joinServer(
      searchParams.serverId,
      userId!!,
      searchParams.inviteCode,
    ).then(() => {
      redirect(`/server/${server.id}`);
    });
  };

  return (
    <main className='flex min-h-dvh w-full items-center justify-center md:min-h-screen'>
      <form
        action={handleJoinServer}
        className='w-full max-w-96 rounded-md bg-background'
      >
        <header>
          <Image
            src={server.banner ?? '/server/images/server-boost.png'}
            width={300}
            height={100}
            alt='banner'
            className='aspect-video h-48 w-full rounded-sm object-cover'
          />
        </header>
        <div className='p-5 text-center'>
          <h2 className='text-lg font-semibold text-white'>{server.name}</h2>
          <div className='flex-center justify-between pt-5'>
            <div className='flex h-8 w-fit place-items-center gap-2 rounded-full bg-foreground px-5'>
              <div className='size-2 rounded-full bg-green-600'></div>
              <p className='text-center text-xs text-gray-2'>100 online</p>
            </div>
            <div className='flex h-8 w-fit place-items-center gap-2 rounded-full bg-foreground px-5'>
              <div className='size-2 rounded-full bg-gray-2'></div>
              <p className='text-center text-xs text-gray-2'>100 members</p>
            </div>
          </div>
          <Button type='submit' className='mt-5 w-full rounded'>
            Join Server
          </Button>
        </div>
      </form>
    </main>
  );
}
