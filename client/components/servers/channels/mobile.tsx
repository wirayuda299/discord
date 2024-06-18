import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { Socket } from 'socket.io-client';

import ChannelsMessages from './messages';
import { useServerStates } from '@/providers';
import ChannelInfoMobile from './channel-info-mobile';
import { Message, Thread } from '@/types/messages';
import { cn } from '@/lib/utils';

export default function ChannelDetailMobile({
  serverId,
  socket,
  messages,
  thread,
  channelId
}: {
  serverId: string;
  socket: Socket | null;
  messages: Message[];
  thread: Thread | null;
  channelId: string
}) {
  const { selectedChannel, setSelectedChannel, selectedThread, setSelectedThread } = useServerStates((state) => ({
    selectedChannel: state.selectedChannel,
    setSelectedChannel: state.setSelectedChannel,
    selectedThread: state.selectedThread,
    setSelectedThread: state.setSelectedThread
  }));
  if (!selectedChannel || !channelId) return null;

  return (
    <div className='fixed left-0 top-0 min-h-dvh h-full  w-full overflow-y-auto bg-black no-scrollbar'>
      <header className='flex-center h-12 sticky bg-black z-20 top-0 justify-between border-b border-foreground px-3'>
        <div className='flex items-center gap-1'>
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
          <p onClick={() => setSelectedThread(null)} className='text-lg cursor-pointer font-semibold text-white'>
            {selectedChannel.channel_name}
          </p>
          <ChannelInfoMobile
            messages={messages}
            channelName={selectedChannel.channel_name}
            serverId={serverId}
          />
          <p className={cn('text-sm truncate', selectedThread && 'text-base font-semibold')}>{selectedThread ? selectedThread.thread_name : selectedChannel.topic}</p>
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
        messages={messages}
        socket={socket}
        thread={thread}
      />
    </div>
  );
}
