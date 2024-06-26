import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { Ellipsis, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useAuth } from '@clerk/nextjs';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import useServerMembers from '@/hooks/useServerMember';
import { banMember } from '@/actions/members';
import { createError } from '@/utils/error';
import { useSocketStore } from '@/providers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { usePermissionsContext } from '@/providers/permissions';
import useFetch from '@/hooks/useFetch';
import { getServerById } from '@/helper/server';

export default function ServersMembers({
  serverId,
  children,
}: {
  serverId: string;
  children: ReactNode;
}) {
  const { userId } = useAuth()
  const { data, error, isLoading } = useServerMembers(serverId);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutate } = useSWRConfig()
  const socket = useSocketStore(state => state.socket)
  const { data: server, isLoading: serverLoading, error: serverError } = useFetch('server', () => getServerById(serverId))
  const { permission, loading, errors } = usePermissionsContext()

  const handleBanMember = async (memberId: string) => {
    try {
      setIsSubmitting(true)
      await banMember(serverId, memberId, userId!)
        .then(() => {
          mutate('members')
          toast.success('Member has banned!')
          socket?.emit('banned_members', { serverId })
        })
    } catch (error) {
      createError(error)
    } finally {
      setIsSubmitting(false)
    }
  }


  if (isLoading || loading || serverLoading)
    return (
      <div className='h-9 w-full animate-pulse bg-foreground/35 brightness-105 md:w-9 md:bg-foreground'></div>
    );
  if (error || serverError || errors) return <p>{error.message || serverError.message || errors.message}</p>;

  const isAllowedToBanMember = (server?.owner_id === userId) || (permission && permission.ban_member)

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
              {isAllowedToBanMember && (
                <DropdownMenu>
                  <DropdownMenuTrigger className='opacity-0 group-hover:opacity-100'>
                    <Ellipsis className='text-gray-2' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='min-w-48 rounded !bg-black text-white'>
                    <button
                      title='ban'
                      disabled={isSubmitting}
                      onClick={() => handleBanMember(member.user_id)}
                      className='text-sm text-left rounded-sm w-full hover:bg-background/50 p-1 cursor-pointer'>
                      {isSubmitting ? 'Loading..' : 'Ban Member'}
                    </button>

                  </DropdownMenuContent>
                </DropdownMenu>

              )}
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
