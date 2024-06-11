import type { ReactNode } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CreateChannelForm from './form';

export default function CreateChannelDialog({
  serverId,
  type,
  children,
  serverAuthor,
}: {
  serverId: string;
  serverAuthor: string;
  type: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='border-none bg-background'>
        <CreateChannelForm
          serverAuthor={serverAuthor}
          type={type}
          serverId={serverId}
        />
      </DialogContent>
    </Dialog>
  );
}
