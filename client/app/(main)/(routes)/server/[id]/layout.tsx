import { ReactNode } from 'react';

import { getServerById, getServerMembers } from '@/actions/server';
import ServerChannel from '../_components/server-channel';
import SelectedChannelMobile from '@/app/(main)/me/_components/Selected-channel-mobile';
import MemberList from '@/components/shared/memberList';

export default async function ServerLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: {
		id: string;
		channel_id: string;
	};
}) {
	const { channels, server } = await getServerById(params.id);
	const members = await getServerMembers(server.id);
	return (
		<div className='ease flex size-full  justify-start '>
			<ServerChannel
				channels={channels}
				server={server}
				styles='hidden md:block'
				key={'desktop'}
			/>
			<ServerChannel
				key={'mobile'}
				channels={channels}
				server={server}
				styles='fixed md:hidden left-16 z-50 min-w-[100px]'
			/>
			{children}
			<MemberList members={members} />
			<SelectedChannelMobile />
		</div>
	);
}
