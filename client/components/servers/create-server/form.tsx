import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

import { deleteImage, uploadFile } from '@/helper/file';
import { createServer } from '@/actions/server';
import useUploadFile from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateServerSchemaType, createServerSchema } from '@/validations';
import { createError } from '@/utils/error';
import { useState } from 'react';

export default function CreateServerForm({
	handleClose,
}: {
	handleClose: () => void;
}) {
	const { user, isLoaded, isSignedIn } = useUser();
	const [status, setStatus] = useState<string>('Create')
	const form = useForm<CreateServerSchemaType>({
		defaultValues: {
			name: isLoaded && isSignedIn ? `${user?.username}'s server` : '',
			logo:''
		},
		resolver: zodResolver(createServerSchema),
	});

  const { handleChange, preview, files } = useUploadFile(form);
  
	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(data: CreateServerSchemaType) {
		if (!files || !user) return;

		let file: { publicId: string; url: string } | null = null;

		setStatus('Uploading image...')
		try {
			file = await uploadFile(files.logo);
			setStatus('Image uploaded')
			
		

			if (!file)
				throw new Error('Please add server logo', {
					cause: 'file is not defined',
				});
			setStatus('Creating server...')

			await createServer(data.name, file.url, file.publicId, user?.id).then(
				() => {
					toast.success('Server has been created 🥳', {
						className: 'text-white',
					});
						setStatus('Done');
					handleClose();
				}
			);
		} catch (error) {
			createError(error);
			if (file) {
				await deleteImage(file?.publicId);
			}
		}
	}

	return (
		<Form {...form}>
			<form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
				<div className='flex justify-center'>
					{preview && preview.logo ? (
						<Image
							src={preview.logo}
							width={100}
							height={100}
							alt='cover'
							className='aspect-auto size-28 rounded-full object-cover'
						/>
					) : (
						<FormField
							control={form.control}
							name='logo'
							render={() => (
								<FormItem>
									<FormLabel
										htmlFor='logo'
										className='relative mx-auto mt-3 flex size-24 cursor-pointer  flex-col items-center justify-center rounded-full border border-dashed'
									>
										<Camera size={30} />
										<p className='py-2 text-xs font-semibold uppercase'>
											Upload
										</p>
										<div className='absolute right-0 top-0 flex size-7 items-center justify-center rounded-full bg-primary'>
											<Plus size={20} stroke='#fff' fill='#fff' />
										</div>
									</FormLabel>
									<FormControl>
										<>
											<Input
												onChange={(e) => handleChange(e, 'logo')}
												id='logo'
												name='file'
												accept='.jpg,.png,.jpeg'
												className='hidden'
												placeholder='Server logo'
												type='file'
											/>
											<FormMessage className='text-xs text-red-600' />
										</>
									</FormControl>
								</FormItem>
							)}
						/>
					)}
				</div>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Server name</FormLabel>
							<FormControl>
								<>
									<Input
										autoComplete='off'
										placeholder='Server name'
										className='border-none bg-background  ring-offset-transparent focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
										required
										max={30}
										maxLength={30}
										aria-disabled={isSubmitting}
										disabled={isSubmitting}
										{...field}
									/>
									<p className='text-xs font-light leading-relaxed'>
										By createing a server, you&apos;re agree to discord{' '}
										<span className='font-semibold text-primary'>
											Community Guidelines
										</span>
									</p>
									<FormMessage className='text-xs text-red-600' />
								</>
							</FormControl>
						</FormItem>
					)}
				/>

				<div className='flex items-center justify-between'>
					<Button
						onClick={handleClose}
						type='button'
						className='!bg-transparent text-gray-2'
					>
						Back
					</Button>
					<Button
						aria-disabled={isSubmitting}
						disabled={isSubmitting}
						type='submit'
						className='flex items-center gap-2 bg-primary text-white disabled:cursor-not-allowed disabled:opacity-80'
					>
							{isSubmitting && (
								<div className='ease size-5 animate-spin rounded-full border-t-2 border-t-white transition-all duration-500'></div>
							)}
							{status}
					</Button>
				</div>
			</form>
		</Form>
	);
}
