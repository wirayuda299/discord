import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import useServerMembers from '@/hooks/useServerMember';

export default function ServersMembers({
  serverId,
  children,
}: {
  serverId: string;
  children: ReactNode;
}) {
  const { data, error, isLoading } = useServerMembers(serverId);

  if (isLoading)
    return (
      <div className='h-9 w-9 animate-pulse bg-foreground brightness-105'></div>
    );
  if (error) return <p>{error.message}</p>;

  return (
    <Sheet>
      <SheetTrigger
        asChild
        aria-label='show members'
        name='show members'
        title='show members'
      >
        {children}
      </SheetTrigger>
      <SheetContent className='w-full border-foreground bg-black text-white shadow-2xl md:bg-foreground'>
        <SheetHeader className='pb-5'>
          <SheetTitle className='text-left text-white'>Members</SheetTitle>
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
