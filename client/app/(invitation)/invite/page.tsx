import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import {
  getServerByCode,
  isMemberOrAdmin,
} from '@/helper/server';

import ServerCard from '@/components/servers/server-card';

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


  return (
    <main className='flex min-h-dvh w-full items-center justify-center md:min-h-screen'>
      <ServerCard
        server={server}
        userId={userId!}
        inviteCode={searchParams.inviteCode}

      />
    </main>
  );
}
