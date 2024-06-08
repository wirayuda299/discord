import Image from 'next/image';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import useFetch from '@/hooks/useFetch';
import { getServerMembers } from '@/helper/server';
import Link from 'next/link';

export default function ServersMembers({ serverId }: { serverId: string }) {
  const { data, isLoading, error } = useFetch('members', () =>
    getServerMembers(serverId),
  );

  if (isLoading)
    return (
      <div className='h-9 w-9 animate-pulse bg-foreground brightness-105'></div>
    );
  if (error) return <p>{error.message}</p>;

  // console.info(data);

  return (
    <Sheet>
      <SheetTrigger
        aria-label='show members'
        name='show members'
        title='show members'
      >
        <Image
          className='min-w-6'
          src={'/server/icons/member.svg'}
          width={24}
          height={24}
          alt='member'
        />
      </SheetTrigger>
      <SheetContent className='border-foreground bg-foreground text-white shadow-2xl'>
        <SheetHeader className='pb-5'>
          <SheetTitle className='text-white'>Members</SheetTitle>
        </SheetHeader>
        <ul className='flex flex-col gap-3'>
          {data?.map((member) => (
            <li
              key={member.id}
              className='flex-center gap-2 rounded-md p-2 hover:bg-foreground hover:brightness-110'
            >
              <Image
                src={member.serverProfile.avatar}
                width={50}
                height={50}
                alt={member.username}
                className='size-12 rounded-full object-cover'
              />
              <Link href={'#'}>
                <div className='flex-center gap-2'>
                  {member.role && member.role.icon && (
                    <Image
                      src={member.role.icon}
                      width={20}
                      height={20}
                      alt='icon'
                      className='size-4 rounded-full object-cover'
                    />
                  )}
                  <h3
                    className='text-xl font-semibold'
                    style={{
                      ...(member.role && { color: member.role.role_color }),
                    }}
                  >
                    {member.username}
                  </h3>
                </div>
                {member.role && <p className='text-xs'>{member.role.name}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
