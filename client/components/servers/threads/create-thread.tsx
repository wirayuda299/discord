import Image from 'next/image';
import { SendHorizontal, X } from 'lucide-react';
import { FormEvent, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

import { createError } from '@/utils/error';
import { revalidate } from '@/utils/cache';
import { cn } from '@/lib/utils';
import EmojiPicker from '@/components/shared/emoji-picker';
import { formatDate } from '@/utils/date';
import { useSelectedMessageStore } from '@/providers';

export default function CreateThread({
  channelId,
  pathname,
  reloadChannelMessage
}: {
  channelId: string;
  pathname: string;
  reloadChannelMessage: () => void
}) {
  const { userId } = useAuth();
  const ref = useRef<HTMLInputElement>(null);

  const { selectedMessage, setMessage } = useSelectedMessageStore((state) => ({
    selectedMessage: state.selectedMessage,
    setMessage: state.setSelectedMessage,
  }));


  const appendEmoji = useCallback((emoji: string) => {
    if (ref.current) {
      ref.current.value += emoji;
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    const threadName = e.target.thread_name.value;
    // @ts-ignore
    const message = e.target.message.value;

    if (!message) {
      toast.message('Please select a message to start create thread');
      return;
    }

    if (!threadName || !message) {
      toast.error('Please add thread name and message');
      return;
    }

    try {
      const { createThread } = await import('@/actions/threads');
      await createThread({
        channelId,
        message,
        msgId: selectedMessage?.message?.message_id || '',
        threadName,
        userId: userId!!,
        imageAssetId: '',
        imageUrl: '',
      }).then(() => {
        toast.success('Thread has been created');
        revalidate(pathname);
        setMessage(null);
        reloadChannelMessage()
      });
    } catch (error) {
      createError(error);
    }
  };

  if (!selectedMessage || selectedMessage && selectedMessage.action !== 'create_thread') return null

  return (
    <aside
      className={cn(
        'ease fixed -right-full top-0 z-50 max-h-dvh min-h-dvh flex flex-col  md:max-h-screen md:min-h-screen min-w-96 bg-black opacity-0 shadow-2xl transition-all duration-300 md:bg-foreground',
        selectedMessage &&
        selectedMessage &&
        selectedMessage.action === 'create_thread' &&
        'right-0 opacity-100',
      )}
    >
      <header className='sticky left-0 top-0 z-10 flex h-12 w-full items-center justify-between border-b border-foreground bg-black p-3 md:border-none md:bg-background'>
        <div className='flex-center gap-2'>
          <Image
            src={'/general/icons/threads.svg'}
            width={20}
            height={20}
            alt='threads'
          />
          <h2 className='text-lg font-semibold text-white'>New thread</h2>
        </div>
        <button
          aria-label='close'
          name='close'
          title='close'
          onClick={() => setMessage(null)}
        >
          <X />
        </button>
      </header>
      {selectedMessage && (
        <div className='p-3'>
          <div className='flex flex-wrap gap-2'>
            <p className='inline-flex gap-x-1 text-nowrap pt-[3px] text-xs leading-snug text-gray-600'>
              {formatDate(selectedMessage.message.created_at)}
            </p>
            <div className='flex flex-wrap items-start gap-2'>
              <p className='text-sm leading-snug text-gray-2'>
                {selectedMessage.message.username}
              </p>

              <p
                className='min-w-min text-wrap text-sm text-[#d9dee1]'
                style={{
                  wordWrap: 'break-word',
                  wordBreak: 'break-all',
                }}
              >
                {selectedMessage.message.message}
                {new Date(selectedMessage.message.update_at) >
                  new Date(selectedMessage.message.created_at) && (
                    <span className='text-xs text-gray-2'>(edited)</span>
                  )}
              </p>
            </div>
          </div>
          {selectedMessage.message.media_image &&
            !selectedMessage.message.parent_message_id && (
              <Image
                src={selectedMessage.message.media_image}
                width={200}
                height={100}
                alt='media'
                className='ml-9 mt-3 aspect-auto rounded-md object-cover'
                loading='lazy'
              />
            )}
        </div>
      )}
      <div className='flex grow h-full min-h-fit flex-col justify-end p-3'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div>
            <div className='z-0 flex size-16 items-center justify-center rounded-full bg-background/50 md:bg-foreground brightness-125'>
              <Image
                src={'/general/icons/threads.svg'}
                width={40}
                height={40}
                alt='threads'
              />
            </div>
            <label
              htmlFor='thread_name'
              className='block py-2 text-sm font-semibold uppercase text-gray-2'
            >
              Thread name
            </label>
          </div>
          <input
            name='thread_name'
            type='text'
            id='thread_name'
            autoComplete='off'
            placeholder='Thread name'
            autoFocus={false}
            className='w-full rounded bg-background/50 p-2 placeholder:text-xs focus-visible:outline-none md:bg-background'
          />
          <div className='flex-center gap-2 rounded bg-foreground/35 p-3 brightness-125 md:bg-foreground'>
            <input
              ref={ref}
              type='text'
              name='message'
              autoComplete='off'
              placeholder='Enter a message to start conversations'
              autoFocus={false}
              className='w-full rounded placeholder:text-sm bg-transparent placeholder:font-light focus-visible:outline-none'
            />
            <EmojiPicker appendEmoji={({ emoji }) => appendEmoji(emoji)} />
            <button
              aria-label='submit'
              title='submit'
              name='submit'
              type='submit'
            >
              <SendHorizontal className='text-gray-2' />
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
