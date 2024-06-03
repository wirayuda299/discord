import PulseLoader from '@/components/shared/pulse-loader';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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
    <Suspense key={params.channel_id} fallback={<PulseLoader />}>
      <ChannelsDetail
        serverId={params.id}
        channelName={searchParams.channel_name}
        channelId={params.channel_id}
      />
    </Suspense>
  );
}
