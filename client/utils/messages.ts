import { Message } from "@/types/messages";

export const foundMessage = (messages: any[], msg: Message): Message => {
  return messages.find(
    (message) => message.message_id === msg.parent_message_id ,
  );
};

// TODO: Message header should contain recipient profile not current user
