import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { Ellipsis, X } from 'lucide-react';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import useServerMembers from '@/hooks/useServerMember';
import { cn } from '@/lib/utils';

export default function ServersMembers({
  serverId,
  children,
}: {
  serverId: string;
  children: ReactNode;
}) {
  const { data, error, isLoading } = useServerMembers(serverId);
  const [isOpen, setIsOpen] = useState(false)


  if (isLoading)
    return (
      <div className='h-9 w-full animate-pulse bg-foreground/35 brightness-105 md:w-9 md:bg-foreground'></div>
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
        <div className='!flex items-center justify-between pb-5'>
          <h2 className='text-left text-white'>Members</h2>
          <SheetClose className='block'>
            <X />
          </SheetClose>
        </div>
        <ul className='flex flex-col gap-3'>
          {data?.map((member) => (
            <li
              key={member.id}
              className='flex-center justify-between gap-2 rounded-md p-2 hover:bg-foreground group hover:brightness-110'
            >
              <div className='flex-center gap-2'>

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


              </div>
              <div className='relative'>
                <button className=' group-hover:opacity-100 opacity-0' onClick={() => setIsOpen(prev => !prev)}>
                  <Ellipsis className='text-gray-2' />
                </button>

                <ul className={cn('w-full rounded space-y-3 min-w-56 bg-black text-white absolute top-7 p-2 right-0 hidden', isOpen && "block")}>
                  <li className='text-sm rounded-sm hover:bg-background/50 p-1 cursor-pointer'>

                    Ban Member
                  </li>
                  <li className='text-sm hover:bg-background/50 rounded-sm p-1 cursor-pointer'>
                    Kick member
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
