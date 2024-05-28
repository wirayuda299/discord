'use client';

import { z } from 'zod';
import { memo, useCallback, useEffect } from 'react';
import { X, SendHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';

import EmojiPickerButton from './emoji-picker';
import { cn } from '@/lib/utils/mergeStyle';
import { Form, FormControl, FormField, FormItem } from '../../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServerContext } from '@/providers/server';
import { User } from '@/types/user';
import useUploadFile from '@/hooks/useFileUpload';
import { messageData } from '@/helper/message';
import { revalidate } from '@/utils/cache';
import { createError } from '@/utils/error';
import { uploadFile } from '@/helper/file';
import { createThread } from '@/actions/threads';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from './fileUpload';
import usePermissions from '@/hooks/usePermissions';
import { useSocket } from '@/providers/socket-io';

type Props = {
	styles?: string;
	type: string;
	placeholder: string;
	reloadMessage: () => void;
	handleSelectUser?: (user: User | null) => void;
	threadName?: string;
};

type ImageRes = {
	publicId: string;
	url: string;
} | null;

const personalChatSchema = z.object({
	message: z.string().min(1, 'Please add message'),
	image: z.string().optional().nullable(),
});

function ChatForm({
	styles,
	threadName,
	placeholder,
	handleSelectUser,
	type,
	reloadMessage,
}: Props) {
	const { mutate } = useSWRConfig();
	const params = useParams();
	const searchParams = useSearchParams();
	const { userId } = useAuth();
	
	const form = useForm({
		resolver: zodResolver(personalChatSchema),
		defaultValues: {
			message: '',
			image: null,
		},
	});


	const { states } = useSocket();
	const { states: serverStates, updateState } = useServerContext();

	const conversationId = searchParams.get('conversationId') as string;
	const chat = searchParams.get('chat') as string;

	const { preview, files, handleChange } = useUploadFile(form);

	const isSubmitting = form.formState.isSubmitting;
	const isValid = form.formState.isValid;
	const { isError, loading, permissions, isCurrentUserBanned } = usePermissions(
		userId!!,
		params?.id as string
	);

	const appendEmojiToMessage = useCallback(
		(e: any) => {
			const current = form.getValues('message');
			form.setValue('message', (current + e.emoji) as any);
		},
		[form]
	);

	const onSubmit = async (data: z.infer<typeof personalChatSchema>) => {
		let image: ImageRes = null;

		try {
			if (files && files.image) {
				image = await uploadFile(files.image);
			}
		} catch (error) {
			createError(error);
			return;
		}
		// personal message
		if (type === 'personal' && !serverStates.selectedMessage) {
			const values = messageData({
				content: data.message,
				conversationId: searchParams.get('conversationId') as string,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				recipientId: searchParams.get('chat') as string,
				userId: userId!!,
				type: 'personal',
			});

			if (states.socket) {
				states.socket.emit('message', values);
			}
			revalidate('/direct-messages');
		}
		// reply of personal message
		if (
			type === 'personal' &&
			serverStates.selectedMessage &&
			serverStates.selectedMessage.message &&
			serverStates.selectedMessage.type === 'personal'
		) {
			const values = messageData({
				content: data.message,
				conversationId,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				recipientId: chat,
				userId: userId!!,
				type: 'reply',
				parentMessageId: serverStates.selectedMessage?.message.message_id!,
				messageId: serverStates.selectedMessage?.message.message_id!,
			});
			if (states.socket) {
				states.socket.emit('message', values);
			}
		}

		// common message in channel
		if (type === 'channel' && !serverStates.selectedMessage) {
			const values = messageData({
				content: data.message,
				conversationId: '',
				recipientId: '',
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				userId: userId!!,
				type: 'channel',
				channelId: params?.channel_id as string,
				serverId: params.id as string,
				username: serverStates.selectedServer?.serverProfile.username,
			});
			if (states.socket) {
				states.socket.emit('message', values);
			}
		}
		// reply message in channel
		if (
			type === 'channel' &&
			serverStates.selectedMessage &&
			serverStates.selectedMessage.message &&
			serverStates.selectedMessage.type === 'channel'
		) {
			const values = messageData({
				content: data.message,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				userId: userId!!,

				type: 'reply',
				channelId: params?.channelId as string,
				serverId: params?.serverId as string,
				username: serverStates.selectedServer?.serverProfile.username,
				parentMessageId: serverStates.selectedMessage?.message.message_id,
				messageId: serverStates.selectedMessage?.message.message_id,
			});
			if (states.socket) {
				states.socket.emit('message', values);
			}
		}

		// create thread
		if (
			serverStates.selectedMessage &&
			serverStates.selectedMessage.action === 'create_thread'
		) {
			if (!threadName) {
				toast.error('Thread name is required');
				return;
			}

			await createThread({
				channelId: params.channelId as string,
				message: data.message,
				msgId: serverStates.selectedMessage?.message?.message_id || '',
				threadName,
				userId: userId!!,
				imageAssetId: '',
				imageUrl: '',
			}).then(() => {
				toast.success('Thread has been created');
				mutate('all-threads');
			});
		}

		if (
			serverStates.selectedThread &&
			type === 'thread' &&
			!serverStates.selectedMessage
		) {
			const values = messageData({
				content: data.message,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				userId: userId!!,
				type: 'thread',
				channelId: params?.channelId as string,
				serverId: params.serverId as string,
				username: serverStates.selectedServer?.serverProfile.username,
				threadId: serverStates.selectedThread.thread_id,
			});
			if (states.socket) {
				states.socket.emit('message', values);
			}
		}

		if (
			serverStates.selectedThread &&
			serverStates.selectedMessage &&
			serverStates.selectedMessage?.type === 'thread' &&
			serverStates.selectedMessage.action === 'reply'
		) {
			const values = messageData({
				content: data.message,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				userId: userId!!,
				type: 'reply',
				channelId: params?.channelId as string,
				serverId: params.serverId as string,
				username: serverStates.selectedServer?.serverProfile.username,
				parentMessageId: serverStates.selectedMessage?.message.message_id,
				messageId: serverStates.selectedMessage?.message.message_id,
				threadId: serverStates.selectedThread.thread_id,
			});
			if (states.socket) {
				states.socket.emit('message', values);
			}
		}

		form.reset();
		reloadMessage();
		if (serverStates.selectedMessage) {
			resetSelectedMessage();
		}
	};

	const resetSelectedMessage = () => {
		updateState({
			selectedMessage: null,
		});
	};

	useEffect(() => {
		const q = searchParams.get('chat');
		if (!q) return;

		const user = localStorage.getItem(q as string);
		if (user) {
			if (handleSelectUser) {
				handleSelectUser(JSON.parse(user) as User);
			}
		}
	}, [handleSelectUser, searchParams]);

	const deleteImage = () => form.setValue('image', null);

	const image = form.watch('image');

	if (loading || isError) return null;
	if (isCurrentUserBanned) return <p className='text-center text-red-600'>You are banned </p>;
	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='relative w-full'>
				{serverStates.selectedMessage &&
					serverStates.selectedMessage.type === type &&
					serverStates.selectedMessage.action === 'reply' && (
						<div className='absolute -top-9 left-0 flex w-full items-center justify-between rounded-t-xl bg-[#2b2d31] p-2'>
							<p className='bottom-16 text-sm text-gray-2'>
								Replying to{' '}
								<span className='font-semibold text-gray-2 brightness-150'>
									{serverStates.selectedMessage.message &&
										serverStates.selectedMessage.message.username}
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
				<div
					className={cn(
						'flex items-center gap-2 border-t border-t-background rounded-sm bg-black py-[13.5px] w-full px-3 md:bg-[#383a40] ',
						styles
					)}
				>
					{type === 'personal' ? (
						<FileUpload
							deleteImage={deleteImage}
							handleChange={handleChange}
							image={image}
							isSubmitting={isSubmitting}
							preview={preview}
						/>
					) : (
						(serverStates.selectedServer?.owner_id === userId ||
							(permissions && permissions.attach_file)) && (
							<FileUpload
								deleteImage={deleteImage}
								handleChange={handleChange}
								image={image}
								isSubmitting={isSubmitting}
								preview={preview}
							/>
						)
					)}

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
										className='no-scrollbar flex max-h-[30px] min-h-[30px] w-full  max-w-[calc(100%-10px)] break-before-auto items-center overflow-y-auto whitespace-pre-wrap break-all rounded-full !border-none bg-background/20 px-3 pt-2 text-sm font-light text-white caret-white outline-none brightness-110 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse md:bg-transparent'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<EmojiPickerButton handleClick={appendEmojiToMessage} />
					<button
						type='submit'
						disabled={isSubmitting || !isValid}
						className='disabled:cursor-not-allowed disabled:opacity-60'
					>
						<SendHorizontal className='text-gray-2' />
					</button>
				</div>
			</form>
		</Form>
	);
}

export default memo(ChatForm);
