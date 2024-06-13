import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SearchForm from '@/components/shared/search-form';
import { Button } from '@/components/ui/button';
import { Role, getAllRoles } from '@/helper/roles';
import useFetch from '@/hooks/useFetch';
import PulseLoader from '@/components/shared/pulse-loader';
const RoleSettings = dynamic(() => import('./role-settings'));

export default function Roles({
  serverAuthor,
  serverId,
}: {
  serverAuthor: string;
  serverId: string;
}) {
  const { data, isLoading, error } = useFetch('roles', () =>
    getAllRoles(serverId),
  );
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('display');
  const [type, setType] = useState<'create' | 'update' | null>(null);

  const selectRole = useCallback(
    (role: Role | null) => setSelectedRole(role),
    [],
  );
  const selectTab = useCallback(
    (tab: string = 'display') => setSelectedTab(tab),
    [],
  );
  const selectType = useCallback(
    (type: 'create' | 'update' | null) => setType(type),
    [],
  );

  if (isLoading) return <PulseLoader />;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      {type === 'create' || type === 'update' || selectedRole ? (
        <RoleSettings
          selectType={selectType}
          roles={data || []}
          selectRole={selectRole}
          serverAuthor={serverAuthor}
          selectTab={selectTab}
          selectedRole={selectedRole}
          selectedTab={selectedTab}
          type={type}
        />
      ) : (
        <div className='p-3 md:p-7'>
          <h2 className='hidden pb-5 text-lg font-semibold text-white md:block'>
            Roles
          </h2>
          <p className='text-sm text-gray-2'>
            Use roles to group your server members and assign permissions.
          </p>

          <div className='flex-center group mt-5 min-h-20 gap-3 rounded-md bg-background/50 p-5 hover:bg-foreground hover:brightness-110'>
            <div className='flex size-8 items-center rounded-full bg-background/30 group-hover:bg-foreground'>
              <Image
                className='mx-auto'
                src={'/server/icons/member.svg'}
                width={20}
                height={20}
                alt='members'
              />
            </div>
            <div>
              <h3 className='text-gray-2'>Default permissions</h3>
              <p className='text-xs text-gray-2'>
                All members are allowed to send message and view channel
              </p>
            </div>
          </div>

          <div className='mt-5 flex gap-3'>
            <div className='w-full'>
              <SearchForm styles='max-w-full py-2' placeholder='Search roles' />
              <p className='pt-1 text-sm text-gray-2'>
                Members use the color of the highest role they have on this
                list. Drag roles to reorder them.{' '}
                <a href='#' className='text-blue-400'>
                  Need help with permissions?
                </a>
              </p>
            </div>
            <Button
              onClick={() => selectType('create')}
              size={'sm'}
              className='rounded'
            >
              Create role
            </Button>
          </div>

          <Table>
            <TableCaption>A list of role that been created.</TableCaption>
            <TableHeader className='!bg-transparent'>
              <TableRow className='border-gray-2/15 !bg-transparent'>
                <TableHead className='text-white'>Roles</TableHead>
                <TableHead className='text-white'>Member</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='border-foreground'>
              {data?.map((role) => (
                <TableRow
                  key={role.name}
                  onClick={() => {
                    selectRole(role);
                    setType('update');
                  }}
                  className='cursor-pointer border-gray-2/10 hover:!bg-foreground hover:!brightness-110'
                >
                  <TableCell className='text-base'>
                    <div className='flex items-center gap-2 text-gray-2'>
                      <div
                        className='size-2 rounded-full'
                        style={{ backgroundColor: role.role_color }}
                      ></div>
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell className='inline-flex gap-2'>
                    <span className='text-gray-2'>{role.members.length}</span>
                    <Image
                      src={'/server/icons/member.svg'}
                      width={20}
                      height={20}
                      alt='member'
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
