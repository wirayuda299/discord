import { KeyedMutator } from 'swr';
import CreateChannelForm from '../channels/create-channel/form';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';

export default function CreateChannelDrawerMobile<T>({
	serverId,
	mutate,
}: {
	serverId: string;
	mutate: KeyedMutator<T>;
}) {
	return (
		<Drawer>
			<DrawerTrigger className='py-3 text-sm font-semibold capitalize'>
				create channel
			</DrawerTrigger>
			<DrawerContent className='border-none bg-black p-3'>
				<CreateChannelForm serverId={serverId} type='text' mutate={mutate} />
			</DrawerContent>
		</Drawer>
	);
}
