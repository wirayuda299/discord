import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { useSWRConfig } from 'swr';

import { getMyInvitation } from '@/helper/user';
import useFetch from '@/hooks/useFetch';
import PulseLoader from '@/components/shared/pulse-loader';
import { Button } from '@/components/ui/button';
import { acceptinvitation } from '@/actions/invitation';
import { createError } from '@/utils/error';

export default function InvitationRequest() {
  const { userId } = useAuth();
  const { mutate } = useSWRConfig();
  const { data, isLoading, error } = useFetch('invitation-request', () =>
    getMyInvitation(userId!!),
  );

  const handleAcceptInvitation = async (friendId: string) => {
    try {
      if (!userId || !friendId) return;

      await acceptinvitation(friendId, userId).then(() => {
        const mutateKeys = [
          'pending-invitation',
          'invitation-request',
          'friend-list',
        ];
        mutateKeys.forEach((key) => {
          mutate(key);
        });
      });
    } catch (error) {
      console.log(error);

      createError(error);
    }
  };

  if (error) return <p>{error.message}</p>;

  if ((data && data.length < 1) || isLoading) return null;

  return (
    <section className='flex w-full flex-col gap-5 p-3'>
      {data?.map((invitation) => (
        <div
          className='flex w-full items-center justify-between gap-5 p-3 hover:bg-foreground hover:brightness-110'
          key={invitation.id}
        >
          <div className='flex items-center gap-2'>
            <Image
              src={invitation.image}
              width={50}
              height={50}
              loading='lazy'
              alt='user'
              className='size-14 rounded-full object-cover'
            />
            <div>
              <h4 className='text-base font-semibold capitalize text-gray-2'>
                {invitation?.username}
              </h4>
              <p className='text-xs text-secondary'>send you friend request</p>
            </div>
          </div>
          <Button
            size='sm'
            onClick={() => handleAcceptInvitation(invitation.id)}
          >
            Accept
          </Button>
        </div>
      ))}
    </section>
  );
}
