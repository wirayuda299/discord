import { useCallback, useState } from "react";
import { Cog, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../../ui/dialog";

import { getServerSettings } from "@/constants/settings";
import { cn } from "@/lib/utils/mergeStyle";
import ServerOverview from "./overview";
import Roles from "./roles/roles";

export default function ServerSetting({
	logo,
	name,
	logoAssetId,
	serverId,
	showProgressBar,
	showBanner,
	banner,
	bannerAssetId,
  serverAuthor,
  
}: {
	logo: string;
	logoAssetId: string;
	name: string;
	serverId: string;
	serverAuthor: string;
	showProgressBar: boolean;
	showBanner: boolean;
	banner: string | null;
	bannerAssetId: string | null;
}) {
	const [selectedSetting, setSelectedSetting] = useState<string>('overview');

	const serverSettings = useCallback(() => getServerSettings(name), [name]);

	return (
		<Dialog modal>
			<DialogTrigger asChild>
				<div className='group flex cursor-pointer items-center justify-between rounded !bg-black px-2 py-1.5 text-xs font-semibold capitalize text-gray-2 hover:!bg-primary hover:!text-white'>
					<span>Server settings </span>
					<Cog
						size={20}
						className=' stroke-gray-2 text-gray-1 group-hover:stroke-white'
					/>
				</div>
			</DialogTrigger>
			<DialogContent className='hidden h-screen min-w-full border-none  bg-background p-0 text-white md:block'>
				<div className='flex size-full justify-center gap-2 lg:gap-5'>
					<div className=' bg-[#2b2d31]  py-10 md:min-w-[250px] xl:min-w-[410px]'>
						<aside className='sticky top-0 flex h-screen  flex-col overflow-y-auto px-5 pb-16 pt-5 lg:items-end'>
							<ul className='flex w-max flex-col gap-3'>
								{serverSettings().map((setting) => (
									<li key={setting.label}>
										<h2 className='mb-3 w-max border-b border-b-background text-sm font-semibold uppercase text-[#b5b8bc] hover:text-[#ced0d3]'>
											{setting.label}
										</h2>
										<ul className='flex flex-col gap-2'>
											{setting.items.map((item) => (
												<li
													onClick={() => setSelectedSetting(item)}
													className={cn(
														'hover:bg-background cursor-pointer text-nowrap rounded text-sm font-normal capitalize text-[#b5b8bc] py-1 transition ease hover:text-[#ced0d3]',
														selectedSetting === item &&
															'bg-background text-white hover:bg-background/55'
													)}
													key={item}
												>
													{item}
												</li>
											))}
										</ul>
									</li>
								))}
							</ul>
						</aside>
					</div>
					<div className='no-scrollbar h-screen w-full overflow-y-auto py-10'>
						{selectedSetting === 'overview' && (
							<ServerOverview
								banner={banner}
								bannerAssetId={bannerAssetId}
								logo={logo}
								logoAssetId={logoAssetId}
								name={name}
								serverId={serverId}
								showBanner={showBanner}
								showProgressBar={showProgressBar}
							/>
						)}

						{selectedSetting === 'roles' && (
							<Roles serverId={serverId} serverAuthor={serverAuthor} />
						)}
					</div>
					<div className=' min-w-24 pt-10'>
						<DialogClose className='flex size-10 flex-col items-center justify-center rounded-full border border-gray-2'>
							<X className='text-gray-2' />
						</DialogClose>
						<p className='pl-1 font-light text-gray-2'>ESC</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
