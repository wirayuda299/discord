
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { SendHorizontal, X } from 'lucide-react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs'


import { Form, FormControl, FormField, FormItem } from '../ui/form';
import FileUpload from './file-upload';
import { messageData } from '@/utils/messages';
import EmojiPicker from './emoji-picker';
import useUploadFile from '@/hooks/useFileUpload';
import {
  useSelectedMessageStore,
  useServerStates,
  useSocketStore,
} from '@/providers';
import { Input } from '../ui/input';
import { revalidate } from '@/utils/cache';
import { usePermissionsContext } from '@/providers/permissions';

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
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { permission, errors, loading, server } =
    usePermissionsContext();
  const { userId } = useAuth()
  const thread = useServerStates((state) => state.selectedThread);
  const socket = useSocketStore((state) => state.socket);
  const recipientId = searchParams.get('userId') as string;
  const conversationId = searchParams.get('conversationId') as string;

  const { selectedMessage, setMessage } = useSelectedMessageStore((state) => ({
    selectedMessage: state.selectedMessage,
    setMessage: state.setSelectedMessage,
  }));

  const form = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
      image: null,
    },
  });
  const { handleChange, preview, files } = useUploadFile(form);

  const deleteImage = () => form.setValue('image', null);

  const appendEmoji = useCallback(() => {
    (emoji: string) =>
      form.setValue('message', form.getValues('message') + emoji);
  }, [form]);

  const resetSelectedMessage = useCallback(
    () => setMessage(null),
    [setMessage],
  );

  const image = form.watch('image');
  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  const onSubmit = async (data: z.infer<typeof chatSchema>) => {
    if (!userId) return

    let attachment: { publicId: string; url: string } | null = null;

    if (image && files && files.image) {
      const { uploadFile } = await import('@/helper/file');

      attachment = await uploadFile(files.image);
    }

    // general personal message
    if (type === 'personal' && !selectedMessage?.message) {
      const values = messageData({
        content: data.message,
        imageAssetId: attachment ? attachment?.publicId : '',
        imageUrl: attachment ? attachment?.url : '',
        type: 'personal',
        userId: userId as string,
        recipientId,
        conversationId,
      });
      if (socket) {
        socket?.emit('message', values);
        revalidate(pathname);
      }
    }

    // reply personal message
    if (
      type === 'personal' &&
      selectedMessage?.message &&
      selectedMessage.type === type &&
      selectedMessage.action === 'reply'
    ) {
      const values = messageData({
        content: data.message,
        imageAssetId: attachment ? attachment?.publicId : '',
        imageUrl: attachment ? attachment?.url : '',
        type: 'reply',
        parentMessageId: selectedMessage.message.message_id,
        messageId: selectedMessage.message.message_id,
        userId: userId as string,
        recipientId,
        conversationId,
      });
      if (socket) {
        socket?.emit('message', values);
      }
    }

    //common message in channel
    if (type === 'channel' && !selectedMessage?.message) {
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
      selectedMessage?.message &&
      selectedMessage.type === type &&
      selectedMessage.action === 'reply'
    ) {
      const values = messageData({
        content: data.message,
        imageAssetId: attachment ? attachment?.publicId : '',
        imageUrl: attachment ? attachment?.url : '',
        type: 'reply',
        parentMessageId: selectedMessage.message.message_id,
        messageId: selectedMessage.message.message_id,
        userId: userId as string,
        channelId: params.channel_id as string,
        serverId: params.id as string,
      });
      if (socket) {
        socket?.emit('message', values);
      }
    }

    if (thread && type === 'thread' && !selectedMessage?.message) {
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
      }
    }
    reloadMessage();
    form.reset();
    if (selectedMessage) {
      resetSelectedMessage();
    }
  };
  const shouldShowFileUpload =
    type === 'personal' ||
    (server && server.owner_id === userId) ||
    (permission && permission.attach_file);

  if (loading || errors) return null;


  return (
    <>
      {selectedMessage &&
        selectedMessage.message &&
        selectedMessage.action === 'reply' &&
        selectedMessage.type === type && (
          <div className='flex w-full items-center justify-between rounded-t-xl bg-background/50 md:bg-[#2b2d31] md:p-2'>
            <p className='bottom-16 text-sm text-gray-2'>
              Replying to{' '}
              <span className='font-semibold text-gray-2 brightness-150'>
                {selectedMessage.message && selectedMessage.message.username}
              </span>
            </p>
            <button
              aria-label='delete'
              name='delete'
              title='delete'
              className='flex size-5 items-center justify-center rounded-full bg-gray-2'
              onClick={resetSelectedMessage}
            >
              <X size={15} className='mx-auto text-gray-1' />
            </button>
          </div>
        )}
      <Form {...form}>
        <form
          className='flex-center h-16 gap-1 rounded-lg border-t border-background bg-black md:gap-2 md:bg-foreground md:p-3 md:brightness-125 '
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {shouldShowFileUpload && (
            <FileUpload
              key={preview && preview.image}
              deleteImage={deleteImage}
              form={form}
              preview={preview}
              handleChange={handleChange}
              // @ts-ignore
              image={image}
              isSubmitting={isSubmitting}
            />
          )}

          <FormField
            name={'message'}
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl className='w-full'>
                  <Input
                    {...field}
                    autoFocus
                    aria-disabled={isSubmitting}
                    disabled={isSubmitting}
                    placeholder={placeholder}
                    autoComplete='off'
                    className='no-scrollbar h-8 w-full break-before-auto rounded-full !border-none bg-background/50 px-3 pt-2 text-base font-light text-white caret-white outline-none brightness-110 placeholder:text-sm focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse md:bg-transparent'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <EmojiPicker appendEmoji={appendEmoji} />

          <button
            onClick={(e) => e.stopPropagation()}
            aria-label='send'
            name='send'
            title='send'
            type='submit'
            disabled={isSubmitting || !isValid}
          >
            <SendHorizontal className='text-gray-2' />
          </button>
        </form>
      </Form>
    </>
  );
}
