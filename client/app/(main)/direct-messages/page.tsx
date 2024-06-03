import dynamic from 'next/dynamic';

import { getFriend } from '@/helper/friends';
import { getPersonalPinnedMessages } from '@/helper/message';

const Friends = dynamic(() => import('./_components/friends/friends'));
const Sidebar = dynamic(() => import('./_components/sidebar/sidebar'));
const PersonalMessages = dynamic(
  () => import('./_components/personal-messages/personal-messages'),
);

type Props = {
  searchParams: {
    option: string;
    userId: string;
    friendId: string;
    message_type: string;
    conversationId: string;
  };
};

export default async function DirectMessages({ searchParams }: Props) {
  const friend = await getFriend(searchParams.friendId, searchParams.userId);
  const pinnedMessages = await getPersonalPinnedMessages(
    searchParams.conversationId || '',
  );

  return (
    <div className='flex w-full'>
      <Sidebar />
      {searchParams.userId && (
        <PersonalMessages
          pinnedMessages={pinnedMessages}
          friend={friend!}
          styles='hidden md:block'
        />
      )}
      {searchParams.option === 'friends' &&
        (searchParams.userId || !searchParams.userId) && (
          <div className='hidden w-full md:block'>
            <Friends innerStyle='max-w-[670px]' />
          </div>
        )}
    </div>
  );
}
