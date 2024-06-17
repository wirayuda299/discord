import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import UserUpdateForm from '@/components/user/update-form';
import { getUserById } from '@/helper/user';
import { getServerProfile } from '@/helper/server';
import { useServerStates } from '@/providers';
import useFetch from '@/hooks/useFetch';
import PulseLoader from '../shared/pulse-loader';

export default function UserProfile() {
  const params = useParams();
  const { userId } = useAuth();
  const { setSelectedOption, selectedOption } = useServerStates((state) => ({
    setSelectedOption: state.setSelectedOption,
    selectedOption: state.selectedOption,
  }));


  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useFetch('user', () => getUserById(userId!!));

  const { data: serverProfile, isLoading, error } = useFetch('server-profile', () =>
    getServerProfile(params.id as string, userId!!),
  );

  function handleChange(option: string) {
    setSelectedOption(option);
  }

  if (userLoading || isLoading)
    return <PulseLoader />

  if (userError || error) return null

  console.log(selectedOption)

  return (
    <div className='h-full w-full overflow-y-auto p-5'>
      <h2 className='text-base font-semibold text-white'>Profiles</h2>
      <ul
        className={cn(
          'before:ease relative mt-5 flex items-center gap-10 border-b border-b-foreground pb-2 before:absolute before:bottom-0 before:h-0.5 before:w-28 before:rounded-full before:bg-primary before:transition-all before:duration-300 before:content-[""]',
          selectedOption === 'user' ? 'before:left-0' : 'before:left-[123px] md:before:left-[126px]',
        )}
      >
        <li
          onClick={() => handleChange('user')}
          className='cursor-pointer text-sm font-normal uppercase text-gray-2 hover:text-white'
        >
          user profile
        </li>
        <li
          onClick={() => handleChange('server')}
          className='cursor-pointer text-sm font-normal uppercase text-gray-2 hover:text-white'
        >
          server profile
        </li>
      </ul>

      {selectedOption === 'user' && (
        <div
          className={cn(
            'ease mt-4 flex h-36 w-full flex-col justify-center overflow-hidden rounded-lg bg-[url("/server/images/banner.png")] bg-cover bg-fixed bg-center p-2 transition-all duration-500',
          )}
        >
          <div className='flex w-full items-center justify-between'>
            <Image
              className='hidden aspect-auto size-32 object-contain lg:block lg:w-44'
              src={'/server/images/art.png'}
              width={200}
              height={144}
              alt='art'
            />
            <div className='flex flex-wrap items-center gap-3'>
              <div>
                <h3 className='text-wrap text-base font-extrabold lg:text-xl'>
                  Fresh look, Clean aim. Must be valorant
                </h3>
                <p className='truncate text-balance text-xs'>
                  Keep your profile looking clutch with new avatar decorations
                  and profile effects.
                </p>
              </div>
              <Button
                size={'sm'}
                className='!bg-white font-light text-blue-600'
              >
                Go to shop
              </Button>
            </div>
          </div>
        </div>
      )}
      <UserUpdateForm
        user={user!}
        serverProfile={serverProfile!}
        selectedOption={selectedOption}
      />
    </div>
  );
}
