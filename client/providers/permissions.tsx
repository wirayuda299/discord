'use client';

import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { ReactNode, createContext, useContext } from 'react';

import { getCurrentUserPermissions } from '@/helper/roles';
import useFetch from '@/hooks/useFetch';
import { getServerById } from '@/helper/server';
import { Permission, Servers } from '@/types/server';

type PermissionContextType = {
  server: Servers | undefined;
  permission: Permission | undefined;
  loading: boolean;
  errors: any;
  userId: string | null | undefined;
};

const PermissionContext = createContext<PermissionContextType>({
  errors: null,
  loading: false,
  permission: undefined,
  server: undefined,
  userId: null,
});

export default function PermissionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = useAuth();
  const params = useParams();
  const {
    data: server,
    isLoading: serverLoading,
    error: serverError,
  } = useFetch('server', () => getServerById(params.id as string));

  const {
    data: permission,
    isLoading,
    error,
  } = useFetch(
    'permissions',
    () => getCurrentUserPermissions(userId ? userId : '', params.id as string),
    false,
  );

  const loading = serverLoading || isLoading;
  const errors = serverError || error;

  return (
    <PermissionContext.Provider
      value={{ errors, loading, server, permission, userId }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermissionsContext = () => useContext(PermissionContext);
