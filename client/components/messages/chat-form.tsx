'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Suspense, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { X, Plus, SendHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import useUploadFile from '@/hooks/useFileUpload';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import EmojiPickerButton from './emoji-picker';
import { Textarea } from '../ui/textarea';
import { useSocketContext } from '@/providers/socket-io';
import { uploadFile } from '@/helper/file';
import { ServerStates } from '@/providers/server';
import { MessageData } from '@/types/messages';
import { ChatSchema, chatSchema } from '@/validations';
import { createError } from '@/utils/error';
import Link from 'next/link';
import { createThread } from '@/actions/threads';

export default function ChatForm({
	styles,
	serverStates,
	setServerStates,
}: {
	styles?: string;
	serverStates: ServerStates;
	setServerStates: Dispatch<SetStateAction<ServerStates>>;
}) {
	const params = useParams();
	const { selectedServer, selectedChannel, selectedMessage } = serverStates;

	const form = useForm<ChatSchema>({
		defaultValues: {
			author_id: selectedServer ? selectedServer?.serverProfile.user_id : '',
			channel_id: selectedChannel ? selectedChannel.channel_id : '',
			message: '',
			image: '',
		},
		resolver: zodResolver(chatSchema),
	});
	const { socket } = useSocketContext();
	const searchParams = useSearchParams();
	const { handleChange, preview, files } = useUploadFile(form);

	const [selectedTenor, setSelectedTenor] = useState<{
		id: string;
		url: string;
	} | null>(null);

	async function onSubmit(data: ChatSchema) {
		try {
			let image: { publicId: string; url: string } | null = null;

			if (files && files.image) {
				image = await uploadFile(files.image);
			}
			const type = searchParams.get('type');
			if (type === 'thread') {
				await createThread(
					selectedMessage?.reply_id
						? selectedMessage.reply_id!
						: selectedMessage?.message_id!,
					selectedServer ? selectedServer?.serverProfile.user_id : '',
					''
				);
			} else if (type === 'reply') {
				const messageData: MessageData = {
					content: data.message.trim(),
					is_read: false,
					user_id: selectedServer?.serverProfile.user_id,
					username: selectedServer?.serverProfile.username,
					channel_id: params.slug[2],
					server_id: params.slug[1],
					image_url: image?.url ?? '',
					image_asset_id: image?.publicId ?? '',
					avatar: selectedServer?.serverProfile.avatar,
					type: 'reply',
					messageId: selectedMessage?.reply_id || selectedMessage?.message_id,
				};
				socket?.emit('message', messageData);
			} else {
				const messageData: MessageData = {
					content: data.message.trim(),
					is_read: false,
					user_id: selectedServer?.serverProfile.user_id,
					username: selectedServer?.serverProfile.username,
					channel_id: params.slug[2],
					server_id: params.slug[1],
					image_url: image?.url ?? '',
					image_asset_id: image?.publicId ?? '',
					avatar: selectedServer?.serverProfile.avatar,
					type: 'common',
					messageId: crypto.randomUUID(),
				};
				socket?.emit('message', messageData);
			}

			resetForm();
		} catch (error) {
			createError(error);
		}
	}

	useEffect(() => {
		if (selectedChannel) {
			form.setValue('channel_id', params.slug[2]);
		}
	}, [params]);

	const appendEmojiToMessage = (e: any) => {
		const current = form.getValues('message');
		form.setValue('message', current + e.emoji);
	};

	function resetForm() {
		form.resetField('message');
		form.setValue('image', '');
		setSelectedTenor(null);
		setServerStates((prev) => ({
			...prev,
			selectedMessage: null,
		}));
	}

	const deleteImage = () => {
		setSelectedTenor(null);
		form.setValue('image', '');
	};

	const image = form.watch('image');
	const isSubmitting = form.formState.isSubmitting;
	const isValid = form.formState.isValid;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='relative w-full'>
				{selectedMessage && searchParams.get('type') === 'reply' && (
					<div className='absolute -top-9 left-0 flex w-full items-center justify-between rounded-t-xl bg-[#2b2d31] p-2'>
						<p className='text-gray-2 bottom-16 text-sm'>
							Replying to{' '}
							<span className='text-gray-2 font-semibold brightness-150'>
								{selectedMessage.author_name}
							</span>
						</p>
						<Link
							href={`/server/${serverStates.selectedServer?.id}/${selectedChannel?.channel_id}`}
							className='bg-gray-2 size-5 rounded-full'
							onClick={() => {
								setServerStates((prev) => ({
									...prev,
									selectedMessage: null,
								}));
							}}
						>
							<X size={15} className='text-gray-1 mx-auto' />
						</Link>
					</div>
				)}
				<div
					className={cn(
						'flex items-center gap-2 border-t border-t-background rounded-sm bg-black py-[13.5px] w-full px-3 md:bg-[#383a40] ',
						styles
					)}
				>
					<FormField
						control={form.control}
						name='message'
						render={({ field }) => (
							<FormItem className=' '>
								<FormControl className='w-full px-2 '>
									<div className='relative'>
										{(selectedTenor || (image && preview && preview.image)) && (
											<Suspense fallback={'loading...'}>
												<div className='absolute -top-32 w-max'>
													<Image
														className='aspect-square rounded-md object-cover '
														priority
														src={
															selectedTenor?.url || (preview && preview?.image)!
														}
														width={100}
														height={100}
														alt='image'
													/>
													{!isSubmitting && (
														<button
															type='button'
															onClick={deleteImage}
															className='absolute -right-4 -top-3 min-h-5 min-w-5 rounded-full border bg-white p-1'
														>
															<X className='text-sm text-red-600' size={18} />
														</button>
													)}
												</div>
											</Suspense>
										)}
										<label
											aria-disabled={isSubmitting}
											title='Upload image'
											htmlFor='image-upload'
											className='bg-background md:bg-gray-2 flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-full md:h-7 md:min-h-7 md:min-w-7 md:p-1'
										>
											<Plus className='text-gray-2 md:text-foreground text-base md:text-lg' />
										</label>
										<input
											disabled={isSubmitting}
											onChange={(e) => handleChange(e, 'image')}
											type='file'
											name='file'
											id='image-upload'
											className='hidden'
										/>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						name='message'
						control={form.control}
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl className='w-full'>
									<Textarea
										{...field}
										rows={1}
										disabled={isSubmitting}
										placeholder={`Message #${selectedChannel?.channel_name}`}
										autoComplete='off'
										className='bg-background/20 flex min-h-[30px] w-full  max-w-full  break-before-auto items-center whitespace-pre-wrap break-all rounded-full !border-none px-3 pt-2 text-sm font-light text-white caret-white outline-none brightness-110 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse md:bg-transparent'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<EmojiPickerButton handleClick={appendEmojiToMessage} />
					<button
						type='submit'
						disabled={isSubmitting || !isValid}
						className='disabled:cursor-not-allowed'
					>
						<SendHorizontal className='text-gray-2' />
					</button>
				</div>
			</form>
		</Form>
	);
}
