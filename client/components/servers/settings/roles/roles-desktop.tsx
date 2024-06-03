import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useState } from 'react';

import SearchForm from '@/components/shared/search-form';
import { Button } from '@/components/ui/button';
import { Role } from '@/helper/roles';
const RoleSettings = dynamic(() => import('./role-settings'));

export default function RolesDesktop() {
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

  return (
    <>
      {type === 'create' || type === 'update' || selectedRole ? (
        <RoleSettings
          selectTab={selectTab}
          selectedRole={selectedRole}
          selectedTab={selectedTab}
          type={type}
        />
      ) : (
        <div className='p-7'>
          <h2 className='pb-5 text-lg font-semibold text-white'>Roles</h2>
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
        </div>
      )}
    </>
  );
}
