'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

import Tab from './tab';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import Blocked from './blocked';

const AllFriends = dynamic(() => import('./allFriends'));
const Pending = dynamic(() => import('./pending'));

export default function Friends({
  rootStyle,
  innerStyle,
}: {
  rootStyle?: string;
  innerStyle?: string;
}) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversationId');

  const handleClick = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className={cn('w-full p-2', rootStyle)}>
      <section
        className={cn(
          'h-full min-h-screen w-full border-r border-background bg-foreground',
          innerStyle,
        )}
      >
        <Tab activeTab={activeTab} handleClick={handleClick} />
        {activeTab === 'all' && <AllFriends conversationId={conversationId!} />}
        {activeTab === 'pending' && <Pending />}
        {activeTab === 'blocked' && <Blocked />}
      </section>
    </div>
  );
}
