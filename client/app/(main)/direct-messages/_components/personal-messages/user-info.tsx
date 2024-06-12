import Image from 'next/image';

import { Friend } from '@/helper/friends';
import { Button } from '@/components/ui/button';

export default function UserInfo({ friend }: { friend: Friend }) {
  return (
    <section className='flex flex-col gap-4 p-5'>
      <Image
        priority
        fetchPriority='high'
        className='size-16 rounded-full object-cover md:size-24'
        src={friend?.image || '/general/icons/discord.svg'}
        width={80}
        height={80}
        sizes='80px'
        alt='user'
      />
      <div className='flex flex-col gap-4'>
        <h4 className='pl-1 text-xl font-semibold capitalize text-white md:text-3xl'>
          {friend?.username}
        </h4>
        <p className='text-sm text-secondary'>
          This is beginning of your direct messages with {friend?.username}
        </p>
        <div className='flex-center flex-wrap gap-4 pt-5'>
          <div className='flex-center gap-2'>
            <Image
              className='size-5 rounded-full object-cover'
              src={'/general/icons/discord.svg'}
              width={20}
              height={20}
              sizes='20px'
              alt='user'
              priority
            />
            <span className='text-sm text-secondary'>1 Mutual server</span>
          </div>
          <Button
            name='remove friend'
            title='remove friend'
            className='h-5 rounded !bg-gray-1 p-3 text-sm font-normal'
            size={'sm'}
          >
            Remove friend
          </Button>
          <Button
            name='block'
            title='block'
            className='h-5 rounded !bg-gray-1 p-3 text-sm font-normal'
            size={'sm'}
          >
            Block
          </Button>
        </div>
      </div>
    </section>
  );
}
