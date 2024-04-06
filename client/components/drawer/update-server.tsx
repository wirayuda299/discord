'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { SquarePen } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { toast } from 'sonner';

import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import useUploadFile from '@/hooks/useFileUpload';
import { Button } from '../ui/button';
import { updateServer } from '@/actions/server';
import { deleteImage, uploadFile } from '@/actions/file';

const schema = z.object({
	name: z.string().min(3).max(50),
	logo: z.string(),
});

export default function UpdateServerDrawer({
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
	const router = useRouter();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			logo,
			name,
		},
	});
	const { handleChange, preview, files } = useUploadFile(form);

	const image = form.watch('logo');
	const isValid = form.formState.isValid;
	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(data: z.infer<typeof schema>) {
		try {
			if (files && files.logo) {
				const [, file] = await Promise.all([
					deleteImage(logoAssetId),
					await uploadFile(files.logo),
				]);
				await updateServer(serverId, data.name, file.url, file.publicId).then(
					() => {
						toast.success('Server has been updated');
						router.push('/server');
					}
				);
			} else {
				await updateServer(serverId, data.name, logo, logoAssetId).then(() => {
					toast.success('Server has been updated');
					router.push('/server');
				});
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
		<Drawer onOpenChange={() => form.reset()}>
			<DrawerTrigger className='py-3 text-sm font-semibold capitalize'>
				update server
			</DrawerTrigger>
			<DrawerContent className='border-foreground top-0 !h-full bg-black p-3 text-white'>
				<DrawerHeader>
					<DrawerTitle className='text-center text-xl font-semibold '>
						Update server
					</DrawerTitle>
				</DrawerHeader>
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
								className=' relative my-2 flex cursor-pointer items-center justify-center'
							>
								{(image || (preview && preview.logo)) && (
									<Image
										className='aspect-auto min-h-24 min-w-24 rounded-full object-cover'
										src={form.getValues('logo') || preview?.logo || ''}
										width={100}
										height={100}
										alt='logo'
									/>
								)}
								<div className='bg-foreground absolute right-[115px] top-0 flex size-7 items-center justify-center rounded-full'>
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
												className='text-gray-2 my-1 block text-sm uppercase'
											>
												Server name
											</Label>
											<Input
												id='server-name'
												autoComplete='off'
												placeholder='server name'
												className='bg-foreground ring-offset-background text-white caret-white focus:border-none  focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
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
							className='mt-3 w-full'
						>
							Update server
						</Button>
					</form>
				</Form>
			</DrawerContent>
		</Drawer>
	);
}
