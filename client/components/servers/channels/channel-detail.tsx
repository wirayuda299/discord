'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { PinnedMessageType } from '@/helper/message';
import { AllThread } from '@/helper/threads';
import ChannelDetailMobile from './mobile';
import { useServerStates, useSocketStore } from '@/providers';
import { Message } from '@/types/messages';

const ChannelsMessages = dynamic(() => import('./messages'));
const ChannelsHeader = dynamic(() => import('./header-desktop'));

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
      <div className='no-scrollbar hidden max-h-screen min-h-screen w-full overflow-y-auto md:block'>
        <ChannelsHeader {...props} />
        <ChannelsMessages
          loading={loading}
          messages={messages}
          socket={socket}
          thread={thread}
        />
      </div>
      <ChannelDetailMobile
        serverId={props.serverId}
        loading={loading}
        messages={messages}
        socket={socket}
        thread={thread}
      />
    </>
  );
}
