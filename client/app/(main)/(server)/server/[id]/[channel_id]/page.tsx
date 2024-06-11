import dynamic from 'next/dynamic';

const ChannelsDetail = dynamic(
  () => import('@/components/servers/channels/channel-detail'),
);

type Props = {
  params: {
    id: string;
    channel_id: string;
  };
  searchParams: { channel_type: string; channel_name: string };
};
export default function ChannelId({ searchParams, params }: Props) {
  return (
    <ChannelsDetail
      serverId={params.id}
      channelName={searchParams.channel_name}
      channelId={params.channel_id}
    />
  );
}
