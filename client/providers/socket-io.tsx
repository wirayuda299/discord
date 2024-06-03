'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@clerk/nextjs';
import { Socket, io } from 'socket.io-client';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { SocketStates } from '@/types/socket-states';
import { Message } from '@/types/messages';
import { useServerContext } from './servers';

type SocketContextInitialValue = {
  states: SocketStates;
  handleUpdate: (value: Partial<SocketStates>) => void;
};

const initialValues: SocketContextInitialValue = {
  states: {
    active_users: [],
    channel_messages: [],
    personal_messages: [],
    thread_messages: [],
    socket: null,
    isConnected: false,
  },
  handleUpdate: () => {},
};

export const reloadChannelMessages = (
  socket: Socket | null,
  serverId: string,
  channelId: string,
) => {
  socket?.emit('get-channel-message', {
    serverId,
    channelId,
  });
};

export const reloadPersonalMessages = (
  socket: Socket | null,
  conversationId: string,
  userId: string,
) => {
  socket?.emit('personal-message', {
    conversationId,
    userId,
  });
};

export const reloadThreadMessage = (
  socket: Socket | null,
  threadId: string,
  serverId: string,
) => {
  socket?.emit('thread-messages', {
    threadId,
    serverId,
  });
};

export const SocketContext =
  createContext<SocketContextInitialValue>(initialValues);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const params = useParams();
  const recipientId = searchParams.get('userId') as string;
  const thread = useServerContext('selectedThread');

  const [messageStates, setMessageStates] = useState<SocketStates>(
    initialValues.states,
  );

  const reloadChannelMessage = useCallback(() => {
    reloadChannelMessages(
      messageStates.socket,
      params.id as string,
      params.channel_id as string,
    );
  }, [messageStates.socket, params?.channel_id, params?.id]);

  const reloadPersonalMessage = useCallback(() => {
    reloadPersonalMessages(
      messageStates.socket,
      searchParams.get('conversationId') as string,
      recipientId,
    );
  }, [messageStates.socket, searchParams, recipientId]);

  const reloadThread = useCallback(() => {
    if (!thread) return;

    reloadThreadMessage(
      messageStates.socket,
      thread?.thread_id,
      params.id as string,
    );
  }, [messageStates.socket, params.id, thread]);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3001';

    const clientSocket = io(serverUrl, { query: { userId } });
    setMessageStates((prev) => ({
      ...prev,
      socket: clientSocket,
    }));

    return () => {
      clientSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    const socket = messageStates.socket;
    if (socket === null) return;

    socket.on('connect', () => {
      setMessageStates((prev) => ({
        ...prev,
        isConnected: true,
      }));
    });

    socket.on('disconnect', () => {
      setMessageStates((prev) => ({
        ...prev,
        isConnected: false,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [messageStates.socket]);

  useEffect(() => {
    if (!messageStates.socket) return;

    messageStates.socket.on('set-active-users', (data) => {
      setMessageStates((prev) => ({
        ...prev,
        active_users: data,
      }));
    });

    if (recipientId) {
      reloadPersonalMessage();

      messageStates.socket.on(
        'set-personal-messages',
        (messages: Message[]) => {
          setMessageStates((prev) => ({
            ...prev,
            personal_messages: messages,
          }));
        },
      );
    }

    if (params.id && params.channel_id) {
      reloadChannelMessage();
      messageStates.socket.on('set-message', (messages: Message[]) => {
        setMessageStates((prev) => ({
          ...prev,
          channel_messages: messages,
        }));
      });
    }
  }, [
    messageStates.socket,
    params.channel_id,
    params.id,
    recipientId,
    reloadChannelMessage,
    reloadPersonalMessage,
    reloadThread,
    thread,
  ]);

  const handleUpdate = useCallback(
    (value: Partial<SocketStates>) =>
      setMessageStates((prev) => ({
        ...prev,
        value,
      })),
    [],
  );

  const memoizedValues = useMemo(() => messageStates, [messageStates]);

  return (
    <SocketContext.Provider value={{ states: memoizedValues, handleUpdate }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketState = <K extends keyof SocketStates>(
  key: K,
): SocketStates[K] => {
  return useContext(SocketContext).states[key];
};
