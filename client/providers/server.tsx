"use client";
import {
  useMemo,
  useState,
  ReactNode,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

import { Channel } from "@/types/channels";
import { Servers } from "@/types/server";
import { Message, Thread } from "@/types/messages";

export type ServerStates = {
  selectedChannel: Channel | null;
  selectedServer: Servers | null;
  selectedSetting: string;
  selectedOption: string;
  selectedMessage: Message | null;
  selectedThread: Thread | null;
};

export type ServerContextType = {
  serversState: ServerStates;
  setServerStates: Dispatch<SetStateAction<ServerStates>>;
};

const ServerContext = createContext<ServerContextType>({
  serversState: {
    selectedChannel: null,
    selectedServer: null,
    selectedSetting: "my account",
    selectedOption: "user",
    selectedMessage: null,
    selectedThread: null,
  },
  setServerStates: () => {},
});

export const ServerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [serverStates, setServerStates] = useState<ServerStates>({
    selectedChannel: null,
    selectedServer: null,
    selectedSetting: "my account",
    selectedOption: "user",
    selectedMessage: null,
    selectedThread: null,
  });

  const values = useMemo(() => {
    return {
      serverStates,
      setServerStates,
    };
  }, [serverStates]);

  return (
    <ServerContext.Provider
      value={{
        serversState: values.serverStates,
        setServerStates: values.setServerStates,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServerContext = () => useContext(ServerContext);
