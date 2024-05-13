import { Message } from "@/types/messages";

export type SocketStates = {
  channel_messages: Message[];
  active_users: string[];
  personal_messages: Message[];
  thread_messages: Message[];
};

type AllowedActionType =
  | "CHANNEL_MESSAGES"
  | "ACTIVE_USERS"
  | "PERSONAL_MESSAGES"
  | "THREAD_MESSAGES";

type ActionType = {
  type: AllowedActionType;
  payload: any;
};

export function socketReducer(states: SocketStates, action: ActionType) {
  switch (action.type) {
    case "ACTIVE_USERS":
      return {
        ...states,
        active_users: action.payload,
      };
    case "PERSONAL_MESSAGES":
      return {
        ...states,
        personal_messages: action.payload,
      };
    case "CHANNEL_MESSAGES":
      return {
        ...states,
        channel_messages: action.payload,
      };

    case "THREAD_MESSAGES":
      return {
        ...states,
        thread_messages: action.payload,
      };

    default:
      throw new Error("Invalid action: " + action.type);
  }
}
