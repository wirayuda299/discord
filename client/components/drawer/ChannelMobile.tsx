"use client";

import { Search, UserPlus2 } from "lucide-react";

import ServerMobile from "./ServerMobile";
import ChannelList from "../channels/list";
import { Servers } from "@/types/server";
import { Channel } from "@/types/channels";
import AddUser from "../modals/add-user";

export default function ChannelDrawerMobile({
  channels,
  server,
}: {
  server: Servers;
  channels: Channel[];
}) {
  return (
		<aside className='h-screen min-w-[260px] flex-col gap-3 overflow-y-auto border-r-2 border-foreground bg-[#0c0d0e] px-3 pb-12 pt-3 md:hidden md:bg-[#2b2d31]'>
			<header className='flex items-center gap-1 border-b-2 border-b-foreground pb-3'>
				<h2 className='text-base font-semibold text-white'>{server?.name}</h2>
				<ServerMobile server={server} />
			</header>
			<div className='flex w-full items-center gap-2'>
				<form className=' w-[calc(100%-30px)]'>
					<div className='mt-2 flex justify-between gap-2 rounded-md bg-background p-1'>
						<button>
							<Search stroke='#fff' size={18} />
						</button>
						<input
							type='search'
							placeholder='Search...'
							className='w-full bg-transparent'
						/>
					</div>
				</form>
				<AddUser styles='pt-2'>
          <UserPlus2
						className='text-lg text-gray-2'
					/>
				</AddUser>
			</div>
			<>
				{channels && server && (
					<ChannelList channels={channels} server={server} />
				)}
			</>
		</aside>
	);
}
