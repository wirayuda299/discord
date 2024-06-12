import dynamic from 'next/dynamic';
import { getPinnedMessages } from '@/helper/message';
import { getAllThreads } from '@/helper/threads';

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
export default async function ChannelId({ searchParams, params }: Props) {
  const [allThreads, pinnedMessages] = await Promise.all([
    getAllThreads(params.channel_id, params.id),
    getPinnedMessages(params.channel_id, params.id),
  ]);
  return (
    <ChannelsDetail
      threads={allThreads}
      pinnedMessages={pinnedMessages}
      serverId={params.id}
      channelName={searchParams.channel_name}
      channelId={params.channel_id}
    />
  );
}
