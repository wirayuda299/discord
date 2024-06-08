import { create } from 'zustand';

import { Message, Thread } from '@/types/messages';
import { Categories } from '@/types/channels';
import { Servers } from '@/types/server';
import { SocketStates } from '@/types/socket-states';
import { Socket } from 'socket.io-client';

type MessageStates = {
  message: Message;
  type: string;
  action: string;
};

type SelectedMessage = {
  selectedMessage: MessageStates | null;
  setSelectedMessage: (message: MessageStates | null) => void;
};

export type ServerStates = {
  selectedChannel: Categories | null;
  selectedServer: Servers | null;
  selectedSetting: string;
  selectedOption: string;
  selectedThread: Thread | null;
};

type ServerStoreType = {
  setSelectedChannel: (selectedChannel: Categories | null) => void;
  setSelectedServer: (server: Servers | null) => void;
  setSelectedSetting: (setting: string) => void;
  setSelectedOption: (option: string) => void;
  setSelectedThread: (thread: Thread | null) => void;
} & ServerStates;

const initialValues: ServerStates = {
  selectedChannel: null,
  selectedServer: null,
  selectedSetting: 'overview',
  selectedOption: 'user',
  selectedThread: null,
};

const socketStates = {
  active_users: [],
  channel_messages: [],
  personal_messages: [],
  thread_messages: [],
  socket: null,
  isConnected: false,
};

export const useSelectedMessageStore = create<SelectedMessage>((set) => ({
  selectedMessage: null,
  setSelectedMessage: (message: MessageStates | null) =>
    set(() => ({ selectedMessage: message })),
}));

export const useServerStates = create<ServerStoreType>((set) => ({
  ...initialValues,
  setSelectedChannel: (selectedChannel) => set(() => ({ selectedChannel })),
  setSelectedOption: (selectedOption) => set(() => ({ selectedOption })),
  setSelectedServer: (selectedServer) => set(() => ({ selectedServer })),
  setSelectedSetting: (selectedSetting) => set(() => ({ selectedSetting })),
  setSelectedThread: (selectedThread) => set(() => ({ selectedThread })),
}));

type SocketStore = SocketStates & {
  setSocket: (socket: Socket | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setActiveUsers: (users: string[]) => void;
  setPersonalMessages: (messages: Message[]) => void;
  setChannelMessages: (messages: Message[]) => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  ...socketStates,
  setSocket: (socket) => set({ socket }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setActiveUsers: (active_users) => set({ active_users }),
  setPersonalMessages: (personal_messages) => set({ personal_messages }),
  setChannelMessages: (channel_messages) => set({ channel_messages }),
}));
