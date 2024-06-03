import Image from 'next/image';
import { memo, useMemo } from 'react';

import { formatDate } from '@/utils/date';
import { Message } from '@/types/messages';

const highlightLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const segments = text.split(urlRegex);
  return segments.map((segment, index) => {
    if (segment.match(urlRegex)) {
      return (
        <a
          key={index}
          href={segment}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:border-b hover:border-blue-500'
        >
          {segment}
        </a>
      );
    } else {
      return segment;
    }
  });
};

function MessageContent({ msg }: { msg: Message }) {
  const isEdited = useMemo(
    () =>
      new Date(msg.update_at).getTime() > new Date(msg.created_at).getTime(),
    [msg],
  );
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-3'>
          <span className='text-nowrap text-xs'>
            {formatDate(msg.created_at)}
          </span>
          <p
            className='text-base group-hover:text-white'
            style={{
              ...(msg.role && { color: msg.role.role_color }),
            }}
          >
            {msg.username}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {msg.role && msg.role.icon && (
            <Image
              src={msg.role.icon}
              width={20}
              height={20}
              alt='role icon'
              className='size-5 min-w-5 rounded-full object-cover'
            />
          )}
        </div>
      </div>
      <p className='text-wrap break-all text-base group-hover:text-white'>
        {highlightLinks(msg.message)}{' '}
        {isEdited && <span className='text-xs'>(edited)</span>}
      </p>
    </div>
  );
}

export default memo(MessageContent);
