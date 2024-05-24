import { currentUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { isMemberOrAdmin } from '@/helper/server';

const VideoCall = dynamic(
	() => import('@/components/servers/channels/video-call')
);
const SelectedChannel = dynamic(
	() => import('@/components/servers/channels/selected-channel')
);

type Props = {
	params: {
		id: string;
		channel_id: string;
	};
	searchParams: { channel_type: string };
};

export default async function ChannelId({ searchParams, params }: Props) {
	const user = await currentUser();

	if (!user || user === null) return null;

	const isMemberOrAuthor = await isMemberOrAdmin(user.id, params.id);

	if (!isMemberOrAuthor.isAuthor && !isMemberOrAuthor.isMember) {
		redirect('/direct-messages');
	}

	if (searchParams.channel_type === 'text') {
		return (
			<SelectedChannel
				channelId={params.channel_id}
				userId={user?.id}
				serverId={params.id}
			/>
		);
	}
	if (searchParams.channel_type === 'audio') {
		return <VideoCall room={params.channel_id} serverId={params.id} />;
	}
}
