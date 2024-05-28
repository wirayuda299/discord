import { getCurrentUserPermissions } from '@/helper/roles';
import useFetch from './useFetch';
import { getBannedMembers } from '@/helper/members';
import { findBannedMembers } from '@/utils/banned_members';
import { useMemo } from 'react';

export default function usePermissions(userId: string, serverId: string) {
	const {
		data: permissions,
		error: permissionsError,
		isLoading: permissionsLoading,
	} = useFetch('user-permissions', () =>
		getCurrentUserPermissions(userId!!, serverId)
	);
	const {
		data: bannedMembers,
		error: bannedMembersError,
		isLoading: bannedMembersLoading,
	} = useFetch('banned-members', () => getBannedMembers(serverId));

  const loading = permissionsLoading || bannedMembersLoading;
  const isError = permissionsError || bannedMembersError;

  const isCurrentUserBanned = useMemo(() => findBannedMembers(bannedMembers || [], userId!!), [bannedMembers, userId])
    
    return { permissions, isCurrentUserBanned, loading, isError };

}
