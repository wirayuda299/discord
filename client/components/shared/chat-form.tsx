'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, SendHorizontal } from 'lucide-react';
import { z } from 'zod';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Suspense, useState } from 'react';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSocketContext } from '@/providers/socket-io';
import Sticker from './stickers';
import { Message } from '@/types/messages';
import useUploadFile from '@/hooks/useFileUpload';
import { uploadFile } from '@/actions/file-upload';
import EmojiPickerButton from './emoji-picker';

const schema = z.object({
	author_id: z.string(),
	channel_id: z.string(),
	message: z.string().min(1),
	image: z.string().optional(),
});

export default function ChatForm({
	channelName,
	channelId,
}: {
	channelName: string;
	channelId: string;
}) {
	const { user } = useUser();
	const { userId } = useAuth();
	const { socket } = useSocketContext();
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			author_id: userId!!,
			channel_id: channelId,
			message: '',
			image: '',
		},
		resolver: zodResolver(schema),
	});
	const { files, handleChange, preview } = useUploadFile(form);

	const [selectedTenor, setSelectedTenor] = useState<{
		id: string;
		url: string;
	} | null>(null);

	const isSubmiting = form.formState.isSubmitting;

	async function onSubmit(data: z.infer<typeof schema>) {
		if (!socket) return;

		if (selectedTenor) {
			socket.emit('message', {
				channel_id: data.channel_id,
				content: data.message,
				created_at: new Date().toString(),
				email: user?.emailAddresses[0].emailAddress,
				image: user?.imageUrl,
				username: user?.username,
				image_url: selectedTenor.url,
				image_asset_id: selectedTenor.id,
				user_id: user?.id,
			} as Message);
		} else if (files && files.image) {
			const file = await uploadFile(files.image);

			if (!file) return;

			if (file?.url && file.publicId) {
				socket.emit('message', {
					channel_id: data.channel_id,
					content: data.message,
					created_at: new Date().toString(),
					email: user?.emailAddresses[0].emailAddress,
					image: user?.imageUrl,
					username: user?.username,
					image_url: file.url,
					image_asset_id: file.publicId,
					user_id: user?.id,
				} as Message);
			}
		} else {
			socket.emit('message', {
				channel_id: data.channel_id,
				content: data.message,
				created_at: new Date().toString(),
				email: user?.emailAddresses[0].emailAddress,
				image: user?.imageUrl,
				username: user?.username,
				image_url: '',
				image_asset_id: '',

				user_id: user?.id,
			} as Message);
		}
		form.resetField('message');
		form.setValue('image', '');
		setSelectedTenor(null);
	}

	const image = form.watch('image');

	return (
		<Form {...form}>
			<form
				className='flex w-full items-center px-3'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem className='w-full '>
							<FormControl className='w-full px-2 sm:px-5'>
								<div className='relative'>
									{(selectedTenor || (image && preview && preview.image)) && (
										<Suspense fallback={'loading...'}>
											<div className='relative w-max'>
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
												<button
													type='button'
													onClick={(e) => {
														setSelectedTenor(null);
														form.resetField('image');
													}}
													className='bg-main-foreground absolute right-0 top-0 rounded-full p-1'
												>
													<Cross2Icon />
												</button>
											</div>
										</Suspense>
									)}
									<div className='relative flex w-full items-center gap-4  bg-black/10 p-2 brightness-125'>
										<label
											title='Upload image'
											htmlFor='image-upload'
											className='flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-full bg-[#b5bac1]'
										>
											<Plus stroke='#000' size={18} />
										</label>
										<input
											onChange={(e) => handleChange(e, 'image')}
											type='file'
											name='file'
											id='image-upload'
											className='hidden'
										/>
										<Input
											autoComplete='off'
											placeholder={`Message #${channelName}`}
											className='placeholder:text-gray-1 border-none !bg-transparent ring-offset-[[var(--primary)]] focus:border-none focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
											required
											aria-disabled={isSubmiting}
											disabled={isSubmiting}
											{...field}
										/>
										<Sticker setSelectedTenor={setSelectedTenor} />
										<EmojiPickerButton form={form} />
										<button
											type='submit'
											aria-disabled={isSubmiting}
											disabled={isSubmiting}
										>
											<SendHorizontal size={20} className='text-gray-400' />
										</button>
									</div>
									<FormMessage />
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
