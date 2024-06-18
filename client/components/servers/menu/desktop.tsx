'use client';

import Image from 'next/image';
import { ChevronDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Servers } from '@/types/server';
import ServerInvitationModal from '../invite-modal';
import CreateChannelDialog from '../channels/create-channel/dialog';
import { usePermissionsContext } from '@/providers/permissions';
import ServerSettingsDesktop from '../settings/desktop';
import UserSettingsDesktop from '../settings/user-settings/desktop';
import useWindowResize from '@/hooks/useWindowResize';

export default function ServersMenuDesktop({ server }: { server: Servers }) {
  const { permission, errors, loading, userId } = usePermissionsContext();

  const { windowWidth } = useWindowResize();
  if (windowWidth < 768) return null;

  if (loading)
    return (
      <div className='h-12 w-full animate-pulse rounded-md bg-foreground brightness-110'></div>
    );

  if (errors) return <p>{errors.message}</p>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        name='menu'
        aria-label='menu'
        title='menu'
        className='z-10 hidden w-full items-center justify-between border-b border-b-background !bg-transparent p-3 text-white backdrop-blur-sm md:flex'
      >
        <span className='truncate'>{server.name || 'Server name'}</span>
        <ChevronDown size={18} className='text-gray-1' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-full min-w-[250px] space-y-1 !border-none bg-[#111214]'>
        <DropdownMenuItem className='flex items-center justify-between !text-gray-2 hover:!bg-primary hover:!text-white'>
          <p>Server boost</p>
          <Image
            src={'/server/icons/boost.svg'}
            width={20}
            height={20}
            alt='boost'
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator className='border-b border-b-background' />
        <ServerInvitationModal
          serverId={server.id}
          inviteCode={server.invite_code}
          serverName={server.name}
        >
          <DropdownMenuItem className='flex items-center justify-between !text-primary/80 hover:!bg-primary hover:!text-white'>
            <p>Invite user</p>
            <Image
              src={'/server/icons/user-plus.svg'}
              width={20}
              height={20}
              alt='invite user'
            />
          </DropdownMenuItem>
        </ServerInvitationModal>
        {userId && server.owner_id === userId && (
          <ServerSettingsDesktop server={server} />
        )}

        {(userId && server.owner_id === userId) ||
          (permission && permission.manage_channel) ? (
          <CreateChannelDialog
            serverAuthor={server.owner_id}
            serverId={server.id}
            type={'text'}
          >
            <div className='group flex cursor-pointer items-center justify-between rounded px-2 py-2 text-sm !text-gray-2 hover:!bg-primary hover:!text-white'>
              Create channel
              <div className='flex size-[18px] items-center justify-center rounded-full bg-[#b5bac1] group-hover:bg-white'>
                <Plus size={20} className='text-gray-1' />
              </div>
            </div>
          </CreateChannelDialog>
        ) : null}

        {(userId && server.owner_id === userId) ||
          (permission && permission.manage_role) ? (
          <DropdownMenuItem className='flex cursor-pointer items-center justify-between !text-gray-2 hover:!bg-primary hover:!text-white'>
            <p>Create role</p>
            <Image
              src={'/server/icons/guards.svg'}
              width={20}
              height={20}
              alt='guards'
            />
          </DropdownMenuItem>
        ) : null}

        <UserSettingsDesktop />
        <DropdownMenuSeparator className='border-b border-b-background' />

        {userId && userId !== server.owner_id && (
          <DropdownMenuItem className='group flex items-center justify-between !text-red-600 hover:!bg-red-600 hover:!text-white'>
            <p>Leave server</p>
            <Image
              className='group-hover:brightness-0 group-hover:invert'
              src={'/server/icons/leave.svg'}
              width={20}
              height={20}
              alt='leave server'
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
