'use client';

import Image from 'next/image';
import { Bell, ChevronRight, Cog, UserPlus2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Servers } from '@/types/server';
import ServerSettingsMobile from '../settings/mobile';
import CreateChannelForm from '../channels/create-channel/form';
import { usePermissionsContext } from '@/providers/permissions';
import { Categories } from '@/types/channels';
import ServerInvitationModal from '../invite-modal';
import UserProfile from '@/components/user/profiles'



export default function ServerMenuMobile({
  server,
  categories,
}: {
  server: Servers;
  categories: Categories[];
}) {
  const { userId } = useAuth();

  const { permission, loading, errors } = usePermissionsContext();

  if (loading) return null;

  if (errors) return <p>{errors.message}</p>;

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
          <div className='flex-center justify-between gap-3 pt-3'>
            <div className='flex-center size-12 justify-center rounded-full bg-foreground/50'>
              <Image
                src={'/server/icons/boost-1.svg'}
                width={30}
                height={30}
                alt='boost'
              />
            </div>
            <ServerInvitationModal
              serverId={server.id}
              inviteCode={server.invite_code}
              serverName={server.name}
            >
              <div className='flex-center size-12 justify-center rounded-full bg-foreground/50'>
                <UserPlus2
                  size={25}
                  className='mx-auto fill-gray-2 stroke-gray-2'
                />
              </div>
            </ServerInvitationModal>

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
                <ServerSettingsMobile
                  permission={permission}
                  userId={userId!!}
                  server={server}
                />
              </DrawerContent>
            </Drawer>
          </div>
        </DrawerHeader>
        <div className='mt-3 flex flex-col gap-2 divide-y divide-background rounded-lg bg-foreground/35 p-2'>
          {(server.owner_id === userId ||
            (permission && permission.manage_channel)) && (
            <Drawer>
              <DrawerTrigger className='text-left text-sm'>
                Create Channel
              </DrawerTrigger>
              <DrawerContent className='top-0 h-screen bg-black p-2'>
                <CreateChannelForm
                  serverAuthor={server.owner_id}
                  serverId={server.id}
                  type='text'
                />
              </DrawerContent>
            </Drawer>
          )}
          <Drawer>
            <DrawerTrigger className='pt-1 text-left text-sm'>
              Browse Channel
            </DrawerTrigger>
            <DrawerContent className='top-0 flex h-screen flex-col bg-black p-2'>
              {categories?.map((category) => (
                <div key={category.category_id} className='flex flex-col'>
                  <p>{category.category_name}</p>

                  {category?.channels.map((channel) => (
                    <div
                      key={channel.channel_id}
                      className='flex-center cursor-pointer gap-2 rounded p-2 pl-5 text-base hover:bg-foreground hover:text-white hover:brightness-105'
                    >
                      <div className='flex items-center gap-3'>
                        <Image
                          src={`/server/icons/${
                            channel.channel_type === 'text'
                              ? 'hashtag.svg'
                              : 'audio.svg'
                          }`}
                          width={18}
                          height={18}
                          alt='audio'
                        />
                        {channel.channel_name}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </DrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger className='pt-1 text-left text-sm'>
              Edit Server Profile
            </DrawerTrigger>
            <DrawerContent className='top-0 md:hidden min-h-min bg-black p-0'>
              <UserProfile/>
            </DrawerContent>
          </Drawer>

          {userId && userId !== server.owner_id && (
            <button className='flex-center group gap-3 pt-2 !text-red-600'>
              <p>Leave server</p>
            </button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
