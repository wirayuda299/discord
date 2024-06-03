'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { SendHorizontal, X } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useParams, useSearchParams } from 'next/navigation';

import { Form, FormControl, FormField, FormItem } from '../ui/form';
import FileUpload from './file-upload';
import { Textarea } from '../ui/textarea';
import { useMessage } from '@/providers/message';
import { messageData } from '@/utils/messages';
import { useSocketState } from '@/providers/socket-io';
import EmojiPicker from './emoji-picker';
import useUploadFile from '@/hooks/useFileUpload';
import { uploadFile } from '@/helper/file';
import { useServerContext } from '@/providers/servers';

const chatSchema = z.object({
  message: z.string().min(1, 'Please add message'),
  image: z.string().optional().nullable(),
});

type Props = {
  placeholder: string;
  type: string;
  reloadMessage: () => void;
};

export default function ChatForm({ placeholder, type, reloadMessage }: Props) {
  const { userId } = useAuth();
  const socket = useSocketState('socket');
  const thread = useServerContext('selectedThread');
  const searchParams = useSearchParams();
  const params = useParams();

  const { state, setMessage } = useMessage();

  const form = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
      image: null,
    },
  });
  const { handleChange, preview, files } = useUploadFile(form);

  const deleteImage = useCallback(() => form.setValue('image', null), []);

  const appendEmoji = useCallback(() => {
    (emoji: string) =>
      form.setValue('message', form.getValues('message') + emoji);
  }, []);

  const resetSelectedMessage = () => setMessage(null);

  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;
  const image = form.watch('image');

  const onSubmit = async (data: z.infer<typeof chatSchema>) => {
    if (!socket) return;
    let attachment: { publicId: string; url: string } | null = null;

    if (image && files && files.image) {
      attachment = await uploadFile(files.image);
    }

    // general personal message
    if (type === 'personal' && !state?.message) {
      const values = messageData({
        content: data.message,
        imageAssetId: attachment ? attachment?.publicId : '',
        imageUrl: attachment ? attachment?.url : '',
        type: 'personal',
        userId: userId as string,
        recipientId: searchParams.get('userId') as string,
        conversationId: searchParams.get('conversationId') as string,
      });
      if (socket) {
        socket?.emit('message', values);
      }
    }

    // reply personal message
    if (
      type === 'personal' &&
      state?.message &&
      state.type === type &&
      state.action === 'reply'
    ) {
      const values = messageData({
        content: data.message,
        imageAssetId: attachment ? attachment?.publicId : '',
        imageUrl: attachment ? attachment?.url : '',
        type: 'reply',
        parentMessageId: state.message.message_id,
        messageId: state.message.message_id,
        userId: userId as string,
        recipientId: searchParams.get('userId') as string,
        conversationId: searchParams.get('conversationId') as string,
      });
      if (socket) {
        socket?.emit('message', values);
        resetSelectedMessage();
      }
    }

    //common message in channel
    if (type === 'channel' && !state?.message) {
      const values = messageData({
        content: data.message,
        imageAssetId: attachment ? attachment?.publicId : '',
        imageUrl: attachment ? attachment?.url : '',
        type: 'channel',
        userId: userId as string,
        channelId: params.channel_id as string,
        serverId: params.id as string,
      });
      if (socket) {
        socket?.emit('message', values);
      }
    }

    // reply message in channel
    if (
      type === 'channel' &&
      state?.message &&
      state.type === type &&
      state.action === 'reply'
    ) {
      const values = messageData({
        content: data.message,
        imageAssetId: attachment ? attachment?.publicId : '',
        imageUrl: attachment ? attachment?.url : '',
        type: 'reply',
        parentMessageId: state.message.message_id,
        messageId: state.message.message_id,
        userId: userId as string,
        channelId: params.channel_id as string,
        serverId: params.id as string,
      });
      if (socket) {
        socket?.emit('message', values);
        resetSelectedMessage();
      }
    }

    if (thread && type === 'thread' && !state?.message) {
      const values = messageData({
        content: data.message,
        imageAssetId: attachment?.publicId || '',
        imageUrl: attachment?.url || '',
        userId: userId!!,
        type: 'thread',
        channelId: params?.channel_id as string,
        serverId: params?.id as string,
        threadId: thread.thread_id,
      });
      if (socket) {
        socket.emit('message', values);
        reloadMessage();
      }
    }
    form.reset();
    reloadMessage();
  };

  return (
    <>
      {state &&
        state.message &&
        state.action === 'reply' &&
        state.type === type && (
          <div className='flex w-full items-center justify-between rounded-t-xl bg-background/50 p-2 md:bg-[#2b2d31]'>
            <p className='bottom-16 text-sm text-gray-2'>
              Replying to{' '}
              <span className='font-semibold text-gray-2 brightness-150'>
                {state.message && state.message.username}
              </span>
            </p>
            <button
              className='flex size-5 items-center justify-center rounded-full bg-gray-2'
              onClick={resetSelectedMessage}
            >
              <X size={15} className='mx-auto text-gray-1' />
            </button>
          </div>
        )}
      <Form {...form}>
        <form
          className='flex-center h-16 gap-2 rounded-lg border-background bg-black p-3 md:bg-foreground md:brightness-125'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FileUpload
            deleteImage={deleteImage}
            form={form}
            preview={preview}
            handleChange={handleChange}
            // @ts-ignore
            image={image}
            isSubmitting={isSubmitting}
          />

          <FormField
            name={'message'}
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl className='w-full'>
                  <Textarea
                    rows={1}
                    cols={1}
                    {...field}
                    autoFocus
                    aria-disabled={isSubmitting}
                    disabled={isSubmitting}
                    placeholder={placeholder}
                    autoComplete='off'
                    className='no-scrollbar min-h-[30px] w-full max-w-[calc(100%-10px)] break-before-auto rounded-full !border-none bg-background/20 px-3 pt-2 text-base font-light text-white caret-white outline-none brightness-110 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse md:bg-transparent'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <EmojiPicker appendEmoji={appendEmoji} />

          <button
            aria-label='send'
            name='send'
            title='send'
            type='submit'
            disabled={isSubmitting || !isValid}
            className='disabled:cursor-not-allowed disabled:opacity-60'
          >
            <SendHorizontal className='text-gray-2' />
          </button>
        </form>
      </Form>
    </>
  );
}
