import { ReactNode, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useServerContext } from "@/providers/server";
import { Button } from "../ui/button";
import { copyText } from "@/utils/copy";

export default function AddUser({
  styles,
  children,
}: {
  styles?: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {states} = useServerContext();
  
  const path = `${process.env.NEXT_PUBLIC_CLIENT_URL}/server/${states.selectedServer?.id}/invite?inviteCode=${states.selectedServer?.invite_code}`;

  return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger
				asChild
				className={styles}
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					setIsOpen(true);
				}}
			>
				{children}
			</DialogTrigger>
			<DialogContent className=' w-full border-none bg-black'>
				<DialogTitle className='text-sm font-medium text-white'>
					Invite a friend to {states.selectedServer?.name}
				</DialogTitle>
				<div className='flex w-full rounded-md bg-background p-2 text-gray-2 '>
					<input
						className='w-full border-none bg-transparent outline-none'
						type='text'
						disabled
						autoFocus={false}
						name='invite code'
						value={path}
					/>
					<Button
						onClick={() => copyText(path, 'Invite code copied')}
						size={'sm'}
					>
						Copy
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
