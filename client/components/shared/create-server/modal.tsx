'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateServerForm from './form';

export default function CreateServerModal() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const handleClose = () => setIsOpen(false);

	return (
		<Dialog modal onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>
				<button className='bg-main-foreground mt-3 rounded-full p-2 brightness-110'>
					<Plus stroke='green' size={30} />
				</button>
			</DialogTrigger>
			<DialogContent className='bg-main-foreground rounded-lg border-none p-5'>
				<DialogHeader>
					<DialogTitle className='text-center text-xl font-bold'>
						Customize your server server
					</DialogTitle>
					<DialogDescription className='text-center text-sm font-light text-zinc-500'>
						Give your server personality with name and icon. You can always
						change it later.
					</DialogDescription>
					<CreateServerForm handleClose={handleClose} />
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
