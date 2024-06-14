import Image from 'next/image';
import { ArrowLeft, ChevronRight } from 'lucide-react';

import { Permission, Servers } from '@/types/server';
import ServerOverview from './overview/server-overview';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import ServersMembers from '../members';
import Roles from './roles/roles';
import ServerBanList from './bans';

export default function ServerSettingsMobile({
  server,
  userId,
  permission,
}: {
  server: Servers;
  userId: string;
  permission: Permission | undefined;
}) {
  return (
    <div className='h-full w-full text-white'>
      <div className='mx-auto'>
        <Image
          src={server.logo}
          width={50}
          height={50}
          alt='server'
          className='mx-auto mt-2 size-14 rounded-full object-cover'
        />
        <p className='pt-1 text-center text-sm font-light'>{server.name}</p>
      </div>
      <p className='pl-2 text-sm font-light lowercase text-gray-2'>Settings</p>
      <ul className='mt-2 flex flex-col gap-3 divide-y divide-background rounded-lg bg-foreground/20 p-3'>
        {server.owner_id === userId && (
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <li className='flex-center w-full justify-between'>
                <div className='flex-center gap-3'>
                  <Image
                    src={'/server/icons/info.svg'}
                    width={20}
                    height={20}
                    alt='info'
                  />
                  <p className='text-sm font-semibold capitalize'>Overview</p>
                </div>
                <SheetClose>
                  <ChevronRight />
                </SheetClose>
              </li>
            </SheetTrigger>
            <SheetContent className='left-0 h-full w-full border-none bg-black p-0'>
              <header className='flex-center h-14 w-full gap-2 border-b border-foreground px-2 text-white'>
                <SheetClose>
                  <ArrowLeft />
                </SheetClose>
                <h3>Server Overview</h3>
              </header>
              <ServerOverview server={server} />
            </SheetContent>
          </Sheet>
        )}
        <ServersMembers serverId={server.id}>
          <li className='flex-center h-min w-full justify-between pt-2'>
            <div className='flex-center gap-2'>
              <Image
                src={'/server/icons/member.svg'}
                width={24}
                height={24}
                alt='member'
              />
              <p className='text-sm font-semibold capitalize'>Members</p>
            </div>
            <ChevronRight />
          </li>
        </ServersMembers>
        {(server.owner_id === userId ||
          (permission && permission.manage_role)) && (
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <li className='flex-center w-full justify-between pt-2'>
                <div className='flex-center gap-3'>
                  <Image
                    src={'/server/icons/guards.svg'}
                    width={20}
                    height={20}
                    alt='roles'
                  />
                  <p className='text-sm font-semibold capitalize'>Roles</p>
                </div>
                <SheetClose>
                  <ChevronRight />
                </SheetClose>
              </li>
            </SheetTrigger>
            <SheetContent className='left-0 h-full w-full border-none bg-black p-0'>
              <header className='flex-center h-14 w-full gap-2 border-b border-foreground px-2 text-white'>
                <SheetClose>
                  <ArrowLeft />
                </SheetClose>
                <h3 className='font-semibold'>Server Roles</h3>
              </header>
              <div className='h-dvh overflow-y-auto'>
                <Roles serverAuthor={server.owner_id} serverId={server.id} />
              </div>
            </SheetContent>
          </Sheet>
        )}
        {server.owner_id === userId && (
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <li className='flex-center w-full justify-between pt-2'>
                <div className='flex-center gap-3'>
                  <Image
                    src={'/server/icons/hammer.svg'}
                    width={20}
                    height={20}
                    alt='ban'
                  />
                  <p className='text-sm font-semibold capitalize'>Bans</p>
                </div>
                <SheetClose>
                  <ChevronRight />
                </SheetClose>
              </li>
            </SheetTrigger>
            <SheetContent className='left-0 h-full w-full border-none bg-black p-0'>
              <header className='flex-center h-14 w-full gap-2 border-b border-foreground px-2 text-white'>
                <SheetClose>
                  <ArrowLeft />
                </SheetClose>
                <h3 className='font-semibold'>Bans</h3>
              </header>
              <ServerBanList
                serverAuthor={server.owner_id}
                serverId={server.id}
              />
            </SheetContent>
          </Sheet>
        )}
      </ul>
    </div>
  );
}
