import Image from 'next/image';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AllThread } from '@/helper/threads';
import { getCreatedDate } from '@/utils/date';

export default function ThreadList({ threads = [] }: { threads: AllThread[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='see all threads'
        name='see all threads'
        title='See all threads'
      >
        <Image
          className='min-w-6'
          src={'/general/icons/threads.svg'}
          width={24}
          height={24}
          alt={'threads'}
          key={'threads'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-96 max-w-96 border-none bg-black-1 p-0'>
        <header className='flex min-h-6 w-full items-center gap-3 bg-background px-2 py-3 text-white'>
          <div className='flex items-center gap-2 border-r border-r-background pr-5'>
            <Image
              src={'/general/icons/threads.svg'}
              width={24}
              height={24}
              alt={'threads'}
              key={'threads'}
            />
            <h3 className='text-base font-semibold'>Threads</h3>
          </div>
        </header>
        <div className='flex max-h-96 w-full min-w-56 flex-col gap-2 overflow-y-auto p-2'>
          {threads.length < 1 ? (
            <div className='flex min-h-60 w-full flex-col items-center justify-center'>
              <div className='relative'>
                <div className='flex size-20 items-center justify-center rounded-full bg-foreground'>
                  <Image
                    src={'/general/icons/threads.svg'}
                    width={50}
                    height={50}
                    alt='threads'
                  />
                </div>
                <Image
                  className='absolute inset-0'
                  src={'/server/icons/star.svg'}
                  width={220}
                  height={220}
                  alt='star'
                />
              </div>
              <h2 className='text-2xl font-semibold text-white'>
                There are no threads
              </h2>
              <p className='text-center text-base text-gray-2'>
                Stay focused on a conversation with a thread - a temporary text
                channel.
              </p>
            </div>
          ) : (
            <div>
              {threads?.map((thread) => (
                <div
                  key={thread.thread_id}
                  className='flex flex-col gap-1 p-2 hover:bg-foreground'
                >
                  <p className='text-sm font-medium text-gray-2'>
                    {thread.thread_name}
                  </p>
                  <div className='flex-center gap-2 text-gray-2'>
                    <Image
                      src={thread.avatar}
                      width={25}
                      height={25}
                      alt='avatar'
                      className='size-5 rounded-full object-cover'
                    />
                    <h4 className='text-gray-2'>{thread.username}</h4> &#x2022;
                    <span className='text-xs font-semibold text-gray-2'>
                      {getCreatedDate(new Date(thread.created_at))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
