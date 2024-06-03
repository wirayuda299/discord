'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import PersonalMessages from '../../app/(main)/direct-messages/_components/personal-messages/personal-messages';
import useFetch from '@/hooks/useFetch';
import { getPersonalPinnedMessages } from '@/helper/message';
import { getFriend } from '@/helper/friends';

export default function PersonalMessagesMobile({
  userId,
  friendId,
  conversationId,
  children,
}: {
  userId: string;
  friendId: string;
  conversationId: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    data: friend,
    error: friendError,
    isLoading: friendLoading,
  } = useFetch('friend', () => getFriend(friendId as string, userId as string));

  const { data, error, isLoading } = useFetch('pinned-messages', () =>
    getPersonalPinnedMessages(conversationId || ''),
  );

  if (isLoading || friendLoading)
    return (
      <div className='h-10 w-full animate-pulse rounded-md brightness-110'></div>
    );
  if (error || friendError)
    return <p>{error.message || friendError.message}</p>;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          router.push('/direct-messages');
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className='left-0 !w-full min-w-full bg-black p-0'>
        <PersonalMessages
          setIsOpen={setIsOpen}
          pinnedMessages={data || []}
          friend={friend!!}
        />
      </SheetContent>
    </Sheet>
  );
}
