import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import CreateChannelForm from "../channels/create-channel/form";

export default function CreateChannelDrawerMobile({
	serverId,
	serverAuthor,
}: {
	serverId: string;
	serverAuthor: string;
}) {
	return (
		<Drawer>
			<DrawerTrigger className='text-sm font-semibold capitalize'>
				create channel
			</DrawerTrigger>
			<DrawerContent className='border-none bg-black p-3'>
				<CreateChannelForm
					serverId={serverId}
					type='text'
					serverAuthor={serverAuthor}
				/>
			</DrawerContent>
		</Drawer>
	);
}
