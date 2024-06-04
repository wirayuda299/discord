'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { Servers } from '@/types/server';
import { Thread } from '@/types/messages';
import { Categories } from '@/types/channels';

export type ServerStates = {
  selectedChannel: Categories | null;
  selectedServer: Servers | null;
  selectedSetting: string;
  selectedOption: string;
  selectedThread: Thread | null;
};

const initialValues: ServerStates = {
  selectedChannel: null,
  selectedServer: null,
  selectedSetting: 'overview',
  selectedOption: 'user',
  selectedThread: null,
};

type ServerContextType = {
  states: ServerStates;
  updateState: (value: Partial<typeof initialValues>) => void;
};

const socketStates = {
  states: initialValues,
  updateState: () => {},
};

export const ServerStatesContext =
  createContext<ServerContextType>(socketStates);

export const ServerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [states, setStates] = useState(initialValues);
  const memoized = useMemo(() => states, [states]);

  const updateState = useCallback((value: Partial<typeof initialValues>) => {
    setStates((prev) => ({ ...prev, ...value }));
  }, []);

  return (
    <ServerStatesContext.Provider value={{ states: memoized, updateState }}>
      {children}
    </ServerStatesContext.Provider>
  );
};

export const useServerContext = <K extends keyof ServerStates>(key: K) => {
  return useContext(ServerStatesContext).states[key];
};

export const useUpdateServerState = () => {
  return useContext(ServerStatesContext).updateState;
};
