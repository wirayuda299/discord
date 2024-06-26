import { getServerMembers } from '@/helper/server';
import useFetch from './useFetch';

export default function useServerMembers(serverId: string) {
  const { data, isLoading, error } = useFetch('members', () =>
    getServerMembers(serverId),
    true
  );

  return { data, isLoading, error };
}
