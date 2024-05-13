import { Ellipsis, Pencil, Plus, UserRoundPlus } from 'lucide-react';

import { useServerContext } from '@/providers/server';

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import CreateChannelModals from '@/components/servers/channels/create-channel-modal';
import UserSettingsModals from '@/components/user/user-settings';
import ServerSetting from '@/components/servers/server-setting';
import AddUser from '@/components/user/add-user';

export default function ServerMenu({
	serverName,
	serverId,
}: {
	serverName: string;
	serverId: string;
}) {
	const { setServerStates, serversState } = useServerContext();
	if (!serverName) return null;

	const handleClick = (setting: string) => {
		setServerStates((prev) => ({
			...prev,
			selectedSetting: setting,
			selectedOption: 'server',
		}));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className='sticky top-0 z-10  hidden min-h-12 w-full items-center justify-between gap-2 truncate border-b-2 border-foreground bg-black px-2 text-base font-semibold text-gray-2 md:!flex md:bg-[#2b2d31]'>
					<p className='truncate text-wrap'>{serverName ?? ''}</p>
					<Ellipsis className='cursor-pointer text-gray-2' size={18} />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className=' flex w-full min-w-[240px] flex-col gap-3 rounded border-none bg-black p-2 text-white shadow-none'>
				<DropdownMenuItem className='flex cursor-pointer items-center justify-between border-b border-b-foreground !bg-black text-xs font-semibold capitalize text-gray-2 hover:!bg-primary hover:!text-white'>
					<span>server boost</span>
					<svg
						aria-hidden='true'
						role='img'
						width='18'
						height='18'
						viewBox='0 0 8 12'
					>
						<path
							d='M4 0L0 4V8L4 12L8 8V4L4 0ZM7 7.59L4 10.59L1 7.59V4.41L4 1.41L7 4.41V7.59Z'
							fill='currentColor'
						></path>
						<path
							d='M2 4.83V7.17L4 9.17L6 7.17V4.83L4 2.83L2 4.83Z'
							fill='currentColor'
						></path>
					</svg>
				</DropdownMenuItem>
				<AddUser>
					<DropdownMenuItem className='group flex cursor-pointer items-center justify-between !bg-black text-xs font-semibold capitalize !text-[#878ee0] hover:!bg-primary hover:!text-white'>
						<span>invite people</span>
						<UserRoundPlus
							size={20}
							className='text-[#878ee0] group-hover:text-white'
						/>
					</DropdownMenuItem>
				</AddUser>
        {serversState.selectedServer && (
          <ServerSetting
            logo={serversState.selectedServer?.logo || ''}
            logoAssetId={serversState.selectedServer?.logo_asset_id || ''}
            name={serversState.selectedServer?.name || ''}
            serverId={serverId}
          />
        )}
				<CreateChannelModals serverId={serverId} type='text'>
					<div className='group flex cursor-pointer items-center justify-between rounded !bg-black px-2 py-1.5 text-xs font-semibold capitalize text-gray-2 hover:!bg-primary hover:!text-white'>
						<span>create channel </span>
						<div className='flex size-[18px] items-center justify-center rounded-full bg-[#b5bac1] group-hover:bg-white'>
							<Plus size={15} className='text-gray-1 ' />
						</div>
					</div>
				</CreateChannelModals>
				<UserSettingsModals>
					<div
						onClick={() => handleClick('profiles')}
						className='group !flex cursor-pointer items-center justify-between rounded !bg-black px-2 py-1.5 text-xs font-semibold capitalize text-gray-2 hover:!bg-primary hover:!text-white'
					>
						<span>edit server profile </span>
						<Pencil size={18} className='text-gray-2 group-hover:text-white' />
					</div>
				</UserSettingsModals>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
