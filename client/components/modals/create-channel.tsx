import { KeyedMutator } from 'swr';
import type { ReactNode } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import CreateChannelForm from '../channels/create-channel/form';

export default function CreateChannelModals<T>({
	mutate,
	serverId,
	type,
	children,
}: {
	mutate: KeyedMutator<T>;
	serverId: string;
	type: string;
	children: ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='md:bg-background border-none bg-black shadow-2xl'>
				<CreateChannelForm mutate={mutate} serverId={serverId} type={type} />
			</DialogContent>
		</Dialog>
	);
}
