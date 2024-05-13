import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { Cog, SquarePen } from 'lucide-react';

import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import useUploadFile from '@/hooks/useFileUpload';
import { Button } from '../ui/button';
import { deleteImage, uploadFile } from '@/helper/file';
import { updateServer } from '@/helper/server';
import { UpdateServerSchemaType, updateServerSchema } from '@/validations';
import { createError } from '@/utils/error';


export default function ServerSetting({
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
		<Dialog>
			<DialogTrigger asChild>
				<div className='group flex cursor-pointer items-center justify-between rounded !bg-black px-2 py-1.5 text-xs font-semibold capitalize text-gray-2 hover:!bg-primary hover:!text-white'>
					<span>Server settings </span>
					<Cog size={20} className=' stroke-gray-2 text-gray-1 group-hover:stroke-white' />
				</div>
			</DialogTrigger>
			<DialogContent className='border-none'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<input
							onChange={(e) => handleChange(e, 'logo')}
							type='file'
							name='file'
							id='logo'
							className='hidden'
						/>

						<div className='relative'>
							<Label
								htmlFor='logo'
								className='!relative my-2 flex cursor-pointer items-center justify-center'
							>
								{(image || (preview && preview.logo)) && (
									<Image
										className='aspect-auto min-h-24 min-w-24 rounded-full object-cover'
										src={form.getValues('logo') || preview?.logo || ''}
										width={100}
										priority
										height={100}
										alt='logo'
									/>
								)}
								<div className='absolute right-[150px] top-0 flex size-7 items-center justify-center rounded-full bg-foreground'>
									<SquarePen size={16} className='text-gray-1' />
								</div>
							</Label>
						</div>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormControl>
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
												className='border-none bg-foreground text-white caret-white outline-none  ring-offset-background focus:border-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
												required
												{...field}
											/>
										</>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button
							type='submit'
							disabled={!isValid || isSubmitting}
							className='mt-3 w-full hover:bg-blue-600'
						>
							Update server
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};