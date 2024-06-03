import { topEmoji } from '@/constants/emoji';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messages';

export default function TopEmoji({
  handleAddOrRemoveReactions,
  msg,
  styles,
}: {
  handleAddOrRemoveReactions: (
    messageId: string,
    emoji: string,
    unifiedEmoji: string,
  ) => Promise<void>;
  msg: Message;
  styles?: string;
}) {
  return (
    <div className={cn('flex justify-evenly gap-3', styles)}>
      {topEmoji.map((emoji) => (
        <button
          aria-label='add reactions'
          name='add reactions'
          title='add reactions'
          onClick={() =>
            handleAddOrRemoveReactions(msg.message_id, emoji.emoji, emoji.code)
          }
          className='size-10 rounded-full bg-background/50 text-2xl transition-colors hover:bg-background'
          key={emoji.code}
        >
          {emoji.emoji}
        </button>
      ))}
    </div>
  );
}
