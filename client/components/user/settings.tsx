import { X } from 'lucide-react';
import Image from 'next/image';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { user_settings } from '@/constants/user-settings';
import { cn } from '@/lib/utils';
import { useServerStates } from '@/providers';
import UserAccount from '@/components/user/user-account';
import UserProfile from '@/components/user/profiles';
import useWindowResize from '@/hooks/useWindowResize';

export default function UserSettingsDesktop() {
  const { setSelectedSetting, selectedSetting } = useServerStates((state) => ({
    setSelectedSetting: state.setSelectedSetting,
    selectedSetting: state.selectedSetting,
  }));
  const { signOut } = useClerk()
  const router = useRouter()
  const { windowWidth } = useWindowResize();

  if (windowWidth < 768) return null;

  return (
    <Dialog>
      <DialogTrigger
        onClick={() => setSelectedSetting('my account')}
        className='flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-sm !text-gray-2 hover:!bg-primary hover:!text-white'
      >
        <p>Edit server profile</p>
        <Image
          src={'/server/icons/pencil.svg'}
          width={20}
          height={20}
          alt='invite user'
        />
      </DialogTrigger>
      <DialogContent className='hidden max-h-screen min-w-full items-center justify-center border-none p-0 md:flex'>
        <div className='flex h-full max-h-screen w-full'>
          <aside className='flex h-screen min-w-[350px] grow flex-col items-end overflow-y-auto bg-[#2b2d31] p-3 max-lg:min-w-60'>
            <ul className='flex flex-col'>
              {user_settings?.map((setting) => (
                <li key={setting.label}>
                  <ul className='flex flex-col gap-1'>
                    <h4 className='py-2 text-sm font-semibold uppercase text-[#949ba4]'>
                      {setting.label}
                    </h4>

                    {setting.items.map((item) => (
                      <li
                        onClick={() => setSelectedSetting(item)}
                        className={cn(
                          'cursor-pointer rounded-md p-1 text-base capitalize text-[#a9b0bb] hover:bg-foreground hover:text-white hover:brightness-110',
                          selectedSetting === item && 'bg-foreground',
                        )}
                        key={item}
                      >
                        {item}
                      </li>
                    ))}
                    <div className='h-px rounded-full bg-foreground brightness-110'></div>
                  </ul>
                </li>
              ))}
              <li
                onClick={() => signOut().then(() => router.push('/sign-in'))}
                className='flex-center cursor-pointer justify-between rounded-md p-1 text-base capitalize text-[#a9b0bb] hover:bg-foreground hover:text-white hover:brightness-110'>
                Sign Out
              </li>
            </ul>
          </aside>
          <section className='col-span-3 w-full overflow-y-auto bg-[#313338] p-3'>
            {selectedSetting === 'my account' && <UserAccount />}
            {selectedSetting === 'profiles' && <UserProfile />}
          </section>

          <section className='min-w-40 bg-[#313338] p-5 max-lg:min-w-28'>
            <DialogClose>
              <div className='flex size-10 flex-col items-center justify-center rounded-full border'>
                <X className='text-base' />
              </div>
              <p className='text-sm font-semibold'>ESC</p>
            </DialogClose>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
