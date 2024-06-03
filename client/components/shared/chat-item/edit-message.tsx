'use client';

import { FormEvent, useRef } from 'react';
import { toast } from 'sonner';

import { editMessage } from '@/helper/message';
import { Textarea } from '../../ui/textarea';
import { createError } from '@/utils/error';

type Props = {
  message: string;
  handleClose: () => void;
  reloadMessage: () => void;
  messageAuthor: string;
  currentUser: string;
  messageId: string;
};

export default function EditMessageForm({
  message,
  handleClose,
  currentUser,
  messageAuthor,
  messageId,
  reloadMessage,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  async function handleEditMessage(e: FormEvent) {
    e.preventDefault();
    const value = ref.current?.value;

    if (!value) return;

    try {
      if (value === message) {
        return toast.error('Previous message still same');
      }
      await editMessage(messageAuthor, currentUser, messageId, value).then(
        () => {
          handleClose();
          reloadMessage();
        },
      );
    } catch (error) {
      createError(error);
    }
  }
  return (
    <form onSubmit={handleEditMessage}>
      <Textarea
        ref={ref}
        minLength={1}
        name='message'
        defaultValue={message}
        rows={1}
        autoComplete='off'
        className='flex min-h-[30px] w-full max-w-full break-before-auto items-center whitespace-pre-wrap break-all !border-none bg-background px-3 pt-2 text-sm font-light text-white caret-white outline-none brightness-110 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse'
      />
      <div className='flex items-center gap-2 pt-1'>
        <button
          aria-label='cancel'
          name='cancel'
          title='cancel'
          className='text-xs text-red-600'
          type='button'
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          aria-label='submit'
          name='submit'
          title='submit'
          className='text-xs text-blue-600'
          type='submit'
        >
          Submit
        </button>
      </div>
    </form>
  );
}
