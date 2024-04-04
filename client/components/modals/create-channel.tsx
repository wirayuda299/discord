import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import CreateChannelForm from '../channels/create-channel/form';
import { KeyedMutator } from 'swr';

export default function CreateChannelModals<T>({
	mutate,
	serverId,
	type,
}: {
	mutate: KeyedMutator<T>;
	serverId: string;
	type: string;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button>
					<Plus size={18} />
				</button>
			</DialogTrigger>
			<DialogContent className='md:bg-background border-none bg-black shadow-2xl'>
				<CreateChannelForm mutate={mutate} serverId={serverId} type={type} />
			</DialogContent>
		</Dialog>
	);
}
