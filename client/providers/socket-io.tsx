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
import { Message } from "@/types/messages";

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
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
  const [messages, setMessages] = useState<Message[]>([]);

  const { userId } = useAuth();

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_ORIGIN;
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

    socket?.on("set-personal-messages", (e) => {
      setMessages((prev) => [...messages, e]);
    });

    return () => {
      socket.disconnect();
      setMessages([]);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        socket,
        messages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  return useContext(SocketContext);
}
