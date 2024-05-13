"use client";

import { useAuth } from "@clerk/nextjs";
import { Socket, io } from "socket.io-client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType>(
  {} as SocketContextType,
);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { userId } = useAuth();

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_ORIGIN||'http://localhpst:3001';
    const clientSocket = io(serverUrl!, {
      query: {
        userId,
      },
    });
    setSocket(clientSocket);

    return () => {
      clientSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  return useContext(SocketContext);
}
