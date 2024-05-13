import { addOrRemoveReaction } from "@/actions/reactions";
import { createError } from "@/utils/error";

export default function useEmoji(
  serverId: string,
  userId: string,
  callback: () => void,
) {
  async function handleAppendOrRemoveEmoji(e: any, messageId: string) {
    try {
      await addOrRemoveReaction(
        messageId,
        e.emoji,
        e.unified,
        serverId,
        userId,
      );
      callback();
    } catch (error) {
      createError(error);
    }
  }
  return handleAppendOrRemoveEmoji;
}
