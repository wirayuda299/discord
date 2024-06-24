import Image from "next/image";
import { Pencil } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { AllThread, updateThread } from "@/helper/threads";
import { getCreatedDate } from "@/utils/date";
import { Input } from "@/components/ui/input";
import { useSocketStore } from "@/providers";



export default function ThreadItem({ thread }: { thread: AllThread }) {
  const [isOpen, setIsOpen] = useState(false)
  const { userId } = useAuth()
  const threadNameRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const params = useParams()
  const socket = useSocketStore(state => state.socket)

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!threadNameRef.current) return

    await updateThread(params.id as string, userId!, thread.thread_id, threadNameRef.current.value, pathname)
    setIsOpen(false)
    socket?.emit('get-channel-message', {
      serverId: params.id as string,
      channelId: params.channel_id as string
    })
  }
  return (
    <>
      {isOpen ? (
        <form onSubmit={handleUpdate}>
          <Input
            className='w-full rounded bg-background/50 p-2 placeholder:text-xs focus:border-none focus-visible:ring-0 text-gray-2 focus-visible:outline-none md:bg-background'
            type="text"
            defaultValue={thread.thread_name}
            placeholder="thread name"
            ref={threadNameRef} />
          <div className="flex-center gap-2 py-1">
            <button className="text-red-600  text-xs" type="button" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className="text-xs text-blue-500">Submit</button>
          </div>
        </form>
      ) : (

        <div
          className="w-full p-2 hover:bg-foreground group"
        >
          <p className='text-sm font-medium text-gray-2'>
            {thread.thread_name}
          </p>
          <div className='flex-center justify-between'>
            <div className='flex-center gap-2 text-gray-2'>
              <Image
                src={thread.avatar}
                width={25}
                height={25}
                alt='avatar'
                className='size-5 rounded-full object-cover'
              />
              <h4 className='text-gray-2'>{thread.username}</h4> &#x2022;
              <span className='text-xs font-semibold text-gray-2'>
                {getCreatedDate(new Date(thread.created_at))}
              </span>

            </div>
            {userId && userId === thread.author && (

              <button onClick={() => setIsOpen(prev => !prev)} className="group-hover:opacity-100 opacity-0">
                <Pencil size={17} className='text-gray-2' />
              </button>


            )}
          </div>
        </div>

      )}
    </>
  )
}
