import Image from 'next/image';
import { toast } from 'sonner';

import SearchForm from '@/components/shared/search-form';
import { Button } from '@/components/ui/button';
import { getBannedMembers, revokeMember } from '@/helper/members';
import useFetch from '@/hooks/useFetch';
import PulseLoader from '@/components/shared/pulse-loader';

export default function ServerBanList({
  serverId,
}: {
  serverId: string;
}) {
  const { data, isLoading, error, mutate } = useFetch('banned_members', () =>
    getBannedMembers(serverId),
  );
  if (isLoading) return <PulseLoader />;

  if (error) return <p>{error.message}</p>;


  return (
    <section className='size-full p-5'>
      <header className='space-y-3'>
        <h2 className='text-xl font-semibold text-white'>Server ban list</h2>
        <p className='max-w-2xl text-sm text-gray-2'>
          Bans are only applied to the user&apos;s account. This means a user can get around the ban by making a new account. To make it harder for banned users to return, you can enable phone verification in {' '}
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
                onClick={() => revokeMember(serverId, member.id).then(() => {
                  mutate();
                  toast.success('Member removed from banned list');
                })}
                variant='destructive'
              >
                Revoke
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
