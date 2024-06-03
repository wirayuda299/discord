import { ServerStatesContext } from '@/providers/servers';
import { useContext } from 'react';

export const useUpdateServerState = () => {
  const { updateState } = useContext(ServerStatesContext);
  return updateState;
};
