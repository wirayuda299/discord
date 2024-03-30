import { Search } from 'lucide-react';
import Image from 'next/image';

import {
	ChannelMessages,
	ServerSheet,
	VideoRoom,
} from '../../../_components/index';
import ChatForm from '@/components/shared/chat-form';
import { getChannelById } from '@/actions/channel';
import { Channel } from '@/types/channels';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getPinnedMessages } from '@/actions/messages';
import { Input } from '@/components/ui/input';
import MemberButton from '@/components/shared/members';

export default async function ChannelId({
	params,
	searchParams,
}: {
	params: {
		channel_id: string;
	};
	searchParams: {
		type: string;
	};
}) {
	const { channel } = await getChannelById(params.channel_id);
	const pinnedMessages = await getPinnedMessages(channel.id);

	return (
		<main className=' flex h-[calc(100vh-12px)] w-full flex-col justify-between'>
			<header className='border-b-primary-foreground flex w-full justify-between border-b p-5'>
				<h2 className='text-xl font-semibold text-[#949ba4]'>
					#{channel.name}
				</h2>
				<div className='hidden items-center gap-3 md:flex'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button>
								<Image
									className='text-gray-1'
									src={'/icons/pin.svg'}
									width={25}
									height={25}
									alt='pin icon'
								/>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='bg-main-foreground min-h-[300px] min-w-72 space-y-3 rounded-md border-none pb-3'>
							<div className='bg-dark-1 rounded-md py-3 pl-5'>
								<h2 className='text-lg font-semibold'>Pinned Messages</h2>
							</div>
							{pinnedMessages && pinnedMessages?.length >= 1 ? (
								pinnedMessages?.map((msg) => (
									<DropdownMenuItem
										key={msg.created_at}
										className='!bg-transparent'
									>
										<div className='relative flex gap-3'>
											<Image
												src={msg.image}
												width={40}
												height={40}
												alt='user'
												className='aspect-auto size-10 min-w-10 rounded-full object-cover'
											/>
											<div className='group flex items-center gap-2'>
												<div>
													<h3
														className={
															'flex items-center gap-2 text-xs font-semibold'
														}
													>
														{msg.username}{' '}
														<span className='text-xs text-[#55575f]'>
															{new Date(msg.created_at).toLocaleTimeString()}
														</span>
													</h3>
													<p className='text-xs font-medium text-[#dbdee1]'>
														{msg.content}
													</p>
													{msg.image_url && (
														<Image
															className='aspect-auto size-32 rounded-md object-contain pt-3'
															alt='image'
															loading='lazy'
															src={msg?.image_url}
															width={100}
															height={100}
														/>
													)}
												</div>
											</div>
										</div>
									</DropdownMenuItem>
								))
							) : (
								<div className='flex flex-col items-center justify-center p-5'>
									<Image
										src={'/icons/boom.svg'}
										width={100}
										height={100}
										alt='image'
									/>
									<p className=' text-balance break-words pt-2 text-center text-base'>
										This channel doesn&apos;t have any <br /> pinned
										message...yet.
									</p>
								</div>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					<MemberButton />
					<form action='' className='flex rounded-md bg-black/15 p-1.5'>
						<Input
							placeholder='Search...'
							className='h-5 border-none bg-transparent  focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0'
						/>
						<button>
							<Search size={18} className='text-gray-600' />
						</button>
					</form>
				</div>
				<div className='sm:hidden'>
					<ServerSheet
						channels={{
							text: [channel] as unknown as Channel[],
							audio: [channel] as unknown as Channel[],
						}}
						server={undefined}
					/>
				</div>
			</header>
			{searchParams.type === 'text' && (
				<>
					<ChannelMessages channel_id={params.channel_id} />
					<ChatForm channelName={channel.name} channelId={channel.id} />
				</>
			)}

			{searchParams.type === 'audio' && <VideoRoom chatId={channel?.id} />}
		</main>
	);
}
