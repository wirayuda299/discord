'use client';

import { type ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { RefreshCcw } from 'lucide-react';


import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { copyText } from '@/utils/copy';
import { generateNewInviteCode } from '@/helper/server';

type Props = {
  styles?: string;
  children: ReactNode;
  serverId: string;
  inviteCode: string;
  serverName: string;
  serverAuthor: string,
  currentUser: string
}

export default function ServerInvitationModal({
  styles,
  children,
  serverId,
  inviteCode,
  serverName,
  serverAuthor,
  currentUser
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const path = `${process.env.NEXT_PUBLIC_CLIENT_URL}/invite?serverId=${serverId}&inviteCode=${inviteCode}`;

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
      <DialogContent className='w-full border-none bg-black'>
        <DialogTitle className='text-sm font-medium text-white'>
          Invite a friend to {serverName}
        </DialogTitle>
        <div className='flex w-full rounded-md bg-background p-2 text-gray-2'>
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
        {serverAuthor === currentUser && (
          <button
            disabled={isLoading}
            onClick={async () => {

              setIsLoading(true)
              await generateNewInviteCode(serverId, pathname)
              setTimeout(() => {
                setIsLoading(false)

              }, 500)
            }}
            className='text-left disabled:cursor-not-allowed text-sm flex-center gap-2'>Generate new invite code <RefreshCcw className={isLoading ? 'animate-spin' : ''} size={18} /></button>
        )}

      </DialogContent>
    </Dialog>
  );
}
