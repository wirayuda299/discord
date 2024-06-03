import dynamic from 'next/dynamic';

import { getPinnedMessages } from '@/helper/message';
import { getAllThreads } from '@/helper/threads';

const ChannelsMessages = dynamic(() => import('./messages'));
const ChannelsHeader = dynamic(() => import('./header-desktop'));

type Props = {
  channelName: string;
  channelId: string;
  serverId: string;
};

export default async function ChannelsDetail({
  channelName,
  channelId,
  serverId,
}: Props) {
  const [allThreads, pinnedMessages] = await Promise.all([
    getAllThreads(channelId, serverId),
    getPinnedMessages(channelId, serverId),
  ]);

  return (
    <div className='hidden h-screen w-full grow overflow-y-auto md:block'>
      <ChannelsHeader
        channelId={channelId}
        serverId={serverId}
        threads={allThreads}
        channelName={channelName}
        pinnedMessages={pinnedMessages || []}
      />
      <ChannelsMessages />
    </div>
  );
}
