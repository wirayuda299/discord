import Image from 'next/image';
import Link from 'next/link';
import { EllipsisVertical, MessageCircle } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

import PulseLoader from '@/components/shared/pulse-loader';
import { getFriendList } from '@/helper/friends';
import useFetch from '@/hooks/useFetch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSocketState } from '@/providers/socket-io';
import { cn } from '@/lib/utils';
import PersonalMessagesMobile from '../../../../../components/shared/personal-message-mobile';

export default function AllFriends({
  conversationId,
}: {
  conversationId: string;
}) {
  const { userId } = useAuth();
  const activeUsers = useSocketState('active_users');

  const { data, isLoading, error } = useFetch('friend-list', () =>
    getFriendList(userId!!),
  );

  if (isLoading) return <PulseLoader />;
  if (error) return <p>{error.message}</p>;

  return (
    <div className='h-screen overflow-y-auto p-3'>
      <p className='pb-3 text-sm font-semibold uppercase text-secondary'>
        All friends({data?.length || 0})
      </p>
      {data?.map((friend) => (
        <div
          key={friend?.id}
          className='group flex grow items-center justify-between gap-2 rounded-md p-2 hover:bg-foreground hover:brightness-125'
        >
          <div className='flex items-center gap-2'>
            <Image
              src={friend?.image}
              width={50}
              height={50}
              alt='user'
              className='size-14 rounded-full object-cover'
            />
            <div>
              <Link
                aria-label='profile'
                href={'/'}
                className='text-base font-semibold capitalize'
              >
                {friend.username}
              </Link>
              <p
                className={cn(
                  'text-xs text-gray-2',
                  activeUsers.includes(friend.user_id) && 'text-green-600',
                )}
              >
                {activeUsers.includes(friend.user_id) ? 'online' : 'offline'}
              </p>
            </div>
          </div>
          <div className='mr-10 inline-flex gap-3 md:mr-0'>
            <PersonalMessagesMobile
              conversationId={conversationId}
              userId={friend.user_id}
              friendId={friend.id}
            >
              <Link
                aria-label='direct-messages'
                href={`/direct-messages?userId=${friend.user_id}&message_type=personal&friendId=${friend.id}`}
                className='ease flex size-9 items-center rounded-full bg-background/40 transition-colors group-hover:bg-background md:hidden'
              >
                <MessageCircle
                  className='mx-auto fill-secondary stroke-foreground'
                  size={25}
                />
              </Link>
            </PersonalMessagesMobile>

            <Link
              aria-label='direct-messages'
              href={`/direct-messages?userId=${friend.user_id}&message_type=personal&friendId=${friend.id}`}
              className='ease hidden size-9 items-center rounded-full bg-background/40 transition-colors group-hover:bg-background md:flex'
            >
              <MessageCircle
                className='mx-auto fill-secondary stroke-foreground'
                size={25}
              />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='ease size-9 rounded-full bg-foreground/40 transition-colors group-hover:bg-foreground'>
                  <EllipsisVertical
                    className='mx-auto fill-gray-2 stroke-gray-2'
                    size={20}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='border-none bg-background text-secondary'>
                <DropdownMenuItem className='hover:!bg-primary hover:!text-white'>
                  Start video call
                </DropdownMenuItem>
                <DropdownMenuItem className='hover:!bg-primary hover:!text-white'>
                  Start voice call
                </DropdownMenuItem>
                <DropdownMenuItem className='text-red-600 hover:!bg-primary hover:!text-red-700'>
                  Remove friend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
