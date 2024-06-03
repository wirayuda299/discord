import Image from 'next/image';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { emojiList } from '@/constants/emoji';
import { cn } from '@/lib/utils';

export default function EmojiPicker({
  appendEmoji,
  style,
}: {
  appendEmoji: (emoji: { emoji: string; code: string }) => void;
  style?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='add reaction'
        title='add reaction'
        name='add reaction'
      >
        <Image
          className={cn(style)}
          src={'/general/icons/smile.svg'}
          width={30}
          height={30}
          alt='smile icon'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='flex max-h-56 max-w-64 flex-wrap justify-around gap-3 overflow-y-auto border-none bg-background'>
        {emojiList.map((emoji) => (
          <button
            name='add reaction'
            title='add reaction'
            onClick={() => appendEmoji(emoji)}
            className='cursor-pointer rounded text-2xl hover:bg-secondary/40'
            key={emoji.code}
          >
            {emoji.emoji}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
