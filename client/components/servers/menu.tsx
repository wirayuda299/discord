import Image from 'next/image';
import { ChevronDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ServerSettingsDesktop from '../servers/settings/desktop';
import { Servers } from '@/types/server';
import ServerInvitationModal from './invite-modal';

export default function ServersMenu({ server }: { server: Servers }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        name='menu'
        aria-label='menu'
        title='menu'
        className='flex-center z-10 w-full justify-between border-b border-b-background !bg-transparent p-3 text-white backdrop-blur-sm'
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
        <ServerSettingsDesktop server={server} />

        <DropdownMenuItem className='flex items-center justify-between !text-gray-2 hover:!bg-primary hover:!text-white'>
          <p>Create channel</p>
          <Plus size={20} />
        </DropdownMenuItem>

        <DropdownMenuItem className='flex items-center justify-between !text-gray-2 hover:!bg-primary hover:!text-white'>
          <p>Create role</p>
          <Image
            src={'/server/icons/guards.svg'}
            width={20}
            height={20}
            alt='guards'
          />
        </DropdownMenuItem>

        <DropdownMenuItem className='flex items-center justify-between !text-gray-2 hover:!bg-primary hover:!text-white'>
          <p>Edit server profile</p>
          <Image
            src={'/server/icons/pencil.svg'}
            width={20}
            height={20}
            alt='invite user'
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator className='border-b border-b-background' />

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
