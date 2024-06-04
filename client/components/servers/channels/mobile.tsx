import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Categories } from '@/types/channels';

export default function ChannelsDetailMobile({
  channel,
}: {
  channel: Categories;
}) {
  const router = useRouter();
  const params = useParams();
  return (
    <Sheet
      modal={false}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.push(`/server/${params.id}`);
        }
      }}
    >
      <SheetTrigger asChild>
        <div className='flex items-center gap-3 md:hidden'>
          <Image
            src={`/server/icons/${
              channel.channel_type === 'text' ? 'hashtag.svg' : 'audio.svg'
            }`}
            width={18}
            height={18}
            alt='channel icon'
          />
          {channel.channel_name}
        </div>
      </SheetTrigger>
      <SheetContent className='left-0 !min-w-full md:hidden'>
        Hello
      </SheetContent>
    </Sheet>
  );
}
