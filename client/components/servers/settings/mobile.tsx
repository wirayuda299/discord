import { ArrowLeft, ChevronRight, Cog } from 'lucide-react';
import Image from 'next/image';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Servers } from '@/types/server';
import ServerOverview from './overview/server-overview';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function ServerSettingsMobile({ server }: { server: Servers }) {
  return (
    <Drawer>
      <DrawerTrigger className='flex w-full items-center justify-between rounded px-2 py-2 !text-gray-2 hover:!bg-primary hover:!text-white md:hidden'>
        <span className='text-sm'>Server settings</span>
        <Cog size={20} />
      </DrawerTrigger>
      <DrawerContent className='overflow-y-auto bg-black p-0 text-white md:hidden'>
        <DrawerTitle className='pt-5 text-center'>Server settings</DrawerTitle>
        <div className='mx-auto'>
          <Image
            src={server.logo}
            width={50}
            height={50}
            alt='server'
            className='mx-auto mt-2 size-14 rounded-full object-cover'
          />
          <p className='pt-1 text-sm font-light'>{server.name}</p>
        </div>
        <p className='pl-2 text-sm font-light'>Settings</p>
        <ul className='mt-2 flex h-full flex-col gap-2 divide-y divide-background overflow-y-auto rounded-lg bg-foreground/35 p-3'>
          <Sheet>
            <SheetTrigger asChild>
              <div className='flex-center w-full justify-between'>
                <div className='flex-center gap-3'>
                  <Image
                    src={'/server/icons/info.svg'}
                    width={20}
                    height={20}
                    alt='info'
                  />
                  <p className='text-sm font-semibold capitalize'>Overview</p>
                </div>
                <ChevronRight />
              </div>
            </SheetTrigger>
            <SheetContent className='left-0 h-full w-full bg-black p-0'>
              <header className='flex-center h-14 w-full gap-2 border-b text-white'>
                <DrawerClose>
                  <ArrowLeft />
                </DrawerClose>
                <h3>Server Overview</h3>
              </header>
              <ServerOverview server={server} />
            </SheetContent>
          </Sheet>
          <li className='flex-center w-full justify-between pt-1'>
            <div className='flex-center gap-3'>
              <Image
                src={'/server/icons/info.svg'}
                width={20}
                height={20}
                alt='info'
              />
              <p className='text-sm font-semibold capitalize'>Overview</p>
            </div>
            <ChevronRight />
          </li>
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
