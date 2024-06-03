import { Plus } from 'lucide-react';

import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import CreateServerForm from './form';

export default function CreateServerModal() {
  return (
    <Dialog>
      <DialogTrigger
        aria-label='create server'
        title='create server'
        name='create server'
        className='group size-12 rounded-full bg-foreground hover:opacity-60'
      >
        <Plus
          size={30}
          className='mx-auto text-green-600 group-hover:text-white'
        />
      </DialogTrigger>
      <DialogContent className='border-none bg-black text-white'>
        <CreateServerForm />
      </DialogContent>
    </Dialog>
  );
}
