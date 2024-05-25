import { Message } from "@/types/messages";

export const foundMessage = (messages: Message[], msg: Message) => {
	
	if (messages.length>=1) {
		return messages.find(
			(message) => message.message_id === msg.parent_message_id
		);
		
	}
};

