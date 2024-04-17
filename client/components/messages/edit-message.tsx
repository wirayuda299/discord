'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { editMessage } from '@/helper/message';
import { Textarea } from '../ui/textarea';
import { createError } from '@/utils/error';

export default function EditMessageForm({
	message,
	handleClose,
	currentUser,
	messageAuthor,
	messageId,
	serverId,
}: {
	message: string;
	handleClose: () => void;
	messageAuthor: string;
	currentUser: string;
	messageId: string;
	serverId: string;
}) {
	const [value, setValue] = useState<string>(message);
	const router = useRouter();
	async function handleEditMessage(e: FormEvent) {
		e.preventDefault();
		if (value === '') return;

		try {
			if (value === message) {
				return toast.error('Previous message still same');
			}
			await editMessage(
				messageAuthor,
				currentUser,
				messageId,
				value,
				serverId
			).then(() => {
				router.refresh();
				handleClose();
			});
		} catch (error) {
			createError(error);
		}
	}
	return (
		<form onSubmit={handleEditMessage}>
			<Textarea
				minLength={1}
				name='message'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				rows={1}
				autoComplete='off'
				className='bg-background flex min-h-[30px] w-full max-w-full  break-before-auto  items-center whitespace-pre-wrap break-all  !border-none px-3 pt-2 text-sm font-light text-white caret-white outline-none brightness-110 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:animate-pulse '
			/>
			<div className='flex items-center gap-2 pt-1'>
				<button
					className='text-xs text-red-600'
					type='button'
					onClick={handleClose}
				>
					Cancel
				</button>
				<button className='text-xs text-blue-600' type='submit'>
					Submit
				</button>
			</div>
		</form>
	);
}
