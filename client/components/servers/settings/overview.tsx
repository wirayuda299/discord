import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Form, FormControl, FormField, FormItem } from '../../ui/form';
import useUploadFile from '@/hooks/useFileUpload';
import { Button } from '../../ui/button';
import { deleteImage, uploadFile } from '@/helper/file';
import { updateServer } from '@/helper/server';
import { UpdateServerSchemaType, updateServerSchema } from '@/validations';
import { createError } from '@/utils/error';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { SquarePen } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function ServerOverview({
	logo,
	name,
	logoAssetId,
	serverId,
}: {
	logo: string;
	logoAssetId: string;
	name: string;
	serverId: string;
}) {
	const { userId } = useAuth();
	const form = useForm<UpdateServerSchemaType>({
		resolver: zodResolver(updateServerSchema),
		defaultValues: {
			logo,
			name,
		},
	});
	const { handleChange, preview, files } = useUploadFile(form);

	const image = form.watch('logo');
	const isValid = form.formState.isValid;
	const isSubmitting = form.formState.isSubmitting;
	const isEdited = form.formState.isDirty;

	console.log(form.formState.dirtyFields);

	async function onSubmit(data: UpdateServerSchemaType) {
		try {
			if (!userId) return;

			if (files && files.logo) {
				const [, file] = await Promise.all([
					deleteImage(logoAssetId),
					await uploadFile(files.logo),
				]);
				await updateServer(
					serverId,
					data.name,
					file.url,
					file.publicId,
					userId
				).then(() => {
					toast.success('Server has been updated');
				});
			} else {
				await updateServer(
					serverId,
					data.name,
					logo,
					logoAssetId,
					userId as string
				).then(() => {
					toast.success('Server has been updated');
				});
			}
		} catch (error) {
			createError(error);
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='relative flex flex-col gap-3'
			>
				<div className='grid grid-cols-2 justify-between gap-5 border-b border-gray-500 pb-5 max-lg:grid-cols-1'>
					<div className='min-w-90 flex w-full max-w-sm gap-5'>
						<input
							onChange={(e) => handleChange(e, 'logo')}
							type='file'
							name='file'
							id='logo'
							className='hidden'
						/>

						<div className='relative w-min'>
							<Label
								htmlFor='logo'
								className='!relative my-2 w-min cursor-pointer '
							>
								{(image || (preview && preview.logo)) && (
									<Image
										className='aspect-auto size-24 min-h-24 min-w-24 rounded-full object-cover'
										src={form.getValues('logo') || preview?.logo || ''}
										width={100}
										priority
										height={100}
										alt='logo'
									/>
								)}
								<div className='absolute right-0 top-0 flex size-7 items-center justify-center rounded-full bg-gray-2'>
									<SquarePen size={16} className='text-gray-1' />
								</div>
							</Label>
						</div>

						<div className='flex flex-col gap-2 '>
							<p className=' text-sm font-light text-gray-2'>
								We recommend an image of at least 512x512 for the server.
							</p>
							<Label
								htmlFor='logo'
								className=' w-max cursor-pointer whitespace-nowrap rounded border border-gray-2 p-3 text-xs font-light'
							>
								Upload image
							</Label>
						</div>
					</div>

					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className=''>
								<FormControl className=''>
									<>
										<Label
											htmlFor='server-name'
											className='my-1 block text-sm uppercase text-gray-2'
										>
											Server name
										</Label>
										<Input
											id='server-name'
											autoComplete='off'
											placeholder='server name'
											className='rounded border-none bg-foreground text-white caret-white  outline-none ring-offset-background focus:border-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
											required
											{...field}
										/>
									</>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<h3 className='text-lg font-semibold '>Display</h3>
				<ul className='flex flex-col gap-5 divide-y divide-gray-500'>
					<li className='flex flex-wrap justify-between gap-3 py-3'>
						<div className='flex w-full max-w-[430px] justify-between gap-3'>
							<div className=' space-y-2'>
								<h4 className='text-base font-medium'>Show progress bar</h4>
								<p className='text-sm font-light leading-normal text-[#b5b8bc]'>
									This progress bar will display in your channel list, attached
									to your server name (or server banner if you have one set).
								</p>
							</div>
							<Switch />
						</div>
						<Image
							className='rounded-md object-cover'
							src={'/images/server-boost.png'}
							width={300}
							height={300}
							alt='server boost'
						/>
					</li>
					<li className='flex flex-wrap justify-between gap-3 py-3'>
						<div className='flex w-full max-w-[430px]  justify-between gap-3'>
							<div className='max-w-64 space-y-2'>
								<h4 className='text-nowrap text-base font-medium'>
									Show banner background
								</h4>
								<p className='text-sm font-light leading-normal text-[#b5b8bc]'>
									This image will display at the top of your channels list.
								</p>
								<p className='text-sm font-light leading-normal text-[#b5b8bc]'>
									The recommended minimum size is 960x540 and recommended aspect
									ratio is 16:9.
								</p>
							</div>
							<Switch />
						</div>
						<div className='aspect-video  min-h-52 w-full max-w-[300px] rounded-md bg-[#4e5058]'></div>
					</li>
				</ul>
				{isEdited && (
					<Button
						type='submit'
						disabled={!isValid || isSubmitting}
						className=' mt-3 w-full animate-in hover:bg-blue-600'
					>
						Update server
					</Button>
				)}
			</form>
		</Form>
	);
}
