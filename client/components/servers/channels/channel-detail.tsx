'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, Suspense } from 'react';

import { PinnedMessageType } from '@/helper/message';
import { AllThread } from '@/helper/threads';
import { useServerStates, useSocketStore } from '@/providers';
import { Message } from '@/types/messages';
import PulseLoader from "@/components/shared/pulse-loader"
import useWindowResize from '@/hooks/useWindowResize';
const ChannelsMessages = dynamic(() => import('./messages'), { ssr: false });
const ChannelDetailMobile = dynamic(() => import('./mobile'), { ssr: false });
const ChannelsHeader = dynamic(() => import('./header-desktop'), { ssr: false })


type Props = {
  channelName: string;
  channelId: string;
  serverId: string;
  threads: AllThread[];
  pinnedMessages: PinnedMessageType[];
};

export default function ChannelsDetail(props: Props) {
  const thread = useServerStates((state) => state.selectedThread);
  const socket = useSocketStore((state) => state.socket);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { windowWidth } = useWindowResize()

  useEffect(() => {
    if (props.serverId && props.channelId) {
      socket?.emit('get-channel-message', {
        serverId: props.serverId,
        channelId: props.channelId,
      });
    }
    return () => {
      socket?.off('get-channel-messages');
    };
  }, [socket, props.serverId, props.channelId]);

  useEffect(() => {
    setLoading(true);
    socket?.on('set-message', (messages) => setMessages(messages));
    setLoading(false);
  }, [socket]);

  return (
    <>
      {windowWidth >= 768 ? (
        <div className='no-scrollbar hidden max-h-screen min-h-screen w-full overflow-y-auto md:block'>
          <ChannelsHeader {...props} />
          <ChannelsMessages
            loading={loading}
            messages={messages}
            socket={socket}
            thread={thread}
          />
        </div>
      ) : (
        <Suspense fallback={<PulseLoader />} key={props.channelId}>
          <ChannelDetailMobile
            serverId={props.serverId}
            loading={loading}
            messages={messages}
            socket={socket}
            thread={thread}
          />
        </Suspense>
      )}
    </>
  );
}
