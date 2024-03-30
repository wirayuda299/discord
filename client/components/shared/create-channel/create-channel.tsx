'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import ChannelTypeItem from './ChannelTypeItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createChannel } from '@/actions/channel';

const schema = z.object({
	channelType: z.enum(['text', 'audio']),
	name: z.string().min(4),
});

export default function CreateChannel({
	serverId,
	type,
}: {
	serverId: string;
	type: 'text' | 'audio';
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const handleClose = () => setIsOpen(false);

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			channelType: type,
			name: '',
		},
	});

	async function onSubmit(data: z.infer<typeof schema>) {
		const { channelType, name } = data;
		try {
			await createChannel(
				name,
				serverId,
				channelType,
				window.location.pathname
			);
			form.resetField('name');
			toast.success('New channel has been created');
			handleClose();
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Unknown error');
			}
		}
	}
	const isValid = form.formState.isValid;
	const isSubmitting = form.formState.isSubmitting;

	return (
		<Dialog modal onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
				<Plus stroke='#949ba4' />
			</DialogTrigger>
			<DialogContent
				onClick={(e) => e.stopPropagation()}
				className='bg-main-foreground border-none'
			>
				<DialogHeader>
					<DialogTitle className=' text-gray-2 text-lg font-medium leading-snug'>
						Create channel
						<p className='text-gray-3 text-xs font-medium capitalize '>
							in information
						</p>
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name='channelType'
							render={({ field }) => (
								<FormItem>
									<ChannelTypeItem value={field.value} form={form} />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem className='mt-5'>
									<FormLabel className='text-gray-1 uppercase'>
										Channel name
									</FormLabel>
									<FormControl>
										<Input
											onClick={(e) => e.stopPropagation()}
											autoComplete='off'
											placeholder='# new-channel'
											className='bg-[var(--primary)] ring-offset-[[var(--primary)]]  focus:border-none focus:shadow-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-transparent'
											required
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className='mt-3 flex items-center justify-end gap-3'>
							<DialogClose type='button' onClick={(e) => e.stopPropagation()}>
								Cancel
							</DialogClose>

							<Button
								aria-disabled={!isValid || isSubmitting}
								disabled={!isValid || isSubmitting}
								className='bg-secondary-purple text-white'
							>
								Create Channel
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
