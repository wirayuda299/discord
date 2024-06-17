import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { Socket } from 'socket.io-client';

import ChannelsMessages from './messages';
import { useServerStates } from '@/providers';
import ChannelInfoMobile from './channel-info-mobile';
import { Message, Thread } from '@/types/messages';

export default function ChannelDetailMobile({
  serverId,
  loading,
  socket,
  messages,
  thread,
}: {
  serverId: string;
  loading: boolean;
  socket: Socket | null;
  messages: Message[];
  thread: Thread | null;
}) {
  const { selectedChannel, setSelectedChannel } = useServerStates((state) => ({
    selectedChannel: state.selectedChannel,
    setSelectedChannel: state.setSelectedChannel,
  }));

  if (!selectedChannel) return null;

  return (
    <div className='fixed left-0 top-0 h-screen w-full bg-black'>
      <header className='flex-center h-12 justify-between border-b border-foreground px-3'>
        <div className='flex-center gap-1'>
          <Image
            src={`/server/icons/${selectedChannel.channel_type === 'text'
                ? 'hashtag.svg'
                : 'audio.svg'
              }`}
            className='aspect-auto object-contain'
            width={18}
            height={18}
            alt='channel icon'
          />
          <p className='text-xl font-semibold text-white'>
            {selectedChannel.channel_name}
          </p>
          <ChannelInfoMobile
            messages={messages}
            channelName={selectedChannel.channel_name}
            serverId={serverId}
          />
        </div>
        <Link
          href={`/server/${serverId}`}
          onClick={() => {
            setSelectedChannel(null);
          }}
          title='close'
          aria-label='close'
        >
          <X />
        </Link>
      </header>
      <ChannelsMessages
        loading={loading}
        messages={messages}
        socket={socket}
        thread={thread}
      />
    </div>
  );
}
