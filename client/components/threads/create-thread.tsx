import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ChatForm from "../messages/chat-form";
import { ServerStates } from "@/providers/server";
import { Message } from "@/types/messages";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/utils/form-url-query";

type Props = {
  styles?: string;
  message: Message;
  serverState: ServerStates;
  value: string;
  children?: ReactNode;
  setValue: Dispatch<SetStateAction<string>>;
  setServerStates: Dispatch<SetStateAction<ServerStates>>;
};

export default function CreateThread({
  serverState,
  setServerStates,
  message,
  value,
  setValue,
  styles,
  children,
}: Props) {
  const router = useRouter();
  const searchParams=useSearchParams()

  function handleSelectMessage() {
    setServerStates((prev) => ({
      ...prev,
      selectedMessage: message,
    }));
  }

  function handleOpenChange(isOpen:boolean) {
      if (isOpen) {
				router.push(
					formUrlQuery(searchParams.toString(), 'type', 'thread') as string
				);
			} else {
				router.back();
			}
  }
 

  return (
		<Sheet onOpenChange={(isOpen) => handleOpenChange(isOpen)}>
			<SheetTrigger asChild>
				<Link
					onClick={handleSelectMessage}
					href={
						formUrlQuery(searchParams.toString(), 'type', 'threads') as string
					}
					className={cn(
						'flex w-full justify-between bg-transparent p-2 text-sm hover:bg-primary hover:text-white',
						styles
					)}
				>
					{children}
					<Image
						src={'/icons/threads.svg'}
						width={20}
						height={20}
						alt='threads'
					/>
				</Link>
			</SheetTrigger>
			<SheetContent side='right' className='border-none p-0'>
				<header className='flex w-full items-center gap-4 border-b border-b-foreground p-4'>
					<Image
						src={'/icons/threads.svg'}
						width={25}
						height={25}
						alt='threads'
					/>
					<h3 className='text-base font-semibold text-gray-2'>New Thread</h3>
				</header>
				<div className=' h-full  p-3'>
					<div className='mt-auto flex h-[calc(100%-50px)] w-full flex-col  justify-end gap-5'>
						<div className='flex size-14 items-center justify-center rounded-full bg-background brightness-125'>
							<Image
								src={'/icons/threads.svg'}
								width={30}
								height={30}
								alt='threads'
							/>
						</div>
						<div>
							<h4 className='py-3 text-xs font-semibold uppercase text-gray-2'>
								Thread name
							</h4>

							<input
								required
								value={value}
								onChange={(e) => setValue(e.target.value)}
								type='text'
								placeholder={message.message}
								className='w-full rounded bg-foreground py-2 pl-2 text-gray-2 caret-white placeholder:text-xs focus-visible:outline-none'
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<p className='inline-flex gap-x-1 text-nowrap pt-[3px] text-xs leading-snug text-gray-600'>
								{new Date(message.created_at).toLocaleString('en-US', {
									hour: 'numeric',
									hour12: true,
								})}
							</p>
							<div className='flex flex-wrap items-start gap-2'>
								<p className='text-sm leading-snug text-gray-2'>
									{message.username}
								</p>

								<p
									className='min-w-min text-wrap  text-sm text-[#d9dee1]'
									style={{
										wordWrap: 'break-word',
										wordBreak: 'break-all',
									}}
								>
									{message.message}
									{new Date(message.update_at) >
										new Date(message.created_at) && (
										<span className='text-xs text-gray-2'>(edited)</span>
									)}
								</p>
							</div>
						</div>
						<ChatForm
							value={value}
							serverStates={serverState}
							setServerStates={setServerStates}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
