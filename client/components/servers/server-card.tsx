'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";


import { joinServer } from "@/actions/server";
import { Servers } from "@/types/server";
import { Button } from "../ui/button";

type Props = { server: Servers, inviteCode: string, userId: string }

export default function ServerCard({ server, inviteCode, userId }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinServer = async () => {
    setIsLoading(true)
    const res = await joinServer(
      server.id,
      userId!!,
      inviteCode,
    )
    console.log(res)
    if (res?.success) {
      toast.success("Welcome! You've successfully joined the server.")
      router.push(`/server/${server.id}`);
    } else {
      toast.error(res?.message)
    }


    setIsLoading(false)
  };
  return (

    <div
      className='w-full max-w-96 rounded-md bg-background'
    >
      <header>
        <Image
          src={server.banner ?? '/server/images/server-boost.png'}
          width={300}
          height={100}
          alt='banner'
          className='aspect-video h-48 w-full rounded-sm object-cover'
        />
      </header>
      <div className='p-5 text-center'>
        <h2 className='text-lg font-semibold text-white'>{server.name}</h2>
        <div className='flex-center justify-between pt-5'>
          <div className='flex h-8 w-fit place-items-center gap-2 rounded-full bg-foreground px-5'>
            <div className='size-2 rounded-full bg-green-600'></div>
            <p className='text-center text-xs text-gray-2'>100 online</p>
          </div>
          <div className='flex h-8 w-fit place-items-center gap-2 rounded-full bg-foreground px-5'>
            <div className='size-2 rounded-full bg-gray-2'></div>
            <p className='text-center text-xs text-gray-2'>100 members</p>
          </div>
        </div>
        <Button title="Join server" disabled={isLoading} onClick={handleJoinServer} className='mt-5 w-full rounded'>
          {isLoading ? 'Loading...' : 'Join Server'}
        </Button>
      </div>
    </div>

  )
}
