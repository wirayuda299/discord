import { Ellipsis, Pencil, Plus, UserRoundPlus } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import CreateChannelModals from './modals/create-channel';
import { KeyedMutator } from 'swr';
import UserSettingsModals from './modals/user-settings';

export default function ServerMenu<T>({
	serverName,
	serverId,
	mutate,
}: {
	serverName: string;
	serverId: string;
	mutate: KeyedMutator<T>;
}) {
	if (!serverName) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='hidden focus-visible:outline-none md:block'>
				<div className='border-foreground text-gray-2 flex w-full items-center justify-between gap-2 truncate border-b-2 pb-2 text-base font-semibold'>
					<p className='truncate text-wrap'>{serverName}</p>
					<Ellipsis color='#fff' size={18} />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='flex w-full min-w-[240px] flex-col gap-3 rounded border-none bg-black p-2 text-white shadow-none'>
				<DropdownMenuItem className='hover:!bg-primary border-b-foreground text-gray-2 flex items-center justify-between border-b !bg-black text-xs font-semibold capitalize hover:!text-white'>
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
				<DropdownMenuItem className='hover:!bg-primary group flex items-center justify-between !bg-black text-xs font-semibold capitalize !text-[#878ee0] hover:!text-white'>
					<span>invite people</span>
					<UserRoundPlus
						size={20}
						className='text-[#878ee0] group-hover:text-white'
					/>
				</DropdownMenuItem>
				<CreateChannelModals mutate={mutate} serverId={serverId} type='text'>
					<div className='hover:!bg-primary text-gray-2 group flex items-center justify-between rounded !bg-black px-2 py-1.5 text-xs font-semibold capitalize hover:!text-white'>
						<span>create channel </span>
						<div className='flex size-[18px] items-center justify-center rounded-full bg-[#b5bac1] group-hover:bg-white'>
							<Plus size={15} className='text-gray-1 ' />
						</div>
					</div>
				</CreateChannelModals>
				<UserSettingsModals>
					<div className='hover:!bg-primary text-gray-2 group flex items-center justify-between rounded !bg-black px-2 py-1.5 text-xs font-semibold capitalize hover:!text-white'>
						<span>edit server </span>
						<Pencil size={18} className='text-gray-2 group-hover:text-white' />
					</div>
				</UserSettingsModals>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
