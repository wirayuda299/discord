import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { KeyedMutator } from 'swr';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { updateUser } from '@/helper/user';
import useUploadFile from '@/hooks/useFileUpload';
import { deleteImage, uploadFile } from '@/helper/file';
import { User } from '@/types/user';
import { ServerProfile } from '@/types/server';
import { getCookies } from '@/helper/cookies';
import { updateServerProfile } from '@/helper/server';

const schema = z.object({
	username: z.string().min(4),
	bio: z.string().optional(),
	avatar: z.string(),
});

export default function UserUpdateForm({
	selectedOption,
	user,
	serverProfile,
	mutate,
}: {
	user: User;
	serverProfile: ServerProfile;
	selectedOption: string;
	mutate: KeyedMutator<User | ServerProfile>;
}) {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			username:
				selectedOption === 'user' ? user.username : serverProfile.username,
			avatar: selectedOption === 'user' ? user.image : serverProfile.avatar,
			bio: (selectedOption === 'user' ? user.bio : serverProfile.bio) ?? '',
		},
	});
	const { user: currentUser, isLoaded, isSignedIn } = useUser();

	const { handleChange, preview, files, setFiles, setPreview } =
		useUploadFile(form);

	const data = form.watch();
	const isSubmitting = form.formState.isSubmitting;

	useEffect(() => {
		if (!user || !serverProfile) return;

		if (!isSubmitting) {
			setFiles(null);
			setPreview(null);
		}

		if (selectedOption === 'user') {
			form.setValue('username', user.username);
			form.setValue('bio', user.bio);
			form.setValue('avatar', user?.image);
		} else {
			form.setValue('username', serverProfile.username);
			form.setValue('bio', serverProfile.bio ?? '');
			form.setValue('avatar', serverProfile.avatar);
		}
	}, [
		form,
		isSubmitting,
		selectedOption,
		serverProfile,
		setFiles,
		setPreview,
		user,
		user.bio,
		user?.image,
		user.username,
	]);

	if (!isLoaded || !isSignedIn) return null;

	async function onSubmit(data: z.infer<typeof schema>) {
		if (!currentUser) return;

		try {
			const cookies = await getCookies();
			if (selectedOption === 'user') {
				if (files && files.avatar) {
					await deleteImage(user?.image_asset_id);
					await currentUser?.setProfileImage({ file: files.avatar });
					const file = await uploadFile(files?.avatar);
					await updateUser(
						data.username,
						data.bio ?? '',
						currentUser.id ?? '',
						file?.url,
						file?.publicId
					);
				} else {
					await currentUser?.update({ username: data.username });
					await updateUser(
						data.username,
						data.bio ?? '',
						currentUser?.id,
						cookies
					);
				}

				toast.success('User updated');
				// @ts-ignore
				mutate('user');
				await currentUser?.reload();
			}

			if (selectedOption === 'server') {
				if (files && files.avatar) {
					if (serverProfile) {
						await deleteImage(serverProfile?.avatar_asset_id!!);
					}
					const file = await uploadFile(files?.avatar);

					await updateServerProfile(
						serverProfile.server_id,
						serverProfile.user_id,
						data.username,
						file?.url,
						file?.publicId,
						data.bio ?? ''
					);
				} else {
					await updateServerProfile(
						serverProfile.server_id,
						serverProfile.user_id,
						data.username,
						data.avatar,
						'',
						data.bio ?? ''
					);
				}
				toast.success('Server profile updated');
				// @ts-ignore
				mutate('server-profile');
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Unknown error');
			}
		}
	}

	return (
		<div className='grid w-full gap-5 py-5 md:grid-cols-1 lg:grid-cols-2'>
			<Form {...form}>
				<form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<div>
										<Input
											{...field}
											placeholder='username'
											className='bg-foreground placeholder:text-gray-2 w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='bio'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<div>
										<Input
											{...field}
											placeholder='Add bio'
											className='bg-foreground placeholder:text-gray-2 w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Avatar</FormLabel>
								<FormControl>
									<div>
										<Label
											htmlFor='avatar'
											className='bg-primary mt-1 rounded-md p-3'
										>
											Change avatar
										</Label>
										<Input
											onChange={(e) => handleChange(e, 'avatar')}
											name='file'
											id='avatar'
											type='file'
											className='bg-foreground placeholder:text-gray-2 hidden w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Avatar Decoration</FormLabel>
								<FormControl>
									<div>
										<Label htmlFor='avatar'>
											<Button>Change decoration</Button>
										</Label>
										<Input
											name='file'
											id='avatar'
											type='file'
											className='bg-foreground placeholder:text-gray-2 hidden w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Profile effect</FormLabel>
								<FormControl>
									<div>
										<Label htmlFor='avatar'>
											<Button>Change effect</Button>
										</Label>
										<Input
											name='file'
											id='avatar'
											type='file'
											className='bg-foreground placeholder:text-gray-2 hidden w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='border-b-foreground border-b'>
								<FormLabel>Avatar Decoration</FormLabel>
								<FormControl>
									<div>
										<Label htmlFor='avatar'>
											<Button>Change decoration</Button>
										</Label>
										<Input
											name='file'
											id='avatar'
											type='file'
											className='bg-foreground placeholder:text-gray-2 hidden w-full rounded border-none p-3 shadow-none placeholder:text-sm placeholder:capitalize focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<div className='bg-gray-1 mt-7 h-px w-full rounded-full'></div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<Button disabled={isSubmitting} type='submit'>
						Update
					</Button>
				</form>
			</Form>
			<div className='h-max rounded-lg bg-[#1E1F22]'>
				<div className='h-20 w-full rounded-t-md bg-black'></div>
				<div className='flex items-center justify-between px-5'>
					{selectedOption === 'user' ? (
						<Image
							className='border-background aspect-auto min-h-[90px] w-[90px] min-w-[90px] -translate-y-5 rounded-full border-4 object-cover'
							src={preview && preview.avatar ? preview?.avatar : data.avatar}
							width={90}
							height={90}
							alt='user'
						/>
					) : (
						<Image
							className='border-background aspect-auto min-h-[90px] w-[90px] min-w-[90px] -translate-y-5 rounded-full border-4 object-cover'
							src={preview && preview.avatar ? preview?.avatar : data.avatar}
							width={90}
							height={90}
							alt='user'
						/>
					)}
					<div className='aspect-square size-8 rounded-md bg-black p-1'>
						<div className='size-full rounded-md bg-green-600 text-center'>
							#
						</div>
					</div>
				</div>
				<div className='w-full p-3'>
					<div className='w-full rounded-md bg-black p-5 '>
						<div className='border-b-foreground border-b  pb-4'>
							<h3 className='text-wrap break-words text-sm font-semibold'>
								{data.username}
							</h3>
							<p className='text-wrap break-words text-sm'>{data.bio}</p>
						</div>
						<div className='pt-3'>
							<h4 className='text-xs font-semibold uppercase'>
								Customizing user profile
							</h4>
							<div className='flex items-center gap-3'>
								<div className='mt-2 w-max rounded-md bg-blue-600 p-2'>
									<Image
										src={'/images/pencil.png'}
										width={50}
										height={50}
										alt='pencil'
									/>
								</div>
								<div>
									<h5 className='text-sm font-semibold'>User profile</h5>
								</div>
							</div>
							<Button className='mt-3 w-full !bg-[#4e5058]'>
								Example button
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
