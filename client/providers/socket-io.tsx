'use client';

import {
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
import { useParams, useSearchParams } from 'next/navigation';

import { Message } from '@/types/messages';
import { useServerStates, useSocketStore } from '.';
import { useShallow } from 'zustand/react/shallow';

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

export const SocketContext = createContext({});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const params = useParams();
  const recipientId = searchParams.get('userId') as string;
  const thread = useServerStates((state) => state.selectedThread);

  const {
    socket,
    setSocket,
    setIsConnected,
    setActiveUsers,
    setPersonalMessages,
    setChannelMessages,
  } = useSocketStore(
    useShallow((state) => ({
      socket: state.socket,
      setSocket: state.setSocket,
      setActiveUsers: state.setActiveUsers,
      setIsConnected: state.setIsConnected,
      setPersonalMessages: state.setPersonalMessages,
      setChannelMessages: state.setChannelMessages,
    })),
  );

  const reloadChannelMessage = useCallback(() => {
    reloadChannelMessages(
      socket,
      params.id as string,
      params.channel_id as string,
    );
  }, [socket, params?.channel_id, params?.id]);

  const reloadPersonalMessage = useCallback(() => {
    reloadPersonalMessages(
      socket,
      searchParams.get('conversationId') as string,
      recipientId,
    );
  }, [socket, searchParams, recipientId]);

  const reloadThread = useCallback(() => {
    if (!thread) return;
    reloadThreadMessage(socket, thread?.thread_id, params.id as string);
  }, [socket, params.id, thread]);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3001';
    const clientSocket = io(serverUrl, { query: { userId } });
    setSocket(clientSocket);

    return () => {
      clientSocket.disconnect();
      setSocket(null);
    };
  }, [userId, setSocket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.disconnect();
    };
  }, [socket, setIsConnected]);

  useEffect(() => {
    if (!socket) return;

    socket.on('set-active-users', (data) => setActiveUsers(data));

    if (recipientId) {
      reloadPersonalMessage();
      socket.on('set-personal-messages', (messages: Message[]) => {
        setPersonalMessages(messages);
      });
    }

    if (params.id && params.channel_id) {
      reloadChannelMessage();
      socket.on('set-message', (messages: Message[]) => {
        setChannelMessages(messages);
      });
    }
  }, [
    socket,
    params.channel_id,
    params.id,
    recipientId,
    reloadChannelMessage,
    reloadPersonalMessage,
    reloadThread,
    thread,
    setActiveUsers,
    setPersonalMessages,
    setChannelMessages,
  ]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
