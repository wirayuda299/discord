'use client';

import { Message } from '@/types/messages';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type MessageStates = {
  message: Message;
  type: string;
  action: string;
};

type MessageContext = {
  state: MessageStates | null;
  setMessage: (message: MessageStates | null) => void;
};

export const MessageContext = createContext<MessageContext>({
  state: null,
  setMessage: () => {},
});

export default function MessageProviders({
  children,
}: {
  children: ReactNode;
}) {
  const [messageStates, setMessageStates] = useState<MessageStates | null>(
    null,
  );

  const setMessage = useCallback(
    (message: MessageStates | null) => setMessageStates(message),
    [],
  );

  const values = useMemo(() => messageStates, [messageStates]);

  return (
    <MessageContext.Provider value={{ state: values, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessage = () => useContext(MessageContext);
