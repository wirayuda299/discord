import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

import { Message } from '@/types/messages';

function RepliedMessage({
  msg,
  repliedMessage,
}: {
  msg: Message;
  repliedMessage: Message | undefined;
}) {
  return (
    <Link
      aria-label={msg.parent_message_id || msg.message_id}
      href={`#${msg.parent_message_id || msg.message_id}`}
      className='flex items-center gap-2'
    >
      <Image
        className='mt-2 aspect-auto min-w-8 object-contain'
        src='/general/icons/connected-line.svg'
        width={20}
        height={20}
        alt='line'
      />

      <div className='flex w-full items-center gap-2 overflow-hidden md:max-w-[200px] lg:max-w-[500px]'>
        <div className='flex size-4 items-center justify-center rounded-full bg-background'>
          <Image
            className='size-3 object-contain'
            src='/general/icons/reply-small.svg'
            width={20}
            height={20}
            alt='line'
          />
        </div>
        <p className='text-sm text-gray-2 group-hover:brightness-150 md:text-base'>
          {repliedMessage?.username}
        </p>
        <p className='text-xs text-gray-2'>{repliedMessage?.message}</p>
      </div>
    </Link>
  );
}

export default memo(RepliedMessage);
