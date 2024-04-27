import SelectedChannel from "@/components/channels/selected-channel";
import VideoCall from '@/components/channels/video-call';

type Props = {
	params: {
		id: string;
		channel_id: string;
	};
	searchParams: { channel_type: string };
};

export default function ChannelId({ searchParams, params }: Props) {
	if (searchParams.channel_type === 'text') {
		return <SelectedChannel />;
	}
	if (searchParams.channel_type === 'audio') {
		return <VideoCall room={params.channel_id} />;
	}
}
