import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export default function ServersMembers() {
  return (
    <Sheet>
      <SheetTrigger
        aria-label='show members'
        name='show members'
        title='show members'
      >
        <Image
          className='min-w-6'
          src={'/server/icons/member.svg'}
          width={24}
          height={24}
          alt='member'
        />
      </SheetTrigger>
      <SheetContent>Mmeber</SheetContent>
    </Sheet>
  );
}
