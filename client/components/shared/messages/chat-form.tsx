'use client';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Dispatch, SetStateAction, memo, useEffect, useMemo } from 'react';
import { X, SendHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import type { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';

import EmojiPickerButton from './emoji-picker';
import { cn } from '@/lib/utils/mergeStyle';
import { Form, FormControl, FormField, FormItem } from '../../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServerStates } from '@/providers/server';
import { User } from '@/types/user';
import useUploadFile from '@/hooks/useFileUpload';
import { messageData } from '@/helper/message';
import { revalidate } from '@/utils/cache';
import { createError } from '@/utils/error';
import { uploadFile } from '@/helper/file';
import { createThread } from '@/actions/threads';
import { Textarea } from '@/components/ui/textarea';
import { SocketStates } from '@/types/socket-states';
import FileUpload from './fileUpload';

type Props = {
	styles?: string;
	socket: Socket | null;
	userId: string;
	type: string;
	placeholder: string;
	params: Params;
	socketStates: SocketStates;
	searchParams: ReadonlyURLSearchParams;
	serverStates: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
	handleSelectUser?: (user: User | null) => void;
	reloadMessage: () => void;
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
	serverStates,
	placeholder,
	setServerStates,
	handleSelectUser,
	socket,
	type,
	params,
	searchParams,
	userId,
	reloadMessage,
	socketStates,
}: Props) {
	const form = useForm({
		resolver: zodResolver(personalChatSchema),
		defaultValues: {
			message: '',
			image: null,
		},
	});
	const { mutate } = useSWRConfig();
	const { selectedMessage, selectedThread, selectedServer } = useMemo(
		() => serverStates,
		[serverStates]
	);

	const { preview, files, handleChange } = useUploadFile(form);

	const isSubmitting = form.formState.isSubmitting;
	const isValid = form.formState.isValid;

	const appendEmojiToMessage = (e: any) => {
		const current = form.getValues('message');
		form.setValue('message', (current + e.emoji) as any);
	};

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
		if (type === 'personal' && !selectedMessage) {
			const values = messageData({
				content: data.message,
				conversationId: searchParams.get('conversationId') as string,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				recipientId: searchParams.get('chat') as string,
				userId,
				type: 'personal',
			});

			if (socket) {
				socket.emit('message', values);
			}
			revalidate('/direct-messages');
		}
		// reply of personal message
		if (
			type === 'personal' &&
			selectedMessage &&
			selectedMessage.message &&
			selectedMessage.type === 'personal'
		) {
			const values = messageData({
				content: data.message,
				conversationId: searchParams.get('conversationId') as string,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				recipientId: searchParams.get('chat') as string,
				userId,
				type: 'reply',
				parentMessageId: selectedMessage?.message.message_id!,
				messageId: selectedMessage?.message.message_id!,
			});
			if (socket) {
				socket.emit('message', values);
			}
		}

		// common message in channel
		if (type === 'channel' && !selectedMessage) {
			const values = messageData({
				content: data.message,
				conversationId: '',
				recipientId: '',
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				userId,
				type: 'channel',
				channelId: params?.channelId as string,
				serverId: params.serverId as string,
				username: serverStates.selectedServer?.serverProfile.username,
			});
			if (socket) {
				socket.emit('message', values);
			}
		}
		// reply message in channel
		if (
			type === 'channel' &&
			selectedMessage &&
			selectedMessage.message &&
			selectedMessage.type === 'channel'
		) {
			const values = messageData({
				content: data.message,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				userId,
				type: 'reply',
				channelId: params?.channel_id as string,
				serverId: params.serverId as string,
				username: serverStates.selectedServer?.serverProfile.username,
				parentMessageId: selectedMessage?.message.message_id,
				messageId: selectedMessage?.message.message_id,
			});
			if (socket) {
				socket.emit('message', values);
			}
		}

		// create thread
		if (selectedMessage && selectedMessage.action === 'create_thread') {
			if (!threadName) {
				toast.error('Thread name is required');
				return;
			}

			await createThread({
				channelId: params.channelId as string,
				message: data.message,
				msgId: selectedMessage?.message?.message_id || '',
				threadName,
				userId,
				imageAssetId: '',
				imageUrl: '',
			}).then(() => {
				toast.success('Thread has been created');
				mutate('all-threads');
			});
		}

		if (selectedThread && type === 'thread' && !selectedMessage) {
			const values = messageData({
				content: data.message,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				userId,
				type: 'thread',
				channelId: params?.channel_id as string,
				serverId: params.serverId as string,
				username: serverStates.selectedServer?.serverProfile.username,
				threadId: selectedThread.thread_id,
			});
			if (socket) {
				socket.emit('message', values);
			}
		}

		if (
			selectedThread &&
			selectedMessage &&
			selectedMessage?.type === 'thread' &&
			selectedMessage.action === 'reply'
		) {
			const values = messageData({
				content: data.message,
				imageAssetId: image?.publicId || '',
				imageUrl: image?.url || '',
				userId,
				type: 'reply',
				channelId: params?.channel_id as string,
				serverId: params.serverId as string,
				username: serverStates.selectedServer?.serverProfile.username,
				parentMessageId: selectedMessage?.message.message_id,
				messageId: selectedMessage?.message.message_id,
				threadId: selectedThread?.thread_id,
			});
			if (socket) {
				socket.emit('message', values);
			}
		}

		form.reset();
		reloadMessage();
		if (selectedMessage) {
			resetSelectedMessage();
		}
	};

	const resetSelectedMessage = () => {
		setServerStates((prev) => ({ ...prev, selectedMessage: null }));
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

	const deleteImage = () => {
		form.setValue('image', null);
	};

	const image = form.watch('image');

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='relative w-full'>
				{selectedMessage &&
					selectedMessage.type === type &&
					selectedMessage.action === 'reply' && (
						<div className='absolute -top-9 left-0 flex w-full items-center justify-between rounded-t-xl bg-[#2b2d31] p-2'>
							<p className='bottom-16 text-sm text-gray-2'>
								Replying to{' '}
								<span className='font-semibold text-gray-2 brightness-150'>
									{selectedMessage.message && selectedMessage.message.username}
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
						(selectedServer?.owner_id === userId ||
							(socketStates.user_roles &&
								socketStates.user_roles.attach_file)) && (
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
