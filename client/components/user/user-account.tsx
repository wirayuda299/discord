import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';

import { Button } from '../ui/button';
import { getUserById } from '@/helper/user';
import { useServerStates } from '@/providers';
import useFetch from '@/hooks/useFetch';
import PulseLoader from '../shared/pulse-loader';

export default function UserAccount() {
  const { setSelectedSetting, setSelectedUserOption } = useServerStates(
    (state) => ({
      setSelectedSetting: state.setSelectedSetting,
      setSelectedUserOption: state.setSelectedOption,
    }),
  );

  const { userId } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useFetch('user', async () => getUserById(userId!!));

  const handleClick = () => {
    setSelectedSetting('profiles');
    setSelectedUserOption('user');
  };
  if (userLoading) return <PulseLoader />;
  if (userError || !user) return null;

  return (
    <div className='mx-auto flex size-full max-w-2xl flex-col'>
      <h2 className='py-2 text-lg font-semibold'>My account</h2>
      <div className='min-h-[120px] w-full rounded bg-[#020505]'></div>
      <ul className='bg-[#1E1F22] px-3'>
        <li className='flex flex-wrap items-center justify-between gap-3'>
          <div className='inline-flex gap-2'>
            <Image
              className='aspect-auto min-h-[90px] min-w-[90px] -translate-y-3 rounded-full border-4 border-background object-cover'
              src={user.image}
              width={90}
              height={90}
              alt='user'
            />
            <div className='flex flex-col gap-1'>
              <h3 className='pt-2 text-base font-semibold text-white'>
                {user.username}
              </h3>
              <p className='text-xs'>{user.created_at?.toLocaleString()}</p>
            </div>
          </div>
          <Button
            size={'sm'}
            className='mb-3 text-sm lg:mb-0'
            onClick={handleClick}
          >
            Edit user profile
          </Button>
        </li>
        <li className='flex w-full flex-col gap-5 rounded-lg bg-background p-3'>
          <div className='flex items-center justify-between'>
            <div>
              <h5 className='text-sm uppercase leading-relaxed text-gray-2'>
                Display name
              </h5>
              <p className='text-sm text-white'>{user.username}</p>
            </div>
            <Button
              onClick={handleClick}
              className='!bg-[#4e5058] text-sm font-medium text-white'
            >
              Edit
            </Button>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <h5 className='text-sm uppercase leading-relaxed text-gray-2'>
                Email
              </h5>
              <p className='text-sm text-white'>{user.email}</p>
            </div>
            <Button
              onClick={handleClick}
              className='!bg-[#4e5058] text-sm font-medium text-white'
            >
              Edit
            </Button>
          </div>
        </li>
        <div className='p-5'>
          <h5 className='text-sm font-normal text-gray-2'>Account removal</h5>
          <p className='py-1 text-xs text-gray-2'>
            Disabling your account means you can recover it at any time after
            taking this action.
          </p>
          <Button variant={'destructive'} className='mt-3'>
            Delete account
          </Button>
        </div>
      </ul>
    </div>
  );
}
