import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import { deleteImage, uploadFile } from "@/helper/file";
import { createServer } from "@/actions/server";
import useUploadFile from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateServerSchemaType, createServerSchema } from "@/validations";
import { createError } from '@/utils/error';

export default function CreateServerForm({ handleClose }: { handleClose: () => void }) {
	const { user, isLoaded, isSignedIn } = useUser();
	const form = useForm<CreateServerSchemaType>({
		defaultValues: {
			logo: '',
			name: isLoaded && isSignedIn ? `${user?.username}'s server` : '',
		},
		resolver: zodResolver(createServerSchema),
	});

	const { handleChange, preview, files } = useUploadFile(form);
	const isValid = form.formState.isValid;
	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(data: CreateServerSchemaType) {
		if (!files || !user) return;
		let file: { publicId: string; url: string } | null = null;

		try {
			file = await uploadFile(files.logo);

			if (!file)
				throw new Error('Please add server logo', {
					cause: 'file is not defined',
				});

			await createServer(data.name, file.url, file.publicId, user?.id).then(
				() => {
					toast.success('Server has been created 🥳', {
						className: 'text-white',
					});
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
										<div className='bg-primary absolute right-0 top-0 flex size-7 items-center justify-center rounded-full'>
											<Plus size={20} stroke='#fff' fill='#fff' />
										</div>
									</FormLabel>
									<FormControl>
										<Input
											onChange={(e) => handleChange(e, 'logo')}
											id='logo'
											name='file'
											accept='.jpg,.png,.jpeg'
											className='hidden'
											placeholder='Server logo'
											type='file'
										/>
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
										className='bg-[var(--primary)] ring-offset-[[var(--primary)]]  focus:border-none focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
										required
										aria-disabled={isSubmitting || !isValid}
										disabled={isSubmitting || !isValid}
										{...field}
									/>
									<p className='text-xs font-light leading-relaxed'>
										By createing a server, you&apos;re agree to discord{' '}
										<span className='text-primary font-semibold'>
											Community Guidelines
										</span>
									</p>
								</>
							</FormControl>
						</FormItem>
					)}
				/>

				<div className='flex items-center justify-between'>
					<Button
						onClick={handleClose}
						type='button'
						className='bg-[var(--primary)] text-white'
					>
						Back
					</Button>
					<Button
						aria-disabled={!isValid || isSubmitting}
						disabled={!isValid || isSubmitting}
						type='submit'
						className='bg-primary text-white'
					>
						{isSubmitting ? (
							<div className='flex items-center gap-2'>
								<div className='ease size-5 animate-spin rounded-full border-t-2 border-t-white transition-all duration-500'></div>
								<p>Please wait...</p>
							</div>
						) : (
							'Create'
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
