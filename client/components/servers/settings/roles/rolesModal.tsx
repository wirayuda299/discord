import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { User } from "lucide-react";
import Roles from "./roles";

export default function RolesModal({ serverId, serverAuthor}: { serverId: string; serverAuthor: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className='group hidden cursor-pointer items-center justify-between rounded !bg-black px-2 py-1.5 text-xs font-semibold capitalize text-gray-2 hover:!bg-primary hover:!text-white md:!flex'>
					<span>create role </span>
					<User size={18} className='text-gray-2 group-hover:text-white' />
				</button>
			</DialogTrigger>
			<DialogContent className='mt hidden !w-full max-w-5xl border-none md:block'>
				<Roles
					serverId={serverId}
					styles='mt-72 mb-40'
					serverAuthor={serverAuthor}
				/>
			</DialogContent>
		</Dialog>
	);
};