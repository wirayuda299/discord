'use client';

import { createContext, useEffect, type ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useShallow } from 'zustand/react/shallow';
import { io } from 'socket.io-client';

import { useSocketStore } from '.';

export const SocketContext = createContext({});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();

  const { socket, setSocket, setIsConnected, setActiveUsers } = useSocketStore(
    useShallow((state) => ({
      socket: state.socket,
      setSocket: state.setSocket,
      setActiveUsers: state.setActiveUsers,
      setIsConnected: state.setIsConnected,
    })),
  );

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
  }, [socket, setActiveUsers]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
