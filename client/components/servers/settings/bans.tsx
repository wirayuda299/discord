import Image from 'next/image';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';

import SearchForm from '@/components/shared/search-form';
import { Button } from '@/components/ui/button';
import { getBannedMembers } from '@/helper/members';
import useFetch from '@/hooks/useFetch';
import { createError } from '@/utils/error';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import PulseLoader from '@/components/shared/pulse-loader';

export default function ServerBanList({
  serverId,
  serverAuthor,
}: {
  serverId: string;
  serverAuthor: string;
}) {
  const { userId } = useAuth();
  const { data, isLoading, error, mutate } = useFetch('banned_members', () =>
    getBannedMembers(serverId),
  );
  if (isLoading) return <PulseLoader />;

  if (error) return <p>{error.message}</p>;

  const handleRevokeMembers = async (memberId: string) => {
    try {
      const { revokeMember } = await import('@/helper/members');
      await revokeMember(serverId, memberId).then(() => {
        mutate();
        toast.success('Member removed from banned list');
      });
    } catch (error) {
      createError(error);
    }
  };

  const handleKickMember = async (memberId: string) => {
    if (!userId) return;

    try {
      const { kickMember } = await import('@/actions/members');
      await kickMember(serverId, memberId, serverAuthor, userId!!).then(() =>
        toast.success('Member kicked from server'),
      );
    } catch (error) {
      console.log(error);
      createError(error);
    }
  };

  return (
    <section className='size-full p-5'>
      <header className='space-y-3'>
        <h2 className='text-xl font-semibold text-white'>Server ban list</h2>
        <p className='max-w-2xl text-sm text-gray-2'>
          Bans by default are by account and IP. A user can circumvent an IP ban
          by using a proxy. Ban circumvention can be made very hard by enabling
          phone verification in{' '}
          <span className='text-blue-500'>Moderation</span>
        </p>
        <section className='flex items-center gap-3'>
          <SearchForm styles='max-w-full py-2' />
          <Button className='h-[40px] rounded'>Search</Button>
        </section>
      </header>

      <ul className='mt-5'>
        {data?.map((member) => (
          <li
            key={member.id}
            className='flex items-center justify-between rounded p-2 hover:bg-background hover:brightness-110'
          >
            <div className='flex items-center gap-2'>
              <Image
                src={member.image}
                width={45}
                height={45}
                alt='member'
                className='size-11 rounded-full object-cover'
              />
              <h3 className='text-lg font-semibold text-white'>
                {member.username}
              </h3>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                size='sm'
                onClick={() => handleRevokeMembers(member.id)}
                variant='destructive'
              >
                Revoke
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size='sm' variant='destructive'>
                    Kick
                  </Button>
                </DialogTrigger>
                <DialogContent className='border-none bg-black'>
                  <DialogHeader>
                    <h2 className='text-xl font-semibold text-white'>
                      Remember!
                    </h2>
                    <p className='text-xs leading-relaxed text-white'>
                      Kicking member will not remove member from server banned
                      list. If you kick member and and they try to rejoin your
                      server they will be declined and if you want to allow them
                      to join to your server you must remove them from banned
                      list.
                    </p>
                  </DialogHeader>
                  <div className='flex items-center justify-end gap-2'>
                    <DialogClose asChild>
                      <Button className='!bg-green-500 text-white'>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={() => handleKickMember(member.id)}
                      variant='destructive'
                    >
                      Kick
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
