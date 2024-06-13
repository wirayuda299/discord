'use client';

import Image from 'next/image';
import { Bell, ChevronRight, Cog, UserPlus2 } from 'lucide-react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Servers } from '@/types/server';
import ServerSettingsMobile from '../settings/mobile';
import CreateChannelForm from '../channels/create-channel/form';

export default function ServerMenuMobile({ server }: { server: Servers }) {
  return (
    <Drawer fixed={false} modal={false}>
      <DrawerTrigger
        name='menu'
        aria-label='menu'
        title='menu'
        className='flex-center z-10 w-full gap-1 border-b border-b-background !bg-transparent p-3 text-white backdrop-blur-sm md:hidden'
      >
        <span className='truncate'>{server.name || 'Server name'}</span>
        <ChevronRight size={18} className='pt-[3px] text-gray-1' />
      </DrawerTrigger>
      <DrawerContent className='border-t border-foreground bg-black p-3 text-white'>
        <DrawerHeader className='p-0'>
          <Image
            src={server.logo}
            width={50}
            height={50}
            alt='server'
            className='size-14 rounded-full object-cover'
          />
          <p className='text-left'>{server.name}</p>
          <div className='flex-center gap-3'>
            <div className='flex-center gap-1'>
              <div className='size-2 rounded-full bg-green-500'></div>
              <p className='text-xs lowercase'>0 Online</p>
            </div>
            <div className='flex-center gap-1'>
              <div className='size-2 rounded-full bg-gray-2'></div>
              <p className='text-xs lowercase'>0 members</p>
            </div>
          </div>
          <div className='flex-center gap-3 pt-3'>
            <div className='flex-center size-12 justify-center rounded-full bg-foreground/50'>
              <Image
                src={'/server/icons/boost-1.svg'}
                width={30}
                height={30}
                alt='boost'
              />
            </div>
            <div className='flex-center size-12 justify-center rounded-full bg-foreground/50'>
              <UserPlus2
                size={25}
                className='mx-auto fill-gray-2 stroke-gray-2'
              />
            </div>
            <div className='flex-center size-12 justify-center rounded-full bg-foreground/50'>
              <Bell size={20} className='fill-gray-2' />
            </div>
            <Drawer modal={false} fixed={false}>
              <DrawerTrigger asChild>
                <div className='flex-center size-12 justify-center rounded-full bg-foreground/50'>
                  <Cog />
                </div>
              </DrawerTrigger>
              <DrawerContent className='top-0 h-full bg-black'>
                <ServerSettingsMobile server={server} />
              </DrawerContent>
            </Drawer>
          </div>
        </DrawerHeader>
        <div className='mt-3 flex flex-col gap-2 divide-y divide-background rounded-lg bg-foreground/35 p-2'>
          <Drawer>
            <DrawerTrigger className='text-left'>Create Channel</DrawerTrigger>
            <DrawerContent className='top-0 h-screen bg-black p-2'>
              <CreateChannelForm
                serverAuthor={server.owner_id}
                serverId={server.id}
                type='text'
              />
            </DrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger className='pt-1 text-left'>
              Edit Server Profile
            </DrawerTrigger>
            <DrawerContent className='top-0 h-screen bg-black p-2'>
              Server profile
            </DrawerContent>
          </Drawer>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
