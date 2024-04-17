import { Message } from '@/types/messages';
interface ReactionGroup {
	[emoji: string]: {
		emoji: string;
		unified_emoji: string;
		count: number;
	};
}
export function addLabelsToMessages(messages: Message[]) {
	let currentMonth: number | null = null;

	return messages?.map((message) => {
		const messageDate = new Date(message.msg_created_at);
		const messageMonth = messageDate.getMonth();

		const shouldAddLabel = currentMonth !== messageMonth;

		currentMonth = messageMonth;

		return { ...message, shouldAddLabel };
	});
}

export const groupReactionsByEmoji = (messageList: Message[]) => {
	return messageList.map((message) => {
		const groupedReactions = message.reactions.reduce(
			(acc: ReactionGroup, reaction) => {
				const emojiKey = reaction.emoji;
				if (!acc[emojiKey]) {
					acc[emojiKey] = {
						emoji: reaction.emoji,
						unified_emoji: reaction.unified_emoji,
						count: 0,
					};
				}
				acc[emojiKey].count += 1;
				return acc;
			},
			{}
		);

		return {
			...message,
			reactions: Object.values(groupedReactions),
		};
	});
};
