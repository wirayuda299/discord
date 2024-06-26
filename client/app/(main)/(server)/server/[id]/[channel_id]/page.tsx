import dynamic from 'next/dynamic';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { getPinnedMessages } from '@/helper/message';
import { getAllThreads } from '@/helper/threads';
import { isMemberOrAdmin } from '@/helper/server';
import PulseLoader from '@/components/shared/pulse-loader';

const ChannelsDetail = dynamic(
  () => import('@/components/servers/channels/channel-detail'), {
  ssr: false,
  loading() {
    return <PulseLoader />
  },

}
);

type Props = {
  params: {
    id: string;
    channel_id: string;
  };
  searchParams: { channel_type: string; channel_name: string };
};
export default async function ChannelId({ searchParams, params }: Props) {
  const { userId } = auth()
  if (!userId) {
    redirect('/sign-in')
  }
  const { isAuthor, isMember } = await isMemberOrAdmin(userId, params.id)
  if (!isAuthor && !isMember) {
    redirect('/direct-messages')
  }

  const [allThreads, pinnedMessages] = await Promise.all([
    getAllThreads(params.channel_id, params.id),
    getPinnedMessages(params.channel_id, params.id),
  ]);

  return (
    <ChannelsDetail
      threads={allThreads}
      pinnedMessages={pinnedMessages}
      serverId={params.id}
      channel_type={searchParams.channel_type}
      channelName={searchParams.channel_name}
      channelId={params.channel_id}
    />
  );
}
